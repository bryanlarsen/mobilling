angular.module("moBilling.factories.serviceCodes", [])

    .factory("serviceCodes", function (API_URL, ServiceCode) {
        var serviceCodes = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: []
        });

        serviceCodes.initialize();

        ServiceCode.query().$promise.then(function (names) {
            var datums = names.map(function (name) {
                return { name: name };
            });

            serviceCodes.add(datums);
        });

        return serviceCodes;
    });
