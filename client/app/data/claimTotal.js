import _ from 'underscore';

export function itemTotal(item) {
  return _.reduce(item.rows || [], function(memo, premium) {
      return memo + parseInt(premium.fee);
    }, 0);
};

export default function(store) {
  return _.reduce(store.items, function(memo, item) {
    return memo + itemTotal(item);
  }, 0);
};

