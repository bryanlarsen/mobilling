  function easter(string) {
    var c, n, k, i, j, l, month, day, year;

    year = new Date(string).getUTCFullYear();

    c = Math.floor(year / 100);
    n = year - 19 * Math.floor(year / 19);
    k = Math.floor((c - 17) / 25);
    i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor(i / 30);
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    j = year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    l = i - j;

    month = 3 + Math.floor((l + 40) / 44);
    day = l + 28 - 31 * Math.floor(month / 4);

    return new Date(Date.UTC(year, month - 1, day));
  }

  function firstMonday(string) {
    var date, day, year, month;

    date = new Date(string);
    year = date.getUTCFullYear();
    month = date.getUTCMonth();
    day = new Date(Date.UTC(year, month, 1)).getUTCDay();

    return new Date(Date.UTC(year, month, 1 + ((7 - day + 1) % 7)));
  }

  function goodFriday(string) {
    var holiday = new Date(easter(string) - 1000 * 60 * 60 * 24 * 2),
    date = new Date(string);

    return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
  }

  function boxingDay(string) {
    var date = new Date(string);

    return date.getUTCMonth() === 11 && date.getUTCDate() === 26;
  }

  function canadaDay(string) {
    var holiday,
    date = new Date(string),
    julyFirst = new Date(Date.UTC(date.getUTCFullYear(), 6, 1)),
    julySecond = new Date(Date.UTC(date.getUTCFullYear(), 6, 2));

    if (julyFirst.getUTCDay() === 0) {
      holiday = julySecond;
    } else {
      holiday = julyFirst;
    }

    return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
  }

  function christmas(string) {
    var date = new Date(string);

    return date.getUTCMonth() === 11 && date.getUTCDate() === 25;
  }

  function civicHoliday(string) {
    var holiday,
    date = new Date(string);

    holiday = firstMonday(new Date(Date.UTC(date.getUTCFullYear(), 7, 1)));

    return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
  }

  function labourDay(string) {
    var holiday,
    date = new Date(string);

    holiday = firstMonday(new Date(Date.UTC(date.getUTCFullYear(), 8, 1)));

    return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
  }

  function newYearsDay(string) {
    var date = new Date(string);

    return date.getUTCMonth() === 0 && date.getUTCDate() === 1;
  }

  function thanksgiving(string) {
    var holiday,
    date = new Date(string);

    holiday = new Date(firstMonday(new Date(Date.UTC(date.getUTCFullYear(), 9, 1))).getTime() + 1000 * 60 * 60 * 24 * 7);

    return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
  }

  function victoriaDay(string) {
    var year, holiday, mayTwentyFourth,
    date = new Date(string);

    year = date.getUTCFullYear();

    mayTwentyFourth = new Date(Date.UTC(year, 4, 24));

    if (mayTwentyFourth.getUTCDay() > 1) {
      holiday = new Date(mayTwentyFourth.getTime() - (mayTwentyFourth.getUTCDay() - 1) * 1000 * 60 * 60 * 24);
    } else if (mayTwentyFourth.getUTCDay() === 0) {
      holiday = new Date(mayTwentyFourth.getTime() - 1000 * 60 * 60 * 24 * 6);
    }

    return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
  }

  function weekend(string) {
    var date = new Date(string);

    return date.getUTCDay() === 0 || date.getUTCDay() === 6;
  }

  function dayType(string) {
    if (goodFriday(string) ||
        boxingDay(string) ||
        canadaDay(string) ||
        christmas(string) ||
        civicHoliday(string) ||
        labourDay(string) ||
        newYearsDay(string) ||
        thanksgiving(string) ||
        victoriaDay(string)) {
      return "holiday";
    } else if (weekend(string)) {
      return "weekend";
    } else {
      return "weekday";
    }
  }


  function timeType(day, time) {
    var day_type = dayType(day);
    if (time < "07:00") return day_type+"_night";
    if (time >= "17:00" && day_type==="weekday") return "weekday_evening";
    return day_type+"_day";
  };

module.exports = { dayType, timeType };
