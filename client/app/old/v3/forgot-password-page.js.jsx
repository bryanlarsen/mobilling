var ForgotPasswordPage = React.createClass({
  mixins: [ ReactRouter.State, ReactRouter.Navigation,
    Fynx.connect(userStore, 'store'),
  ],

  handleChange: function(ev) {
  },

  submit: function(ev) {
    var page = this;
    ev.preventDefault();
    var data = [[['email'], this.refs.form.getDOMNode().elements.email.value]];
    data.dontSave = true;
    userActions.updateFields(data);
    userActions.saveComplete.listenOnce(function() {
      page.transitionTo('login');
    });
    userActions.forgotPassword();
  },


  render: function() {
    return (
      <div className="body">
        <EmptyHeader />

        <div className="container with-bottom">
          <form ref="form" className="form-horizontal" onSubmit={this.submit}>

            <legend>Request Password Reset</legend>
            <ClaimInputGroup store={this.state.store} type="email" name="email" />

            <ClaimFormGroup label="">
              <button type="submit" className="btn btn-default btn-primary">Submit</button>
            </ClaimFormGroup>
          </form>
        </div>
      </div>
    );
  }
});

