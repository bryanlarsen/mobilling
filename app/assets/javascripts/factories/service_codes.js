angular.module("moBilling.factories.serviceCodes", [])

    .factory("serviceCodes", function (API_URL, $resource) {
        var serviceCodes = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: []
        });

        serviceCodes.initialize();

        $resource(API_URL + "/v1/service_codes.json").query(function (names) {
            var datums = names.map(function (name) {
                return { name: name };
            });

            serviceCodes.add(datums);
        });

        return serviceCodes;
    });
