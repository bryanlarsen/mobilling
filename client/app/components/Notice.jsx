module.exports = React.createClass({
  render: function() {
    if (this.props.userStore.notice) {
      return (
        <div className="container">
          <div className="alert alert-info fade in">
            { this.props.userStore.notice }
          </div>
        </div>
      );
    } else return false;
  }
});
