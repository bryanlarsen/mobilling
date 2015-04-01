var ClaimPaymentProgram = React.createClass({
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
          <RadioSelect {...this.props} value={value} small name="payment_program" options={options} onChange={this.props.handleChange}/>
        </ClaimInputWrapper>
      </ClaimFormGroup>
    );
  }
});
