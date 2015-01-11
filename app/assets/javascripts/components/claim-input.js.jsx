var ClaimInputWrapper = React.createClass({
  render: function() {
    var messages = Immutable.fromJS([]);
    var types = {};

    ['warnings', 'errors', 'validations'].forEach(function(type) {
      var m = this.props.store.getIn([type, this.props.name]);
      if (m) {
        messages = messages.concat(m);
        types[type] = true;
      }
    }, this);

    return (
      <div className={""+(types['warnings'] || types['validations'] ? 'has-warning ' : '')+(types['errors'] ? 'has-error' : '')}>
        {this.props.children}
        { this.props.silent ? undefined :
         _.map(_.flatten(messages.toJS()), function(msg, i) {
           return <div key={"err-name-"+i} className="help-block">{msg}</div>;
         })
        }
      </div>
    );
  }
});

var ClaimInput = React.createClass({
  render: function() {
    return (
      <ClaimInputWrapper {...this.props}>
        <ClaimInputInner {...this.props}/>
      </ClaimInputWrapper>
    );
  }
});

var ClaimInputInner = React.createClass({
  render: function() {
    return (
      <BlurInput type={this.props.type} className={"form-control "+(this.props.className || '')} name={this.props.name} value={this.props.value || (this.props.store && this.props.store.get(this.props.name))} onChange={this.props.onChange} />
    );
  }
});

