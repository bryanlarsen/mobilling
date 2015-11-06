const _ = require('underscore');

module.exports = {
  detailSignature(detail) {
    return [
      detail.day,
      detail.time_in || null,
      detail.time_out || null,
      _.map(detail.rows || [], function(premium) {
        return (premium.code || "").slice(0,5).toUpperCase();
      }).join(",")
    ].join(";");
  },


  // returns the index in nextSig for every sig that we need to add:
  // the generator thinks we need it and we don't have it
  detailsToAdd(currentSigs, nextSigs, oldSigs) {
    return _.difference(nextSigs, currentSigs).map(function(nextSig) {
      return nextSigs.indexOf(nextSig);
    });
  },

  // returns the index in currentSig for every sig that we need to remove:
  // it's exists in old but not in new and still exists in current.
  // returns in reverse order so that removal is stable
  detailsToRemove(currentSigs, nextSigs, oldSigs) {
    return _.intersection(_.difference(oldSigs, nextSigs), currentSigs).map(function(sig) {
      return currentSigs.indexOf(sig);
    }).sort().reverse();
  },

};

