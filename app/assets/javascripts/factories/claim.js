angular.module("moBilling.factories.claim", [])

    .factory("Claim", function ($resource, API_URL) {
        var Claim = $resource(API_URL + "/v1/claims/:id.json?auth=:auth", {
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        return Claim;
    });
