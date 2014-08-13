angular.module("moBilling.factories")

    .factory("Claim", function ($resource, $q, API_URL) {
        var Claim = $resource(API_URL + "/v1/claims/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        }, {
            create: {
                method: "POST"
            },
            update: {
                method: "PUT"
            }
        });

        Claim.prototype.$save = function () {
            var method = this.id ? "$update" : "$create";

            return this[method].apply(this, arguments);
        };

        Claim.save = function (claim) {
            var method = claim.id ? "update" : "create";

            return this[method].apply(this, arguments);
        };

        return Claim;
    });
