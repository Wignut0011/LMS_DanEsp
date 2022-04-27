export default class Animations{
  constructor(){
    this.panelToggle = false;
    this.initEvents();
  }

  initEvents(){
    let that = this;
    //Scroll to top after tab opens
    $(".nav-link").on("click", function() {
      $("html, body").animate({
        scrollTop: 0
      }, "slow");
    });
    
    $(".aside-btn").on("click", function(){ //Aside show button (togglable)
      that.panelToggle = !that.panelToggle;
      if(that.panelToggle)
        that.ShowPanel();
      else
        that.HidePanel();
    });
    $(".aside-close").on("click", function(){ //Aside close button
      that.panelToggle = false;
      that.HidePanel();});
  }
  
  //Sidepanel show
  ShowPanel(){
    $(".sidepanel").css({
      "max-width": "280px", //Animate max-width and keep width to fit content, little animation hack
      "border-width": "6px 6px 6px 0"});
    $(".sidepanel").attr("aria-hidden", "false");
    $(".sidepanel").attr("aria-expanded", "true");
  }

  //Sidepanel hide
  HidePanel(){
    $(".sidepanel").css({
      "max-width": "0",
      "border-width": "0"});
    $(".sidepanel").attr("aria-hidden", "true");
    $(".sidepanel").attr("aria-expanded", "false");
  }
}