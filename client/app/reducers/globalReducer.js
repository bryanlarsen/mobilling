"use strict";

export const initialState = {
  busy: 0,
  claimsListQuery: {filter: 'drafts', sort: '-number'},
};

export default function globalReducer(state = initialState, action) {
  const { type, query } = action;

  switch(type) {
  case 'START_BUSY': {
    return {...state, busy: state.busy + 1};
  }

  case 'END_BUSY': {
    return {...state, busy: state.busy - 1};
  }

  case 'SET_DEFAULT_QUERY': {
    return {...state, claimsListQuery: query };
  }

  default: {
    return state;
  }
  }
}
