const FeeGenerator = require('../data/FeeGenerator');
const dollars = require('../data/dollars');

module.exports = React.createClass({
  render: function() {
    var needs_diagnosis = true;
    var feeGenerator = FeeGenerator.feeGenerator;
    if (feeGenerator) {
      needs_diagnosis = this.props.store.rows.length>0 && feeGenerator.needsDiagnosis(this.props.store.rows[0].code);
    }
    return (
      <div className="well col-xs-12" onClick={this.props.onClick}>
        <div key='code-message'>{this.props.store.message}</div>
        { this.props.store.rows.map(function(row, i) {
          return (
            <div key={'row-'+i}>
              {!this.props.silent && <span>{row.units}x </span>}
              <span>{row.code}</span>
              <span className="pull-right">{dollars(row.fee)}</span>
              {row.paid && <span className="pull-right">{dollars(row.paid)+'/'}</span>}
              <div>{row.message}</div>
            </div>
          );
        }, this)
        }
        <div>
          <span>{this.props.store.time_in}-{this.props.store.time_out}</span>
          {needs_diagnosis && <span> {this.props.store.diagnosis}</span>}
        </div>
      </div>
    );
  }
});
