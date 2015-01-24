var ChangePassword = React.createClass({
  mixins: [ ReactRouter.State, ReactRouter.Navigation,
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

  done: function() {
    this.transitionTo('settings');
  },

  componentWillMount: function(ev) {
    userActions.checkpoint();
    userActions.saveComplete.listen(this.done);
  },

  componentWillUnmount: function(ev) {
    userActions.restore();
  },

  render: function() {
    return (
      <div className="body">
        <ProfileHeader store={this.state.store}/>

        <div className="container with-bottom">
          <div className="form-horizontal">
            <ClaimInputGroup type="password" store={this.state.store} name="current_password" onChange={this.handleChange} />
            <ClaimInputGroup type="password" store={this.state.store} label="New Password" name="password" onChange={this.handleChange} />
            <ClaimInputGroup type="password" store={this.state.store} label="New Password Confirmation" name="password_confirmation" onChange={this.handleChange} />

            <ClaimFormGroup label="">
              <button className="btn btn-default btn-primary" onClick={this.submit}>Submit</button>
              &nbsp;
              <ButtonLink to="settings" className="btn btn-default">Cancel</ButtonLink>
            </ClaimFormGroup>
          </div>
        </div>
      </div>
    );
  }
});
