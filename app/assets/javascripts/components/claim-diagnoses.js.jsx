var diagnosesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  prefetch: {
    url: "/v1/diagnoses.json",
  }
});
setTimeout(function() {
  diagnosesEngine.initialize();
}, 500);

var ClaimDiagnoses = React.createClass({
  diagnosisChanged: function(i, ev) {
    this.props.actions.updateFields([
      [['diagnoses', i, ev.target.name], ev.target.value]
    ]);
  },

  removeDiagnosis: function(i) {
    this.props.actions.removeDiagnosis(i);
  },

  newDiagnosis: function() {
    this.props.actions.newDiagnosis();
  },

  render: function() {
    var diagnoses = this.props.store.get('diagnoses').toJS();
    return (
     <div>
            {
             _.map(diagnoses, function(diagnosis, i) {
               return (
                 <div className="form-group" key={diagnosis.uuid}>
                 {
                   i==0 ?
                   <label className="control-label col-md-4">Diagnoses</label> :
                   <div className="col-md-4"></div>
                 }
                   <div className="col-md-4">
                     <ClaimInputWrapper name="name" store={this.props.store}>
                       <div className="input-group">
                         <span className="input-group-btn">
                           <button className="btn btn-success" onClick={this.newDiagnosis}>
                             <i className="fa fa-plus"/>
                           </button>
                         </span>
                         <Typeahead name="name" engine={diagnosesEngine} value={diagnosis.name} onChange={this.diagnosisChanged.bind(this, i)} />
                         {diagnoses.length > 1 && <span className="input-group-btn">
                           <button className="btn btn-danger" onClick={this.removeDiagnosis.bind(this, i)}>
                             <i className="fa fa-close"/>
                           </button>
                         </span>}
                       </div>
                     </ClaimInputWrapper>
                   </div>
                 </div>
               );
             }, this)
            }
     </div>
    );
  }
});

var ClaimDiagnosesList = React.createClass({
  render: function() {
    return (
      <div>
      {_.map(this.props.store.get('diagnoses').toJS(), function(diagnosis, i) {
        return diagnosis.name && <ClaimStaticOptional key={i} {...this.props} label="Diagnosis" value={diagnosis.name} />;
      })}
      </div>
    );
  }
});
