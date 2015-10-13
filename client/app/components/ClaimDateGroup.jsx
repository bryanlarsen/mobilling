import s from 'underscore.string';
import { ClaimFormGroup, ClaimDate } from '../components';

export default (props) => {
  return (
    <ClaimFormGroup label={props.label || s.humanize(props.name)}>
      <ClaimDate {...props}/>
    </ClaimFormGroup>
  );
}

