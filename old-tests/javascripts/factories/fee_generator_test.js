describe("fee generator", function () {
    var injector, feeGenerator, codes, $q, $rootScope;

    beforeEach(function () {
        module('moBilling');
        module('moBilling.mocks');

        inject(function($injector, _$q_, _$rootScope_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            feeGenerator = $injector.get("feeGenerator");
        });
    });

    it("generates codes correctly", function() {
        var data = [['R441B', '10:00', '10:00',  8,   9632],
                    ['E676B', '10:00', '10:00',  6,   7224],
                    ['R441A', '10:00', '10:00',  1,  61990],
                    ['R441A', '10:00', '13:00',  1,  61990],
                    ['R441A',    null,    null,  1,  61990],
                    ['R441C', '10:00', '10:00',  8,  12008],
                    ['R441B', '10:00', '10:01',  9,  10836],
                    ['R441B', '10:00', '10:15',  9,  10836],
                    ['R441B', '10:00', '10:16', 10,  12040],
                    ['R441B', '09:00', '10:00', 12,  14448],
                    ['R441B', '10:00', '11:00', 12,  14448],
                    ['R441B', '10:00', '11:01', 14,  16856],
                    ['R441B', '10:00', '12:30', 24,  28896],
                    ['R441B', '10:00', '12:31', 27,  32508],
                    ['R441B', '22:00', '00:31', 27,  32508],
                    ['R441B', '10:00', '14:59', 54,  65016],
                    ['C998B', '10:00', '10:00',  1,   6000],
                    ['C998B', '10:00', '13:00',  1,   6000],
                    ['C998B',    null,    null,  1,   6000],
                    ['R441C', '10:00', '10:01',  9,  13509],
                    ['R441C', '10:00', '10:15',  9,  13509],
                    ['R441C', '10:00', '10:16', 10,  15010],
                    ['R441C', '10:00', '11:00', 12,  18012],
                    ['R441C', '10:00', '11:01', 14,  21014],
                    ['R441C', '10:00', '11:30', 16,  24016],
                    ['R441C', '10:00', '11:31', 19,  28519],
                    ['R441C', '10:00', '14:59', 58,  87058]];
        var details = data.map(function (t) {
            return {
                 day: '2014-09-18',
                 code: t[0],
                 time_in: t[1],
                 time_out: t[2]
             };
        });
        var promises = details.map(function (detail) {
            return feeGenerator({}, detail);
        });
        $q.all(promises).then(function (_results) {
        });
        $rootScope.$apply();
        for (var i = 0; i < data.length; ++i) {
            expect(details[i].units).toEqual(data[i][3]);
            expect(details[i].fee).toEqual(data[i][4]);
        }
    });
    it("calculates overtime correctly", function() {
        var detail = { day: '2009-09-19', code: 'R441B', time_in: '03:00', time_out: '03:30', premiums: [ { code: 'E401B' } ] };

        var handler = function (_result) {
        };

        feeGenerator({}, detail).then(handler);
        $rootScope.$apply();
        expect(detail.fee).toEqual(12040);
        expect(detail.units).toEqual(10);
        expect(detail.premiums[0].fee).toEqual(12040 * 0.75);
        expect(detail.premiums[0].units).toEqual(10);
        expect(detail.total_fee).toEqual(12040 * 1.75);

        detail.premiums.push({ code: 'C998B' });
        feeGenerator({}, detail).then(handler);
        $rootScope.$apply();
        expect(detail.premiums[1].fee).toEqual(6000);
        expect(detail.premiums[1].units).toEqual(1);
        expect(detail.total_fee).toEqual(12040 * 1.75 + 6000);

        detail.premiums.push({ code: 'Z999C' });
        feeGenerator({}, detail).then(handler);
        $rootScope.$apply();
        expect(detail.total_fee).toEqual(undefined);
    });

});
