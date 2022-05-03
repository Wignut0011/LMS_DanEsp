const teams = require("../controllers/team.controller.js");

module.exports = app => {
    const teams = require("../controllers/team.controller.js");
    const fileUpload = require('express-fileupload');

    app.use(fileUpload()); //express-fileupload

    //Get size of database
    app.get("/size/teams", async (req, res, next)=> {
        await teams.getSize(req, res).catch(err => {
            next(err);
        });
    });

    //Get lookup
    app.get("/lookups/:lookupName", async (req, res, next)=>{
        await teams.getLookup(req, res).catch(err => {
            next(err);
        });
    });

    //Get all teams
    app.get("/teams", async(req, res, next)=> {
        await teams.findAll(req, res).catch(err => {
            next(err);
        });
    });

    //Get a team
    app.get("/teams/:teamId", async(req, res, next)=> {
        await teams.findOne(req, res).catch(err => {
            next(err);
        });
    });

    //Update a team
    app.put("/teams/:teamId", teams.validate('updateTeam'), async (req, res, next)=> {
        await teams.update(req, res).catch(err => {
            next(err);
        });
    });

    //Retrieve default teams
    app.put("/teams", async(req, res, next)=> {
        await teams.reset(req, res).catch(err => {
            next(err);
        });
    });

    //Create a team
    app.post("/teams", teams.validate('createTeam'),async(req, res, next)=> {
        await teams.create(req, res).catch(err => {
            next(err);
        });
    });

    //Upload team logo image
    app.post("/teams/upload", async(req, res, next)=> {
        await teams.uploadFile(req, res).catch(err => {
            next(err);
        });
    })

    //Delete a team
    app.delete("/teams/:teamId", async(req, res, next)=> {
        await teams.del(req, res).catch(err => {
            next(err);
        });
    });
}