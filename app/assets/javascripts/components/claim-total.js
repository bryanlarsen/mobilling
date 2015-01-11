var dollars = function(i) {
  return (i/100).toFixed(2);
};

var claimTotal = function(store) {
  return _.reduce(store.get('daily_details').toJS(), function(memo, item) {
    return memo + itemTotal(item);
  }, 0);
};

var itemTotal = function(item) {
  return parseInt(item.fee) +
    _.reduce(item.premiums || [], function(memo, premium) {
      return memo + parseInt(premium.fee);
    }, 0);
};
