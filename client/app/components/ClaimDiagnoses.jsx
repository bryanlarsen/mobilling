import _ from 'underscore';
import Bloodhound from 'typeahead.js/dist/bloodhound.js';

import { ClaimInputWrapper, Typeahead } from '../components';
import { updateClaim } from '../actions';
import uuid from '../data/uuid';

var diagnosesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  prefetch: {
    url: window.ENV.API_ROOT+'v1/diagnoses.json',
  }
});
setTimeout(function() {
  diagnosesEngine.initialize();
}, 500);

export default React.createClass({
  diagnosisChanged: function(i, ev) {
    let diagnoses = this.props.claim.diagnoses.slice();
    diagnoses[i].name = ev.target.value;
    this.props.dispatch(updateClaim(this.props.claim, {diagnoses}));
  },

  removeDiagnosis: function(i) {
    let diagnoses = this.props.claim.diagnoses.slice();
    diagnoses.splice(i, 1);
    this.props.dispatch(updateClaim(this.props.claim, {diagnoses}));
  },

  newDiagnosis: function() {
    let diagnoses = this.props.claim.diagnoses.slice();
    diagnoses.push({name: ""});
    this.props.dispatch(updateClaim(this.props.claim, {diagnoses}));
  },

  render: function() {
    var diagnoses = this.props.claim.diagnoses;
    if (diagnoses.length === 0) diagnoses.push({name: ""});
    return (
     <div>
            {
              _.map(diagnoses, function(diagnosis, i) {
                if (!diagnosis.uuid) diagnosis.uuid = uuid();
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
