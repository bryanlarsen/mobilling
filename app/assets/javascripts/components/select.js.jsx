var Select = React.createClass({
  render: function() {
    var value = this.props.value || this.props.store.get(this.props.name);
    return (
      <select className="form-control" value={value} name={this.props.name} onChange={this.props.onChange}>
        { _.map(this.props.options, function(label, code) {
            return (
              <option value={code} key={'option'+name+code} >{label}</option>
            );
          }, this)
         }
      </select>
    );
  }
});

