(function(exports) {
  function daysRange(first, last) {
    var i,
      days = [];

    first = new Date(first).getTime();
    last = new Date(last).getTime();

    if (!isNaN(first) && !isNaN(last)) {
      for (i = first; i <= last; i += 1000 * 60 * 60 * 24) {
        days.push(new Date(i).toISOString().substr(0, 10));
      }
    }

    return days;
  }

  function firstAffix(first) {
    return first ? "first" : "second";
  }

  function erAffix(consult) {
    return {
      general_er:               "er",
      general_non_er:           "non_er",
      comprehensive_er:         "er",
      comprehensive_non_er:     "non_er",
      limited_er:               "er",
      limited_non_er:           "non_er",
      special_er:               "er",
      special_non_er:           "non_er",
      on_call_admission_er:     "er",
      on_call_admission_non_er: "non_er"
    }[consult];
  }

  function visitAffix(type) {
    return {
      weekday_office_hours: "office_hours",
      weekday_day:          "day",
      weekday_evening:      "evening",
      weekday_night:        "night",
      weekend_day:          "holiday",
      weekend_night:        "night",
      holiday_day:          "holiday",
      holiday_night:        "night"
    }[type];
  }

  function consultCode(specialty, consult) {
    return {
      internal_medicine_general_er:             "A135A",
      internal_medicine_general_non_er:         "C135A",
      internal_medicine_comprehensive_er:       "A130A",
      internal_medicine_comprehensive_non_er:   "C130A",
      internal_medicine_limited_er:             "A435A",
      internal_medicine_limited_non_er:         "C435A",
      cardiology_general_er:                    "A605A",
      cardiology_general_non_er:                "C605A",
      cardiology_comprehensive_er:              "A600A",
      cardiology_comprehensive_non_er:          "C600A",
      cardiology_limited_er:                    "A675A",
      cardiology_limited_non_er:                "C675A",
      family_medicine_general_er:               "A005A",
      family_medicine_general_non_er:           "C005A",
      family_medicine_special_er:               "A911A",
      family_medicine_special_non_er:           "C911A",
      family_medicine_comprehensive_er:         "A912A",
      family_medicine_comprehensive_non_er:     "C912A",
      family_medicine_on_call_admission_er:     "A933A",
      family_medicine_on_call_admission_non_er: "C933A"
    }[[specialty, consult].join("_")];
  }

  function premiumVisitCode(first, consult, visit) {
    return {
      first_non_er_office_hours:  "C992A",
      first_non_er_day:           "C990A",
      first_non_er_evening:       "C994A",
      first_non_er_holiday:       "C986A",
      first_non_er_night:         "C996A",
      second_non_er_office_hours: "C993A",
      second_non_er_day:          "C991A",
      second_non_er_evening:      "C995A",
      second_non_er_holiday:      "C987A",
      second_non_er_night:        "C997A",
      first_er_office_hours:      "K992A",
      first_er_day:               "K990A",
      first_er_evening:           "K994A",
      first_er_holiday:           "K998A",
      first_er_night:             "K996A",
      second_er_office_hours:     "K993A",
      second_er_day:              "K991A",
      second_er_evening:          "K995A",
      second_er_holiday:          "K999A",
      second_er_night:            "K997A"
    }[[firstAffix(first), erAffix(consult), visitAffix(visit)].join("_")];
  }

  function premiumVisitLimit(consult, visit) {
    return {
      office_hours: 10,
      day:          10,
      evening:      10,
      holiday:      20,
      night:        999,
    }[visitAffix(visit)];
  }

  function premiumTravelCode(consult, visit) {
    return {
      non_er_office_hours: "C961A",
      non_er_day:          "C960A",
      non_er_evening:      "C962A",
      non_er_holiday:      "C963A",
      non_er_night:        "C964A",
      er_office_hours:     "K961A",
      er_day:              "K960A",
      er_evening:          "K962A",
      er_holiday:          "K963A",
      er_night:            "K964A"
    }[[erAffix(consult), visitAffix(visit)].join("_")];
  }

  function premiumTravelLimit(consult, visit) {
    return {
      office_hours: 2,
      day:          2,
      evening:      2,
      holiday:      6,
      night:        999,
    }[visitAffix(visit)];
  }

  function firstFiveWeeksCode(specialty) {
    return {
      internal_medicine: "C132A",
      cardiology:        "C602A",
      family_medicine:   "C002A"
    }[specialty];
  }

  function sixthToThirteenthWeekInclusiveCode(specialty) {
    return {
      internal_medicine: "C137A",
      cardiology:        "C607A",
      family_medicine:   "C007A"
    }[specialty];
  }

  function afterThirtheenthWeekCode(specialty) {
    return {
      internal_medicine: "C139A",
      cardiology:        "C609A",
      family_medicine:   "C009A"
    }[specialty];
  }

  function concurrentCode(specialty) {
    return {
      internal_medicine: "C138A",
      cardiology:        "C608A",
      family_medicine:   "C138A" // not defined in client's spec
    }[specialty];
  }

  function detailsGenerator(claim) {
    var daysAfterFirstSeen,
    specialty = claim.specialty,
    admissionOffset = 0,
    admission = claim.admission_on,
    first = claim.first_seen_on,
    last = claim.last_seen_on,
    mrp = claim.most_responsible_physician,
    consult = claim.consult_type,
    visit = claim.consult_premium_visit,
    premiumFirst = claim.consult_premium_first,
    travel = claim.consult_premium_travel,
    icu = claim.icu_transfer,
    discharge = claim.last_seen_discharge,
    details = [];

    daysRange(admission, last).forEach(function (day, daysAfterAdmission) {
      // no codes before first seen date
      if (day < first) {
        admissionOffset++;
        return;
      }

      daysAfterFirstSeen = daysAfterAdmission - admissionOffset;

      if (day === first && consult) {
        var detail = { day: day, code: consultCode(specialty, consult), premiums: [] };

        if (visit) {
          // visit premium
          detail.premiums.push({ code: premiumVisitCode(premiumFirst, consult, visit) });

          if (travel) {
            // travel premium
            detail.premiums.push({ code: premiumTravelCode(consult, visit) });
          }
        }

        if (admission === first && mrp) {
          // admission premium
          detail.premiums.push({ code: "E082A" });
        }
        details.push(detail);
      } else if (daysAfterFirstSeen === 0 && icu) {
        details.push({ day: day, code: "C142A", premiums: [{ code: 'E083A' }] });
      } else if (daysAfterFirstSeen === 1 && icu) {
        details.push({ day: day, code: "C143A", premiums: [{ code: 'E083A' }] });
      } else if (daysAfterAdmission === 1) {
        if (mrp) {
          details.push({ day: day, code: "C122A", premiums: [{ code: 'E083A' }] });
        } else {
          details.push({ day: day, code: concurrentCode(specialty) });
        }
      } else if (daysAfterAdmission === 2) {
        if (mrp) {
          details.push({ day: day, code: "C123A", premiums: [{ code: 'E083A' }] });
        } else {
          details.push({ day: day, code: concurrentCode(specialty) });
        }
      } else if (day === last && discharge) {
        if (mrp) {
          details.push({ day: day, code: "C124A", premiums: [{ code: 'E083A' }] });
        } else {
          details.push({ day: day, code: concurrentCode(specialty) });
        }
      } else if (daysAfterAdmission >= 3 && daysAfterAdmission <= 35) {
        if (mrp) {
          details.push({ day: day, code: firstFiveWeeksCode(specialty), premiums: [{ code: 'E083A' }] });
        } else {
          details.push({ day: day, code: concurrentCode(specialty) });
        }
      } else if (daysAfterAdmission >= 36 && daysAfterAdmission <= 91) {
        if (mrp) {
          details.push({ day: day, code: sixthToThirteenthWeekInclusiveCode(specialty), premiums: [{ code: 'E083A' }] });
        } else {
          details.push({ day: day, code: concurrentCode(specialty) });
        }
      } else if (daysAfterAdmission >= 92) {
        if (mrp) {
          details.push({ day: day, code: afterThirtheenthWeekCode(specialty), premiums: [{ code: 'E083A' }] });
        } else {
          details.push({ day: day, code: concurrentCode(specialty) });
        }
      }
    });

    details.forEach(function (detail) {
      detail.autogenerated = true;
      detail.time_in = null;
      detail.time_out = null;
    });

    return details;
  }

  detailsGenerator.erAffix = erAffix;
  detailsGenerator.consultCode = consultCode;
  detailsGenerator.premiumVisitCode = premiumVisitCode;
  detailsGenerator.premiumTravelCode = premiumTravelCode;
  detailsGenerator.premiumVisitLimit = premiumVisitLimit;
  detailsGenerator.premiumTravelLimit = premiumTravelLimit;

  exports.detailsGenerator = detailsGenerator;
})(window);
