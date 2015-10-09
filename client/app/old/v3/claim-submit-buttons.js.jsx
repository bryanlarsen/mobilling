var ClaimSubmitButtons = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    var form = this;
    var statuses = {
      "saved":          ["saved", "for_agent", "ready"],
      "for_agent":      ["saved", "for_agent", "ready"],
      "ready":          ["saved", "for_agent", "ready"],
      "file_created":   ["file_created"],
      "uploaded":       ["uploaded"],
      "acknowledged":   ["acknowledged"],
      "agent_attention": ["agent_attention"],
      "doctor_attention": ["doctor_attention", "for_agent", "ready"],
      "done":           ["done"],
      "reclaimed":      ["reclaimed"],
    }[this.props.store.get('status')];

    var disabled = this.props.store.get('unsaved') || (this.props.store.get('errors') || Immutable.List()).count() !== 0;
    var notReady = disabled ||
      (this.props.store.get('validations') || Immutable.List()).count() !== 0 ||
      (this.props.store.get('warnings') || Immutable.List()).count() !== 0;

    var statusOptions = {};
    _.each(statuses, function(status) {
      if (status === 'reclaimed') return;
      if (status === 'ready' && notReady) return;
      if (status === this.props.store.get('status')) return;
      statusOptions[status] = claimStatusNames[status];
    }, this);

    return (
      <div>
        <div className="form-group">
          <RadioSelect {...this.props} name="status" options={statusOptions} onChange={this.handleChange} />
        </div>
        <div className="form-group">
          { !window.ENV.CORDOVA && <a href={"/admin/claims/"+this.props.store.get('id')+"/edit"} className="btn btn-lg btn-default">Edit as Agent</a> }
          <ButtonLink className="btn-lg" to="new_claim">
            <Icon i="plus">New Claim</Icon>
          </ButtonLink>
          <ButtonLink to="claims" className="btn-lg" query={this.state.globalStore.get('claimsListQuery').toJS()}>
            <Icon xs i="list">List</Icon>
          </ButtonLink>
          { this.props.store.get('status') === 'ready' && !window.ENV.CORDOVA &&
           <a href={"/admin/claims?status%5B%5D=2&user_id="+userStore().get('id')} className="btn btn-lg btn-default"><Icon i="gears">Generate Submission</Icon></a>
          }
        </div>
      </div>
    );
  }

});
