angular.module("moBilling.factories")

    .factory("Session", function ($resource, API_URL, authenticationToken) {
        var Session = $resource(API_URL + "/v1/session.json?auth=:auth", {
            auth: authenticationToken.get
        });

        return Session;
    });
