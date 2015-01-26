var NewUser = React.createClass({
  mixins: [
    Fynx.connect(userStore, 'store'),
  ],

  submit: function(ev) {
    ev.preventDefault();
    userActions.attemptSave();
  },

  handleChange: function(ev) {
    var data = [[[ev.target.name], ev.target.value]];
    data.dontSave = true;
    userActions.updateFields(data);
  },

  render: function() {
    return (
      <div className="form-horizontal">
        <UserForm store={this.state.store} handleChange={this.handleChange}/>
      </div>
    );
  }
});
