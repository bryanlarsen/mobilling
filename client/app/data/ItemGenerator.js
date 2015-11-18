import _ from 'underscore';
import {newItem, updateItem, deleteItem, updateClaim} from '../actions/claimActions';
import {detailSignature, detailsToAdd, detailsToRemove} from '../data/detailsDelta';
import detailsGenerator from '../data/detailsGenerator';

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
  this.props.dispatch(updateClaim(this.props.claim.id, {last_code_generation: JSON.stringify(this.nextSigs)}));
};

export default ItemGenerator;
