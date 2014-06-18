angular.module("moBilling.factories.session", [])

    .factory("Session", function ($resource, apiResponseTransformer) {
        var Session = $resource("/v1/session.json", {}, {
            save: {
                method: "POST",
                transformResponse: apiResponseTransformer("sessions")
            }
        });

        return Session;
    });
