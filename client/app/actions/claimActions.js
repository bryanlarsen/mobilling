"use strict";

const _ = require('underscore');
const moment = require('moment');
const { writeHelper } = require('./actionHelpers');
const { unrecoverableError } = require('./globalActions');
const { dayType, timeType } = require('../data/dayType');
const FeeGenerator = require('../data/FeeGenerator');

function updateConsult(claim) {
  let updates = {consult_time_type: claim.consult_time_type};
  var date = claim.admission_on || claim.first_seen_on;
  if (date && !claim.admission_on) claim.admission_on = updates.admission_on = date;
  if (date && !claim.first_seen_on) claim.first_seen_on = updates.first_seen_on = date;

  if (claim.admission_on === claim.first_seen_on && !claim.first_seen_consult) {
    claim.first_seen_consult = updates.first_seen_consult = true;
  }

  var premium = claim.consult_premium_visit;
  var travel = claim.consult_premium_travel;
  var day_type = claim.first_seen_on && dayType(claim.first_seen_on);
  var time_type = day_type && claim.consult_time_in && timeType(claim.first_seen_on, claim.consult_time_in);

  if (!time_type) return updates;

  if (premium === 'weekday_office_hours' && time_type === 'weekday_day') time_type = premium;

  if (claim.consult_time_type !== time_type) claim.consult_time_type = updates.consult_time_type = time_type;

  if (premium && claim.consult_premium_first_count === 0) claim.consult_premium_first = updates.consult_premium_first = true;

  if (claim.consult_premium_first_count > 1 && claim.consult_premium_first) claim.consult_premium_first = updates.consult_premium_first = false;

  if (!premium && claim.consult_premium_first) claim.consult_premium_first = updates.consult_premium_first = false;

  if (premium && premium !== time_type) {
    premium = time_type;
    claim.consult_premium_visit = updates.consult_premium_visit = premium;
  }

  if (!premium && travel) {
    travel = false;
    claim.consult_premium_travel = updates.consult_premium_travel = travel;
  }

  return updates;
};

function claimListInit(claims) {
  return { type: 'CLAIM_LIST.INIT', payload: claims };
}

function claimInit(claim) {
  return { type: 'CLAIM.INIT', payload: claim };
}

function claimUpdate(payload) {
  return { type: 'CLAIM.UPDATE', payload };
}

function claimResponse(payload) {
  return { type: 'CLAIM.UPDATE',
           payload: _.pick(payload, 'id', 'errors', 'warnings', 'submission', 'total_fee', 'submitted_fee', 'paid_fee', 'original_id', 'reclamation_id', 'photo', 'errors', 'warnings', 'files', 'consult_premium_visit_count', 'consult_premium_first_count', 'consult_premium_travel_count', 'service_date', 'consult_setup_visible', 'consult_tab_visible'),
         };
}

function itemInit(payload) {
  return { type: 'ITEM.INIT', payload };
}

function itemUpdate(payload) {
  return { type: 'ITEM.UPDATE', payload };
}

function itemResponse(payload) {
  return { type: 'ITEM.UPDATE',
           payload: _.pick(payload, 'claim_id', 'id', 'errors', 'warnings'),
         };
}

function itemDelete(payload) {
  return { type: 'ITEM.DELETE', payload };
}

function rowInit(payload) {
  return { type: 'ROW.INIT', payload };
}

function rowUpdate(payload) {
  return { type: 'ROW.UPDATE', payload };
}

function rowResponse(payload) {
  return { type: 'ROW.UPDATE',
           payload: _.pick(payload, 'claim_id', 'item_id', 'id', 'errors', 'warnings'),
         };
}

function rowDelete(payload) {
  return { type: 'ROW.DELETE', payload };
}

const claimActions = {
  refreshClaimList() {
    return (dispatch, getState) => {
      if (moment().subtract(1, 'days').isAfter(getState().claimStore.claimListLoadedOn)) {
        dispatch({type: 'CLAIM_LIST.GET.START'});
        fetch(`${window.ENV.API_ROOT}v1/claims.json`, {
          credentials: 'include',
        }).then((response) => response.json()).then((json) => {
          dispatch(claimListInit(json));
          dispatch({type: 'CLAIM_LIST.GET.FINISH'});
        }).catch((error) => {
          dispatch({type: 'CLAIM_LIST.GET.FAILURE'});
          console.log(error);
        });
      }
    };
  },

  newClaim(callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(claimInit(response));
      callback(response.id);
    };
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}v1/claims.json`,
                   action_prefix: 'CLAIM.CREATE',
                   payload: {status: 'saved'},
                   updateAction: unrecoverableError,
                   responseAction: done
                  });
    }
  },

  newItem(claimId, item) {
    const done = (item) => (dispatch, getState) => {
      dispatch(itemInit(item));
      // update fee & units on new item if necessary
      dispatch(claimActions.updateItem(claimId, item.id, {}));
    };
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}v1/claims/${claimId}/items.json`,
                   action_prefix: 'ITEM.CREATE',
                   payload: item,
                   updateAction: unrecoverableError,
                   responseAction: done,
                  });
    };
  },

  setComment(claimId, commentId, body) {
    const done = (payload) => {
      return {type: commentId ? 'COMMENT.UPDATE' : 'COMMENT.INIT', payload: {...payload, live: true}};
    };
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: commentId ? 'PATCH' : 'POST',
                   url: `${window.ENV.API_ROOT}v1/claims/${claimId}/comments${commentId ? '/'+commentId : ''}.json`,
                   action_prefix: commentId ? 'COMMENT.PATCH' : 'COMMENT.CREATE',
                   payload: {body},
                   updateAction: unrecoverableError,
                   responseAction: done
                  });
    };
  },

  refreshClaim(id) {
    return (dispatch, getState) => {
      const claim = getState().claimStore.claims[id];
      if (!claim || !claim.patient_sex) {
        dispatch({type: 'CLAIM.GET.START'});
        fetch(`${window.ENV.API_ROOT}v1/claims/${id}.json`, {
          credentials: 'include',
        }).then((response) => response.json()).then((json) => {
          dispatch(claimInit(json));
          dispatch({type: 'CLAIM.GET.FINISH'});
        }).catch((error) => {
          dispatch({type: 'CLAIM.GET.FAILED'});
          console.error(error);
        });
      }
    };
  },

  updateClaim(id, changes) {
    return (dispatch, getState) => {
      const claim = getState().claimStore.claims[id];
      let newClaim = {...claim, ...changes};
      let calculated = updateConsult(newClaim);
      let updates = {id, ...changes, ...calculated};
      dispatch(claimUpdate(updates));
      writeHelper({dispatch,
                   method: 'PATCH',
                   url: `${window.ENV.API_ROOT}v1/claims/${id}.json`,
                   action_prefix: 'CLAIM.PATCH',
                   payload: updates,
                   updateAction: claimUpdate,
                   responseAction: claimResponse,
                  });
    };
  },

  updateItem(claim_id, id, changes) {
    return (dispatch, getState) => {
      const claim = getState().claimStore.claims[claim_id];
      const item = claim.items.find((i) => i.id === id);
      let newItem = {...item, ...changes};
      let updates = {id, claim_id, ...changes};
      dispatch(itemUpdate(updates));

      const gen = FeeGenerator.feeGenerator;
      if (gen) {
        for (const row of newItem.rows) {
          const result = gen.calculateFee(newItem, newItem.rows[0], row.code);
          if (result && (result.fee !== row.fee || result.units !== row.units)) {
            dispatch(claimActions.updateRow(claim_id, id, row.id, {id: row.id, fee: result.fee, units: result.units}));
          }
        }
      }

      if (_.size(updates) === 2) return;
      writeHelper({dispatch,
                   method: 'PATCH',
                   url: `${window.ENV.API_ROOT}v1/claims/${claim_id}/items/${id}.json`,
                   action_prefix: 'ITEM.PATCH',
                   payload: updates,
                   updateAction: itemUpdate,
                   responseAction: itemResponse,
                  });
    };
  },

  updateRow(claim_id, item_id, id, changes) {
    return (dispatch, getState) => {
      const claim = getState().claimStore.claims[claim_id];
      const item = claim.items.find((i) => i.id === item_id);
      const row = item.rows.find((r) => r.id === id);
      const gen = FeeGenerator.feeGenerator;
      let updates = {id, claim_id, item_id, ...changes};
      if (gen) {
        const result = gen.calculateFee(item, item.rows[0], row.code);
        if (result && (result.fee !== row.fee || result.units !== row.units)) {
          updates = {...updates, fee: result.fee, units: result.units};
        }
      }
      dispatch(rowUpdate(updates));
      writeHelper({dispatch,
                   method: 'PATCH',
                   url: `${window.ENV.API_ROOT}v1/claims/${claim_id}/rows/${id}.json`,
                   action_prefix: 'ROW.PATCH',
                   payload: updates,
                   updateAction: rowUpdate,
                   responseAction: rowResponse,
                  });
    };
  },

  deleteItem(claim_id, id) {
    const payload = {claim_id, id};
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: 'DELETE',
                   url: `${window.ENV.API_ROOT}v1/claims/${claim_id}/items/${id}.json`,
                   action_prefix: 'ITEM.DELETE',
                   payload: {},
                   updateAction: unrecoverableError,
                   responseAction: (json) => itemDelete(payload),
                  });
    }
  },

  deleteRow(claim_id, item_id, id) {
    const payload = {claim_id, item_id, id};
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: 'DELETE',
                   url: `${window.ENV.API_ROOT}v1/claims/${claim_id}/rows/${id}.json`,
                   action_prefix: 'ROW.DELETE',
                   payload: {},
                   updateAction: unrecoverableError,
                   responseAction: (json) => rowDelete(payload),
                  });
    }
  },

  createRow(claim_id, item_id, row) {
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}v1/claims/${claim_id}/items/${item_id}/rows.json`,
                   action_prefix: 'ROW.CREATE',
                   payload: {},
                   updateAction: unrecoverableError,
                   responseAction: rowInit,
                  });
    };
  },

  claimChangeHandler(dispatch, id, ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    //dispatch(claimActions.updateClaim(id, updates));
    dispatch(claimUpdate({id, ...updates}));
  },

  itemChangeHandler(dispatch, claim_id, id, ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    dispatch(claimActions.updateItem(claim_id, id, updates));
  },

  rowChangeHandler(dispatch, claim_id, item_id, id, ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    dispatch(claimActions.updateRow(claim_id, item_id, id, updates));
  },
}

module.exports = claimActions;
