const ClaimInputGroup = require('./ClaimInputGroup');
const ClaimInputWrapper = require('./ClaimInputWrapper');
const ClaimFormGroup = require('./ClaimFormGroup');
const Select = require('./Select');
const ClaimDateGroup = require('./ClaimDateGroup');
const ClaimYesNo = require('./ClaimYesNo');
const ClaimHospital = require('./ClaimHospital');
const ClaimDiagnoses = require('./ClaimDiagnoses');
const ClaimAdmissionFirstLast = require('./ClaimAdmissionFirstLast');
const ClaimPaymentProgram = require('./ClaimPaymentProgram');
const SPECIALTIES = require('../data/specialties');
const serviceLocations = require('../data/serviceLocations');

const ClaimTabSimplified = (props) => {
  return (
      <div>
        <ClaimFormGroup label="Doctor">
          <ClaimInputWrapper store={props.claim} name="user_id">
            <Select store={props.claim} name="user_id" options={props.userStore.doctors} onChange={props.onChange} />
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimFormGroup label="Specialty">
          <ClaimInputWrapper store={props.claim} name="specialty">
            <Select store={props.claim} name="specialty" options={SPECIALTIES} onChange={props.onChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimHospital {...props} />

        {props.agent && <ClaimFormGroup label="Service Location">
          <ClaimInputWrapper store={props.claim} name="service_location">
            <Select store={props.claim} name="service_location" options={serviceLocations} onChange={props.onChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>}

        {props.agent && <ClaimPaymentProgram store={props.claim} />}
        {props.agent && <ClaimFormGroup label="Manual Review Required">
          <ClaimYesNo store={props.claim} name="manual_review_indicator" onChange={props.onChange}/>
        </ClaimFormGroup>}

       </div>
  );
};

const ClaimTabFull = (props) => {
    return (
      <div>

        <ClaimTabSimplified {...props} />

        <ClaimDiagnoses {...props} />
        <ClaimFormGroup label="Most Responsible Physician">
          <ClaimYesNo store={props.claim} name="most_responsible_physician" onChange={props.onChange}/>
        </ClaimFormGroup>
        <ClaimInputGroup name="referring_physician" type='text' store={props.claim} onChange={props.onChange} />
        <ClaimAdmissionFirstLast {...props} />
      </div>
    );
};

module.exports = (props) => {
  return props.claim.consult_setup_visible ?
                   <ClaimTabFull {...props} /> :
                   <ClaimTabSimplified {...props} />;
};
