const ClaimFormGroupUnwrapped = require('./ClaimFormGroupUnwrapped');

module.exports = (props) => {
  return (
    <ClaimFormGroupUnwrapped {...props}>
      <div className={"col-md-"+(props.width || 4)}>
        {props.children}
      </div>
    </ClaimFormGroupUnwrapped>
  );
}

