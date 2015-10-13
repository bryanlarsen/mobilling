import { ClaimItemList } from '../components';

/*
var ItemGenerator = function(claim, props) {
  this.claim = claim;
  this.next = detailsGenerator(claim);
  this.nextSigs = _.map(this.next, detailSignature);
  this.curSigs = _.map(claim.items, detailSignature);
  this.oldSigs = JSON.parse(props.store.get('last_code_generation') || '[]');
  this.toAdd = detailsToAdd(this.curSigs, this.nextSigs, this.oldSigs);
  this.toRemove = detailsToRemove(this.curSigs, this.nextSigs, this.oldSigs);
  this.props = props;
};

ItemGenerator.prototype.go = function() {
  _.each(this.toRemove, function(remove) {
    this.props.actions.removeItem({index: remove, dontSave: true});
  }, this);
  _.each(this.toAdd, function(add) {
    this.props.actions.newItem({template: this.next[add], dontSave: true});
  }, this);
  var updates = [[['last_code_generation'], JSON.stringify(this.nextSigs)]];
  updates.forceSave = true;
  this.props.actions.updateFields(updates);
};
*/

export default React.createClass({
/*  generate: function() {
    var gen = new ItemGenerator(this.props.store.toJS(), this.props);
    gen.go();
  },
*/
  render: function() {
//    var gen = new ItemGenerator(this.props.store.toJS(), this.props);

    return (
      <div>
        <ClaimItemList {...this.props}/>
      </div>
    );
/*        { (gen.toAdd.length > 0 || gen.toRemove.length > 0 ) &&
         <div className="row">
          <div className="col-sm-12">
            <button className="btn btn-info btn-block" onClick={this.generate} disabled={(gen.toAdd.length + gen.toRemove.length) === 0}>
              <i className="fa fa-cogs" /> Generate: add {gen.toAdd.length} codes, remove {gen.toRemove.length}
            </button>
          </div>
         </div>
         }
*/
  }
});

