// import teamData from '../../Model/team_data.js'
var teamViewModel = {
  // key: "teamsTable", //For local storage

  // teams: teamData, //Grab the default list of losers

  bracket:{
    wrapperContainerId: "container-TeamsPage", //Container for all the elements in the Teams section attatched to the table
    containerId: "container-TeamsTable", //Container for the table itself
    tableContainerClass: "container",    

    wrapperTemplateUrl: "js/View/ejs/wrapper_view.ejs", //Template for the container
    itemTemplateUrl: "js/View/ejs/table_view.ejs", //Template for the table    
    modalTemplateUrl: "js/View/ejs/Modal/delTeam_modal.ejs", //Template for the ban modal

    modalID:"teamModal", //The model
    alertID: "alert-PopUp", //The alert

    topText:"REMAINING TEAMS - BRACKET II",
    defaultTeamLogo: "img/Def_Team_img/default.png",
    defaultTeamSize: 16,

    //The table
    remaining:{
      tableID:"TeamsTable",
      tableClasses: "table table-hover base-table super base-container mb-0",

      //Filter settings
      tableOptions:{
        selCol: "TeamName",
        direction: "Asc",
        filterCol: "TeamName",
        filterStr: "",
        limit: 10,
        offset: 3
      },
  
      //Header columns
      tableHead:[ //Decided to do this to change the layout per column
        {
          name: "TeamName",
          text: "Name",
          otherClasses:"text-center",
          span: "2"
        },
        {
          name: "RemainingPlayers",
          text: "Remaining Players",
          otherClasses: "text-center",
          span: "1"
        },
        {
          name: "Penalties",
          text: "Penalties",
          otherClasses: "text-center",
          span: "1"
        },
        {
          name: "TotalHomeruns",
          text: "Total Homeruns",
          otherClasses: "text-center",
          span: "1"
        },
        {
          name: "MissilesThwarted",
          text: "Missiles Thwarted",
          otherClasses: "text-center",
          span: "1"
        },
        {
          name: "DamageDealt",
          text: "Damage Dealt",
        otherClasses: "text-center",
          span: "1"
        }
      ]    
    }  
  },
  
  form:{
    wrapperContainerId: "", //No wrapper
    containerId: "teamModal", //Container (which is the modal)    
    formId: "modalForm",

    wrapperTemplateUrl: "", //No wrapper
    itemTemplateUrl: "js/View/ejs/Modal/form_modal.ejs", //Template for the form

    addTitle: "Add New Team",
    editTitle: "Edit Team ", //Concat team name in ejs render
    defaultTeamLogo: "img/Def_Team_img/default.png",

    method:"POST",

    addLim: 3, //Field Limit for adding a team
    editSkip: 2, //Field to skip when editing

    fields:[
      {
        form:"both",
        hidden: true,
        id:"edit-id",
        label: "id",
        name: "id",
        tag: "input",
        attributes:[
          ["id","edit-id"],["name","id"],["tag","input"]
        ],
        other:{
        
        },
        validate:{
          required: false
        }
      },
      
      {
        form:"both",
        colLength:"col-sm-8",
        newLine: false,
        id:"edit-name",
        label: "Name",
        name: "TeamName",
        tag: "input",
        attributes:[
          ["type","text"],["id","edit-name"],["name","TeamName"],["class","form-control"]
        ],
        validate:{
          required: true,
          message: "Your team needs a name"
        }
      },

      {
        form:"both",
        colLength:"col-sm-4",
        newLine: false,
        id:"edit-state",
        label: "ST",
        name: "State",
        tag: "select",
        attributes:[
          ["id","edit-state"],["name","State"],["class","form-select"],["style","max-width:fit-content"]
        ],      
        validate:{
          required: true,
          message: "Select their home state"
        }
      },

      {
        form:"both",
        id:"edit-coach",
        colLength:"col-sm-6",
        newLine: false,
        label: "Coach",
        name: "Coach",
        tag: "input",
        attributes:[
          ["type","text"],["id","edit-coach"],["name","Coach"],["class","form-control"]
        ],
        validate:{
          required: true,
          message: "Your team needs a coach"
        }
      },

      {
        form:"both",
        colLength:"col-sm-6",
        newLine: false,
        id:"edit-MVP",
        label: "MVP",
        name:"MVP",
        tag: "input",
        attributes:[
          ["type","text"],["id","edit-MVP"],["name","MVP"],["class","form-control"]
        ],
        validate:{
        name: "MVP",
          required: true,
          message: "Your team needs a star player"
        }
      },
      
      {
        form:"add",
        colLength:"col-7 col-sm-4",
        newLine: false,
        id:"edit-player",
        label: "Players",
        name: "RemainingPlayers",
        tag: "input",
        attributes:[
          ["type","number"],["id","edit-player"],["name","RemainingPlayers"],["min","1"],["max","100"],["class","form-control"],["placeholder","0-100"]
        ],
        validate:{
          required: true,
          message: "Your team must have 0-100 players"
        }
      },

      {
        form:"edit",
        colLength:"col-7 col-sm-4",
        newLine: false,
        id:"edit-remain",
        label: "Remaining",
        name: "RemainingPlayers",
        tag: "input",
        attributes:[
          ["type","number"],["id","edit-remain"],["name","RemainingPlayers"],["min","0"],["max","100"],["class","form-control"],["placeholder","0-100"]
        ],
        validate:{
          required: true,
          message: "How many team members are left?"
        }
      },

      {
        form:"edit",
        colLength:"col-6 col-sm-4",
        newLine: false,
        id:"edit-penalties",
        label: "Penalties",
        name: "Penalties",
        tag: "input",
        attributes:[
          ["type","number"],["id","edit-penalties"],["name","Penalties"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"edit",
        colLength:"col-7 col-sm-4",
        newLine: false,
        id:"edit-homerun",
        label: "Homeruns",
        name: "TotalHomeruns",
        tag: "input",
        attributes:[
          ["type","number"],["id","edit-homerun"],["name","TotalHomeruns"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"edit",
        colLength:"col-7 col-sm-5",
        newLine: false,
        id:"edit-missiles",
        label: "Missiles Thwarted",
        name: "MissilesThwarted",
        tag: "input",
        attributes:[
          ["type","number"],["id","edit-missiles"],["name","MissilesThwarted"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"edit",
        colLength:"col-6 col-sm-4",
        newLine: false,
        id:"edit-damage",
        label: "Damage Dealt",          
        name: "DamageDealt",
        tag: "input",
        attributes:[
          ["type","number"],["id","edit-damage"],["name","DamageDealt"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"both",
        colLength:"8",
        newLine: true,
        id:"edit-logo",
        label: "Team Logo",
        name: "TeamLogoFile",
        tag: "input",
        attributes:[
          ["type","file"],["id","edit-logo"],["name","TeamLogoFile"],["class","form-control align-center"],["accept","img/png, img/jpeg"]
        ],
        validate:{
          required: false,
          message: ""
        }
      },
      {
        form:"both",
        hidden: true,
        colLength:"0",
        newLine: false,
        id:"logo-url",
        label: "Team Logo",
        name: "TeamLogo",
        tag: "input",
        attributes:[
          ["id","logo-url"],["name","TeamLogo"],["class","form-control align-center"]
        ],
        validate:{
          required: false,
          message: ""
        }
      }
    ],
    NewTeamTemplate:{
      "Penalties": "0",
		  "TotalHomeruns": "0",
		  "MissilesThwarted": "0",
		  "DamageDealt": "0",
    }
  }
}
export default teamViewModel;