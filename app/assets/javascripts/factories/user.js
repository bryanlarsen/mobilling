angular.module("moBilling.factories")

    .factory("User", function ($resource, API_URL, authenticationToken) {
        var User = $resource(API_URL + "/v1/user.json?auth=:auth", {
            auth: authenticationToken.get
        }, {
            update: {
                method: "PUT"
            }
        });

        return User;
    });
