var ClaimBulkActions = React.createClass({
  getInitialState: function() {
    return {
      status: this.props.initialStatus
    };
  },

  handleChange: function(ev) {
    _.each(this.props.ids, function(id) {
      claimActionsFor(id).updateFields([[[ev.target.name], ev.target.value]]);
    });
    this.setState({status: ev.target.value});
  },

  render: function() {
    var statuses = ["saved", "for_agent", "ready", "file_created", "agent_attention", "doctor_attention", "done"];

    var statusOptions = {};
    _.each(statuses, function(status) {
      statusOptions[status] = s.humanize(status);
    }, this);


    return (

      <fieldset>
        <div className="form-group">
          <RadioSelect {...this.props} name="status" options={statusOptions} value={this.props.status} onChange={this.handleChange} />
        </div>
      </fieldset>
    );
  }
});
