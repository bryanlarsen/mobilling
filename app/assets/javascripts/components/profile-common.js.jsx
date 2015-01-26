var ProfileCommon = React.createClass({
  render: function() {
    var roles = {
      doctor: <Icon i="user-md">Doctor</Icon>,
      agent: <Icon i="briefcase">Agent</Icon>
    };

    return (
      <div>
        <ClaimFormGroup label="">
          <ClaimInputWrapper store={this.props.store} name="role" onChange={this.props.handleChange}>
            <RadioSelect store={this.props.store} name="role" options={roles} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimInputGroup store={this.props.store} name="name" onChange={this.props.handleChange} />
        <ClaimInputGroup store={this.props.store} label="E-mail" name="email" onChange={this.props.handleChange} />

      </div>
    );
  }
});
