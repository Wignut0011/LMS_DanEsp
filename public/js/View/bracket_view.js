import View from './view.js'
import FormView from './form_view.js'
import Utils from '../Util/util.js'

export default class BracketView extends View{
  constructor(teamLocalStorage, teamViewModel){    
    super(teamLocalStorage, teamViewModel.bracket);
    this.totalViewModel = teamViewModel;
    this.waitToRefresh = null;
    this.formModal = new FormView(teamLocalStorage, teamViewModel, this);
  }

  //Retrieve banished teams and re-render
  // Reset(){
  //   this.storage.Reset();
  //   this.Render()
  // }

  //Render the view
  // async Render(){
  //   await this.RenderWrapper();
  //   await this.RenderItem();
  // }

  //Populate the wrapper EJS and render
  // async RenderWrapper(){
  //   this.$wrapperContainer.empty();
    
  //   if(!this.wrapperHTML.length > 0){ //Wait until doc is fully loaded in
  //     this.wrapperHTML =  await this.getFileContents(this.wrapperEJS);
  //   }
  //   this.$wrapperContainer.html(ejs.render(this.wrapperHTML, {view: this.viewModel}));

  //   await this.bindWrapperEvents(); //Init wrapper events
  // }

  //Populate the teams table EJS and render
  async RenderTeams(){
    this.$tableContainer.empty();
    // this._teams =  await this.teams;
    
    if(!this.tableHTML.length > 0){ //Wait until doc is fully loaded in
      this.tableHTML =  await this.getFileContents(this.tableEJS);
    }
    this.$tableContainer.html(ejs.render(this.tableHTML, {view:this, data:this.teams}));
    
    if(this.$tableContainer.html().charAt(0) === "&")//Removing stray "&gt;" string table_view.ejs put in. I don't know why it prepends this
      this.$tableContainer.html(this.$tableContainer.html().substring(4));
    
    this.$headerIcon.show(); //Show header sort icons
    
    this.bindTableEvents(this.teams); //Init table events
  }

  //Initializes table event handlers
  bindItemEvents(data){
    let that=this;
    let $theWarning = this.$modal;

    this.$headerIcon.show(); //Show header sort icons

    //Table Events: Sort table based on column selected
    for(let col of this.tableHead){
      $(`th[data-name="${col.name}"]`).one("click", function(e){
        function toggleAsc(col){ //Toggle to Ascending local function
          $(`${col}-Asc`).attr("style","display:true");
          $(`${col}-Asc`).attr("aria-hidden","false");
          $(`${col}-Desc`).attr("style","display:false");
          $(`${col}-Desc`).attr("aria-hidden","true");
          that.storage.direction = "Asc";
        }
        function toggleDesc(col){ //Toggle to Descending local function
          $(`${col}-Asc`).attr("style","display:false");
          $(`${col}-Asc`).attr("aria-hidden","true");
          $(`${col}-Desc`).attr("style","display:true");
          $(`${col}-Desc`).attr("aria-hidden","false");
          that.storage.direction = "Desc";
        }
      
        let selected = $(e.currentTarget).attr("data-name");

        //If same col, just toggle
        if(selected === that.storage.selCol){
          if(that.storage.direction === "Asc")
            toggleDesc(selected);
          else
            toggleAsc(selected);
        }
        //Not the same, disable the previous col and enable the new one to asc
        else{      
          //Turn off previously selsected
          $(`${that.storage.selCol}-Asc`).attr("style","display:false");
          $(`${that.storage.selCol}-Asc`).attr("aria-hidden","true");
          $(`${that.storage.selCol}-Desc`).attr("style","display:false");
          $(`${that.storage.selCol}-Desc`).attr("aria-hidden","true");
          //Turn on new
          toggleAsc(selected);
        }
        //Now that view attributes for the arrows are done, set model attributes for re-rendering
        that.storage.colChange = true;
        that.storage.selCol = selected;
        that.renderItem();
      })
    }

    //Table Event: Show banished warning modal
    $(".btn-ban").on("click", async function(e){
      //Get team data
      let teamID = $(e.target).attr("data-id");
      let teamDat = that.storage.getTeam(teamID);
      let data = {id: teamID, logo: teamDat["TeamLogo"], name: teamDat["TeamName"], mvp: teamDat["MVP"]};

      
      //Render banish modal      
      await that.renderModal(data);

      //Put the rest of the attributes
      $theWarning.attr("data-id", teamID);
      $theWarning.attr("data-name", teamDat["TeamName"]);

      //Modal Event: Clicked yes to banish team
      $("#banish-button").on("click", () =>{
        //Get team data
        let itemName=$theWarning.attr("data-name");
        let teamID = $theWarning.attr("data-id");
        
        //Delete, used Promise Pattern
        that.DeleteTeam(teamID).
        then(() => {
          //Show alert
          that.addAlert(itemName);
          that.renderItem();
        }).catch((e)=>{console.error(e)});
      });      
    });

    //Event: Show form modal to edit team
    $(".btn-edit").on("click", function(e){      
      let teamID = $(e.target).attr("data-id");
      that.formModal.requestForm(teamID);
    });
    
    this.initPopover();
  }

  
  //Initializes wrapper event handlers
  bindWrapperEvents(){
    let that=this;
    let $theWarning = this.$modal;

    //Event-one: Bring back all the teams that were banished
    $('#reset-btn').one("click", (e) => {
      //Turn off previous events
      $theWarning.off("show.bs.modal");
      $("#banish-button").off("click");
      $('#search-text').off("input");
      $('#search-clear').on("click");

      //Reset view
      this.Reset().then(()=>{
        this.ShowMoreButton(this.storage.hasMore); //Display show button if more
      });
    });

    //Event: Search bar recieved input, attempt search
    $('#search-text').on("input", (e) => {                        
      this.searchVal = $(e.target).val();
      this.Search();
    });
        
    //Event: Clear search bar
    $('#search-clear').on("click", (e) => {
      $('#search-text').val("");
      this.storage.filterStr = "";
      this.storage.colChange = true;
      this.renderItem().then(()=>{
        this.ShowMoreButton(this.storage.hasMore); //Display show button if more
      });
    });

    //Event: Load more button
    $('.bottom-table-tab').on("click",(e)=>{
      if(this.storage.hasMore)
        this.storage.LoadMore()
          .then(() => {
            this.renderItem();
            this.ShowMoreButton(this.storage.hasMore); //Remove show button if limit reached
          });
    })

    //Event: Launch form to add team
    $("#add-btn").on("click", (e)=>{
      // let teamDat = eventTeam(e);
      this.formModal.requestForm();
    });

    //Show "show more" button if needed
    this.ShowMoreButton(this.storage.hasMore);
  }

  //Put an alert when team was banished, will get more worried as more teams get banished
  addAlert(alertName){
    let alertHTML=``;
    
    if(this.storage.banishedAm < 5){ //Default
      alertHTML = `<div id="banishedAlert" class="alert alert-success alert-dismissible fade show" role="alert">
  <i class="fa-solid fa-person-booth"></i>
  <h5 class="text-center">You have banished The ${alertName} to wander aimlessly in the Shadow Realm</h5>
  <hr>
  <p class="text-center">A court date is now pending, you monster.</p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    }
    else if(this.storage.banishedAm < this.view.defaultTeamSize-6){ //Something's wrong
      alertHTML = `<div id="banishedAlert" class="alert alert-success alert-dismissible fade show" role="alert">
  <i class="fa-solid fa-circle-info"></i>
  <h5 class="text-center">You have banished The ${alertName} to wander aimlessly in the Shadow Realm</h5>
  <hr>
  <p class="text-center">ok.... you can stop now...</p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    }

    else if(this.storage.banishedAm < this.view.defaultTeamSize-1){ //Uh oh
      alertHTML = `<div id="banishedAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
  <i class="fa-solid fa-person-praying"></i>
  <h5 class="text-center">You have banished The ${alertName} to wander aimlessly in the Shadow Realm</h5>
  <hr>
  <p class="text-center">Dude, stop. You don't know what you are doing.<p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    }
    else if(this.storage.banishedAm == this.view.defaultTeamSize-1){ //THIS IS REALLY BAD
      alertHTML = `<div id="banishedAlert" class="alert alert-danger alert-dismissible fade show" role="alert">
  <i class="fa-solid fa-radiation"></i>
  <h5 class="text-center">You have banished The ${alertName} to wander aimlessly in the Shadow Realm</h5>
  <hr>
  <h5 class="text-center">DUDE! STOP! WE ARE ALL IN DANGER IF YOU BANISH THE LAST TEAM!</h5>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    }
    else{ // BAD ENDING | TODO LMS-3: Change John Base's photo in the about section when this is executed
      alertHTML = `<div id="banishedAlert" class="alert alert-danger alert-dismissible fade show" role="alert">
  <i class="fa-solid fa-person-dots-from-line"></i>
  <h5 class="text-center">Everyone's gone</h5>
  <hr>
  <p class="text-center">You doomed us all. John Base has awoken.</p>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    }

    this.$alertContainer.html(alertHTML); //Render alert
  }

  //Attempt search
  Search(){
    clearTimeout(this.waitToRefresh);
    this.waitToRefresh = setTimeout(() => {
            if (this.searchVal.length > 1) { //Minimum 2 chars
              this.storage.filterStr = this.searchVal;
              // this.storage.filterCol = this.storage.sortCol;
              this.renderItem(true).then(()=>{
                this.ShowMoreButton(false); //Disable show button
              });
            }
      else{ //If fewer then 2 chars, reset view like the clear button
        this.storage.colChange = true;
        this.storage.filterStr = "";
        this.renderItem().then(()=>{
          this.ShowMoreButton(this.storage.hasMore); //Display show button if more
        });
      }
    }, 250);
  }

  //Remove team from storage and re-render
  async DeleteTeam(teamID){
    await this.storage.Delete(teamID);
    await this.renderItem().then(()=>{
      this.ShowMoreButton(this.storage.hasMore); //Display show button if more
    });
  }

  //Initializes team popover
  initPopover(){
    let that = this;
    $('[data-bs-toggle="popover"]').popover({      
      html: true,
      trigger: 'hover',
      delay: {show:500},
      title: function(){ //Top part
            var index = $(this).attr("data-id");
            let item= that.storage.getTeam(index);
            return `<img class="img-fluid rounded-circle" src="${item["TeamLogo"]}" width="40" height="40">  ${item["TeamName"]} `;
      },
      content: function(){ //Bottom part
            var index = $(this).attr("data-id");
            let item= that.storage.getTeam(index);
            return `<p>Coach: ${item["Coach"]} </p> <p>MVP: ${item["MVP"]}</p>`;
      }
    });
  }

  //Shows the "show more" button
  async ShowMoreButton(sh){
    if(sh)
      $('.bottom-table-tab').show();
    else
      $('.bottom-table-tab').hide();
  }

  eventTeam(e, that){
    let teamID = $(e.target).attr("data-id");
    return that.teams[that.storage.getItemIndex(teamID)];
  }

  async getViewData(){
    let teams = await this.teams;
    return {view: this, viewModel: this.viewModel, data: teams};
  }

  //Getters and Setters  
  get teams(){return this.storage.Teams();}
  get remaining(){return this.view.remaining;}
  get view(){return this.viewModel;}  
  get modalEJS(){return this.view.banModalTemplateUrl}
  get tableHead(){return this.remaining.tableHead;}
  get $alertContainer(){return $("#"+this.view.alertID);}
  get $modal(){return $("#"+this.view.modalID);}
  get $headerIcon() { return $(`#${this.storage.selCol}-${this.storage.direction}`);}

}