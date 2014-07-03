angular.module("moBilling.factories.dayType", [])

    .factory("dayType", function () {
        function easter(string) {
            var c, n, k, i, j, l, month, day, year;

            year = new Date(string).getFullYear();

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

            return new Date(year, month - 1, day);
        }

        function firstMonday(string) {
            var date, day, year, month;

            date = new Date(string);
            year = date.getFullYear();
            month = date.getMonth();
            day = new Date(year, month, 1).getDay();

            return new Date(year, month, 1 + ((7 - day + 1) % 7));
        }

        function goodFriday(string) {
            var holiday = new Date(easter(string) - 1000 * 60 * 60 * 24 * 2),
                date = new Date(string);

            return date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate();
        }

        function boxingDay(string) {
            var date = new Date(string);

            return date.getMonth() === 11 && date.getDate() === 26;
        }

        function canadaDay(string) {
            var holiday,
                date = new Date(string),
                julyFirst = new Date(date.getFullYear(), 6, 1),
                julySecond = new Date(date.getFullYear(), 6, 2);

            if (julyFirst.getDay() === 0) {
                holiday = julySecond;
            } else {
                holiday = julyFirst;
            }

            return date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate();
        }

        function christmas(string) {
            var date = new Date(string);

            return date.getMonth() === 11 && date.getDate() === 25;
        }

        function civicHoliday(string) {
            var holiday,
                date = new Date(string);

            holiday = firstMonday(new Date(date.getFullYear(), 7, 1));

            return date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate();
        }

        function labourDay(string) {
            var holiday,
                date = new Date(string);

            holiday = firstMonday(new Date(date.getFullYear(), 8, 1));

            return date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate();
        }

        function newYearsDay(string) {
            var date = new Date(string);

            return date.getMonth() === 0 && date.getDate() === 1;
        }

        function thanksgiving(string) {
            var holiday,
                date = new Date(string);

            holiday = new Date(firstMonday(new Date(date.getFullYear(), 9, 1)).getTime() + 1000 * 60 * 60 * 24 * 7);

            return date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate();
        }

        function victoriaDay(string) {
            var year, holiday, mayTwentyFourth,
                date = new Date(string);

            year = date.getFullYear();

            mayTwentyFourth = new Date(year, 4, 24);

            if (mayTwentyFourth.getDay() > 1) {
                holiday = new Date(mayTwentyFourth.getTime() - (mayTwentyFourth.getDay() - 1) * 1000 * 60 * 60 * 24);
            } else if (mayTwentyFourth.getDay() === 0) {
                holiday = new Date(mayTwentyFourth.getTime() - 1000 * 60 * 60 * 24 * 6);
            }

            return date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate();
        }

        function weekend(string) {
            var date = new Date(string);

            return date.getDay() === 0 || date.getDay() === 6;
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
