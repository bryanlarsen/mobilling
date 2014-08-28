angular.module("moBilling.factories")

    .factory("Diagnosis", function (API_URL) {
        var diagnoses = new Bloodhound({
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

        return {
            initialize: function () {
                console.log("qqq");
                return diagnoses.initialize().then(function () {
                    console.log("qqq2");
                    return diagnoses;
                });
            }
        };
    });
