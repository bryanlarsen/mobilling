"use strict";

export const initialState = {
  role: 'doctor',
  specialty_code: 0,
};

export default function globalReducer(state = initialState, action) {
  const { type, session, updates } = action;

  switch(type) {
  case 'NEW_SESSION': {
    return session;
  }

  case 'UPDATE_USER': {
    return {...state, ...updates};
  }

  default: {
    return state;
  }
  }
}
