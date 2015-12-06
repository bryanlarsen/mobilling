import _ from 'underscore';

export default (props) => {
  var value = props.value || props.store[props.name];
  return (
    <select className="form-control" value={value} name={props.name} onChange={props.onChange}>
      { Object.keys(props.options).map((code) => 
           <option value={code} key={'option'+name+code} >{props.options[code]}</option>
        )}

    </select>
  );
}

