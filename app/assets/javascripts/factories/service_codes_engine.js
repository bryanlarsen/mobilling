angular.module("moBilling.factories")

    .factory("serviceCodesEngine", function (API_URL, $resource) {
        var serviceCodesEngine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
            queryTokenizer: Bloodhound.tokenizers.nonword,
            local: []
        });

        serviceCodesEngine.promise = $resource(API_URL + "/v1/service_codes.json").query().$promise.then(function (names) {
            var datums = names.map(function (name) {
                return { name: name };
            });

            return serviceCodesEngine.initialize().then(function () {
                serviceCodesEngine.add(datums);

                return serviceCodesEngine;
            });
        });

        return serviceCodesEngine;
    });
