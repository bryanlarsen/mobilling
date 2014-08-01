//= require jquery
//= require jquery_ujs
//= require bootstrap/modal
//= require_tree ./admin

$(document).on("ready page:load", function () {
    $("[data-lightbox]:not(.electric-lightbox)").lightbox().addClass("electric-lightbox");
});
