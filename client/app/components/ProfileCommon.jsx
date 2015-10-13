import { Icon, ClaimInputGroup, ClaimInputWrapper, ClaimFormGroup, RadioSelect, ClaimInput } from '../components';

export default (props) => {
  var roles = {
    doctor: <Icon i="user-md">Doctor</Icon>,
    agent: <Icon i="briefcase">Agent</Icon>
  };

  return (
    <div>
      <ClaimFormGroup label="">
        <ClaimInputWrapper store={props.userStore} name="role">
          <RadioSelect store={props.userStore} name="role" options={roles} />
        </ClaimInputWrapper>
      </ClaimFormGroup>
      <ClaimInputGroup {...props} store={props.userStore} name="name" />
      <ClaimInputGroup {...props} label="E-mail" store={props.userStore} name="email"/>

    </div>
  );
};
