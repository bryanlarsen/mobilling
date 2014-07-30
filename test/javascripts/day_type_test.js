module("day type", {
    setup: function () {
        this.$scope = injector.get("$rootScope").$new();
        this.dayType = injector.get("dayType");
    }
});

test("returns 'holiday' for Good Friday 2015", 1, function () {
    strictEqual(this.dayType("2015-04-03"), "holiday");
});

test("returns 'holiday' for Boxing Day 2015", 1, function () {
    strictEqual(this.dayType("2015-12-26"), "holiday");
});

test("returns 'holiday' for Canada Day 2015", 1, function () {
    strictEqual(this.dayType("2015-07-01"), "holiday");
});

test("returns 'holiday' for Christmas 2015", 1, function () {
    strictEqual(this.dayType("2015-12-25"), "holiday");
});

test("returns 'holiday' for Civic Holiday 2015", 1, function () {
    strictEqual(this.dayType("2015-08-03"), "holiday");
});

test("returns 'holiday' for Labour Day 2015", 1, function () {
    strictEqual(this.dayType("2015-09-07"), "holiday");
});

test("returns 'holiday' for New Years Day 2015", 1, function () {
    strictEqual(this.dayType("2015-01-01"), "holiday");
});

test("returns 'holiday' for Thanksgiving 2015", 1, function () {
    strictEqual(this.dayType("2015-10-12"), "holiday");
});

test("returns 'holiday' for Victoria Day 2015", 1, function () {
    strictEqual(this.dayType("2015-05-18"), "holiday");
});

test("returns 'weekend' for Saturday", 1, function () {
    strictEqual(this.dayType("2014-08-02"), "weekend");
});

test("returns 'weekend' for Sunday", 1, function () {
    strictEqual(this.dayType("2014-08-03"), "weekend");
});

test("returns 'weekday' for Monday", 1, function () {
    strictEqual(this.dayType("2014-08-11"), "weekday");
});

test("returns 'weekday' for Tuesday", 1, function () {
    strictEqual(this.dayType("2014-08-05"), "weekday");
});

test("returns 'weekday' for Wednesday", 1, function () {
    strictEqual(this.dayType("2014-08-06"), "weekday");
});

test("returns 'weekday' for Thursday", 1, function () {
    strictEqual(this.dayType("2014-08-07"), "weekday");
});

test("returns 'weekday' for Friday", 1, function () {
    strictEqual(this.dayType("2014-08-08"), "weekday");
});
