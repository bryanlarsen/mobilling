import ClaimInputWrapper from '../components/ClaimInputWrapper';
import ClaimInputInner from '../components/ClaimInputInner';

export default (props) => {
  return (
    <ClaimInputWrapper {...props}>
      <ClaimInputInner {...props} />
    </ClaimInputWrapper>
  );
}
