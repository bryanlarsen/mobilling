"use strict";

export const initialState = {
  role: 'doctor',
  specialty_code: 0,
};

export default function globalReducer(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
  case 'USER.INIT': {
    return payload;
  }

  case 'USER.UPDATE': {
    return {...state, ...payload};
  }

  default: {
    return state;
  }
  }
}
