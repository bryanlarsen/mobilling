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
          <CommentsTab {...this.props} handleChange={this.handleChange}/>
        </fieldset>

      </div>
    );
  },

});
