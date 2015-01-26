var UserForm = React.createClass({
  render: function() {
    return (
      <div>Hello, {this.props.store.get('role')}</div>
    );
  }
});
