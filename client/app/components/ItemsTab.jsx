const _ = require('underscore');
const ClaimItemList = require('./ClaimItemList');
const detailsGenerator = require('../data/detailsGenerator');
const {detailSignature, detailsToAdd, detailsToRemove} = require('../data/detailsDelta');
const {newItem, updateItem, deleteItem, changeClaim} = require('../actions');

var ItemGenerator = function(claim, props) {
  this.claim = claim;
  this.next = detailsGenerator(claim);
  this.nextSigs = _.map(this.next, detailSignature);
  this.curSigs = _.map(claim.items, detailSignature);
  this.oldSigs = JSON.parse(props.claim.last_code_generation || '[]');
  this.toAdd = detailsToAdd(this.curSigs, this.nextSigs, this.oldSigs);
  this.toRemove = detailsToRemove(this.curSigs, this.nextSigs, this.oldSigs);
  this.props = props;
};

ItemGenerator.prototype.go = function() {
  _.each(this.toRemove, function(remove) {
    this.props.dispatch(deleteItem(this.props.claim.id, this.props.claim.items[remove].id));
  }, this);
  _.each(this.toAdd, function(add) {
    let item = this.next[add];
    this.props.dispatch(newItem(this.props.claim.id, item));
  }, this);
  this.props.dispatch(changeClaim(this.props.claim, {last_code_generation: JSON.stringify(this.nextSigs)}));
};

module.exports = React.createClass({
  generate: function() {
    var gen = new ItemGenerator(this.props.claim, this.props);
    gen.go();
  },

  render: function() {
    var gen = new ItemGenerator(this.props.claim, this.props);

    return (
      <div>
      { (gen.toAdd.length > 0 || gen.toRemove.length > 0 ) &&
        <div className="row">
          <div className="col-sm-12">
            <button className="btn btn-info btn-block" onClick={this.generate} disabled={(gen.toAdd.length + gen.toRemove.length) === 0}>
              <i className="fa fa-cogs" /> Generate: add {gen.toAdd.length} codes, remove {gen.toRemove.length}
            </button>
          </div>
        </div>
      }

        <ClaimItemList {...this.props}/>
      </div>
    );
  }
});

