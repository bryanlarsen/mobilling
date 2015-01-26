var EditUser = React.createClass({
  mixins: [
    Fynx.connect(userStore, 'store'),
  ],

  handleChange: function(ev) {
    var data = [[[ev.target.name], ev.target.value]];
    userActions.updateFields(data);
  },

  back: function(ev) {
    ev.preventDefault();
    history.back();
  },

  render: function() {
    return (
      <div className="form-horizontal">
        <ProfileCommon store={this.state.store} handleChange={this.handleChange} />

        { this.state.store.get('role') === 'doctor' && <DoctorProfile store={this.state.store} handleChange={this.handleChange} /> }

        <ClaimFormGroup label="">
          { this.state.store.get('unsaved') ?
             <button className="btn btn-default btn-danger" disabled>Unsaved</button> :
             <button className="btn btn-default btn-primary" disabled>Saved</button>
          }
           &nbsp;or <a href="#" onClick={this.back}>Cancel</a>
        </ClaimFormGroup>
      </div>
    );
  }
});
