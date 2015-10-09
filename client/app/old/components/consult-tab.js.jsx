var ConsultType = React.createClass({
  fieldChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    var consult_type = this.props.store.get('consult_type');

    return (
      <div className="form-group">
        <label className="control-label col-xs-4 col-sm-4">{s.humanize(this.props.consultType)}</label>
        <div className="col-xs-4 col-sm-2 text-center radio">
          <button name="consult_type" value={this.props.consultType+"_er"} className={"btn btn-default "+(consult_type === this.props.consultType+"_er" ? 'btn-primary' : '')} onClick={this.fieldChanged} >
            {detailsGenerator.consultCode(this.props.store.get('specialty'), this.props.consultType+'_er')}
          </button>
        </div>
        <div className="col-xs-4 col-sm-2 text-center radio">
          <button name="consult_type" value={this.props.consultType+"_non_er"} className={"btn btn-default "+(consult_type === this.props.consultType+"_non_er" ? 'btn-primary': '')} onClick={this.fieldChanged}>
            {detailsGenerator.consultCode(this.props.store.get('specialty'), this.props.consultType+'_non_er')}
          </button>
        </div>
      </div>
    );
  }
});

var ConsultTab = React.createClass({
  fieldChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  premiumChanged: function(ev) {
    if (ev.target.value) {
      this.props.actions.updateFields([[['consult_premium_visit'], "calculate"]]);
    } else {
      this.props.actions.updateFields([[['consult_premium_visit'], null]]);
    }
  },

  officeHoursChanged: function(ev) {
    if (ev.target.value) {
      this.props.actions.updateFields([[['consult_premium_visit'], "weekday_office_hours"]]);
    } else {
      this.props.actions.updateFields([[['consult_premium_visit'], "calculate"]]);
    }
  },

  render: function() {
    var consultTypes = {
      internal_medicine: ["general", "comprehensive", "limited"],
      cardiology:        ["general", "comprehensive", "limited"],
      family_medicine:   ["general", "special", "comprehensive", "on_call_admission"]
    }[this.props.store.get('specialty')];

    var visit_labels = {
        weekday_day:          "Weekday (07:00-17:00)",
        weekday_office_hours: "Office hours (07:00-17:00)",
        weekday_evening:      "Weekday Evening (17:00-00:00)",
        weekday_night:        "Night (00:00-07:00)",
        weekend_day:          "Weekend (07:00-00:00)",
        weekend_night:        "Night (00:00-07:00)",
        holiday_day:          "Holiday (07:00-0:00)",
        holiday_night:        "Night (00:00-07:00)"
    };

    var consult_type = this.props.store.get('consult_type');
    var premium_visit = this.props.store.get('consult_premium_visit');
    var consultTimeRequired = {
      comprehensive_er: 75,
      comprehensive_non_er: 75,
      special_er: 50,
      special_non_er: 50
    }[consult_type];

    var day_type = this.props.store.get('first_seen_on') && dayType(this.props.store.get('first_seen_on'));
    var time_type = day_type && this.props.store.get('consult_time_in') && timeType(this.props.store.get('first_seen_on'), this.props.store.get('consult_time_in'));

    if (time_type) {
      var first = premium_visit ? this.props.store.get('consult_premium_first') : this.props.store.get('consult_premium_first_count') === 0;
      var premium_label = detailsGenerator.premiumVisitCode(first, consult_type, premium_visit || time_type) +
        ": " + visit_labels[premium_visit || time_type];
      var premium_disabled = false;
      if (typeof(this.props.store.get('consult_premium_visit_count'))==="number") {
        var n = detailsGenerator.premiumVisitLimit(consult_type, premium_visit || time_type) - this.props.store.get('consult_premium_visit_count');
        if (n < 100) premium_label = premium_label + " ("+n+" remaining)";
        if (n <= 0) premium_disabled = true;
      }

    }
    if (premium_visit) {
      var travel_label = detailsGenerator.premiumTravelCode(consult_type, premium_visit);
      var travel_disabled = false;
      if (typeof(this.props.store.get('consult_premium_travel_count'))==="number") {
        var n = detailsGenerator.premiumTravelLimit(consult_type, premium_visit) - this.props.store.get('consult_premium_travel_count');
        if (n < 100) travel_label = travel_label + " ("+n+" remaining)";
        if (n <= 0 && !this.props.store.get('consult_premium_travel')) travel_disabled = true;
      }
    }

    return (
    <div>
      <div className="form-group">
        <div className="col-xs-offset-4 col-xs-4 col-sm-offset-4 col-sm-2 text-center">
          <label className="control-label">ER</label>
        </div>
        <div className="col-xs-4 col-sm-2 text-center">
          <label className="control-label">Non-ER</label>
        </div>
      </div>

      { _.map(consultTypes, function(consultType) {
        return <ConsultType {...this.props} consultType={consultType} key={consultType} />
       }, this) }

       <ClaimFormGroup label="Special Visit Premium">
         <div>
           <ClaimYesNo {...this.props} name="consult_premium_visit" onChange={this.premiumChanged} disabled={premium_disabled}/>
           <span>{premium_label}</span>
         </div>
       </ClaimFormGroup>

      { (premium_visit || consultTimeRequired) &&
      <div className="form-group">
        <label className="control-label col-xs-4">Time</label>
        <div className="col-xs-4">
          <ClaimTime {...this.props} name="consult_time_in" onChange={this.fieldChanged} max={this.props.store.get('consult_time_out')} disableRange={consultTimeRequired} />
        </div>
        { consultTimeRequired && <div className="col-xs-4">
          <ClaimTime {...this.props} name="consult_time_out" onChange={this.fieldChanged} min={this.props.store.get('consult_time_in')} disableRange={consultTimeRequired} />
        </div>}
      </div>
      }

      { premium_visit &&
       <ClaimFormGroup label="Travel Premium">
         <ClaimYesNo {...this.props} name="consult_premium_travel" disabled={travel_disabled}/>
         <span>{travel_label}</span>
       </ClaimFormGroup>
      }

      { (premium_visit==="weekday_day" || premium_visit==="weekday_office_hours") &&
       <ClaimFormGroup label="Sacrifice of Office Hours">
         <YesNo on={premium_visit === 'weekday_office_hours'} onChange={this.officeHoursChanged} />
       </ClaimFormGroup>
      }

    </div>
    );
  }
}
);

