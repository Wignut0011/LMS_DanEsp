class TeamLocalStorage{
  "use strict"
  constructor(key, teams, options={}){
    this.key = key;
    this.model={};
    this.model.teams=[];
    this.banishedAm = 0;
    if(teams != null){
      this.model.teams = teams;
    }    
    this.tableOptions = options;    
    
    this.defaultModel = this.CloneObject(this.model);    

    //Get data from local storage
    if (localStorage.getItem(this.key) !== null) 
      this.model = JSON.parse(localStorage[this.key]);  
  }

  //Store data into local storage
  Store(){
    localStorage.setItem(this.key, JSON.stringify(this.model));
  }

  //Clear local storage and reset the model to the default
  async Reset(){
    this.model = this.CloneObject(this.defaultModel);
    localStorage.clear();
  }


  //Other functions

  //Return current instance of the list of teams after sorting
  async Teams(){
    this.Sort(this.selCol, this.direction, true);
    let filterObj={};
        
    if (this.filterStr){
      filterObj[this.selCol]=this.filterStr;
      return this.Filter(filterObj);
    }        
    return this.model.teams;
  }

  //Add team, for edit button later
  async Create(newTeam){
    this.model.teams.push(newteam);
    this.Store();
  }

  //Get team by id
  async Read(getId){
    let team = this.model.teams.find(element => element.Name == getId);
    return (team === undifined ? (null):(team));
  }

  //Updates team, for edit button later
  async Update(team){
    let index = this.model.teams.findIndex(element => element.Name == team.Name);
    if(index != -1){
      this.model.teams[index] = team;
      this.Store();
    }
  }

  //Deletes team from model
  async Delete(id){
    let index = this.getItemIndex(id);
    this.model.teams.splice(index,1);
    this.Store();
  }

  //Sorts the teams
  Sort(col, direction, perm = true){
    let copy = this.CloneObject(this.model.teams);
    
    let sorted = copy.sort((a, b) => {
      //Check if string or number
      let a_ = isNaN(a[col]) ? a[col] : parseInt(a[col]);
      let b_ = isNaN(b[col]) ? b[col] : parseInt(b[col]);
      
      if (a_ == b_)
        return 0;
      if (a_ < b_) 
        return direction == "asc" ? -1 : 1;        
      if (a_ > b_) 
        return direction == "asc" ? 1 : -1;
    });
    
    if (perm) {
      this.model.teams = sorted;
      this.selCol = col;
      this.direction = direction;
      this.Store();
    }    
    return sorted;
  }

  //Filters teams for search
  Filter(filterObj){
    function filterFunc(team) {
      for (let key in filterObj) {
        if ( !team[key].toLowerCase().includes(filterObj[key].toLowerCase())) {
          return false;
        }
      }
      return true;
    }
    let result = this.model.teams.filter(filterFunc);
    return this.CloneObject(result);
  }

  //Returns copy of object
  CloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  //Getters and Setters
  set tableOptions(options){
    this.model.tableOptions = {
      selCol: "name",
      direction: "asc",
      filterCol: "",
      filterStr: ""
    };
    this.model.tableOptions = Object.assign(this.model.tableOptions, options);
  }

  get selCol(){return this.model.tableOptions.selCol;}
  set selCol(col){this.model.tableOptions.selCol = col;}
  get direction(){return this.model.tableOptions.direction;}
  set direction(dire){this.model.tableOptions.direction = dire;}
  get filterCol(){return this.model.tableOptions.filterCol;}
  set filterCol(filt){this.model.tableOptions.filterCol = filt;}
  get size(){return this.model.teams.length;}
  get banishedAm(){return this.model.banishedAm;}
  set banishedAm(amount){this.model.banishedAm = amount;}


  //Index finding function
  getItemIndex(id) {
    let id_= isNaN(id) ? id : parseInt(id);
    return this.model.teams.findIndex(element => element.id == id_);
  }
  getTeam(id){ //Fix for popover after search
    let index = this.getItemIndex(id);
    return this.model.teams[index];
  }
}