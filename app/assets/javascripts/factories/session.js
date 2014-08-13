angular.module("moBilling.factories")

    .factory("Session", function ($resource, API_URL) {
        var Session = $resource(API_URL + "/v1/session.json");

        return Session;
    });
