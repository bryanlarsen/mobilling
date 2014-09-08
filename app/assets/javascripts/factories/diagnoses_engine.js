angular.module("moBilling.factories")

    .factory("diagnosesEngine", function (API_URL) {
        var diagnosesEngine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
            queryTokenizer: Bloodhound.tokenizers.nonword,
            prefetch: {
                url: API_URL + "/v1/diagnoses.json",
                filter: function (response) {
                    return response.map(function (name) {
                        return { name: name };
                    });
                }
            }
        });

        diagnosesEngine.promise = diagnosesEngine.initialize().then(function () {
            return diagnosesEngine;
        });

        return diagnosesEngine;
    });
