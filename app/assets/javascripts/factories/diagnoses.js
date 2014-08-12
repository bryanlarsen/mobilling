angular.module("moBilling.factories")

    .factory("diagnoses", function (API_URL) {
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

        diagnoses.initialize();

        return diagnoses;
    });
