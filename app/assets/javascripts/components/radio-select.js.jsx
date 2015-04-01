var RadioSelect = React.createClass({
  render: function() {
    var value = this.props.value || this.props.store.get(this.props.name);

    return (
      <div className="btn-group">
        {
         _.map(this.props.options, function(label, code) {
           return (
             <label key={'rg'+this.props.name+code} className={"btn btn-default "+(value===code ? 'btn-primary ' : '')+(this.props.small ? '' : 'btn-lg')}>
               <input type="radio" id={this.props.name+code} value={code} name={this.props.name} className="hide" onChange={this.props.onChange} />
             {label}
             </label>
           );
         }, this)
        }
      </div>
    );
  }
});

