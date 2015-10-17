"use strict";

import _ from 'underscore';

export const initialState = {
  claimList: [],
  claimListLoadedOn: new Date(0),
  claims: {},
};

export default function claimsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
  case 'CLAIM_LIST.INIT': {
    return {
      ...state,
      claimList: [for (claim of payload) claim.id],
      claims: _.object([for (claim of payload) [claim.id, claim]]),
      claimListLoadedOn: new Date(),
    };
  }

  case 'CLAIM.INIT': {
    let newClaims = {};
    newClaims[payload.id] = payload;
    return {
      ...state,
      claims: { ...state.claims, ...newClaims },
    };
  }

  case 'CLAIM.UPDATE': {
    let newClaims = {};
    newClaims[payload.id] = { ...state.claims[payload.id], ...payload};
    return {
        ...state,
      claims: { ...state.claims, ...newClaims }
    };
  }

  default: {
    return state;
  }
  }
}
