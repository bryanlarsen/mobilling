describe("fee generator", function () {
    var injector, feeGenerator, codes;

    beforeEach(function () {
        injector = angular.injector(["ng", "ngMock", "moBilling"]);
        feeGenerator = injector.get("feeGenerator");
        codes = {}
        var data = [ ['R441B',  9632],
                     ['R441A', 61990],
                     ['R441C', 12008],
                     ['E676B',  7224],
                     ['C998B',  6000],
                     ['E401B',   604],
                   ];
        data.forEach(function(a) {
              codes[a[0]] = { code: a[0], fee: a[1] };
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
        data.forEach(function(t) {
             result = feeGenerator({}, {
                 day: '2014-09-18',
                 code: t[0],
                 time_in: t[1],
                 time_out: t[2]
             }, codes[t[0]]);
             expect(result.units).toEqual(t[3]);
             expect(result.fee).toEqual(t[4]);
         });
    });

    it("calculates overtime correctly", function() {
        var master1 = { day: '2009-09-19', code: 'R441B', time_in: '03:00', time_out: '03:30', units: 10, fee: 12040};
        var master2 = { day: '2009-09-19', code: 'C998B', time_in: '03:00', time_out: '03:30', units: 1, fee: 10000};
        var ot = { day: '2009-09-19', code: 'E401B', time_in: '03:00', time_out: '03:30' };

        var claim = { daily_details: [master1, master2, claim] };

        expect(feeGenerator(claim, ot, codes['E401B']).fee).toEqual(12040*0.75);
        var claim = { daily_details: [master2, master1, claim] };
        expect(feeGenerator(claim, ot, codes['E401B']).fee).toEqual(12040*0.75);
        var claim = { daily_details: [claim, master2, master1] };
        expect(feeGenerator(claim, ot, codes['E401B']).fee).toEqual(12040*0.75);

        master1.time_out = '03:29';
        expect(feeGenerator(claim, ot, codes['E401B']).fee).toEqual(undefined);

        master1.time_out = '03:30';
        master1.units = 1;
        expect(feeGenerator(claim, ot, codes['E401B']).fee).toEqual(undefined);
    });
});
