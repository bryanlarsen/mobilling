angular.module("moBilling.factories", [])

    .factory("Session", function ($http) {
        function Session(attributes) {
            angular.extend(this, attributes);
        }

        Session.prototype.save = function () {
            var session = this;

            return $http({
                url: "/v1/session.json",
                method: "POST",
                data: { session: session }
            }).success(function (response) {
                // angular.extend(session, response.sessions);
            }).error(function (response) {
                // session.errors = response.errors;
            });
        };

        Session.prototype.toJSON = function () {
            return {
                email: this.email,
                password: this.password
            };
        };

        return Session;
    });
