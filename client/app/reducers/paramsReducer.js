"use strict";

// holds params for the pages that aren't using redux-router (aka the
// admin pages)

module.exports = {
  initialState: {
  },

  reducer: function globalReducer(state = module.exports.initialState, action) {
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
};
