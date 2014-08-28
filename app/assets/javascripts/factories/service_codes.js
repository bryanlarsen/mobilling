angular.module("moBilling.factories")

    .factory("serviceCodes", function (API_URL, $resource) {
        var serviceCodes = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
            queryTokenizer: Bloodhound.tokenizers.nonword,
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
