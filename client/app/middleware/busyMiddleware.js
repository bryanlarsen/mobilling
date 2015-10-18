export default (store) => (next) => (action) => {
  if (action.type.endsWith('.START')) {
    store.dispatch({type: 'START_BUSY'});
  } else if (action.type.endsWith('.FINISH') || action.type.endsWith('.FAILURE')) {
    store.dispatch({type: 'END_BUSY'});
  }
  next(action);
};
