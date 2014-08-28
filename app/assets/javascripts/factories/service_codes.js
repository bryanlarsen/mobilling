angular.module("moBilling.factories")

    .factory("ServiceCode", function (API_URL, $resource) {
        return {
            initialize: function () {
                console.log("asd");

                return $resource(API_URL + "/v1/service_codes.json").query().$promise.then(function (names) {
                    console.log("asd2");

                    var datums = names.map(function (name) {
                        return { name: name };
                    });

                    var serviceCodes = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.nonword("name"),
                        queryTokenizer: Bloodhound.tokenizers.nonword,
                        local: datums
                    });

                    return serviceCodes.initialize().then(function () {
                        return serviceCodes;
                    });
                });
            }
        };
    });
