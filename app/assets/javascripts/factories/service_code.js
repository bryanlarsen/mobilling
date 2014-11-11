/*

    This is sort of like a cached $resource for /v1/service_codes --
    it only makes a single request for all service codes, and
    subsequently serves requests from the cache.

    We have explicitly avoided providing the $resource interface
    though, so that we don't get tripped up by unanticipated interface
    differences.

*/

angular.module("moBilling.factories")

    .factory("ServiceCode", function ($resource, $q, API_URL) {
        var promise;
        var hash = {};

        var exports = {
            // cf. query
            all: function() {
                promise = promise || $resource(API_URL + "/v1/service_codes.json").query().$promise.then(function (codes) {
                    codes.forEach(function (code) {
                        hash[code.code] = code;
                    });
                    return codes;
                });
                return promise;
            },

            // cf. get
            find: function(code) {
                return exports.all().then(function (codes) {
                    return hash[exports.normalize(code)];
                });
            },

            // internal function, exported for testing
            normalize: function(value) {
                if (typeof value !== 'string') {
                    return null;
                }
                var code = value.toUpperCase().match(/^[A-Z]\d\d\d[A-C]/);
                if (code) {
                    return code[0];
                } else if (!code) {
                    code = value.toUpperCase().match(/^[A-Z]\d\d\d/);
                    if (code) return code[0]+'A';
                }
                return null;
            }
        };

        return exports;
    });
