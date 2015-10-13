"use strict";

import _ from 'underscore';

export const initialState = {
  claimList: [],
  claimListLoadedOn: new Date(0),
  claims: {},
};

export default function claimsReducer(state = initialState, action) {
  const { type, claims, id, claim, updates } = action;

  switch(type) {
  case 'CLAIM_LIST': {
    return {
      ...state,
      claimList: [for (claim of claims) claim.id],
      claims: _.object([for (claim of claims) [claim.id, claim]]),
      claimListLoadedOn: new Date(),
    };
  }

  case 'CLAIM_LOAD': {
    let newClaims = {};
    newClaims[id] = claim;
    return {
      ...state,
      claims: { ...state.claims, ...newClaims },
    };
  }

  case 'CLAIM_UPDATE': {
    let newClaims = {};
    newClaims[id] = { ...state.claims[id], ...updates};
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
