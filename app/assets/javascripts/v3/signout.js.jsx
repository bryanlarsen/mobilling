var SignOut = React.createClass({
  mixins: [ReactRouter.Navigation ],

  componentWillMount: function() {
    globalActions.signout();
  },

  render: function() {
    return (
      <div className="body">
        Signing out...
      </div>
    );
  }
});
