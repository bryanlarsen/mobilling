import { ClaimInputWrapper, YesNo } from '../components';

export default (props) => {
  return (
    <ClaimInputWrapper {...props}>
      <YesNo name={props.name} on={props.store[props.name]} onChange={props.onChange} disabled={props.disabled}/>
    </ClaimInputWrapper>
  );
};
