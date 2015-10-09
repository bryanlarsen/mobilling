var Icon = React.createClass({
  render: function() {
    return (
      <span>
        <i className={"fa fa-"+this.props.i+(this.props.xsi?" hidden-xs":"")} />
        <span className={this.props.xs ? "hidden-xs" : ""}> {this.props.children}</span>
      </span>
    );
  }
});

