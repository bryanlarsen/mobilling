var NewUserPage = React.createClass({
  mixins: [ ReactRouter.State, ReactRouter.Navigation,
    Fynx.connect(userStore, 'store'),
  ],

  handleChange: function(ev) {
    var data = [[[ev.target.name], ev.target.value]];
    data.dontSave = true;
    userActions.updateFields(data);
  },

  submit: function(ev) {
    var page = this;
    ev.preventDefault();
    var role = this.state.store.get('role');
    userActions.saveComplete.listenOnce(function() {
      if (role === "agent") {
        window.location.href = "/admin";
      } else {
        page.transitionTo('login');
      }
    });
    userActions.attemptSave();
  },

  render: function() {
    return (
      <div className="body">
        <EmptyHeader />

        <div className="container with-bottom">
          <div className="form-horizontal">

            <legend>Create Account</legend>

            <ProfileCommon store={this.state.store} handleChange={this.handleChange} />

            <ClaimInputGroup type="password" store={this.state.store} label="Password" name="password" onChange={this.handleChange} />
            <ClaimInputGroup type="password" store={this.state.store} label="Password Confirmation" name="password_confirmation" onChange={this.handleChange} />

            { this.state.store.get('role') === 'doctor' && <DoctorProfile store={this.state.store} handleChange={this.handleChange} /> }

            <ClaimFormGroup label="">
              <button className="btn btn-default btn-primary" onClick={this.submit}>Submit</button>
            </ClaimFormGroup>
          </div>
        </div>
      </div>
    );
  }
});
