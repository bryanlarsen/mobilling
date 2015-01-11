//= require components/day-type.js

describe("day type", function () {
    it("returns 'holiday' for Good Friday 2015", function () {
        expect(dayType("2015-04-03")).toEqual("holiday");
    });

    it("returns 'holiday' for Boxing Day 2015", function () {
        expect(dayType("2015-12-26")).toEqual("holiday");
    });

    it("returns 'holiday' for Canada Day 2015", function () {
        expect(dayType("2015-07-01")).toEqual("holiday");
    });

    it("returns 'holiday' for Christmas 2015", function () {
        expect(dayType("2015-12-25")).toEqual("holiday");
    });

    it("returns 'holiday' for Civic Holiday 2015", function () {
        expect(dayType("2015-08-03")).toEqual("holiday");
    });

    it("returns 'holiday' for Labour Day 2015", function () {
        expect(dayType("2015-09-07")).toEqual("holiday");
    });

    it("returns 'holiday' for New Years Day 2015", function () {
        expect(dayType("2015-01-01")).toEqual("holiday");
    });

    it("returns 'holiday' for Thanksgiving 2015", function () {
        expect(dayType("2015-10-12")).toEqual("holiday");
    });

    it("returns 'holiday' for Victoria Day 2015", function () {
        expect(dayType("2015-05-18")).toEqual("holiday");
    });

    it("returns 'weekend' for Saturday", function () {
        expect(dayType("2014-08-02")).toEqual("weekend");
    });

    it("returns 'weekend' for Sunday", function () {
        expect(dayType("2014-08-03")).toEqual("weekend");
    });

    it("returns 'weekday' for Monday", function () {
        expect(dayType("2014-08-11")).toEqual("weekday");
    });

    it("returns 'weekday' for Tuesday", function () {
        expect(dayType("2014-08-05")).toEqual("weekday");
    });

    it("returns 'weekday' for Wednesday", function () {
        expect(dayType("2014-08-06")).toEqual("weekday");
    });

    it("returns 'weekday' for Thursday", function () {
        expect(dayType("2014-08-07")).toEqual("weekday");
    });

    it("returns 'weekday' for Friday", function () {
        expect(dayType("2014-08-08")).toEqual("weekday");
    });
});
