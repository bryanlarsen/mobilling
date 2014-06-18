angular.module("moBilling.factories.claim", [])

    .factory("Claim", function ($resource, $q, API_URL, apiResponseTransformer) {
        var Claim = $resource(API_URL + "/v1/claims/:id.json?auth=:auth", {
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        }, {
            query: {
                transformResponse: apiResponseTransformer("claims"),
                isArray: true
            }
        });

        return Claim;
    });
