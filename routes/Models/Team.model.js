const sql = require("./db.js");
const fs = require("fs"); //Image file checking and removing
const Error = require("../Teams/Errors.js") //Error Object
const DEFAULT_TEAM_LOGO = "img/Def_Team_img/default.png" //Default logo path

const Team = function (team){
    this.id = team.id;
    this.TeamName = team.TeamName;
    this.State = team.State;
    this.Coach = team.Coach;
    this.MVP = team.MVP;
    this.RemainingPlayers = team.RemainingPlayers;
    this.Penalties = team.Penalties;
    this.TotalHomeruns = team.TotalHomeruns;
    this.MissilesThwarted = team.MissilesThwarted;
    this.DamageDealt = team.DamageDealt;
    this.TeamLogo = team.TeamLogo;
    this.TeamLogoFile = team.TeamLogoFile
};

//Get specific lookup
Team.lookups = (param)=>{
    switch (param) {
        //Normal Bracket View
        case 'Teams':
            return 'SELECT t.id, TeamName, State, CoachName AS Coach, MVPName AS MVP, RemainingPlayers, Penalties, TotalHomeruns, MissilesThwarted, DamageDealt, TeamLogo ' +
            'FROM Teams t ' +
            'INNER JOIN Coaches c ON t.coach_id = c.c_id ' +
            'INNER JOIN MVPs m ON t.mvp_id = m.mvp_id';

        //List of MVPs
        case 'MVP':
            return 'SELECT MVPName AS MVP, TeamName ,CoachName AS Coach ' +
            'FROM Teams t ' +
            'INNER join Coaches c ON t.coach_id = c.c_id ' +
            'INNER join MVPs m ON t.mvp_id = m.mvp_id';

        //List of Coaches
        case 'Coach':
            return 'SELECT CoachName AS Coach, TeamName as Team\n ' +
                'FROM Coaches c\n ' +
                'INNER JOIN Teams t ON c.c_id = t.coach_id';

        //Invalid lookup provided
        default:
            return '';
    }
}
//Makes sure empty image submissions get the default logo
Team.cleanImageURL = (team) =>{
    if (!team.TeamLogo) //Put logo default if url empty
        team.TeamLogo = DEFAULT_TEAM_LOGO;
}

//INSERT query statements, prepared for iteration in JankTransaction
Team.insertQuery = (newTeam)=>{
    //Make sure img src is clean
    Team.cleanImageURL(newTeam)

    return [{
        //Coach
        query:'INSERT INTO Coaches(CoachName) VALUES(?)',
        variables: [newTeam.Coach]
    },{
        //MVP
        query: 'INSERT INTO MVPs(coach_id, MVPName) VALUES((SELECT c_id FROM Coaches WHERE c_id = ?), ?)',
        variables: ['c_id', newTeam.MVP]
    },{
        //Teams
        query:'INSERT INTO Teams(TeamName, State, coach_id, mvp_id, RemainingPlayers, Penalties, TotalHomeruns, ' +
            'MissilesThwarted, DamageDealt, TeamLogo) VALUES(?, ?, ?, (SELECT mvp_id FROM MVPs WHERE mvp_id = ?), ?, ?, ?, ?, ?, ?)',
        variables: [newTeam.TeamName, newTeam.State, 'c_id', 'mvp_id', newTeam.RemainingPlayers, 0, 0, 0, 0, newTeam.TeamLogo]
    }]
}

//UPDATE query statement
Team.updateQuery = ()=>{
    return `UPDATE Teams t
            inner join Coaches c on t.coach_id = c.c_id
            inner join MVPs m on t.mvp_id = m.mvp_id
            SET State = ?, TeamName = ?, c.CoachName = ?, m.MVPName = ?, RemainingPlayers = ?, Penalties = ?, TotalHomeruns = ?, MissilesThwarted = ?, DamageDealt = ?, TeamLogo = ? WHERE t.id = ?`;
}

//Reset query statements, iterated inside JankTransaction
//CASCADE deletion method
Team.resetQuery = ()=>{
    return [
        'DELETE FROM Coaches',
        'INSERT INTO Coaches SELECT * FROM DefaultCoaches',
        'INSERT INTO MVPs SELECT * FROM DefaultMVPs',
        'INSERT INTO Teams SELECT * FROM DefaultTeams'
    ]
}

//DELETE Team query statement, uses CASCADE method by deleting from Coaches
Team.deleteQuery =(id)=>{
    return `DELETE Coaches FROM Coaches INNER JOIN Teams ON Teams.coach_id = Coaches.c_id WHERE Teams.id = ${id}`;
}

//Additions to Team lookup when list queries were provided
Team.listQuery = (params) => {
    let query = Team.lookups('Teams');

    //Filter
    if(params.filterCol != null){
        query += ` WHERE ${params.filterCol} like '%${params.filterStr}%'`;
    }

    //Sort
    if(params.sortCol != null){
        query += ` ORDER BY ${params.sortCol} ${params.sortDir}`
    }

    //Limit/Offset
    if(params.limit != null){
        query += ` LIMIT ${params.offset}, ${params.limit}`
    }
    return query;
};

//Janky pseudo query transaction, no time to implement in db.js
Team.JankTransaction = async (queries, variables = false)=>{
    let new_id = {"c_id": 0,  "mvp_id": 0, 'id':0};
    let result = {};
    for(let q of queries) {

        //Insert, be sure to get insert ids
        if (variables) {

            //Check if query needs a new id
            Object.keys(new_id).forEach((i, ind) => {
                if (q.variables.includes(i))
                    q.variables[q.variables.findIndex((j) => j === i)] = new_id[i];
            })

            //Send query
            result = await sql.query(q.query, q.variables).catch((err) => {
                throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
            });

            //Check if new insert id was returned
            if (!result.insertId)
                throw Error.InternalError('Internal Return Error');

            //Insert new id
            Object.keys(new_id).every((i) => {
                if (new_id[i] === 0) { //This is needed, insert
                    new_id[i] = result.insertId;
                    return false;
                }
                return true;
            });
        }

        //Reset, just perform sequentially;
        else
            result = await sql.query(q.toString()).catch((err) => {
                throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
            });
    }
    return new_id['id']; //Return new team id for insert
}

//Checks for duplicate entries
Team.checkDuplicate = async (value, selector, table) => {
    //Query table
    let dup = await sql.query(`SELECT ${selector} FROM ${table} WHERE ${selector} = ?`, value)
        .then((resp) => {
            return resp.length <= 0; //Check result for any matches
        }).catch((err) => {
            throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
        });

    //Duplicate found
    if (!dup)
        return Promise.reject(`Duplicate ${selector}`);
};

//Returns current size of Teams
Team.size = async ()=> {
    //Simple Query
    let res = await sql.query("SELECT COUNT(*) FROM Teams").catch((err) => {
        throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
    });

    return {count: res[0]["COUNT(*)"]};
}

//Returns a lookup table
Team.lookup = async(sel)=>{
    //Check if lookup selection was given
    if (Team.lookups(sel) === '')
        throw Error.BadRequest('Bad Lookup Request');

    //Query
    let res =  await sql.query(Team.lookups(sel)).catch((err)=>{
        throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
    });

    //Returned empty
    if (res.length === 0)
        throw Error.NotFound('No Teams Exist');

    return res;
}

//Inserts new team into database tables, queries done in JankTransaction
Team.create = async(newTeam)=> {
    //Start building chained queries
    let queries = Team.insertQuery(newTeam);

    // let res = await sql.query("INSERT INTO Teams SET ?", newTeam).catch(() => {
    let res = await Team.JankTransaction(queries, true).catch((err) => {
        throw err;
    });

    //Return team back (for postman tests) with newly generated ids (not for only tests)
    let respObj = {status: 201, id: res, TeamName: newTeam.TeamName, Coach: newTeam.Coach, MVP: newTeam.MVP,...newTeam};
    respObj.id = res;
    return respObj;
};

//Updates team
Team.updateById = async (id, team) => {
    //Make sure img src is clean
    Team.cleanImageURL(team);

    //Query
    let res = await sql.query(Team.updateQuery(), [team.State, team.TeamName, team.Coach, team.MVP, team.RemainingPlayers, team.Penalties, team.TotalHomeruns, team.MissilesThwarted, team.DamageDealt, team.TeamLogo, team.id])
        .catch((err) => {
            throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
        });

    //Did not update, could not find team
    if (res.affectedRows === 0) {
        throw Error.NotFound('Team Not Found');
    }

    //Return team back (for postman test)
    return {status: 201, id: id, TeamName: team.TeamName, Coach: team.Coach, MVP: team.MVP,...team};
};

//Gets specific team via id
Team.getById = async (id) => {
    //Query with list parameters, if any
    let res = await sql.query(`${Team.lookups('Teams')} WHERE id = ${id}`)
        .catch((err) => {
            throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
        });

    //Returned empty
    if (res.length === 0)
        throw Error.NotFound('Team Not Found');

    return res;
};

//Gets Team lookup
Team.getAll = async (params) => {
    //Query
    let res = await sql.query(Team.listQuery(params))
        .catch((err) => {
            throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
    });

    //Returned empty
    if (res.length === 0)
        throw Error.NotFound('No Teams Exist');

    return res;
};

//Delete Team from database
Team.remove = async (id) => {
    //Delete team
    let query = Team.deleteQuery(id);

    //Query
    let res = await sql.query(query, id)
        .catch((err) => {
            throw Error.InternalError('Internal Query Error: '+err.sqlMessage);
        });

    //Nothing was removed
    if (res.affectedRows === 0) {
        throw Error.NotFound('Team Not Found');
    }
};

//Removes stored image file
Team.removeImg = (path) => {
    //Remove image file
    fs.unlink(path, (err) => {
        if (err)
            throw Error.Gone('Team Logo Image Does Not Exist');
    });
};

//Stores image file received
Team.uploadImg = async (path, file, res)=> {
    await file.mv(path, (err) => { //Express-FileUpload
        if (err) {
            throw Error.InternalError('Could Not Upload File');
        }
        res.json({status: res.statusCode, path: path.replace("public/", "")});
    });
}

module.exports = Team;