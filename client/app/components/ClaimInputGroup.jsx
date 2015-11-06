const ClaimFormGroup = require('./ClaimFormGroup');
const ClaimInput = require('./ClaimInput');
const s = require('underscore.string');

module.exports = (props) => {
  return (
    <ClaimFormGroup label={props.label || s.humanize(props.name)} width={props.width}>
      <ClaimInput {...props} />
    </ClaimFormGroup>
  );
};

