class AppController{
  constructor(appViewModel){
    this.appViewModel = appViewModel.viewModel;

    this.TeamLocalStorage = new TeamLocalStorage(this.key, this.teams, this.remaining.tableOptions);

    this._view = new PageView(this.TeamLocalStorage, this.teamViewModel);
  }

  
  //Getters and Setters, basically shorthands
  get teams(){return this.appViewModel.teams;}  
  get key(){return this.appViewModel.key}  
  get remaining(){return this.appViewModel.remaining;}  
  get teamViewModel(){return this.appViewModel;}  
  get view(){return this._view;}  
  async reset(){await this.view.Reset()}  
  async render(){await this.view.Render();}
}