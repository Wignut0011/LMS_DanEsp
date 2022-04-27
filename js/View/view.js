import Utils from '../Util/util.js'

export default class View {
  constructor(teamLocalStorage, teamViewModel) {
    this.storage = teamLocalStorage;
    this.viewModel = teamViewModel;
    this.utils = new Utils();
    this.wrapperHTML = "";
    this.containerHTML = "";
    this.modalHTML = "";
    this.data=null;
    this.isModal=false;
  }

  //Reset view back to default
  async Reset() {
    await this.storage.Reset();
    await this.Render();
  }

  //Render the view
  async Render() {
    // render the wrapper first, then the item
    await this.renderWrapper();
    await this.renderItem();
  }
  
  //Populate the EJS and render
  async renderTemplate($container, templateUrl, viewData, wrapHTML, mod=false) {
    //hide the container
    $container.empty().hide();
    this._teams =  await this.storage.Teams();

    //Debug (data)
    //console.log(typeof viewData);
    //console.log(viewData);
    
    if(!wrapHTML.length > 0){ //Wait until doc is fully loaded in
      wrapHTML =  await this.utils.getFileContents(templateUrl);
    }
    $container.html(ejs.render(wrapHTML, viewData));

    //Debug (container)
    //console.log(typeof $container.html());
    //console.log("\n=============\n"+$container.html());
    
    if($container.html().charAt(0) == "&")//Removing stray "&gt;" string bracket_view.ejs put in. I don't know why it prepends this
      $container.html($container.html().substring(4));
    
    //show the container
    if (mod){
      $container.modal("show");
    }
    else
      $container.show();
  }

  //Populate the wrapper EJS and render
  async renderWrapper() {
    if(this.hasWrapper){
      let viewData = await this.getViewData();
      await this.renderTemplate(this.$wrapperContainer, this.wrapperTemplateUrl, viewData, this.wrapperHTML);
      this.bindWrapperEvents(); //Init wrapper events      
    }
  }

  //Populate the item EJS and render
  async renderItem() {
    let viewData = await this.getViewData();
    await this.renderTemplate(this.$container, this.itemTemplateUrl, viewData, this.containerHTML, this.isModal);        
    this.bindItemEvents(viewData.data); //Init table events
  }

  //Populate the modal EJS and render
  async renderModal(data){
    await this.renderTemplate(this.$modal, this.modalTemplateUrl, data, this.modalHTML, true);
    //Opacity animation not working by default
    // this.$modal.css("opacity", 1);
  }

  //Close the modal
  async closeModal(){
    this.$modal.empty.hide();
  }
  
  async getViewData() {
    throw new Error("Supposed to get getViewData in the sub class!")
  }  
  async bindItemEvents() {
    throw new Error("Supposed to call bindItemEvents in the sub class!")
  }  
  async bindWrapperEvents() {
    throw new Error("Supposed to call bindWrapperEvents in the sub class!")
  }

  // get $alertContainer() {
  //   return $("#" + this.viewModel.alertID);
  // } 
  get wrapperTemplateUrl() {
    return this.viewModel.wrapperTemplateUrl;
  }
  get hasWrapper() {
    return !(this.viewModel.wrapperTemplateUrl == "");
  }
  get $wrapperContainer() {
    return $("#" + this.viewModel.wrapperContainerId);
  }
  get $container() {
    return $("#" + this.viewModel.containerId);
  }
  get itemTemplateUrl() {
    return this.viewModel.itemTemplateUrl;
  }
  get $modal(){return $("#"+this.viewModel.modalID);}
  get modalTemplateUrl(){return this.viewModel.modalTemplateUrl;}
  /*readCachedItem()
  special function I added to get the currently cached item instead of reading it anew
  this will be more important later when we are reading from an API.  I don't want to go all the
  way out to the internet to get a value that is sitting in memory.
  I use it when rendering the popover and delete modal when the latest information is not really needed
  */
  // readCachedItem(id) {   
  //   return this.storage.getItem(id);
  // }
}