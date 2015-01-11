var ClaimEdit = React.createClass({
  mixins: [
    Fynx.connect(claimStore, 'store'),
  ],

  render: function() {
    return (
      <div className="form-horizontal">
        <ClaimForm {...this.props} actions={claimActionsFor(this.state.store.get('id'))} store={this.state.store.get(this.props.id)}/>
        <ClaimStatusActions {...this.props} actions={claimActionsFor(this.state.store.get('id'))} store={this.state.store.get(this.props.id)}/>
      </div>
    );
  }

});

var serviceLocationsEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: ['', 'HDS', 'HED', 'HIP', 'HOP', 'HRP', 'OTN']
});
serviceLocationsEngine.initialize();

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
              <Typeahead value={this.props.store.get('service_location')} name="service_location" engine={serviceLocationsEngine} onChange={this.handleChange} />
            </ClaimInputWrapper>
          </ClaimFormGroup>
        </fieldset>

        <fieldset>
          <legend>Items</legend>
          <ClaimItemList {...this.props} />
        </fieldset>

        <fieldset>
          <legend>Comments</legend>
          {
            this.props.store.get('comments').map(function(comment, i) {
             return (
               <div className="form-group" key={'comment-'+i}>
                 <div className="control-label col-md-2">
                   <label>{moment(comment.get('created_at')).fromNow()}</label>
                   <p className="text-muted">{comment.get('user_name')}</p>
                 </div>
                 <div className="col-md-10">
                   <p className="form-control-static">
                     {comment.get('body')}
                   </p>
                 </div>
               </div>
             );
           }).toJS()
          }
          <ClaimInputGroup name="comment" store={this.props.store} onChange={this.handleChange}/>
        </fieldset>

        <ClaimErrors data={this.props.store.get('validations')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('warnings')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('errors')} name="Errors"/>
      </div>
    );
  },

});
