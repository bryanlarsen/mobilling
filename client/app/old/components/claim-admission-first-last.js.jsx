var ClaimAdmissionFirstLast = React.createClass({
  dateChanged: function(ev) {
    var fields = [ev.target.name];
    _.each(['admission_on', 'first_seen_on', 'last_seen_on'], function(field) {
      if (!this.props.store.get(field)) {
        fields.push(field);
      }
    }, this);

    this.props.actions.updateFields(_.map(_.uniq(fields), function(field) {
      return [[field], ev.target.value];
    }, this));

    if (this.props.store.get('admission_on') === this.props.store.get('first_seen_on') &&
        !this.props.store.get('first_seen_consult')) {
      this.props.actions.updateFields([[['first_seen_consult'], true]]);
    }
  },

  isFirstSeenConsultEnabled: function() {
    return this.props.store.get('admission_on') !== this.props.store.get('first_seen_on');
  },

  isICUTransferEnabled: function() {
    return this.isFirstSeenConsultEnabled() && this.props.store.get('most_responsible_physician');
  },

  render: function() {
    return (
      <div>
        <ClaimDateGroup {...this.props} name="admission_on" max={this.props.store.get('last_seen_on')} onChange={this.dateChanged} />
        <ClaimDateGroup {...this.props} name="first_seen_on" min={this.props.store.get('admission_on')} max={this.props.store.get('last_seen_on')} onChange={this.dateChanged} />
        <ClaimFormGroup label="Consult on first seen date">
          <ClaimYesNo {...this.props} name="first_seen_consult" disabled={!this.isFirstSeenConsultEnabled()} />
        </ClaimFormGroup>
        { this.isICUTransferEnabled() &&
          <ClaimFormGroup label="Transfer From ICU/CCU">
            <ClaimYesNo {...this.props} name="icu_transfer"/>
          </ClaimFormGroup>
        }
        <ClaimDateGroup {...this.props} name="last_seen_on" min={this.props.store.get('admission_on')} onChange={this.dateChanged} />
        <ClaimFormGroup label="Last Seen Date is Discharge">
          <ClaimYesNo {...this.props} name="last_seen_discharge" />
        </ClaimFormGroup>
      </div>
    );
  }
});


