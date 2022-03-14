//Scroll to top after tab opens
$(".nav-link").on("click", function(e) {
  $("html, body").animate({
    scrollTop: 0
  }, "slow");
});

//Sidepanel show
function ShowPanel(){
  $(".sidepanel").css({
    "max-width": "280px", //Animate max-width and keep width to fit content, little animation hack
    "border-width": "6px 6px 6px 0"});
  $(".sidepanel").attr("aria-hidden", "false");
  $(".sidepanel").attr("aria-expanded", "true");
}

//Sidepanel hide
function HidePanel(){
  $(".sidepanel").css({
    "max-width": "0",
    "border-width": "0"});
  $(".sidepanel").attr("aria-hidden", "true");
  $(".sidepanel").attr("aria-expanded", "false");
}