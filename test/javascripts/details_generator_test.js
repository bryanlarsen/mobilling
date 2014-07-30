module("details generator", {
    setup: function () {
        this.$scope = injector.get("$rootScope").$new();
        this.detailsGenerator = injector.get("detailsGenerator");
    }
});

test("returns empty array for empty claim", 1, function () {
    var details,
        claim = {};

    details = this.detailsGenerator(claim);

    deepEqual(details, []);
});
