var ClaimView = React.createClass({
  render: function() {
    return (
      <div>
        <ClaimStaticOptional {...this.props} name="number" label="Claim"/>
        <ClaimStaticOptional {...this.props} name="status" value={claimStatusNamesCurrent[this.props.store.get('status')]} />
        <ClaimStaticOptional {...this.props} name="photo" value={
          <a href={this.props.store.getIn(['photo', 'url'])}>
             <img src={this.props.store.getIn(['photo', 'small_url'])} width="300"/>
          </a>
        } />
        <ClaimStaticOptional {...this.props} name="patient_name" label="Name" />
        <ClaimStaticOptional {...this.props} name="patient_number" label="Health Number" />
        <ClaimStaticOptional {...this.props} name="patient_province" label="Province" />
        <ClaimStaticOptional {...this.props} name="patient_birthday" label="Birth Date" />
        <ClaimStaticOptional {...this.props} name="patient_sex" label="Sex" />
        <br/>

        <ClaimStaticOptional {...this.props} name="user_id" label="Doctor" value={userStore().get('doctors').get(this.props.store.get('user_id'))} />
        <ClaimStaticOptional {...this.props} name="specialty" value={specialties[this.props.store.get('specialty')]} />
        <ClaimStaticOptional {...this.props} name="hospital" />
        <ClaimStaticOptional {...this.props} name="manual_review_indicator" />
        <ClaimStaticOptional {...this.props} name="referring_physician" />
        <ClaimStaticOptional {...this.props} name="service_location" />
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
        <ClaimStaticOptional {...this.props} name="submitted_fee" value={this.props.store.get('submitted_fee') && dollars(this.props.store.get('submitted_fee'))} />
        <ClaimStaticOptional {...this.props} name="paid_fee" value={this.props.store.get('paid_fee') && dollars(this.props.store.get('paid_fee'))} />

        {this.props.store.get('files') && <ClaimStaticOptional {...this.props} name="files" value={this.props.store.get('files').map(function(href, filename) {
          return <a href={href}>{filename} </a>;
                                                         }).toJS()} /> }

        <br />
        <div className="row">
          <ClaimItemList {...this.props} readonly silent={false} />
        </div>

        <CommentsTab {...this.props} />
      </div>
    );
  }
});
