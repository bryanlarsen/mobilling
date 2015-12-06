export default (props) => {
  return (
    <span>
      <i className={"fa fa-"+props.i+(props.xsi?" hidden-xs":"")} />
      <span className={props.xs ? "hidden-xs" : ""}> {props.children}</span>
    </span>
  );
};

