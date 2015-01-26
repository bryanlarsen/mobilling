
var ProfileSettings = React.createClass({
  handleChange: function(ev) {
    userActions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    return (
      <div className="form-horizontal">
        <ProfileCommon store={this.props.store} handleChange={this.handleChange} />

        <Link to="password" className="btn btn-lg btn-block">Change your Password</Link>

        { this.props.store.get('role') === 'doctor' && <DoctorProfile store={this.props.store} handleChange={this.handleChange} /> }

      </div>
    );
  }
});
