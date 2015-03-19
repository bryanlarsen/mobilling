var ClaimsBulk = React.createClass({
  mixins: [
    Fynx.connect(claimStore, 'store'),
  ],

  getInitialState: function() {
    return {
      selectedIds: this.props.ids
    };
  },

  changeCheckbox: function(ev) {
    if (ev.target.checked) {
      this.setState({selectedIds: this.state.selectedIds.concat(ev.target.value)});
    } else {
      this.setState({selectedIds: _.without(this.state.selectedIds, ev.target.value)});
    }
  },

  selectAll: function(ev) {
    this.setState({selectedIds: this.props.ids});
  },

  deselectAll: function(ev) {
    this.setState({selectedIds: []});
  },

  render: function() {
    var claimHref = function(id) {
      return "/admin/claims/"+id+"/edit";
    };

    var status = this.state.store.get(this.props.ids[0]).get('status');

    var cards = _.map(this.props.ids, function(id) {
      var claimHref = function(id) {
        return "/admin/claims/"+id+"/edit";
      };

      if (this.state.store.get(id).get('status') !== status) status = "none";

      return (
        <div className="claim-card" key={id}>
          <input type="checkbox" checked={this.state.selectedIds.indexOf(id) >= 0} onChange={this.changeCheckbox} value={id}/>
          <div className="form-horizontal">
            <ClaimView {...this.props} store={this.state.store.get(id)} claimHref={claimHref} readonly />
          </div>
        </div>
      );
    }, this);

    return (
      <div>
        <div className="no-print">
          <ClaimBulkActions {...this.props} status={status} ids={this.state.selectedIds} />
          <ReactBootstrap.ButtonGroup>
            <ReactBootstrap.Button onClick={this.selectAll}>Select All</ReactBootstrap.Button>
            <ReactBootstrap.Button onClick={this.deselectAll}>Deselect All</ReactBootstrap.Button>
          </ReactBootstrap.ButtonGroup>
        </div>
        {cards}
      </div>
    );
  }
});

