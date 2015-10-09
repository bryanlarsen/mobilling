var RadioSelect = React.createClass({
  render: function() {
    var value = this.props.value || this.props.store.get(this.props.name);

    return (
      <div className="btn-group">
        {
         _.map(this.props.options, function(label, code) {
           return (
             <button key={'rg'+this.props.name+code} className={"btn btn-default "+(value===code ? 'btn-primary ' : '')+(this.props.small ? '' : 'btn-lg')} name={this.props.name} value={code} onClick={this.props.onChange}>
               {label}
             </button>
           );
         }, this)
        }
      </div>
    );
  }
});

