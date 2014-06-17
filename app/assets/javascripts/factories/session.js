angular.module("moBilling.factories.session", [])

    .factory("Session", function ($http) {
        function Session(attributes) {
            angular.extend(this, attributes);
        }

        Session.prototype.save = function () {
            var session = this;

            this.saving = true;

            return $http({
                url: "/v1/session.json",
                method: "POST",
                data: { session: session }
            }).success(function (response) {
                session.saving = false;
                angular.extend(session, response.sessions);
            }).error(function (response) {
                session.saving = false;
                angular.extend(session, response);
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
