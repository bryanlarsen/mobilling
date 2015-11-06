const ClaimInputWrapper = require('./ClaimInputWrapper');
const ClaimFormGroup = require('./ClaimFormGroup');
const Typeahead = require('./Typeahead');
const Bloodhound = require('typeahead.js/dist/bloodhound.js');

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

module.exports = React.createClass({
  render: function() {
    return (
      <ClaimFormGroup name="hospital">
        <ClaimInputWrapper store={this.props.claim} name="hospital">
          <Typeahead id="input_hospital" name="hospital" engine={hospitalsEngine} value={this.props.claim.hospital} onChange={this.props.onChange}/>
        </ClaimInputWrapper>
      </ClaimFormGroup>
    );
  }
});
