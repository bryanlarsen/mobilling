import Icon from '../components/Icon';
import ClaimInputGroup from '../components/ClaimInputGroup';
import ClaimInputWrapper from '../components/ClaimInputWrapper';
import ClaimFormGroup from '../components/ClaimFormGroup';
import RadioSelect from '../components/RadioSelect';
import ClaimInput from '../components/ClaimInput';
import Select from '../components/Select';
import ClaimDateGroup from '../components/ClaimDateGroup';
import Typeahead from '../components/Typeahead';
import ClaimPhoto from '../components/ClaimPhoto';
import { updateClaim } from '../actions/claimActions';
import Bloodhound from 'typeahead.js/dist/bloodhound.js';

import provinces from '../data/provinces';

const patientNameEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: [],
  remote: {
    url: window.ENV.API_ROOT + 'v1/patients?name=%QUERY',
    wildcard: '%QUERY',
  },
});

var patientNumberEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: [],
  remote: {
    url: window.ENV.API_ROOT + 'v1/patients?number=%QUERY',
    wildcard: '%QUERY',
  },
});

export default React.createClass({
  patientChanged: function(ev, suggestion) {
    if (suggestion && suggestion.name) {
      this.props.dispatch(
        updateClaim(this.props.claim.id, {
          patient_name: suggestion.name,
          patient_number: suggestion.number,
          patient_province: suggestion.province,
          patient_birthday: suggestion.birthday,
          patient_sex: suggestion.sex,
        })
      );
    } else {
      this.props.onChange(ev);
    }
  },

  typeaheadTemplates: {
    suggestion: function(suggestion) {
      return (
        '<div><div><span>' +
        suggestion.name +
        "&nbsp;</span><span class='pull-right'>" +
        suggestion.sex +
        ' ' +
        suggestion.province +
        '</span></div><div><span>' +
        suggestion.number +
        "&nbsp;</span><span class='pull-right'>" +
        suggestion.birthday +
        '</span></div>'
      );
    },
  },

  render: function() {
    var sexes = {
      F: (
        <span>
          <i className="fa fa-venus" />
          Female
        </span>
      ),
      M: (
        <span>
          <i className="fa fa-mars" />
          Male
        </span>
      ),
    };

    return (
      <div>
        <ClaimPhoto {...this.props} />
        <ClaimFormGroup {...this.props} store={this.props.claim} label="Name">
          <ClaimInputWrapper {...this.props} name="patient_name">
            <Typeahead
              name="patient_name"
              engine={patientNameEngine}
              value={this.props.claim.patient_name}
              onChange={this.patientChanged}
              templates={this.typeaheadTemplates}
              display={function(suggestion) {
                return suggestion.name;
              }}
            />
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimFormGroup {...this.props} label="Number">
          <ClaimInputWrapper {...this.props} name="patient_number">
            <Typeahead
              name="patient_number"
              engine={patientNumberEngine}
              value={this.props.claim.patient_number}
              onChange={this.patientChanged}
              templates={this.typeaheadTemplates}
              display={function(suggestion) {
                return suggestion.number;
              }}
            />
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimFormGroup label="Province">
          <ClaimInputWrapper store={this.props.claim} name="patient_province">
            <Select
              store={this.props.claim}
              name="patient_province"
              options={provinces}
              onChange={this.props.onChange}
            />
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimDateGroup
          store={this.props.claim}
          label="Birth Date"
          name="patient_birthday"
          birthday
          onChange={this.props.onChange}
        />
        <ClaimFormGroup label="Sex">
          <ClaimInputWrapper store={this.props.claim} name="patient_sex">
            <RadioSelect
              store={this.props.claim}
              name="patient_sex"
              options={sexes}
              onChange={this.props.onChange}
            />
          </ClaimInputWrapper>
        </ClaimFormGroup>
      </div>
    );
  },
});
