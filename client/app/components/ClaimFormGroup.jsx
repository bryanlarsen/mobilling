import { ClaimFormGroupUnwrapped } from '../components';

export default (props) => {
  return (
    <ClaimFormGroupUnwrapped {...props}>
      <div className={"col-md-"+(props.width || 4)}>
        {props.children}
      </div>
    </ClaimFormGroupUnwrapped>
  );
}

