angular.module("moBilling.factories")

    .factory("hospitalsEngine", function (API_URL) {
        var hospitalsEngine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
            queryTokenizer: Bloodhound.tokenizers.nonword,
            prefetch: {
                url: API_URL + "/v1/hospitals.json",
                filter: function (response) {
                    return response.map(function (name) {
                        return { name: name };
                    });
                }
            }
        });

        hospitalsEngine.promise = hospitalsEngine.initialize().then(function () {
            return hospitalsEngine;
        });

        return hospitalsEngine;
    });
