angular.module("moBilling.factories.diagnosis", [])

    .factory("Diagnosis", function ($resource, API_URL) {
        var Diagnosis = $resource(API_URL + "/v1/diagnoses/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        return Diagnosis;
    });
