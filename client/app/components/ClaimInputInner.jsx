import BlurInput from './BlurInput';

export default (props) => {
  return (
    <BlurInput type={props.type} name={props.name} value={props.value !== undefined ? props.value : props.store[props.name]} onChange={props.onChange} className={"form-control "+(props.className || '')} />
  );
};

