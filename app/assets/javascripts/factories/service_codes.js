angular.module("moBilling.factories")

    .factory("ServiceCode", function (API_URL, $resource) {
        var serviceCodes = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
            queryTokenizer: Bloodhound.tokenizers.nonword,
            local: []
        });

        serviceCodes.promise = $resource(API_URL + "/v1/service_codes.json").query().$promise.then(function (names) {
            var datums = names.map(function (name) {
                return { name: name };
            });

            return serviceCodes.initialize().then(function () {
                serviceCodes.add(datums);

                return serviceCodes;
            });
        });

        return serviceCodes;
    });
