var ClaimPaymentProgram = React.createClass({
  handleChange: function(ev) {
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    this.props.actions.updateFields([[[target.name], target.value]]);
  },
  render: function() {
    var options = {};
    var value = this.props.store.get('payment_program');
    if (this.props.store.get('patient_province') === 'ON') {
      options['HCP'] = 'OHIP';
      value = value || 'HCP';
    } else {
      options['RMB'] = 'Reciprocal';
      value = value || 'RMB';
    }
    options['WCB'] = 'WSIB';
    return (
      <ClaimFormGroup label="Payment Program">
        <ClaimInputWrapper {...this.props} name="payment_program">
          <RadioSelect {...this.props} value={value} small name="payment_program" options={options} onChange={this.handleChange}/>
        </ClaimInputWrapper>
      </ClaimFormGroup>
    );
  }
});
