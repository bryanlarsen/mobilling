//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap/modal
//= require_tree ./admin

$(document).on("ready page:load", function () {
    $("[data-lightbox]:not(.electric-lightbox)").lightbox().addClass("electric-lightbox");
});
