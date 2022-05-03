import RestLocalStorage from '../Model/rest_storage_service.js'
import BracketView from '../View/bracket_view.js'
import Animations from './animations.js'

export default class AppController{
  constructor(appViewModel){
    this.appViewModel = appViewModel.viewModel;
    this.connect = appViewModel.connect;

    this.RestLocalStorage = new RestLocalStorage(this.defaultSize, this.apiName, null, this.remaining.tableOptions, this.host);

    this.bracket_view = new BracketView(this.RestLocalStorage, this.teamViewModel);

    this.animations = new Animations(); //Just init it
  }

  
  //Getters and Setters, basically shorthands
  get teams(){return this.appViewModel.teams;}
  // get key(){return this.appViewModel.key}
  get key(){return null}
  get remaining(){return this.appViewModel.bracket.remaining;}
  get defaultSize(){return this.appViewModel.bracket.defaultTeamSize;}
  get teamViewModel(){return this.appViewModel;}  
  // get view(){return this.bracket_view;}
  // async reset(){await this.bracket_view.Reset()}
  get apiName(){return this.connect.apiName}
  get host(){return this.connect.host}
  async render(){await this.bracket_view.Render();}
}