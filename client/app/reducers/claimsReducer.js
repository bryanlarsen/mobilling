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
      claimList: payload.map((claim) => claim.id),
      claims: _.object(payload.map((claim) => [claim.id, claim])),
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

  case 'CLAIM.DELETE': {
    let claims = {...state.claims};
    delete claims[payload.id];
    let claimList = state.claimList.slice();
    const index = claimList.findIndex((i) => i === payload.id);
    claimList.splice(index, 1);
    return {...state, claims, claimList };
  }

  case 'ITEM.INIT': {
    let claims = {...state.claims};
    claims[payload.claim_id].items = (claims[payload.claim_id].items || []).concat(payload);
    return {...state, claims};
  }

  case 'COMMENT.INIT': {
    let claims = {...state.claims};
    claims[payload.claim_id].comments = (claims[payload.claim_id].comments || []).concat(payload);
    return {...state, claims};
  }

  case 'ITEM.UPDATE': {
    let claims = {...state.claims};
    const claim = claims[payload.claim_id];
    let items = claim.items.slice();
    const index = items.findIndex((i) => i.id === payload.id);
    items.splice(index, 1, { ...items[index], ...payload });
    claims[payload.claim_id] = { ...claim, items };
    return {...state, claims };
  }

  case 'COMMENT.UPDATE': {
    let claims = {...state.claims};
    const claim = claims[payload.claim_id];
    let comments = claim.comments.slice();
    const index = comments.findIndex((i) => i.id === payload.id);
    comments.splice(index, 1, { ...comments[index], ...payload });
    claims[payload.claim_id] = { ...claim, comments };
    return {...state, claims };
  }

  case 'ITEM.DELETE': {
    let claims = {...state.claims};
    const claim = claims[payload.claim_id];
    let items = claim.items.slice();
    const index = items.findIndex((i) => i.id === payload.id);
    items.splice(index, 1);
    claims[payload.claim_id] = { ...claim, items };
    return {...state, claims };
  }

  case 'ROW.INIT': {
    let claims = {...state.claims};
    const claim = claims[payload.claim_id];
    let items = claim.items.slice();
    const index = items.findIndex((i) => i.id === payload.item_id);
    items.splice(index, 1, { ...items[index], rows: (items[index].rows || []).concat(payload) });
    claims[payload.claim_id] = { ...claim, items };
    return {...state, claims};
  }

  case 'ROW.UPDATE': {
    let claims = {...state.claims};
    let claim = claims[payload.claim_id];
    let items = claim.items.slice();
    let item_index = items.findIndex((i) => i.id === payload.item_id);
    let rows = items[item_index].rows.slice();
    let row_index = rows.findIndex((r) => r.id === payload.id);
    rows.splice(row_index, 1, { ...rows[row_index], ...payload });
    items.splice(item_index, 1, { ...items[item_index], rows });
    claims[payload.claim_id] = { ...claim, items };
    return {...state, claims };
  }

  case 'ROW.DELETE': {
    let claims = {...state.claims};
    let claim = claims[payload.claim_id];
    let items = claim.items.slice();
    let item_index = items.findIndex((i) => i.id === payload.item_id);
    let rows = items[item_index].rows.slice();
    let row_index = rows.findIndex((r) => r.id === payload.id);
    rows.splice(row_index, 1);
    items.splice(item_index, 1, { ...items[item_index], rows });
    claims[payload.claim_id] = { ...claim, items };
    return {...state, claims };
  }

  default: {
    return state;
  }
  }
}
