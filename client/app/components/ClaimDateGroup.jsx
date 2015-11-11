import s from 'underscore.string';
import ClaimFormGroup from '../components/ClaimFormGroup';
import ClaimDate from '../components/ClaimDate';

export default (props) => {
  return (
    <ClaimFormGroup label={props.label || s.humanize(props.name)}>
      <ClaimDate {...props}/>
    </ClaimFormGroup>
  );
}

