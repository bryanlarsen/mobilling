angular.module("moBilling.factories.serviceCode", [])

    .factory("ServiceCode", function ($resource, API_URL) {
        var ServiceCode = $resource(API_URL + "/v1/service_codes/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        return ServiceCode;
    });
