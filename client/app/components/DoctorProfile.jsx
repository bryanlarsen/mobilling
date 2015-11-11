import _ from 'underscore';

import Icon from '../components/Icon';
import ClaimInputGroup from '../components/ClaimInputGroup';
import ClaimInputWrapper from '../components/ClaimInputWrapper';
import ClaimFormGroup from '../components/ClaimFormGroup';
import Select from '../components/Select';
import ClaimInput from '../components/ClaimInput';
import SPECIALTIES from '../data/specialties';

export default React.createClass({
  getInitialState: function() {
    return {
      agents: {"": "Select an Agent"}
    }
  },

  componentWillMount: function(ev) {
    var that = this;
    $.ajax({
      url: window.ENV.API_ROOT+'v1/agents',
      contentType: 'application/json',
      success: function(data) {
        var agents = that.state.agents;
        _.each(data, function(o) {
          agents[o.id] = o.name;
        });
        that.setState({agents: agents});
      }
    });
  },

  render: function() {
    const office_codes = {
      "": "Select an Office Code",
      "G": "Hamilton (G)",
      "J": "Kingston (J)",
      "P": "London (P)",
      "E": "Missisauga (E)",
      "F": "Oshawa (F)",
      "D": "Ottawa (D)",
      "R": "Sudbury (R)",
      "U": "Thunder Bay (U)",
      "N": "Toronto (N)"
    };

    const specialty_codes = {
      "0": "Family Practice and Practice In General (00)",
      "1": "Anaesthesia (01)",
      "2": "Dermatology (02)",
      "3": "General Surgery (03)",
      "4": "Neurosurgery (04)",
      "5": "Community Medicine (05)",
      "6": "Orthopaedic Surgery (06)",
      "7": "Geriatrics (07)",
      "8": "Plastic Surgery (08)",
      "9": "Cardiovascular and Thoracic Surgery (09)",
      "12": "Emergency Medicine (12)",
      "13": "Internal Medicine (13)",
      "18": "Neurology (18)",
      "19": "Psychiatry (19)",
      "20": "Obstetrics and Gynaecology (20)",
      "22": "Genetics (22)",
      "23": "Ophthalmology (23)",
      "24": "Otolaryngology (24)",
      "26": "Paediatrics (26)",
      "27": "Non-medical Laboratory Director (Provider Number Must Be 599993) (27)",
      "28": "Pathology (28)",
      "29": "Microbiology (29)",
      "30": "Clinical Biochemistry (30)",
      "31": "Physical Medicine (31)",
      "33": "Diagnostic Radiology (33)",
      "34": "Therapeutic Radiology (34)",
      "35": "Urology (35)",
      "41": "Gastroenterology (41)",
      "47": "Respiratory Diseases (47)",
      "48": "Rheumatology (48)",
      "49": "Dental Surgery (49)",
      "50": "Oral Surgery (50)",
      "51": "Orthodontics (51)",
      "52": "Paedodontics (52)",
      "53": "Periodontics (53)",
      "54": "Oral Pathology (54)",
      "55": "Endodontics (55)",
      "56": "Optometry (56)",
      "57": "Osteopathy (57)",
      "58": "Chiropody (Podiatry) (58)",
      "59": "Chiropractics (59)",
      "60": "Cardiology (60)",
      "61": "Haematology (61)",
      "62": "Clinical Immunology (62)",
      "63": "Nuclear Medicine (63)",
      "64": "Thoracic Surgery (64)",
      "70": "Oral Radiology (70)",
      "71": "Prosthodontics (71)",
      "75": "Midwife (referral only) (75)",
      "76": "Nurse Practitioner (76)",
      "80": "Private Physiotherapy Facility (Approved to Provide Home Treatment Only) (80)",
      "81": "Private Physiotherapy Facility (Approved to Provide Office and Home Treatment) (81)",
      "85": "Alternate Health Care Profession (85)",
      "90": "IHF Non-Medical Practitioner (Provider Number Must Be 991000) (90)"
    };

    return (
      <div>
        <legend>Settings</legend>
        <ClaimFormGroup label="Agent">
          <ClaimInputWrapper store={this.props.userStore} name="agent_id">
            <Select store={this.props.userStore} name="agent_id" options={this.state.agents} onChange={this.props.onChange} />
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimFormGroup label="Default Specialty">
          <ClaimInputWrapper store={this.props.userStore} name="default_specialty">
            <Select store={this.props.userStore} name="default_specialty" options={SPECIALTIES} onChange={this.props.onChange} />
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimInputGroup store={this.props.userStore} name="provider_number" label="OHIP Provider Number" onChange={this.props.onChange} />
        <ClaimInputGroup store={this.props.userStore} name="group_number" label="OHIP Group Number (enter 0000 for no group)" onChange={this.props.onChange} />
        <ClaimFormGroup label="MOH Office Code">
          <ClaimInputWrapper store={this.props.userStore} name="office_code">
            <Select store={this.props.userStore} name="office_code" options={office_codes} onChange={this.props.onChange} />
          </ClaimInputWrapper>
        </ClaimFormGroup>
        <ClaimFormGroup label="MOH Specialty Code">
          <ClaimInputWrapper store={this.props.userStore} name="specialty_code">
            <Select store={this.props.userStore} name="specialty_code" options={specialty_codes} onChange={this.props.onChange} />
          </ClaimInputWrapper>
        </ClaimFormGroup>
      </div>
    );
  }
});

