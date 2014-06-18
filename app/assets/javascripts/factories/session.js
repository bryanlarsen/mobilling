angular.module("moBilling.factories.session", [])

    .factory("Session", function ($resource, apiInterceptor) {
        var Session = $resource("/v1/session.json", {}, {
            save: {
                method: "POST",
                transformResponse: function (response) {
                    if (response.status === 200) {
                        return angular.fromJson(response).sessions;
                    } else if (response.status === 422) {
                        return angular.fromJson(response).errors;
                    } else {
                        return angular.fromJson(response);
                    }
                }
            }
        });

        window.Session = Session;

        return Session;
    });
