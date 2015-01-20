var ClaimEdit = React.createClass({
  mixins: [
    Fynx.connect(claimStore, 'store'),
  ],

  render: function() {
    return (
      <div className="form-horizontal">
        <ClaimForm {...this.props} actions={claimActionsFor(this.props.id)} store={this.state.store.get(this.props.id)}/>
        <ClaimStatusActions {...this.props} actions={claimActionsFor(this.props.id)} store={this.state.store.get(this.props.id)}/>
      </div>
    );
  }

});

