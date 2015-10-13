const globalActions = {
  startBusy() {
    return { type: 'START_BUSY' };
  },

  endBusy() {
    return { type: 'END_BUSY' };
  },

  setDefaultQuery(query) {
    return { type: 'SET_DEFAULT_QUERY', query };
  },
}

export default globalActions;
