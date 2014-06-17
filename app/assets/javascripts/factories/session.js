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
            }).then(function (response) {
                if (response.data) {
                    angular.extend(session, response.data.session);
                }
            }, function (response) {
                if (response.data) {
                    angular.extend(session, response.data);
                }
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
