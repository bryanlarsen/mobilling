const _ = require('underscore');
const RadioSelect = require('./RadioSelect');
const Icon = require('./Icon');
const { Button } = require('react-bootstrap');
const { LinkContainer } = require('react-router-bootstrap');
const { claimStatusNames } = require('../data/claimStatusNames');

module.exports = React.createClass({
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
    }[this.props.store.status];

    var disabled = this.props.store.unsaved || (this.props.store.errors || []).length !== 0;
    var notReady = disabled ||
      (this.props.store.validations || []).count() !== 0 ||
      (this.props.store.warnings || []).count() !== 0;

    var statusOptions = {};
    _.each(statuses, function(status) {
      if (status === 'reclaimed') return;
      if (status === 'ready' && notReady) return;
      if (status === this.props.store.status) return;
      statusOptions[status] = claimStatusNames[status];
    }, this);

    return (
      <div>
        <div className="form-group">
          <RadioSelect {...this.props} name="status" options={statusOptions} />
        </div>
        <div className="form-group">
          { !window.ENV.CORDOVA && <a href={"/admin/claims/"+this.props.store.id+"/edit"} className="btn btn-lg btn-default">Edit as Agent</a> }
          <LinkContainer to="/new_claim">
            <Button className="btn-lg">
              <Icon i="plus">New Claim</Icon>
            </Button>
          </LinkContainer>
          <LinkContainer to="/claims" query={this.props.globalStore.claimsListQuery}>
            <Button className="btn-lg">
              <Icon xs i="list">List</Icon>
            </Button>
          </LinkContainer>
          { this.props.store.status === 'ready' && !window.ENV.CORDOVA &&
           <a href={"/admin/claims?status%5B%5D=2&user_id="+this.props.userStore.id} className="btn btn-lg btn-default"><Icon i="gears">Generate Submission</Icon></a>
          }
        </div>
      </div>
    );
  }

});
