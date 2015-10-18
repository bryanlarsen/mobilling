export default React.createClass({
/*  getInitialState: function() {
    notice: undefined
  },

  componentWillMount: function() {
    this.setState({notice: this.state.globalStore.get('notice')});
  },

  componentWillUnmount: function() {
    if (this.state.notice) globalActions.clearNotice(this.state.notice);
  },
*/
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
