angular.module("moBilling.factories.authentication", [])

    .factory("Authentication", function ($http, $q, User) {
        function Authentication() {

        }

        Authentication.requireUser = function () {
            return User.fetch().then(null, function () {
            });
        };

        Authentication.requireNoUser = function () {
            return User.fetch().then(function () {
                return $q.reject({dupa: 1});
            });
        };

        return Authentication;
    });
