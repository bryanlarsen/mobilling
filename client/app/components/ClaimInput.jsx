import {ClaimInputWrapper, ClaimInputInner} from '../components';

export default (props) => {
  return (
    <ClaimInputWrapper {...props}>
      <ClaimInputInner {...props} />
    </ClaimInputWrapper>
  );
}
