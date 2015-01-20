var ClaimTab = React.createClass({
  admissionChanged: function(ev) {
    if (!this.props.store.get('first_seen_on')) {
      this.props.actions.updateFields([
        [['admission_on'], ev.target.value],
        [['first_seen_on'], ev.target.value]
      ]);
    } else {
      this.props.actions.updateFields([
        [['admission_on'], ev.target.value],
      ]);
    }
    this.props.actions.recalculateConsult();
  },

  render: function() {
    return (
      <div>
        <ClaimFormGroup label="Specialty">
          <ClaimInputWrapper {...this.props} name="specialty">
            <Select {...this.props} name="specialty" options={specialties} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimHospital {...this.props} />
        <ClaimFormGroup label="Manual Review Required">
          <ClaimYesNo {...this.props} name="manual_review_indicator" />
        </ClaimFormGroup>

        {['family_medicine', 'internal_medicine', 'cardiology'].indexOf(this.props.store.get('specialty')) !== -1 && (
           <div>
             <ClaimInputGroup name="referring_physician" type='text' store={this.props.store} onChange={this.props.handleChange} />
             <ClaimDiagnoses {...this.props} />
             <ClaimFormGroup label="Most Responsible Physician">
               <ClaimYesNo {...this.props} name="most_responsible_physician" />
             </ClaimFormGroup>
             <ClaimAdmissionFirstLast {...this.props}/>
           </div>
         )
        }
      </div>
    );
  }
});

