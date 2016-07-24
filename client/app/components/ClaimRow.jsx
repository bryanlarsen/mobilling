import FeeGenerator from '../data/FeeGenerator';
import serviceCodesEngine from '../data/serviceCodesEngine';
import ClaimInputWrapper from '../components/ClaimInputWrapper';
import ClaimInput from '../components/ClaimInput';
import Typeahead from '../components/Typeahead';
import {deleteRow, deleteItem} from '../actions/claimActions';

export default React.createClass({
  unitsChanged: function(ev) {
    this.props.onChange({target: {name: ev.target.name, value: parseInt(ev.target.value)}});
  },

  feeChanged: function(ev) {
    this.props.onChange({target: {name: ev.target.name, value: Math.round(Number(ev.target.value)*100)}});
  },

  codeChanged: function(ev) {
    var value = ev.target.value;
    var feeGenerator = FeeGenerator.feeGenerator;
    if (!feeGenerator) return false;

    messages = feeGenerator.validateCode(value);
    var updates = [
      [['validations'], messages ? Immutable.fromJS({'code': messages}) : Immutable.fromJS({})],
      [['code'], value],
      [['override_fee'], false],
      [['override_units'], false]
    ];
    if (!messages) {
      updates.push([['fee'], "*recalculate"]);
    }
    this.props.actions.updateFields(updates);
  },

  removePremium: function(ev) {
    if (this.props.item.rows.length <= 1) {
      this.props.dispatch(deleteItem(this.props.claim.id, this.props.item.id));
    } else {
      this.props.dispatch(deleteRow(this.props.claim.id, this.props.item.id, this.props.store.id));
    }
  },

  render: function() {
    return (
      <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Code</div>
        <div className="col-sm-8 col-md-4">
          <ClaimInputWrapper name='code' {...this.props} >
            <div className="input-group">
              <Typeahead name='code' engine={serviceCodesEngine} onChange={this.props.onChange} value={this.props.store.code}/>
              <span className="input-group-btn">
                <button type="button" className="btn btn-danger" onClick={this.removePremium}>
                  <i className="fa fa-close"/>
                </button>
              </span>
            </div>
          </ClaimInputWrapper>
        </div>
        {this.props.full && <div className="col-md-2 col-md-offset-0 col-xs-4 col-xs-offset-4">
          <div className="input-group">
            <span className="input-group-addon">
              <input type="checkbox" checked={this.props.store.override_units} name="override_units" onChange={this.props.onChange} />
            </span>
            <ClaimInput name='units' store={this.props.store} onChange={this.unitsChanged} disabled={!this.props.store.override_units}/>
          </div>
        </div>}
        {this.props.full && <div className="col-md-2 col-xs-4">
          <div className="input-group">
            <span className="input-group-addon">
              <input type="checkbox" checked={this.props.store.override_fee} name="override_fee" onChange={this.props.onChange} />
            </span>
            <ClaimInput name='fee' value={(this.props.store.fee/100).toFixed(2)} store={this.props.store} onChange={this.feeChanged} disabled={!this.props.store.override_fee}/>
          </div>
        </div>}
      </div>
    );
  }
});

