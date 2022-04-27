import teamData from '../../Model/team_data.js'
var teamViewModel = {
  key: "teamsTable", //For local storage

  teams: teamData, //Grab the default list of losers

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

    //The table
    remaining:{
      tableID:"TeamsTable",
      tableClasses: "table table-hover base-table super base-container",

      //Filter settings
      tableOptions:{
        selCol: "Name",
        direction: "asc",
        filterCol: "",
        filterStr: ""
      },
  
      //Header columns
      tableHead:[ //Decided to do this to change the layout per column
        {
          name: "Name",
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
          text: "Missles Thwarted",
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

    defaultTeamLogo: "img/Team_img/default.png",

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
        _attributes:[
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
        colLength:"8",
        newLine: false,
        id:"edit-name",
        label: "Name",
        name: "Name",
        tag: "input",
        _attributes:[
          ["type","text"],["id","edit-name"],["name","Name"],["class","form-control"]
        ],
        validate:{
          required: true,
          message: "Your team needs a name"
        }
      },

      {
        form:"both",
        colLength:"3",
        newLine: false,
        id:"edit-state",
        label: "ST",
        name: "State",
        tag: "select",
        _attributes:[
          ["id","edit-state"],["name","State"],["class","form-select"]
        ],
        options:[ //Use for value and text
          'Sel', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' 
        ],
        validate:{
          required: true,
          message: "Select their home state"
        }
      },

      {
        form:"both",
        id:"edit-coach",
        colLength:"6",
        newLine: true,
        label: "Coach",
        name: "Coach",
        tag: "input",
        _attributes:[
          ["type","text"],["id","edit-coach"],["name","Coach"],["class","form-control"]
        ],
        validate:{
          required: true,
          message: "Your team needs a coach"
        }
      },

      {
        form:"both",
        colLength:"6",
        newLine: false,
        id:"edit-MVP",
        label: "MVP",
        name:"MVP",
        tag: "input",
        _attributes:[
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
        colLength:"4",
        newLine: true,
        id:"edit-player",
        label: "Players",
        name: "RemainingPlayers",
        tag: "input",
        _attributes:[
          ["type","number"],["id","edit-player"],["name","RemainingPlayers"],["min","1"],["max","100"],["class","form-control"],["placeholder","0-100"]
        ],
        validate:{
          required: true,
          message: "Your team must have 0-100 players"
        }
      },

      {
        form:"edit",
        colLength:"4",
        newLine: true,
        id:"edit-remain",
        label: "Remaining",
        name: "RemainingPlayers",
        tag: "input",
        _attributes:[
          ["type","number"],["id","edit-remain"],["name","RemainingPlayers"],["min","0"],["max","100"],["class","form-control"],["placeholder","0-100"]
        ],
        validate:{
          required: true,
          message: "How many team members are left?"
        }
      },

      {
        form:"edit",
        colLength:"3",
        newLine: false,
        id:"edit-penalties",
        label: "Penalties",
        name: "Penalties",
        tag: "input",
        _attributes:[
          ["type","number"],["id","edit-penalties"],["name","Penalties"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"edit",
        colLength:"3",
        newLine: false,
        id:"edit-homerun",
        label: "Homeruns",
        name: "TotalHomeruns",
        tag: "input",
        _attributes:[
          ["type","number"],["id","edit-homerun"],["name","TotalHomeruns"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"edit",
        colLength:"5",
        newLine: true,
        id:"edit-missles",
        label: "Missles Thwarted",
        name: "MissilesThwarted",
        tag: "input",
        _attributes:[
          ["type","number"],["id","edit-missles"],["name","MissilesThwarted"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },

      {
        form:"edit",
        colLength:"4",
        newLine: false,
        id:"edit-damage",
        label: "Damage Dealt",          
        name: "DamageDealt",
        tag: "input",
        _attributes:[
          ["type","number"],["id","edit-damage"],["name","DamageDealt"],["min","0"],["max","9999"],["class","form-control"],["placeholder","0-9999"]
        ],
        validate:{
          required: true,
          message: "Must be more or the same"
        }
      },
      
      {
        form:"both",
        colLength:"10",
        newLine: true,
        id:"edit-logo",
        label: "Team Logo",
        name: "TeamLogoFile",
        tag: "input",
        _attributes:[
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
        colLength:"1",
        newLine: false,
        id:"logo-url",
        label: "Team Logo",
        name: "TeamLogo",
        tag: "input",
        _attributes:[
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