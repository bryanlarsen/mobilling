angular.module("moBilling.services.apiInterceptor", [])

    .service("apiInterceptor", function ($q) {
        return {
            response: function (response) {
                var resourceName = response.config.resourceName;

                if (resourceName) {
                    return response.data[resourceName];
                } else {
                    return response;
                }
            },

            responseError: function (response) {
                if (response.status === 422 && response.data.errors) {
                    return $q.reject(response.data.errors);
                } else {
                    return $q.reject(response);
                }
            }
        };
    });
