var ClaimTabSimplified = React.createClass({
  render: function() {
    return (
      <div>
        <ClaimFormGroup label="Doctor">
          <ClaimInputWrapper {...this.props} name="user_id">
            <Select {...this.props} name="user_id" options={userStore().get('doctors').toJS()} onChange={this.props.handleChange} />
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimFormGroup label="Specialty">
          <ClaimInputWrapper {...this.props} name="specialty">
            <Select {...this.props} name="specialty" options={specialties} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimFormGroup label="Template">
          <ClaimInputWrapper {...this.props} name="template">
            <Select {...this.props} name="template" options={{full: 'full', simplified: 'simplified', agent: 'agent'}} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimHospital {...this.props} />
        <ClaimFormGroup label="Manual Review Required">
          <ClaimYesNo {...this.props} name="manual_review_indicator" />
        </ClaimFormGroup>

      </div>
    );
  }
});

var ClaimTabFull = React.createClass({
  render: function() {
    return (
      <div>

        <ClaimTabSimplified {...this.props} />

        <ClaimInputGroup name="referring_physician" type='text' store={this.props.store} onChange={this.props.handleChange} />
        <ClaimDiagnoses {...this.props} />
        <ClaimFormGroup label="Most Responsible Physician">
          <ClaimYesNo {...this.props} name="most_responsible_physician" />
        </ClaimFormGroup>
        <ClaimAdmissionFirstLast {...this.props}/>
      </div>
    );
  }
});

var ClaimTabAgent = React.createClass({
  render: function() {
    return (
      <div>

        <ClaimTabSimplified {...this.props} />

        <ClaimFormGroup label="Service Location">
          <ClaimInputWrapper store={this.props.store} name="service_location">
            <Select {...this.props} name="service_location" options={serviceLocations} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
      </div>
    );
  }
});

var ClaimTab = React.createClass({
  render: function() {
    switch (this.props.store.get('template')) {
      case 'full': return <ClaimTabFull {...this.props} />;
      case 'simplified': return <ClaimTabSimplified {...this.props} />;
      case 'agent': return <ClaimTabAgent {...this.props} />;
      default: return <div> FIXME </div>;
    }
  }
});
