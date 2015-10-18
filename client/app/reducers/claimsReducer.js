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
    let claims = {...state.claims};
    claims[payload.id] = payload;
    let claimList = state.claimList.slice();
    if (claimList.indexOf(payload.id) === -1) {
      claimList.push(payload.id);
    }
    return {...state, claimList, claims};
  }

  case 'CLAIM.UPDATE': {
    let claims = {...state.claims};
    claims[payload.id] = { ...state.claims[payload.id], ...payload};
    return {...state, claims };
  }

  case 'ITEM.INIT': {
    let claims = {...state.claims};
    claims[payload.claim_id].items = (claims[payload.claim_id].items || []).concat(payload);
    return {...state, claims};
  }

  default: {
    return state;
  }
  }
}
