describe("details generator", function () {
    var injector, detailsGenerator;

    beforeEach(function () {
        injector = angular.injector(["ng", "ngMock", "moBilling"]);
        detailsGenerator = injector.get("detailsGenerator");
    });

    it("returns empty array for empty claim", function () {
        expect(detailsGenerator({})).toEqual([]);
    });
});
