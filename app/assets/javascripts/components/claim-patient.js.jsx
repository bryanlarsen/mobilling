var ClaimPatient = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    var sexes = {
      F: <span className="needsclick"><i className="needsclick fa fa-venus" /><span className="needsclick">Female</span></span>,
      M: <span className="needsclick"><i className="needsclick fa fa-mars" /><span className="needsclick">Male</span></span>,
    };
    return (
      <div>
        <ClaimPhoto {...this.props} />

        <ClaimInputGroup {...this.props} label="Name" name="patient_name" onChange={this.handleChange} />
        <ClaimInputGroup {...this.props} label="Number" name="patient_number" onChange={this.handleChange} />
        <ClaimFormGroup label="Province">
          <ClaimInputWrapper {...this.props} name="patient_province">
            <Select {...this.props} name="patient_province" options={provinces} onChange={this.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimDateGroup {...this.props} label="Birth Date" name="patient_birthday" birthday onChange={this.handleChange}/>
        <ClaimFormGroup label="Sex">
          <ClaimInputWrapper {...this.props} name="patient_sex" onChange={this.handleChange}>
            <RadioSelect {...this.props} name="patient_sex" options={sexes} onChange={this.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
      </div>
    );
  }
});
