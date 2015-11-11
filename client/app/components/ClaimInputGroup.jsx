import ClaimFormGroup from '../components/ClaimFormGroup';
import ClaimInput from '../components/ClaimInput';
import s from 'underscore.string';

export default (props) => {
  return (
    <ClaimFormGroup label={props.label || s.humanize(props.name)} width={props.width}>
      <ClaimInput {...props} />
    </ClaimFormGroup>
  );
};

