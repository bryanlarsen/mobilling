var ConsultType = React.createClass({
  fieldChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
    this.props.actions.recalculateConsult();
  },

  render: function() {
    var consult_type = this.props.store.get('consult_type');

    return (
      <div className="form-group">
        <label className="control-label col-xs-2">{_.string.humanize(this.props.consultType)}</label>
        <div className="col-xs-4 text-center radio">
          <label className="">
            <input name="consult_type" type="radio" id={"radio-"+this.props.consultType+"-er"} value={this.props.consultType+"_er"} checked={consult_type === this.props.consultType+"_er"} onChange={this.fieldChanged} />
            {detailsGenerator.consultCode(this.props.store.get('specialty'), this.props.consultType+'_er')}
          </label>
        </div>
        <div className="col-xs-4 text-center radio">
          <label>
            <input name="consult_type" type="radio" id={"radio-"+this.props.consultType+"-non_er"} value={this.props.consultType+"_non_er"} checked={consult_type === this.props.consultType+"_non_er"} onChange={this.fieldChanged} />
            {detailsGenerator.consultCode(this.props.store.get('specialty'), this.props.consultType+'_non_er')}
          </label>
        </div>
      </div>
    );
  }
});

var ConsultTab = React.createClass({
  fieldChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
    this.props.actions.recalculateConsult();
  },

  premiumChanged: function(ev) {
    if (ev.target.value) {
      this.props.actions.updateFields([[['consult_premium_visit'], "calculate"]]);
    } else {
      this.props.actions.updateFields([[['consult_premium_visit'], null]]);
    }
    this.props.actions.recalculateConsult();
  },

  officeHoursChanged: function(ev) {
    if (ev.target.value) {
      this.props.actions.updateFields([[['consult_premium_visit'], "weekday_office_hours"]]);
    } else {
      this.props.actions.updateFields([[['consult_premium_visit'], "calculate"]]);
    }
    this.props.actions.recalculateConsult();
  },

  render: function() {
    var consultTypes = {
      internal_medicine: ["general", "comprehensive", "limited"],
      cardiology:        ["general", "comprehensive", "limited"],
      family_medicine:   ["general", "special", "comprehensive", "on_call_admission"]
    }[this.props.store.get('specialty')];

    var consult_type = this.props.store.get('consult_type');
    var premium_visit = this.props.store.get('consult_premium_visit');
    var consultTimeVisible = ["comprehensive_er", "comprehensive_non_er", "special_er", "special_non_er"].indexOf(consult_type) !== -1;

    var day_type = this.props.store.get('first_seen_on') && dayType(this.props.store.get('first_seen_on'));
    var time_type = day_type && this.props.store.get('consult_time_in') && timeType(this.props.store.get('first_seen_on'), this.props.store.get('consult_time_in'));

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

    return (
    <div>
      <div className="form-group">
        <div className="col-xs-offset-2 col-xs-4 text-center">
          <label className="control-label">ER</label>
        </div>
        <div className="col-xs-4 text-center">
          <label className="control-label">Non-ER</label>
        </div>
      </div>

      { _.map(consultTypes, function(consultType) {
        return <ConsultType {...this.props} consultType={consultType} key={consultType} />
       }, this) }

      <div className="form-group">
        <label className="control-label col-xs-2">Time</label>
        <div className="col-xs-4">
          <ClaimTime {...this.props} name="consult_time_in" onChange={this.fieldChanged} max={this.props.store.get('consult_time_out')} />
        </div>
        { consultTimeVisible && <div className="col-xs-4">
          <ClaimTime {...this.props} name="consult_time_out" onChange={this.fieldChanged} min={this.props.store.get('consult_time_in')} />
        </div>}
      </div>

       <ClaimFormGroup label="Special Visit Premium">
         { time_type ?
          <div>
            <ClaimYesNo {...this.props} name="consult_premium_visit" onChange={this.premiumChanged} />
            <span>{detailsGenerator.premiumVisitCode(this.props.store.get('consult_premium_first'), consult_type, premium_visit || time_type)}: {visit_labels[premium_visit || time_type]}</span>
          </div>
                                                                                               : <div>Please set Claim Date and time</div>
         }
       </ClaimFormGroup>

      { premium_visit &&
       <ClaimFormGroup label="Travel Premium">
         <ClaimYesNo {...this.props} name="consult_premium_travel" />
         <span>{detailsGenerator.premiumTravelCode(consult_type, premium_visit)}</span>
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

