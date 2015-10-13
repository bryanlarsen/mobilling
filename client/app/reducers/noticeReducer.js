"use strict";

export const initialState = "FOO_NOTICE";

export default function noticeReducer(state = initialState, action) {
  const { type, message } = action;

  switch(type) {
  case 'SET_NOTICE': {
    return state.merge({notice});
  }

  case 'CLEAR_NOTICE': {
    return state.merge({notice: ""});
  }

  default: {
    return state;
  }
  }
}
