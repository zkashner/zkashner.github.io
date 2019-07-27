$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
});


// Hamburger button, click to open sidebar
$("#menu-toggle").click(function(e) {
    $("#wrapper").toggleClass("toggled");
});

$("body").click(function(e) {
   if(!$(e.target).hasClass('ham-btn-target')){
       $("#wrapper").removeClass("toggled");
   }
});


// Accordion JS, for opening/closing the papers' abstracts
var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
