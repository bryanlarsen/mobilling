const _ = require('underscore');

module.exports = {
itemTotal: function(item) {
  return _.reduce(item.rows || [], function(memo, premium) {
      return memo + parseInt(premium.fee);
    }, 0);
},

claimTotal: function(store) {
  return _.reduce(store.items, function(memo, item) {
    return memo + itemTotal(item);
  }, 0);
}
};

