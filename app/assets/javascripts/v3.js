//= require react-router
//= require ReactRouterBootstrap
//= require react-router-globals

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

