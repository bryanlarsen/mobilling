angular.module("moBilling.factories")

    .factory("PasswordReset", function ($resource, API_URL) {
        var PasswordReset = $resource(API_URL + "/v1/password_resets.json");

        return PasswordReset;
    });
