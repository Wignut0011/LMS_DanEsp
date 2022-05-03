//Local instance of the team data
import teamViewModel from './team_view_model.js'
var appViewModel={
  viewModel: teamViewModel,

  connect:{
    host: "localhost:8080",
    apiName:"teams"
  }
}
export default appViewModel;