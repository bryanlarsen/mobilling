//= require twitter/bootstrap/collapse

$(document).on("ready page:load", function() {
  $('.max-height-clickable').click(function() {
    $(this).toggleClass('on');
  });
});
