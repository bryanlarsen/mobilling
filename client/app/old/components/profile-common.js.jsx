var ProfileCommon = React.createClass({
  handleChange: function(ev) {
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    this.props.actions.updateFields([[[target.name], target.value]]);
  },

  render: function() {
    var roles = {
      doctor: <Icon i="user-md">Doctor</Icon>,
      agent: <Icon i="briefcase">Agent</Icon>
    };

    return (
      <div>
        <ClaimFormGroup label="">
          <ClaimInputWrapper store={this.props.store} name="role" onChange={this.props.handleChange}>
            <RadioSelect store={this.props.store} name="role" options={roles} onChange={this.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimInputGroup store={this.props.store} name="name" onChange={this.props.handleChange} />
        <ClaimInputGroup store={this.props.store} label="E-mail" name="email" onChange={this.props.handleChange} />

      </div>
    );
  }
});
