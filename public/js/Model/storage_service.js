export default class TeamLocalStorage{
  "use strict"
  constructor(defaultSize, entity, entitySingle = null, options={}, host = null){
    this.defaultSize = defaultSize;
    this.entity = entity;
    this.host = host;
    this.model={};
    this.model.teams=[];
    this.colChange = false;
    this.banishedAm = 0;
    this.tableOptions = options
    this.defaultLimit = this.limit;
    this.totalSize = 0;
  }

  //Store data into local storage
  Store(){
    // localStorage.setItem(this.key, JSON.stringify(this.model));
  }

  //Clear local storage and reset the model to the default
  async Reset(){
    // this.model = this.CloneObject(this.defaultModel);
    // localStorage.clear();
  }


  //Other functions

  //Return current instance of the list of teams after sorting
  async Teams(){
    //Update teams if cache is empty, sort was changed, or filter was created
    if(this.model.teams.length === 0 || this.colChange || this.filterStr !== "") {
      await this.UpdateTeams();
      this.colChange = false;
      this.filterStr = "";
      this.banishedAm = this.ripple ? this.defaultSize - this.model.teams.length : 0;
    }

    return this.model.teams;
  }

  //Add team
  async Create(newTeam){
    console.log("This should have called in rest_storage_service")
    // this.model.teams.push(newTeam);
    // this.Store();
  }
  async UpdateTeams(){
    console.log("This should have called in rest_storage_service")
  }
  //Get by name
  async Read(getName){
    console.log("This should have called in rest_storage_service")
    // let team = this.model.teams.find(element => element.TeamName == getName);
    // return (typeof team === "undifined" ? (null):(team));
  }

  //Updates team, for edit button later
  async Update(team){
    console.log("This should have called in rest_storage_service")
    // let index = this.model.teams.findIndex(element => element.TeamName == team.Name);
    // if(index != -1){
    //   this.model.teams[index] = team;
    //   this.Store();
    // }
    // else{
    //   this.Create(team);
    // }
  }

  //Deletes team from model
  async Delete(id){
    console.log("This should have called in rest_storage_service")
    // let index = this.getItemIndex(id);
    // this.model.teams.splice(index,1);
    // this.Store();
  }

  //Sorts the teams
  Sort(col, direction, perm = true){
    console.log("This should have called in rest_storage_service")
    // let copy = this.CloneObject(this.model.teams);
    //
    // let sorted = copy.sort((a, b) => {
    //   //Check if string or number
    //   let a_ = isNaN(a[col]) ? a[col] : parseInt(a[col]);
    //   let b_ = isNaN(b[col]) ? b[col] : parseInt(b[col]);
    //
    //   if (a_ == b_)
    //     return 0;
    //   if (a_ < b_)
    //     return direction == "asc" ? -1 : 1;
    //   if (a_ > b_)
    //     return direction == "asc" ? 1 : -1;
    // });
    //
    // if (perm) {
    //   this.model.teams = sorted;
    //   this.selCol = col;
    //   this.direction = direction;
    //   this.Store();
    // }
    // return sorted;
  }

  //Filters teams for search
  Filter(filterObj){
    console.log("This should have called in rest_storage_service")
    // function filterFunc(team) {
    //   for (let key in filterObj) {
    //     if ( !team[key].toLowerCase().includes(filterObj[key].toLowerCase())) {
    //       return false;
    //     }
    //   }
    //   return true;
    // }
    // let result = this.model.teams.filter(filterFunc);
    // return this.CloneObject(result);
  }

  //Returns copy of object
  CloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  //Getters and Setters
  set tableOptions(options){
    this.model.tableOptions = {
      selCol: "TeamName",
      direction: "asc",
      filterCol: "TeamName",
      filterStr: "",
      limit: 20,
      offset: 0
    };
    this.model.tableOptions = Object.assign(this.model.tableOptions, options);
  }

  //Converts string id to int
  SanitizeId(team){
    if (isNaN(team.id)){
      let intID = parseInt(team.id);
      delete team.id;
      team.id = intID;
    }
  }

  get tableOptions(){return this.model.tableOptions;}
  get selCol(){return this.model.tableOptions.selCol;}
  set selCol(col){this.model.tableOptions.selCol = col;}
  get direction(){return this.model.tableOptions.direction;}
  set direction(dire){this.model.tableOptions.direction = dire;}
  get filterCol(){return this.model.tableOptions.filterCol;}
  set filterCol(filt){this.model.tableOptions.filterCol = filt;}
  get filterStr(){return this.model.tableOptions.filterStr;}
  set filterStr(str){this.model.tableOptions.filterStr = str;}
  get limit(){return this.model.tableOptions.limit;}
  set limit(lim){this.model.tableOptions.limit = lim;}
  get offset(){return this.model.tableOptions.offset;}
  set offset(off){this.model.tableOptions.offset = off;}
  set colChange(ch){this.changed = ch}
  get colChange(){return this.changed;}
  get size(){return this.model.teams.length;}
  get banishedAm(){return this.model.banishedAm;}
  set banishedAm(amount){this.model.banishedAm = amount;}
  get defaultTeamLogo(){return "img/Def_Team_img/default.png"};
  get ripple(){return this.model.teams.length < this.defaultSize}
  get hasMore(){return this.size < this.totalSize}


  //Index finding function
  getItemIndex(id) {
    let id_= isNaN(id) ? id : parseInt(id);
    return this.model.teams.findIndex(element => element.id == id_);
  }
  getTeam(id){ //Fix for popover after search
    let index = this.getItemIndex(id);
    let team = this.model.teams[index]
    //Check if no logo
    if(team.TeamLogo === "")
      team.TeamLogo = this.defaultTeamLogo;
    return team;
  }
}