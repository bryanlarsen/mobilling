const ClaimInputWrapper = require('./ClaimInputWrapper');
const YesNo = require('./YesNo');

module.exports = (props) => {
  return (
    <ClaimInputWrapper {...props}>
      <YesNo name={props.name} on={props.store[props.name]} onChange={props.onChange} disabled={props.disabled}/>
    </ClaimInputWrapper>
  );
};
