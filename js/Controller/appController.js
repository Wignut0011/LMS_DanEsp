import TeamLocalStorage from '../Model/local_storage_service.js'
import BracketView from '../View/bracket_view.js'
import Animations from './animations.js'

export default class AppController{
  constructor(appViewModel){
    this.appViewModel = appViewModel.viewModel;

    this.TeamLocalStorage = new TeamLocalStorage(this.key, this.teams, this.remaining.tableOptions);

    this.bracket_view = new BracketView(this.TeamLocalStorage, this.teamViewModel);

    this.animations = new Animations();
  }

  
  //Getters and Setters, basically shorthands
  get teams(){return this.appViewModel.teams;}  
  get key(){return this.appViewModel.key}  
  get remaining(){return this.appViewModel.bracket.remaining;}  
  get teamViewModel(){return this.appViewModel;}  
  get view(){return this.bracket_view;}  
  async reset(){await this.bracket_view.Reset()}  
  async render(){await this.bracket_view.Render();}
}