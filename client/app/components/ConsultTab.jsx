import _ from 'underscore';
import s from 'underscore.string';
import ClaimFormGroup from '../components/ClaimFormGroup';
import ClaimYesNo from '../components/ClaimYesNo';
import ClaimTime from '../components/ClaimTime';
import YesNo from '../components/YesNo';
import detailsGenerator from '../data/detailsGenerator';
import { dayType, timeType } from '../data/dayType';
import { updateClaim } from '../actions';

const ConsultType = React.createClass({
  render: function() {
    var consult_type = this.props.claim.consult_type;

    return (
      <div className="form-group">
        <label className="control-label col-xs-4 col-sm-4">{s.humanize(this.props.consultType)}</label>
        <div className="col-xs-4 col-sm-2 text-center radio">
          <button name="consult_type" value={this.props.consultType+"_er"} className={"btn btn-default "+(consult_type === this.props.consultType+"_er" ? 'btn-primary' : '')} onClick={this.props.onChange} >
            {detailsGenerator.consultCode(this.props.claim.specialty, this.props.consultType+'_er')}
          </button>
        </div>
        <div className="col-xs-4 col-sm-2 text-center radio">
          <button name="consult_type" value={this.props.consultType+"_non_er"} className={"btn btn-default "+(consult_type === this.props.consultType+"_non_er" ? 'btn-primary': '')} onClick={this.props.onChange}>
            {detailsGenerator.consultCode(this.props.claim.specialty, this.props.consultType+'_non_er')}
          </button>
        </div>
      </div>
    );
  }
});

export default React.createClass({
  premiumChanged: function(ev) {
    this.props.dispatch(updateClaim(this.props.claim.id, {
      consult_premium_visit: ev.target.value ? 'calculate' : null
    }));
  },

  officeHoursChanged: function(ev) {
    this.props.dispatch(updateClaim(this.props.claim.id, {
      consult_premium_visit: ev.target.value ? 'weekday_office_hours' : 'calculate'
    }));
  },

  render: function() {
    var consultTypes = {
      internal_medicine: ["general", "comprehensive", "limited"],
      cardiology:        ["general", "comprehensive", "limited"],
      family_medicine:   ["general", "special", "comprehensive", "on_call_admission"]
    }[this.props.claim.specialty];

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

    var consult_type = this.props.claim.consult_type;
    var premium_visit = this.props.claim.consult_premium_visit;
    var consultTimeRequired = {
      comprehensive_er: 75,
      comprehensive_non_er: 75,
      special_er: 50,
      special_non_er: 50
    }[consult_type];

    var day_type = this.props.claim.first_seen_on && dayType(this.props.claim.first_seen_on);
    var time_type = day_type && this.props.claim.consult_time_in && timeType(this.props.claim.first_seen_on, this.props.claim.consult_time_in);

    if (time_type) {
      var first = premium_visit ? this.props.claim.consult_premium_first : this.props.claim.consult_premium_first_count === 0;
      var premium_label = detailsGenerator.premiumVisitCode(first, consult_type, premium_visit || time_type) +
        ": " + visit_labels[premium_visit || time_type];
      var premium_disabled = false;
      if (typeof(this.props.claim.consult_premium_visit_count)==="number") {
        var n = detailsGenerator.premiumVisitLimit(consult_type, premium_visit || time_type) - this.props.claim.consult_premium_visit_count;
        if (n < 100) premium_label = premium_label + " ("+n+" remaining)";
        if (n <= 0) premium_disabled = true;
      }

    }
    if (premium_visit) {
      var travel_label = detailsGenerator.premiumTravelCode(consult_type, premium_visit);
      var travel_disabled = false;
      if (typeof(this.props.claim.consult_premium_travel_count)==="number") {
        var n = detailsGenerator.premiumTravelLimit(consult_type, premium_visit) - this.props.claim.consult_premium_travel_count;
        if (n < 100) travel_label = travel_label + " ("+n+" remaining)";
        if (n <= 0 && !this.props.claim.consult_premium_travel) travel_disabled = true;
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
           <ClaimYesNo store={this.props.claim} name="consult_premium_visit" onChange={this.premiumChanged} disabled={premium_disabled}/>
           <span>{premium_label}</span>
         </div>
       </ClaimFormGroup>

      { (premium_visit || consultTimeRequired) &&
      <div className="form-group">
        <label className="control-label col-xs-4">Time</label>
        <div className="col-xs-4">
          <ClaimTime store={this.props.claim} name="consult_time_in" onChange={this.props.onChange} max={this.props.claim.consult_time_out} disableRange={consultTimeRequired} />
        </div>
        { consultTimeRequired && <div className="col-xs-4">
          <ClaimTime store={this.props.claim} name="consult_time_out" onChange={this.props.onChange} min={this.props.claim.consult_time_in} disableRange={consultTimeRequired} />
        </div>}
      </div>
      }

      { premium_visit &&
       <ClaimFormGroup label="Travel Premium">
         <ClaimYesNo store={this.props.claim} name="consult_premium_travel" disabled={travel_disabled} onChange={this.props.onChange} />
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

