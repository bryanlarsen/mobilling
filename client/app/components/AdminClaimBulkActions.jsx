import _ from 'underscore';
import s from 'underscore.string';
import { RadioSelect } from '../components';
import { updateClaim } from '../actions';

export default React.createClass({
  getInitialState: function() {
    return {
      status: this.props.initialStatus
    };
  },

  handleChange: function(ev) {
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    for (const id of this.props.claimStore.claimList) {
      this.props.dispatch(updateClaim(id, {status: target.value}));
    }
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

