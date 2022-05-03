import StorageService from './storage_service.js'

export default class RestStorageService extends StorageService{
    "use strict"
    constructor(key, entity, entitySingle, options={}, host) {
        super(key, entity, entitySingle, options, host);
        this.reDown = null;
    }

    get apiName(){return this.entity};

    //Gets current size of database table
    async GetSize() {
        let addr = `http://${this.host}/size/${this.apiName}`;
        return await fetch(addr)
            .then(out => out.json())
            .then((resp) => {
                return resp.count;
            }).catch((err) => {
                console.error(err.message);
                throw (err);
            });
    }

    //Requests more teams from server
    async LoadMore(){
        //Update Limit
        this.limit = this.limit > this.totalSize ? this.totalSize : this.limit+ this.offset;

        //Update teams
        await this.UpdateTeams();
    }

    //Gets up-to-date version of teams from host
    async UpdateTeams(params = null){
        //Get size of table if haven't yet
        if(this.totalSize === 0)
            this.totalSize = await this.GetSize();

        //Re-Download team for image
        if (this.reDown !== null){
            await this.Read(this.reDown);
            this.reDown = null;
            return;
        }

        //Send request
        await fetch(`http://${this.host}/${this.apiName}/${this.ParamBuilder(params)}`)
            .then(out=>out.json())
            .then((resp)=> {
                //Update teams
                this.model.teams = resp

                //Update limit
                this.limit = this.limit > this.size && this.limit <= this.totalSize ? this.limit : this.size;
                // this.model.ShowMoreButton(this.size < this.totalSize);
            })
            .catch((err) => {
                console.error(err.message);
                throw (err);
            });

        //Check if list of states are populated
        if(!this.stateList){
            //Send request
            await fetch(`http://${this.host}/lookups/State`)
                .then(out=>out.json())
                .then((resp)=> {
                    //Update state list
                    this.stateList = resp;
                })
                .catch((err) => {
                    console.error(err.message);
                    throw (err);
                });
        }
    }

    //Get by name
    async Read(id){
        //If cache of this team does not exist
        if(this.model.teams[this.getItemIndex(id)] === -1){
            return fetch(`http://${this.host}/${this.apiName}/${id}`)
                .then(out => out.json())
                .then((resp) => {
                    //Be sure to update cache before returning
                    this.OrderInsert(resp, true);
                    return resp;
                }).catch((err) => {
                    console.error(err.message);
                    throw (err);
                });
        }
        else //Return cache
            return this.model.teams[this.getItemIndex(id)];
    }

    //Sends Team Logo to host for upload
    async UploadImg(team){
        //Check if image was provided
        if(team.TeamLogoFile.size === 0){
            //Sanitize
            delete team.TeamLogoFile;
            this.reDown = null;
            return;
        }

        //Be sure to notify to redownload for image
        this.reDown = team.id;

        let teamName = team.TeamName;
        let img = new FormData(); //Datatype that host excepts for images
        img.append('TeamLogoFile',team.TeamLogoFile);

        //Post
        let response = await fetch(`http://${this.host}/${this.apiName}/upload?TeamName=${teamName}`,{
            method: 'POST',
            body: img
        })
            .then(response => response.json())
            .then(response => {
                if (!this.CheckError(response.status))
                    team.TeamLogo = response.path;
                return response;
            }).catch((err) => {
                console.error(err.message);
                throw (err);
            });

        //Check if upload was successful
        if(this.CheckError(response.status, "Image Upload Error: "))
            return null;

        //Sanitize file
        delete team.TeamLogoFile;
        return response;
    }

    //Add team, limit updated for immediate viewer feedback
    async Create(newTeam){
        //Sanitize id string
        this.SanitizeId(newTeam);

        //Upload image first
        if(await this.UploadImg(newTeam) === {})
            return;

        //Post
        let response = await fetch(`http://${this.host}/${this.apiName}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTeam)
        })
            .then(response => response.json())
            .then(response => {return response;}).catch((err) => {
                console.error(err.message);
                throw (err);
            });

        //Check for error
        if (typeof response.id === 'undefined') {
            this.CheckError(response.errno, "Team Upload Error: ", response.code, true);
            return;
        }

        //Update local cache
        newTeam.id = response.id;
        if(this.hasMore)
            this.limit++;
        this.OrderInsert(newTeam);
        this.totalSize++;

        //Decrease banished count
        this.banishedAm = this.ripple ? this.banishedAm-1 : 0;
    }

    //Updates team
    async Update(team){
        //Sanitize id string
        this.SanitizeId(team);

        //Check if image first
        await this.UploadImg(team);

        //Put
        let response = await fetch(`http://${this.host}/${this.apiName}/${team.id}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(team)
        }).catch((err) => {
            console.error(err.message);
            throw (err);
        });

        //Check for error
        if (this.CheckError(response.status, "Team Update Error: "))
            return;

        //Update local cache
        this.model.teams[this.getItemIndex(team.id)] = team;
    }

    //Deletes team from model
    async Delete(id){
        //Remove image first
        let photoResp = "";
        if(this.getTeam(id).TeamLogo !== ""){
            photoResp = "?logo="+this.getTeam(id).TeamLogo;
        }

        //Delete
        let response = await fetch(`http://${this.host}/${this.apiName}/${id}${photoResp}`,{
            method: 'DELETE'
        }).catch((err) => {
            console.error(err.message);
            throw (err);
        });

        //Check for errors
        if(this.CheckError(response.status,"Delete error: "))
            return;

        //Delete from cache
        this.model.teams.splice(this.getItemIndex(id), 1);
        this.totalSize--;

        //Increase banished count
        this.banishedAm = this.ripple ? this.banishedAm+1 : 0;

        //If there is more, load the next team to replace the deleted one
        if (this.hasMore)
            this.Read(Math.max(...this.model.teams.map(team => team.id)))
    }

    //Reset teams back to default roster, I am way too attached to let these guys permanently go away
    async Reset(){
        let response = await fetch(`http://${this.host}/${this.apiName}`,{
            method: 'PUT'
        }).catch((err) => {
            console.error(err.message);
            throw (err);
        });

        if (this.CheckError(response.status, "Reset Error: ","\nPlease Notify As Database May Be Wiped."))
            return;

        this.limit = this.defaultLimit;
        this.totalSize = this.defaultSize;
        await this.UpdateTeams();
        this.banishedAm = this.ripple ? this.defaultSize - this.model.teams.length : 0;
    }

    //Sorts the teams
    async Sort(col, direction, def = false){
        console.log("Storage Sort no longer in use, handled by UpdateTeams");
    }

    //Filters teams for search
    async Filter(){
        console.log("Storage Filter no longer in use, handled by UpdateTeams");
    }

    ParamBuilder(obj = null){
        //Table options, this made Sort and Filter obsolete
        if (obj === null){
            obj ={
                offset: 0,
                limit:this.limit,
                sortCol: this.selCol,
                sortDir: this.direction
            }
            if (this.filterStr !== ""){
                obj.filterStr = this.filterStr;
                obj.filterCol = this.filterCol;
            }
        }

        //Other object
        let result = "?";
        Object.keys(obj).forEach((o) =>{
            result += `${o}=${obj[o]}&`
        })
        result.slice(0, -1);
        return result.slice(0, -1);
    }

    CheckError(code, error = "Error: ", error2 = "", sql = false){
        if (sql){
            console.error(error + code + error2);
            return false;
        }
        if (code >= 400) {
            console.error(error + code + error2);
            return false;
        }
    }

    OrderInsert(newTeam, insert = false){
        //Check if just updating existing in cache
        if (insert){
            this.model.teams[this.getItemIndex(newTeam.id)] = newTeam;
            return;
        }

        for (let i = 0; i < this.model.teams.length; i++){ //Go through each
            let result = newTeam[this.selCol].localeCompare(this.model.teams[i][this.selCol]); //Compare
            switch (this.direction) {
                case "Asc":
                    if (result <= 0) {//If Asc and lower
                        this.model.teams.splice(i, 0, newTeam);
                        return;
                    }
                    break;
                case "Desc":
                    if (result >= 0) {//If Desc and higher
                        this.model.teams.splice(i, 0, newTeam);
                        return;
                    }
                    break;
            }
        }
    }
}