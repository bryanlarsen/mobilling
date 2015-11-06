const _ = require('underscore');

module.exports = (props) => {
  let messages = [];
  let types = {};

  if (!props.silent && props.store) {
    for (const type of ['warnings', 'errors', 'validations']) {
      const m = props.store[type] && props.store[type][props.name];
      if (m) {
        messages.push(m);
        types[type] = true;
      }
    }
  }

  return (
    <div className={""+(types['warnings'] || types['validations'] ? 'has-warning ' : '')+(types['errors'] ? 'has-error' : '')}>
      {props.children}
      {props.silent ? undefined :
       _.map(_.flatten(messages), function(msg, i) {
         return <div key={"err-name-"+i} className="help-block">{msg}</div>;
       })
       }
    </div>
  );
};
