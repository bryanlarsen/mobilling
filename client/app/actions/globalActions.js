export function  startBusy() {
  return { type: 'START_BUSY' };
}

export function  endBusy() {
  return { type: 'END_BUSY' };
}

export function  setDefaultQuery(query) {
  return { type: 'SET_DEFAULT_QUERY', query };
}
