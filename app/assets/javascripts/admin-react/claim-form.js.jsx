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

          <ClaimPatient {...this.props} handleChange={this.handleChange}/>
        </fieldset>

        <fieldset>
          <legend>Claim</legend>
          <ClaimTab {...this.props} handleChange={this.handleChange} />
        </fieldset>

        { this.props.store.get('template') === 'full' &&
         <fieldset>
          <legend>Consult</legend>
          <ConsultTab {...this.props} handleChange={this.handleChange}/>
         </fieldset>
        }

        <fieldset>
          <legend>Items</legend>
          <ItemsTab {...this.props} handleChange={this.handleChange}/>
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
