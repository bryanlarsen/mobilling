angular.module("moBilling.factories")

    .factory("serviceCodesEngine", function (API_URL, ServiceCode) {
        var serviceCodesEngine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
            queryTokenizer: Bloodhound.tokenizers.nonword,
            local: []
        });

        serviceCodesEngine.promise = ServiceCode.all().then(function (codes) {
            return serviceCodesEngine.initialize().then(function () {
                serviceCodesEngine.add(codes);

                return serviceCodesEngine;
            });
        });

        return serviceCodesEngine;
    });
