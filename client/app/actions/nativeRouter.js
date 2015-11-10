module.exports = {
  pushState: function(obj, path, params) {
    return { type: 'PUSH_STATE', payload: {path, params: params || {}}};
  }
};
