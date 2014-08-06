angular.module("moBilling.factories.hospital", [])

    .factory("Hospital", function ($resource, API_URL) {
        var Hospital = $resource(API_URL + "/v1/hospitals/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        return Hospital;
    });
