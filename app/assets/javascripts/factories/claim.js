angular.module("moBilling.factories.claim", [])

    .factory("Claim", function ($resource, $q, API_URL) {
        var Claim = $resource(API_URL + "/v1/claims/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        }, {
            save: {
                method: "PUT"
            }
        });

        Claim.getOrInit = function (attributes) {
            return Claim.get(attributes).$promise.then(null, function (response) {
                if (response.status === 404) {
                    return new Claim(attributes);
                } else {
                    return $q.reject(response);
                }
            });
        };

        return Claim;
    });
