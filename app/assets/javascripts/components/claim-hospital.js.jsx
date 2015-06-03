var hospitalsEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  prefetch: {
    url: window.ENV.API_ROOT+'v1/hospitals.json',
  }
});
setTimeout(function() {
  hospitalsEngine.initialize();
}, 500);

var ClaimHospital = React.createClass({
  render: function() {
    return (
      <ClaimFormGroup name="hospital">
        <ClaimInputWrapper {...this.props} name="hospital">
          <Typeahead store={this.props.store} id="input_hospital" name="hospital" engine={hospitalsEngine} value={this.props.store.get('hospital')} onChange={this.props.handleChange}/>
        </ClaimInputWrapper>
      </ClaimFormGroup>
    );
  }
});
