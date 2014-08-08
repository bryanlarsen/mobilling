angular.module("moBilling.factories.serviceCode", [])

    .factory("ServiceCode", function (API_URL, $resource) {
        var ServiceCode = $resource(API_URL + "/v1/service_codes.json");

        return ServiceCode;
    });
