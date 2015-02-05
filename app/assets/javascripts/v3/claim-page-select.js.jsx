var ClaimPageSelect = React.createClass({
  mixins: [ ReactRouter.State, ReactRouter.Navigation,
    Fynx.connect(claimStore, 'store'),
  ],

  checkClaim: function() {
    if (!this.state.store.get(this.props.params.id)) {
      claimLoad(this.props.params.id);
    }
  },

  componentDidMount: function(ev) {
    this.checkClaim();
  },

  componentDidUpdate: function(ev) {
    this.checkClaim();
  },


  render: function() {
    var claimHref = function(id) {
      return "/#/claim/"+id+"/patient";
    };

    var store = this.state.store.get(this.props.params.id) || Immutable.fromJS({daily_details: [], diagnoses: []});
    var actions = claimActionsFor(this.props.params.id);

    if (['saved', 'doctor_attention'].indexOf(this.state.store.getIn([this.props.params.id, 'status'])) !== -1) {
      return <ClaimPage {...this.props} store={store} actions={actions} claimHref={claimHref} />;
    } else {
      return <ClaimViewPage {...this.props} store={store} actions={actions} claimHref={claimHref} />;
    }
  }
});
