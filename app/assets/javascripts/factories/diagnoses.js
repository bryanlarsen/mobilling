angular.module("moBilling.factories.diagnoses", [])

    .factory("diagnoses", function (API_URL) {
        var diagnoses = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: API_URL + "/v1/diagnoses.json",
                filter: function (response) {
                    return response.map(function (name) {
                        return { name: name };
                    });
                }
            }
        });

        diagnoses.initialize();

        return diagnoses;
    });
