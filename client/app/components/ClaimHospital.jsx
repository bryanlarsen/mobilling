import { ClaimInputWrapper, ClaimFormGroup, Typeahead } from '../components';
import Bloodhound from 'typeahead.js/dist/bloodhound.js';

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

export default React.createClass({
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
