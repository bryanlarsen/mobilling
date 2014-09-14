angular.module("moBilling.factories")

    .factory("Agent", function ($resource, API_URL, authenticationToken) {
        var Agent = $resource(API_URL + "/v1/agents/:id.json?auth=:auth", {
            id: "@id",
            auth: authenticationToken.get
        });

        return Agent;
    });
