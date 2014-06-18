angular.module("moBilling.services.apiResponseTransformer", [])

    .factory("apiResponseTransformer", function () {
        function apiResponseTransformer(resourceName) {
            return function (response) {
                var data = angular.fromJson(response);

                return data[resourceName] || data;
            };
        };

        return apiResponseTransformer;
    });
