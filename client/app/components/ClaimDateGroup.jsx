const s = require('underscore.string');
const ClaimFormGroup = require('./ClaimFormGroup');
const ClaimDate = require('./ClaimDate');

module.exports = (props) => {
  return (
    <ClaimFormGroup label={props.label || s.humanize(props.name)}>
      <ClaimDate {...props}/>
    </ClaimFormGroup>
  );
}

