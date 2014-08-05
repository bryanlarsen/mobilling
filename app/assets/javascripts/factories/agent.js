angular.module("moBilling.factories.agent", [])

    .factory("Agent", function ($resource, API_URL) {
        var Agent = $resource(API_URL + "/v1/agents/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        return Agent;
    });
