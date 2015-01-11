angular.module("moBilling.mocks", []).factory("ServiceCode", function ($q) {
    codes = {}
    var data = [ ['R441B',  9632],
                 ['R441A', 61990],
                 ['R441C', 12008],
                 ['E676B',  7224],
                 ['C998B',  6000],
                 ['E401B',   604],
                 ['P018A', 57980],
                 ['P018B',  7224],
               ];
    data.forEach(function(a) {
        codes[a[0]] = { code: a[0], name: a[0], fee: a[1] };
    });
    return {
        all: function () {
            return $q(function (resolve) {
                resolve(data);
            });
        },
        find: function (code) {
            /*         return $q(function (resolve) {
                       resolve(codes[code]);
                       }); */
            var deferred = $q.defer();
            deferred.resolve(codes[code]);
            return deferred.promise;
        }
    };
});
