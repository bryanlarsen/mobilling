describe("ClaimEditDetailController", function() {
    var injector, controller, scope, detail, $q, serviceCodes;

    beforeEach(function () {
        var $rootScope, $controller;
        module('moBilling');
        module('moBilling.mocks');

        inject(function($injector, _$q_, _$rootScope_, _$controller_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            feeGenerator = $injector.get("feeGenerator");
        });
        detail = {};
        $rootScope.detail = detail;
        scope = $rootScope.$new();

        controller = $controller('ClaimEditDetailController', {
            $scope: scope,
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
