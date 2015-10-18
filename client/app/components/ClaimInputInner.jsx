import BlurInput from './BlurInput';

export default (props) => {
  return (
    <BlurInput type={props.type} name={props.name} value={props.store[props.name]} onChange={props.onChange} className={"form-control "+(props.className || '')} />
  );
};

