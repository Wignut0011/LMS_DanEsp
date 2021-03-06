import View from './view.js'

export default class FormView extends View {
  constructor(storageService, viewModel, parentView) {
    super(storageService, viewModel.form);
    this.isModal=true;
    this.entityViewModel = viewModel;
    this.currentItemId = null;
    this.parentView = parentView; //reference to parent list view
    this.formChanged = false; //tracks if form changed
  }

  //Parent requests the form
  async requestForm(id = null){
    this.MultiModalInit();
    this.currentItemId = id;
    this.Render();  
  }
  
  //Data for rendering EJS
  async getViewData() {
    return (this.currentItemId != null) ? 
      ({formType:"edit",
      view:await this.storage.getTeam(this.currentItemId),
      viewModel: this.viewModel})
      :
      ({formType:"add",
      viewModel: this.viewModel});
  }

  //Init Event handlers
  async bindItemEvents(data) {
    let that = this;
    let $formModal = this.$modal;

    //Finish adding to modal
    this.$container.attr("data-id", this.currentItemId);
    this.$container.attr("data-name", this.storage.Read(this.currentItemId).name);
    
    if(this.currentItemId != null){ //Edit
      $("#edit-id").val(this.storage.getTeam(this.currentItemId).id);
      $("#logo-url").val(this.storage.getTeam(this.currentItemId).TeamLogo);
    }
    else{ //New 
      $("#edit-id").val(this.storage.size);
      $("#logo-url").val(this.storage.defaultTeamLogo);
    }
    
    //Event: Submit form
    $("#form-add-button").on("click", this.submit);
        
    //Event: When the form attempts to close, check for unsaved work
    $formModal.on("hide.bs.modal", (e)=>{
      //Check if changes were made
      if(that.formChanged){
        $("#unsavedModal").modal("show"); //Show warning modal

        //Event: Close form if confirmed
        $("#change-close-button").one("click", (e)=>{
          that.formChanged = false;
          $formModal.modal("hide");
        });        
        e.preventDefault(); //Don't close modal
      }
      else{
        $formModal.off("hide.bs.modal"); //Remove hide event handler
        $formModal.modal("hide");
      }
    });
    
    //Event: Check field validation if change occures
    $(".form-control").on("change", this.change);

    //Event: New Image Uploaded
    $("#edit-logo").change(()=>{
      $(".form-icon").attr("style","display:none");
      $(".form-pic").attr("src",URL.createObjectURL($("#edit-logo").prop('files')[0]));
      $(".form-pic").attr("style","display:block");
      
    });
  }
  
  async bindWrapperEvents() {}  //needed for now so parent class doesn't complain. 

  //Event Function: Submit form
  submit = e => {
    let $formObj = this.form;
    e.preventDefault();
    
    //Validate and get data
    if(!this.form.checkValidity()){
      e.stopPropagation();
      $(".form-control,.form-select").each(function(){this.fieldValidated($(this))});//Check each field
      return; //Failed validation
    }
    this.formValidated($formObj);
    let formDat = this.getFormData();
    
    //Add logo source url to image if uploaded
    if(formDat.TeamLogoFile.size > 0)
      formDat.TeamLogo = URL.createObjectURL(formDat.TeamLogoFile);
    
    //Create team from form data
    let newTeamObj = Object.assign({}, this.viewModel.NewTeamTemplate, formDat);

     //Convert id to int if new data
    if (isNaN(newTeamObj.id))
      newTeamObj.id = parseInt(newTeamObj.id);
    
    //Add to storage and re-render
    this.storage.Update(newTeamObj);
    this.parentView.reRender();
    
    this.$modal.off("hide.bs.modal"); //Remove hide event handler
    this.$modal.modal("hide");
  }

  //Event Function: Field has changed
  change = e => {
    let $changed = this.getEventEl(e);
    
    //Validate
    this.fieldValidated($changed);
    this.formChanged = true;
  }

  //Updates classes after validation
  fieldValidated($el) {
    $el.removeClass('is-valid');
    $el.removeClass('is-invalid');
    
    if($el.get(0).checkValidity())
      $el.addClass('is-valid');
    else
      $el.addClass('is-invalid');
  }

  //Let's bootstrap know validation was finished
  formValidated() {
    this.$form.addClass('was-validated');
  }

  //Support for multiple modals
  MultiModalInit(){
    $(document).on('show.bs.modal', '.modal', function() {
      const zIndex = 1040 + 10 * $('.modal:visible').length;
      $(this).css('z-index', zIndex);
      setTimeout(() => $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack'));
    });
  }
    //Object-ify the form data
  getFormData() {
    return Object.fromEntries(new FormData(this.form));
  }

  //Shortcut jquery wrapper for events
  getEventEl(ev) {
    return $(ev.currentTarget);
  }

  get fields() {return this.viewModel.fields;}
  get formId() {return this.viewModel.containerId;}
  get $modal() {return $("#" + this.viewModel.containerId);}
  get $form(){return $(".needs-validation");}
  get form() {return this.$form.get(0);}
  get formValid() {return this.form.checkValidity();}
  get $inputs() {return $("#" + this.formId + " :input");}

}