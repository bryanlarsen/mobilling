import _ from 'underscore';
import { ClaimStaticOptional } from '../components';
export default React.createClass({
  render: function() {
    return (
      <div>
      {_.map(this.props.claim.diagnoses, function(diagnosis, i) {
        return diagnosis.name && <ClaimStaticOptional key={i} label="Diagnosis" value={diagnosis.name} />;
      })}
      </div>
    );
  }
});
