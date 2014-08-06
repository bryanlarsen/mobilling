angular.module("moBilling.factories.serviceCodes", [])

    .factory("serviceCodes", function (API_URL) {
        var serviceCodes = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: API_URL + "/v1/service_codes.json",
                filter: function (response) {
                    return response.map(function (name) {
                        return { name: name };
                    });
                }
            }
        });

        serviceCodes.initialize();

        return serviceCodes;
    });
