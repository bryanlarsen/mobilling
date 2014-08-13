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
            if (this.id) {
                return this.$update.apply(this, arguments);
            } else {
                return this.$create.apply(this, arguments);
            }
        };

        Claim.save = function (claim) {
            if (claim.id) {
                return this.update.apply(this, arguments);
            } else {
                return this.create.apply(this, arguments);
            }
        };

        return Claim;
    });
