"use strict";

import _ from 'underscore';
import moment from 'moment';
import { startBusy, endBusy } from "./globalActions";
import { updateObject } from "./actionHelpers";
import { dayType, timeType } from "../data/dayType";

function claimListInit(claims) {
  return { type: 'CLAIM_LIST.INIT', claims };
}

function claimLoadInit(id, claim) {
  return { type: 'CLAIM.INIT', id, claim };
}

function claimUpdate(id, updates) {
  return { type: 'CLAIM.UPDATE', id, updates };
}

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

const claimActions = {
  refreshClaimList(state) {
    return (dispatch) => {
      if (moment().subtract(1, 'days').isAfter(state.claimListLoadedOn)) {
        dispatch(startBusy());
        fetch(`${window.ENV.API_ROOT}v1/claims.json`, {
          credentials: 'include',
        }).then((response) => response.json()).then((json) => {
          dispatch(claimList(json));
          dispatch(endBusy());
        }).catch((error) => {
          dispatch(endBusy());
          console.error(error);
        });
      }
    };
  },

  refreshClaim(state, id) {
    return (dispatch) => {
      if (!state.claims[id].patient_sex) {
        dispatch(startBusy());
        fetch(`${window.ENV.API_ROOT}v1/claims/${id}.json`, {
          credentials: 'include',
        }).then((response) => response.json()).then((json) => {
          dispatch(claimLoad(id, json));
          dispatch(endBusy());
        }).catch((error) => {
          dispatch(endBusy());
          console.error(error);
        });
      }
    };
  },

  claimResponse(response) {
    return { type: 'CLAIM_UPDATE',
             id: response.id,
             updates: _.pick(response, 'errors', 'warnings', 'submission', 'total_fee', 'submitted_fee', 'paid_fee', 'original_id', 'reclamation_id', 'photo', 'errors', 'warnings', 'files', 'consult_premium_visit_count', 'consult_premium_first_count', 'consult_premium_travel_count', 'service_date', 'consult_setup_visible', 'consult_tab_visible'),
           };
  },

  updateClaim(id, changes) {
    return (dispatch, getState) => {
      const claim = getState().claimStore.claims[id];
      let newClaim = {...claim, ...changes};
      let calculated = updateConsult(newClaim)
      let updates = {...changes, ...calculated};
      dispatch(claimUpdate(id, updates));
      return updateObject(dispatch,
                          `${window.ENV.API_ROOT}v1/claims/${id}.json`,
                          updates,
                          claimUpdate.bind(null, id),
                          claimActions.claimResponse);
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
