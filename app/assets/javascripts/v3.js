//= require jquery
//= require fastclick
//= require react
//= require react_ujs
//= require underscore
//= require underscore.string
//= require es6-promise
//= require pickadate/lib/picker
//= require pickadate/lib/picker.date
//= require pickadate/lib/picker.time
//= require moment
//= require typeahead.js/dist/typeahead.bundle
//= require react-bootstrap
//= require react-router
//= require ReactRouterBootstrap
//= require ./react-globals
//= require immutable
//= require Fynx

//= require components
//= require_tree ./v3

React.initializeTouchEvents(true);

$(document).ready(function() {
  ReactRouter.run(V3Routes, function(Handler, state) {
        React.render(React.createElement(Handler, {params: state.params}), document.body);
  });

  globalActions.startBusy();
  $.ajax({
    url: '/v1/claims',
    dataType: 'json',
    success: function(data) {
      claimListActions.init(data);
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      console.error('error loading claims');
      globalActions.endBusy();
    }
  });

});

