var Notice = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  getInitialState: function() {
    notice: undefined
  },

  componentWillMount: function() {
    this.setState({notice: this.state.globalStore.get('notice')});
  },

  componentWillUnmount: function() {
    if (this.state.notice) globalActions.clearNotice(this.state.notice);
  },

  render: function() {
    if (this.state.notice) {
      return (
        <div className="container">
          <div className="alert alert-info fade in">
            { this.state.notice }
          </div>
        </div>
      );
    } else return false;
  }
});
