import Icon from '../components/Icon';
import ClaimInputGroup from '../components/ClaimInputGroup';
import ClaimInputWrapper from '../components/ClaimInputWrapper';
import ClaimFormGroup from '../components/ClaimFormGroup';
import RadioSelect from '../components/RadioSelect';
import ClaimInput from '../components/ClaimInput';

export default (props) => {
  var roles = {
    doctor: <Icon i="user-md">Doctor</Icon>,
    agent: <Icon i="briefcase">Agent</Icon>
  };

  return (
    <div>
      <ClaimFormGroup label="">
        <ClaimInputWrapper store={props.userStore} name="role">
          <RadioSelect store={props.userStore} name="role" options={roles} onChange={props.onChange} />
        </ClaimInputWrapper>
      </ClaimFormGroup>
      <ClaimInputGroup {...props} store={props.userStore} name="name" />
      <ClaimInputGroup {...props} label="E-mail" store={props.userStore} name="email"/>

    </div>
  );
};
