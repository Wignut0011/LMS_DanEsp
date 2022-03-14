var teamViewModel = {
  key: "teamsTable", //For local storage

  teams: theTeams, //Grab the default list of losers
  
  wrapperID: "container-TeamsPage", //Container for all the elements in the Teams section attatched to the table
  tableContainerID: "container-TeamsTable", //Container for the table itself
  tableContainerClass: "container",

  wrapperEJS: "js/MVC/View/ejs/wrapper_view.ejs", //Template for the container
  tableEJS: "js/MVC/View/ejs/table_view.ejs", //Template for the table

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
}