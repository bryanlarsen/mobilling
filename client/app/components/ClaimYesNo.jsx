import ClaimInputWrapper from '../components/ClaimInputWrapper';
import YesNo from '../components/YesNo';

export default (props) => {
  return (
    <ClaimInputWrapper {...props}>
      <YesNo name={props.name} on={props.store[props.name]} onChange={props.onChange} disabled={props.disabled}/>
    </ClaimInputWrapper>
  );
};
