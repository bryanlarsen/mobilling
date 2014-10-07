describe("service code", function() {
    var injector, ServiceCode;

    beforeEach(function () {
        injector = angular.injector(["ng", "ngMock", "moBilling"]);
        ServiceCode = injector.get("ServiceCode");
    });

    it("normalizes codes", function () {
        ['R441A', 'r441a', 'r441', 'r441a total hip', 'r441 total hip']
            .forEach(function (code) {
                expect(ServiceCode.normalize(code)).toEqual('R441A');
            });

        [' R441A', '441', '']
            .forEach(function (code) {
                expect(ServiceCode.normalize(code)).toEqual(null);
            });
    });
});
