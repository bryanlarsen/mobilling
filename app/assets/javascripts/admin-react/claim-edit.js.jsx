var ClaimEdit = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.id
    };
  },

  mixins: [
    Fynx.connect(claimStore, 'store'),
  ],

  loadClaim: function(id) {
    claimActions.load(id);
    this.setState({id: id});
  },

  render: function() {
    return (
      <div className="form-horizontal">
        <ClaimForm {...this.props} actions={claimActionsFor(this.state.id)} store={this.state.store.get(this.state.id)} loadClaim={this.loadClaim} />
        <ClaimStatusActions {...this.props} actions={claimActionsFor(this.state.id)} store={this.state.store.get(this.state.id)} loadClaim={this.loadClaim} />
      </div>
    );
  }

});

