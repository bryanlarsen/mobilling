import s from 'underscore.string';

export default (props) => {
  return (
    <div className="form-group">
      <label className="control-label col-md-4" htmlFor={props.htmlFor || props.name}>{props.label || s.humanize(props.name)}</label>
      {props.children}
    </div>
  );
};
