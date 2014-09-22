angular.module("moBilling.factories")

    .factory("ServiceCode", function ($resource, $q, API_URL) {
        var ServiceCode = $resource(API_URL + "/v1/service_codes/:code.json");

        return ServiceCode;
    });
