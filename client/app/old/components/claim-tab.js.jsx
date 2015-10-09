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

        <ClaimHospital {...this.props} />

        {this.props.agent && <ClaimFormGroup label="Manual Review Required">
          <ClaimYesNo {...this.props} name="manual_review_indicator" />
        </ClaimFormGroup>}

        {this.props.agent && <ClaimFormGroup label="Service Location">
          <ClaimInputWrapper store={this.props.store} name="service_location">
            <Select {...this.props} name="service_location" options={serviceLocations} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>}

        {this.props.agent && <ClaimPaymentProgram {...this.props} />}

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

var ClaimTab = React.createClass({
  render: function() {
    return this.props.store.get('consult_setup_visible') ?
                   <ClaimTabFull {...this.props} /> :
                   <ClaimTabSimplified {...this.props} />;
  }
});
