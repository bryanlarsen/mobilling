"use strict";

import _ from 'underscore';
import moment from 'moment';
import { writeHelper } from "./actionHelpers";
import { unrecoverableError } from "./globalActions";
import { dayType, timeType } from "../data/dayType";

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
    return (dispatch, getState) => {
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}v1/claims/${claimId}/items.json`,
                   action_prefix: 'ITEM.CREATE',
                   payload: item,
                   updateAction: unrecoverableError,
                   responseAction: itemInit
                  });
    }
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
      let calculated = updateConsult(newClaim)
      let updates = {id, ...changes, ...calculated};
      dispatch(claimUpdate(updates));
      return writeHelper({dispatch,
                          method: 'PATCH',
                          url: `${window.ENV.API_ROOT}v1/claims/${id}.json`,
                          action_prefix: 'CLAIM.PATCH',
                          payload: updates,
                          updateAction: claimUpdate,
                          responseAction: claimResponse,
                         });
    };
  },

  claimChangeHandler(dispatch, claim, ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    dispatch(claimActions.updateClaim(claim, updates));
  }
}

export default claimActions;
