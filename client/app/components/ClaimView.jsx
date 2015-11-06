const _ = require('underscore');
const ClaimStaticOptional = require('./ClaimStaticOptional');
const ClaimItemList = require('./ClaimItemList');
const CommentsTab = require('./CommentsTab');
const ClaimDiagnosesList = require('./ClaimDiagnosesList');
const { claimStatusNames, claimStatusNamesCurrent } = require('../data/claimStatusNames');
const specialties = require('../data/specialties');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <ClaimStaticOptional {...this.props} name="number" label="Claim"/>
        <ClaimStaticOptional {...this.props} name="status" value={claimStatusNamesCurrent[this.props.store.status]} />
        {this.props.store.photo && <ClaimStaticOptional {...this.props} name="photo" value={
          <a href={this.props.store.photo.url}>
             <img src={this.props.store.photo.small_url} width="300"/>
          </a>
        } />}
        <ClaimStaticOptional {...this.props} name="patient_name" label="Name" />
        <ClaimStaticOptional {...this.props} name="patient_number" label="Health Number" />
        <ClaimStaticOptional {...this.props} name="patient_province" label="Province" />
        <ClaimStaticOptional {...this.props} name="patient_birthday" label="Birth Date" />
        <ClaimStaticOptional {...this.props} name="patient_sex" label="Sex" />
        <br/>

        <ClaimStaticOptional {...this.props} name="user_id" label="Doctor" value={this.props.userStore.doctors[this.props.store.user_id]} />
        <ClaimStaticOptional {...this.props} name="specialty" value={specialties[this.props.store.specialty]} />
        <ClaimStaticOptional {...this.props} name="hospital" />
        <ClaimStaticOptional {...this.props} name="manual_review_indicator" />
        <ClaimStaticOptional {...this.props} name="referring_physician" />
        <ClaimStaticOptional {...this.props} name="service_location" />
        <ClaimDiagnosesList {...this.props} />
        <ClaimStaticOptional {...this.props} name="admission_on" />
        <ClaimStaticOptional {...this.props} name="first_seen_on" />
        <ClaimStaticOptional {...this.props} name="first_seen_consult" label="Consult on first seen date" />
        <ClaimStaticOptional {...this.props} name="icu_transfer" label="ICU/CCU Transfer" />
        <ClaimStaticOptional {...this.props} name="last_seen_on" />
        <ClaimStaticOptional {...this.props} name="last_seen_discharge" label="Last Seen Date is Discharge" />
        <br />

        <ClaimStaticOptional {...this.props} name="consult_type" />
        <ClaimStaticOptional {...this.props} name="consult_time_in" />
        <ClaimStaticOptional {...this.props} name="consult_time_out" />
        <ClaimStaticOptional {...this.props} name="consult_premium_visit" label="Special Visit Premium" />
        <ClaimStaticOptional {...this.props} name="consult_premium_first" />
        <ClaimStaticOptional {...this.props} name="consult_premium_travel" label="Travel Premium" />

        <br />
        <ClaimStaticOptional {...this.props} name="submitted_fee" value={this.props.store.submitted_fee && dollars(this.props.store.submitted_fee)} />
        <ClaimStaticOptional {...this.props} name="paid_fee" value={this.props.store.paid_fee && dollars(this.props.store.paid_fee)} />

        {this.props.store.files && <ClaimStaticOptional {...this.props} name="files" value={_.map(this.props.store.files, (href, filename) => {
          return <a href={href}>{filename} </a>;
                         })} /> }
        {this.props.store.reclamation_id && <ClaimStaticOptional {...this.props} name="reclamation_id" label="Reclamation" value={<a href={this.props.claimHref(this.props.store.reclamation_id)}>{this.props.store.reclamation_id}</a>}/>}

        {this.props.store.original_id && <ClaimStaticOptional {...this.props} name="original_id" label="Original Claim" value={<a href={this.props.claimHref(this.props.store.original_id)}>{this.props.store.original_id}</a>}/>}

        <br />
        <div className="row">
          <ClaimItemList {...this.props} readonly silent={false} />
        </div>

        <CommentsTab {...this.props} />
      </div>
    );
  }
});
