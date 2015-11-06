const ClaimInputWrapper = require('./ClaimInputWrapper');
const ClaimInputInner = require('./ClaimInputInner');

module.exports = (props) => {
  return (
    <ClaimInputWrapper {...props}>
      <ClaimInputInner {...props} />
    </ClaimInputWrapper>
  );
}
