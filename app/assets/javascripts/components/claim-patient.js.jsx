var patientNameEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: [],
  remote: {
    url: window.ENV.API_ROOT+'v1/patients?name=%QUERY',
    wildcard: '%QUERY'
  }
});
patientNameEngine.initialize();

var patientNumberEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: [],
  remote: {
    url: window.ENV.API_ROOT+'v1/patients?number=%QUERY',
    wildcard: '%QUERY'
  }
});
patientNumberEngine.initialize();

var ClaimPatient = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  patientChanged: function(ev, suggestion) {
    if (suggestion.name) {
      this.props.actions.updateFields([
        [['patient_name'], suggestion.name],
        [['patient_number'], suggestion.number],
        [['patient_province'], suggestion.province],
        [['patient_birthday'], suggestion.birthday],
        [['patient_sex'], suggestion.sex]
      ]);
    } else {
      this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
    }
  },

  typeaheadTemplates: {
    suggestion: function(suggestion) {
      return "<div><div><span>"+suggestion.name+"&nbsp;</span><span class='pull-right'>"+suggestion.sex+" "+suggestion.province+"</span></div><div><span>"+suggestion.number+"&nbsp;</span><span class='pull-right'>"+suggestion.birthday+"</span></div>";
    }
  },

  render: function() {
    var sexes = {
      F: <span><i className="fa fa-venus" />Female</span>,
      M: <span><i className="fa fa-mars" />Male</span>,
    };
    return (
      <div>
        <ClaimPhoto {...this.props} />

        <ClaimFormGroup {...this.props} label="Name">
          <ClaimInputWrapper {...this.props} name="patient_name">
            <Typeahead name="patient_name" engine={patientNameEngine} value={this.props.store.get('patient_name')} onChange={this.patientChanged} templates={this.typeaheadTemplates} display={function(suggestion) { return suggestion.name; }}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimFormGroup {...this.props} label="Number">
          <ClaimInputWrapper {...this.props} name="patient_number">
            <Typeahead name="patient_number" engine={patientNumberEngine} value={this.props.store.get('patient_number')} onChange={this.patientChanged} templates={this.typeaheadTemplates} display={function(suggestion) { return suggestion.number; }}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>
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
