const BlurInput = require('./BlurInput');

module.exports = (props) => {
  return (
    <BlurInput type={props.type} name={props.name} value={props.store[props.name]} onChange={props.onChange} className={"form-control "+(props.className || '')} />
  );
};

