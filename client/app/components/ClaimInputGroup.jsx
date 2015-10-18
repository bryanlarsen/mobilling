import { ClaimFormGroup, ClaimInput } from '../components';
import s from 'underscore.string';

export default (props) => {
  return (
    <ClaimFormGroup label={props.label || s.humanize(props.name)} width={props.width}>
      <ClaimInput {...props} />
    </ClaimFormGroup>
  );
};

