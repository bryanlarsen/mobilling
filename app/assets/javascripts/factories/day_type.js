angular.module("moBilling.factories.dayType", [])

    .factory("dayType", function () {
        function parseDate(year, month, day) {
            var date;

            if (!month && !day) {
                date = year;

                if (typeof date === "string") {
                    year  = parseInt(date.split("-")[0], 10);
                    month = parseInt(date.split("-")[1], 10) - 1;
                    day   = parseInt(date.split("-")[2], 10);

                    return parseDate(year, month, day);
                } else {
                    return new Date(date);
                }
            } else {
                return new Date(Date.UTC(year, month, day));
            }
        }

        function easter(string) {
            var c, n, k, i, j, l, month, day, year;

            year = parseDate(string).getUTCFullYear();

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

            return parseDate(year, month - 1, day);
        }

        function firstMonday(string) {
            var date, day, year, month;

            date = parseDate(string);
            year = date.getUTCFullYear();
            month = date.getUTCMonth();
            day = parseDate(year, month, 1).getUTCDay();

            return parseDate(year, month, 1 + ((7 - day + 1) % 7));
        }

        function goodFriday(string) {
            var holiday = parseDate(easter(string) - 1000 * 60 * 60 * 24 * 2),
                date = parseDate(string);

            return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
        }

        function boxingDay(string) {
            var date = parseDate(string);

            return date.getUTCMonth() === 11 && date.getUTCDate() === 26;
        }

        function canadaDay(string) {
            var holiday,
                date = parseDate(string),
                julyFirst = parseDate(date.getUTCFullYear(), 6, 1),
                julySecond = parseDate(date.getUTCFullYear(), 6, 2);

            if (julyFirst.getUTCDay() === 0) {
                holiday = julySecond;
            } else {
                holiday = julyFirst;
            }

            return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
        }

        function christmas(string) {
            var date = parseDate(string);

            return date.getUTCMonth() === 11 && date.getUTCDate() === 25;
        }

        function civicHoliday(string) {
            var holiday,
                date = parseDate(string);

            holiday = firstMonday(parseDate(date.getUTCFullYear(), 7, 1));

            return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
        }

        function labourDay(string) {
            var holiday,
                date = parseDate(string);

            holiday = firstMonday(parseDate(date.getUTCFullYear(), 8, 1));

            return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
        }

        function newYearsDay(string) {
            var date = parseDate(string);

            return date.getUTCMonth() === 0 && date.getUTCDate() === 1;
        }

        function thanksgiving(string) {
            var holiday,
                date = parseDate(string);

            holiday = parseDate(firstMonday(parseDate(date.getUTCFullYear(), 9, 1)).getTime() + 1000 * 60 * 60 * 24 * 7);

            return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
        }

        function victoriaDay(string) {
            var year, holiday, mayTwentyFourth,
                date = parseDate(string);

            year = date.getUTCFullYear();

            mayTwentyFourth = parseDate(year, 4, 24);

            if (mayTwentyFourth.getUTCDay() > 1) {
                holiday = parseDate(mayTwentyFourth.getTime() - (mayTwentyFourth.getUTCDay() - 1) * 1000 * 60 * 60 * 24);
            } else if (mayTwentyFourth.getUTCDay() === 0) {
                holiday = parseDate(mayTwentyFourth.getTime() - 1000 * 60 * 60 * 24 * 6);
            }

            return date.getUTCFullYear() === holiday.getUTCFullYear() && date.getUTCMonth() === holiday.getUTCMonth() && date.getUTCDate() === holiday.getUTCDate();
        }

        function weekend(string) {
            var date = parseDate(string);

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

        return dayType;
    });
