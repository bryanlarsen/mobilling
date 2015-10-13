export default React.createClass({
  _onClick: function(val) {
    return (ev) => {
      this.props.onChange({target: {name: this.props.name, value: val}});
    };
  },

  render: function() {
    return (
      <div className="btn-group">
        <button className={"btn btn-default"} onClick={this._onClick(!this.props.on)} disabled={this.props.disabled}>
          <i className={"fa " + (this.props.on ? 'fa-check-square-o' : 'fa-square-o')} />
        </button>
        <button className={"btn btn-default "+(this.props.on ? 'btn-primary' : '')} onClick={this._onClick(true)} disabled={this.props.disabled}>
          Yes
        </button>
        <button className={"btn btn-default "+(this.props.on ? '': 'btn-primary')} onClick={this._onClick(false)} disabled={this.props.disabled}>
          No
        </button>
      </div>
    );
  }
});

