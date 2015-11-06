"use strict";

module.exports = {
 initialState: {
  role: 'doctor',
  specialty_code: 0,
 },

 reducer: function globalReducer(state = module.exports.initialState, action) {
  const { type, payload } = action;

  switch(type) {
  case 'USER.INIT': {
    return payload;
  }

  case 'USER.UPDATE': {
    return {...state, ...payload};
  }

  case 'SET_NOTICE': {
    return {...state, notice: payload};
  }

  default: {
    return state;
  }
  }
 }
};
