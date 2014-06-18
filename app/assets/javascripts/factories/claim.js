angular.module("moBilling.factories.claim", [])

    .factory("Claim", function ($http) {
        function Claim(attributes) {
            angular.extend(this, attributes);
        }

        Claim.fetch = function () {
            return $http({
                url: "/v1/claims.json",
                method: "GET",
                params: { auth: window.localStorage.getItem("authenticationToken") }
            }).then(function (response) {
                return (response.data.claims || []).map(function (attributes) {
                    return new Claim(attributes);
                });
            });
        };

        Claim.prototype.save = function () {
            var claim = this;

            this.saving = true;

            return $http({
                url: "/v1/claim.json",
                method: "POST",
                data: { claim: claim }
            }).success(function (response) {
                claim.saving = false;
                angular.extend(claim, response.claims);
            }).error(function (response) {
                claim.saving = false;
                angular.extend(claim, response);
            });
        };

        Claim.prototype.toJSON = function () {
            return {
                email: this.email,
                password: this.password
            };
        };

        return Claim;
    });
