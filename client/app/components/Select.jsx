const _ = require('underscore');

module.exports = (props) => {
  var value = props.value || props.store[props.name];
  return (
    <select className="form-control" value={value} name={props.name} onChange={props.onChange}>
      { [for (code of Object.keys(props.options))
           <option value={code} key={'option'+name+code} >{props.options[code]}</option>
       ]
       }

    </select>
  );
}

