describe("ClaimEditDetailController", function() {
    var injector, controller, scope, detail, mockServiceCode, $q, serviceCodes;

    beforeEach(function () {
        injector = angular.injector(["ng", "ngMock", "moBilling"]);
        $q = injector.get("$q");
        var $rootScope = injector.get("$rootScope");
        detail = {};
        $rootScope.detail = detail;
        scope = $rootScope.$new();

        serviceCodes = [
            { code: 'P018A', name: 'P018A C-section', fee: 57980 },
            { code: 'P018B', name: 'P018A C-section', fee: 7224 },
        ];

        serviceCodeHash = {};
        serviceCodes.forEach(function (service_code) {
            serviceCodeHash[service_code.code] = service_code;
        });

        mockServiceCode = {
            all: function() {
                return $q(function (resolve, reject) {
                    resolve(serviceCodes);
                });
            },

            find: function(code) {
                return $q(function (resolve, reject) {
                    resolve(serviceCodeHash[code]);
                });
            }
        };

        controller = injector.get("$controller")('ClaimEditDetailController', {
            $scope: scope,
            ServiceCode: mockServiceCode,
            feeGenerator: injector.get('feeGenerator')
        });
        scope.$digest();
    });

    it('should init', function() {
        expect(scope.service_code.code).toEqual('');
        expect(scope.detail.fee).toEqual(undefined);
    });

    it('should work with A code', function() {
        detail.code = 'P018A';
        detail.day = '2014-09-09';
        scope.$apply();
        expect(scope.detail.fee).toEqual(57980);
        expect(scope.detail.units).toEqual(1);
    });

    it('should work with B code', function() {
        detail.code = 'P018B';
        detail.day = '2014-09-09';
        detail.time_in = '09:00';
        detail.time_out = '10:00';
        scope.$apply();
        expect(scope.detail.units).toEqual(10);
        expect(scope.detail.fee).toEqual(12040);
    });

    it('should clear when invalidated', function() {
        detail.code = 'P018A';
        detail.day = '2014-09-09';
        scope.$apply();
        expect(scope.detail.fee).toEqual(57980);
        expect(scope.detail.units).toEqual(1);
        detail.code = 'invalid';
        scope.$apply();
        expect(scope.detail.fee).toEqual(undefined);
        expect(scope.detail.units).toEqual(undefined);
    });
});
