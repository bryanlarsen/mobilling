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
    return (
     <div>
            {
             _.map(this.props.store.get('diagnoses').toJS(), function(diagnosis, i) {
               return (
                 <div className="form-group" key={diagnosis.uuid}>
                 {
                   i==0 ?
                   <label className="control-label col-md-2">Diagnoses</label> :
                   <div className="col-md-2"></div>
                 }
                   <div className="col-md-4">
                     <ClaimInputWrapper name="name" store={this.props.store}>
                       <div className="input-group">
                         <Typeahead name="name" engine={diagnosesEngine} value={diagnosis.name} onChange={this.diagnosisChanged.bind(this, i)} />
                         <span className="input-group-btn">
                           <button className="btn btn-danger" onClick={this.removeDiagnosis.bind(this, i)}>
                             <i className="fa fa-close"/>
                           </button>
                         </span>
                       </div>
                     </ClaimInputWrapper>
                   </div>
                 </div>
               );
             }, this)
            }
      <div className="form-group">
        <div className="col-md-4 col-md-offset-2">
          <button className="btn btn-success" onClick={this.newDiagnosis}>
            <i className="fa fa-plus"/>
          </button>
        </div>
      </div>
     </div>
    );
  }
});

