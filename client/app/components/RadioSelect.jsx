import _ from 'underscore';

export default (props) => {
  var value = props.value || props.store[props.name];

  return (
    <div className="btn-group">
      {
       _.map(props.options, function(label, code) {
         return (
           <button key={'rg'+props.name+code} className={"btn btn-default "+(value===code ? 'btn-primary ' : '')+(props.small ? '' : 'btn-lg')} name={props.name} value={code} onClick={props.onChange}>
           {label}
           </button>
         );
       })
       }
    </div>
  );
};

