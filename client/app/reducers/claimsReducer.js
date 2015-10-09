"use strict";

import Immutable from 'immutable';

export const initialState = Immutable.fromJS({
  claims: [],
});

export default function claimsReducer(state = initialState, action) {
  const { type } = action;

  switch(type) {
  case 'FOO': {
    return state.merge({});
  }

  default: {
    return state;
  }
  }
}
