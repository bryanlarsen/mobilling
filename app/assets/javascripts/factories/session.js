angular.module("moBilling.factories.session", [])

    .factory("Session", function ($resource, API_URL) {
        var Session = $resource(API_URL + "/v1/session.json");

        return Session;
    });
