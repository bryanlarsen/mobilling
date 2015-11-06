const _ = require('underscore');
const FeeGenerator = require('../data/FeeGenerator');
const dollars = require('../data/dollars');
const { claimTotal, itemTotal } = require('../data/claimTotal');
const ClaimDate = require('./ClaimDate');
const ClaimTime = require('./ClaimTime');
const Typeahead = require('./Typeahead');
const ClaimRow = require('./ClaimRow');
const diagnosesEngine = require('../data/diagnosesEngine');
const {rowChangeHandler, createRow} = require('../actions');

module.exports = React.createClass({
  newPremium: function(ev) {
    this.props.dispatch(createRow(this.props.claim.id, this.props.item.id, {}));
  },

  render: function() {
    var rows = this.props.item.rows ? this.props.item.rows.map(function(row, i) {
      return React.createElement(ClaimRow, {
        store: this.props.item.rows[i],
        row: this.props.item.rows[i],
        item: this.props.item,
        claim: this.props.claim,
        key: row.id,
        silent: this.props.silent,
        full: this.props.full,
        dispatch: this.props.dispatch,
        onChange: rowChangeHandler.bind(null, this.props.dispatch, this.props.claim.id, this.props.item.id, row.id)
      });
    }, this) : null;

    var feeGenerator = FeeGenerator.feeGenerator;
    var needs_diagnosis = true;
    if (feeGenerator) {
      needs_diagnosis = feeGenerator.needsDiagnosis(this.props.item.rows.length && this.props.item.rows[0].code);
    }

    return (
    <div>
      <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Date</div>
        <div className="col-sm-8 col-md-4">
          <ClaimDate {...this.props} name='day' />
        </div>
      </div>


      { rows }

      <div className="form-group row">
        <div className="col-sm-8 col-md-4 col-sm-offset-4">
          <button type="button" className="btn btn-block btn-success" onClick={this.newPremium}>
            <i className="fa fa-asterisk"/> Add a premium
          </button>
        </div>
      </div>

      {needs_diagnosis && <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Diagnosis</div>
        <div className="col-sm-8 col-md-4">
          <Typeahead name="diagnosis" engine={diagnosesEngine} value={this.props.item.diagnosis} onChange={this.props.onChange}/>
        </div>
      </div>}

      <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Time</div>
        <div className="control-label col-xs-4 visible-xs">In</div>
        <div className="col-xs-8 col-sm-4 col-md-2">
          <ClaimTime {...this.props} name='time_in' max={this.props.item.time_out}/>
        </div>
        <div className="control-label col-xs-4 visible-xs">Out</div>
        <div className="col-xs-8 col-sm-4 col-md-2">
          <ClaimTime {...this.props} name='time_out'  min={this.props.item.time_in}/>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-xs-4 col-sm-4 control-label">{dollars(itemTotal(this.props.item))}</div>
        <div className="col-xs-8 col-sm-8 col-md-4">
          <button className="btn btn-info btn-block" onClick={this.props.done}>
            <i className="fa fa-check" /> OK
          </button>
        </div>
      </div>

    </div>
    );

  }
});
