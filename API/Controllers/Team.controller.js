const Team = require("../Models/Team.model.js");
const util = require("./controller.util.js");
const Error = require("../Error/Errors.js")
const {body, validationResult} = require('express-validator');
const sql = require("../Models/db");
const fs = require("fs");
const LOGO_PATH = "public/img/Team_img/";
const DEFAULT_LOGO = "default.png";
const DEFAULT_TEAM_PATH = "public/img/Def_Team_img/"

//Sets validation results
exports.validate = (team) => {
    let updateValidation=[
        body('TeamName', '\nMust have a Name')
            .not().isEmpty().trim().escape(),
        body('State', '\nMust have a Home State')
            .not().isEmpty(),
        body('Coach', '\nMust have a Coach')
            .not().isEmpty().trim().escape(),
        body('MVP', '\nMust have an MVP')
            .not().isEmpty().trim().escape(),
        body('RemainingPlayers', '\nNeeds at least one player in team')
            .not().isEmpty()
    ];
    switch (team) {
        case 'updateTeam':
            return updateValidation;
        case 'createTeam': {
            let createValidation=[...updateValidation];
            createValidation.push(
                body('TeamName').custom(async (val) => {
                    return await Team.checkDuplicate(val, 'TeamName', 'Teams');//custom validation to check if team exists
                }));
            createValidation.push(
                body('Coach').custom(async (val) => {
                    return await Team.checkDuplicate(val, 'CoachName', 'Coaches');//custom validation to check if team exists
                }));
            createValidation.push(
                body('MVP').custom(async (val) => {
                    return await Team.checkDuplicate(val, 'MVPName', 'MVPs');//custom validation to check if team exists
                }));
            return createValidation;
        }
    }
};


exports.getSize = async(req, res)=> {
    res.json(await Team.size().catch(err => {
        throw err;
    }));
}

exports.getLookup = async (req, res)=>{
    //Make sure lookup was specified
    if (!req.params.lookupName)
        throw Error.BadRequest('Bad Database Request');


    res.json(await Team.lookup(req.params.lookupName).catch(err => {
        throw err;
    }));
}

exports.findAll = async(req, res)=> {
    let params = util.getQueryParams(req);
    res.send(await Team.getAll(params).catch((err)=>{
        throw err;
    }));
};

exports.findOne = async(req, res)=> {
    if (!req.params.teamId) {
        throw Error.BadRequest('Missing Id');
    }

    let result = await Team.getById(req.params.teamId).catch((err) => {
        throw err;
    });
    res.status(200).send(result[0]);
};


exports.create = async(req, res)=> {
    //Check if valid content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw Error.IncompleteQuery(errors.array(), true);
    }

    //Valid, create
    res.status(201).json(await Team.create(req.body).catch(err => {
        throw err;
    }));
};



exports.reset = async (req, res)=> {
    //Truncate tables and re-add everything
    let query = Team.resetQuery();
    await Team.JankTransaction(query)
        .catch((err) => {
            throw err;
        });

    res.sendStatus(200);
};


exports.uploadFile = async(req,res) => {
    //No team received
    if (!req.query)
        throw Error.BadRequest('No Team Data Given');

    //No image received
    else if (!req.files)
        throw Error.BadRequest('No Image File Given');

    let params = req.query.TeamName;
    const file = req.files.TeamLogoFile;
    const path = LOGO_PATH + params.split(' ').join('_') + '.' + file.mimetype.split('/')[1];

    try {
        //Unlink if already exists, DON'T DELETE ORIGINAL TEAM LOGO OR DEFAULT LOGO
        if (fs.existsSync(path) && path !== LOGO_PATH + DEFAULT_LOGO && !path.startsWith(DEFAULT_TEAM_PATH))
            Team.removeImg(path);

        //Upload
        Team.uploadImg(path, file, res);
    } catch (err) {
        throw err;
    }
}


exports.update = async(req, res)=> {
    //Check if content was even sent
    if (!req.body) {
        throw Error.BadRequest('Missing Id In Submission');
    }

    //Check if valid content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw Error.IncompleteQuery(errors.array(), true);
    }

    //Send
    res.status(200).json(await Team.updateById(req.params.teamId, new Team(req.body)).catch(err => {
        throw err;
    }));
};


exports.del = async(req, res)=> {
    //Delete photo if one is attached to the team
    let thisTeam = await Team.getById(req.params.teamId).catch((err) => {
        throw err;
    });

    //Don't delete original team logo or default logo
    let path = "public/" + thisTeam[0].TeamLogo;
    if (path !== "public/" && path !== LOGO_PATH + DEFAULT_LOGO && !path.startsWith(DEFAULT_TEAM_PATH)) {
        await Team.removeImg(path);
    }

    res.send(await Team.remove(req.params.teamId).catch(err => {
        throw err;
    }));
};