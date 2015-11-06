const ClaimFormGroup = require('./ClaimFormGroup');
const ClaimDateGroup = require('./ClaimDateGroup');
const ClaimYesNo = require('./ClaimYesNo');
const { updateClaim } = require('../actions');

module.exports = React.createClass({
  dateChanged: function(ev) {
    var updates = {}
    updates[ev.target.name] = ev.target.value;
    for (const field of ['admission_on', 'first_seen_on', 'last_seen_on']) {
      if (!this.props.claim[field]) {
        updates[field] = ev.target.value;
      }
    }
    this.props.dispatch(updateClaim(this.props.claim.id, updates));

    if (this.props.claim.admission_on === this.props.claim.first_seen_on &&
      !this.props.claim.first_seen_consult) {
        this.props.dispatch(updateClaim(this.props.claim.id, {first_seen_consult: true}));
    }
  },

  isFirstSeenConsultEnabled: function() {
    return this.props.claim.admission_on !== this.props.claim.first_seen_on;
  },

  isICUTransferEnabled: function() {
    return this.isFirstSeenConsultEnabled() && this.props.claim.most_responsible_physician;
  },

  render: function() {
    return (
      <div>
        <ClaimDateGroup store={this.props.claim} name="admission_on" max={this.props.claim.last_seen_on} onChange={this.dateChanged} />
        <ClaimDateGroup store={this.props.claim} name="first_seen_on" min={this.props.claim.admission_on} max={this.props.claim.last_seen_on} onChange={this.dateChanged} />
        <ClaimFormGroup label="Consult on first seen date">
          <ClaimYesNo store={this.props.claim} name="first_seen_consult" disabled={!this.isFirstSeenConsultEnabled()} onChange={this.props.onChange} />
        </ClaimFormGroup>
        { this.isICUTransferEnabled() &&
          <ClaimFormGroup label="Transfer From ICU/CCU">
            <ClaimYesNo store={this.props.claim} name="icu_transfer" onChange={this.props.onChange} />
          </ClaimFormGroup>
        }
        <ClaimDateGroup store={this.props.claim} name="last_seen_on" min={this.props.claim.admission_on} onChange={this.dateChanged} />
        <ClaimFormGroup label="Last Seen Date is Discharge">
          <ClaimYesNo store={this.props.claim} name="last_seen_discharge" onChange={this.props.onChange} />
        </ClaimFormGroup>
      </div>
    );
  }
});


