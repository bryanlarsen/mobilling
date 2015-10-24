//= require ./rollbar
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require fastclick

var Promise = typeof Promise === "undefined" ? ES6Promise.Promise : Promise;

$(function() {
  FastClick.attach(document.body);
});

