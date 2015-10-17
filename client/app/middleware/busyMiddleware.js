export default function (store) => (next) => (action) => {
  if (action.type.endsWith('.START')) {
    store.dispatch({type: 'START_BUSY'});
  } else if (action.type.endsWith('.SUCCESS') || action.type.endsWith('.FAILURE')) {
    store.dispatch({type: 'END_BUSY'});
  }
  next(action);
};
