var serviceLocations = ['', 'HDS', 'HED', 'HIP', 'HOP', 'HRP', 'OTN'];

var ClaimForm = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  checkboxChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.checked]]);
  },

  render: function() {
    return (
      <div>
        <fieldset>
          <ClaimFormGroup label="Number">
            <p className="form-control-static">{this.props.store.get('number')}</p>
          </ClaimFormGroup>

          <ClaimFormGroup label="Status">
            <p className="form-control-static">{this.props.store.get('status')}</p>
          </ClaimFormGroup>
        </fieldset>
        <fieldset>
          <legend>Patient</legend>

          <ClaimPatient {...this.props}/>
        </fieldset>
        <fieldset>
          <legend>Claim</legend>
          <ClaimHospital {...this.props} />
          <ClaimInputGroup name="referring_physician" store={this.props.store} onChange={this.handleChange} />
          <ClaimDiagnoses store={this.props.store} actions={this.props.actions} />
          <ClaimFormGroup label="Manual Review" htmlFor="manual_review_indicator">
            <ClaimYesNo {...this.props} name="manual_review_indicator" />
          </ClaimFormGroup>
          <ClaimFormGroup label="Service Location">
            <ClaimInputWrapper store={this.props.store} name="service_location">
              <Select {...this.props} name="service_location" options={serviceLocations} onChange={this.handleChange}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
        </fieldset>

        <fieldset>
          <legend>Items</legend>
          <ClaimItemList {...this.props} />
        </fieldset>

        <fieldset>
          <legend>Comments</legend>
          { (this.props.store.get('comments') || Immutable.fromJS([])).map(function(comment, i) {
            return <ClaimComment {...this.props} comment={comment} key={'comment'+i} />;
          }, this).toJS() }
          <ClaimInputGroup name="comment" store={this.props.store} onChange={this.handleChange}/>
        </fieldset>

        <ClaimErrors data={this.props.store.get('validations')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('warnings')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('errors')} name="Errors"/>
      </div>
    );
  },

});
