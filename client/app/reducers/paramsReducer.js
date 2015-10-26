"use strict";

// holds params for the pages that aren't using redux-router (aka the
// admin pages)

export const initialState = {
};

export default function globalReducer(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
  case 'PARAMS.INIT': {
    return { ...payload };
  }

  case 'PARAMS.UPDATE': {
    return { ...state, ...payload };
  }

  default: {
    return state;
  }
  }
}
