angular.module("moBilling.factories.user", [])

    .factory("User", function ($resource, $q, apiInterceptor) {
        var User = $resource("/v1/user.json?auth=:auth", {
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        }, {
            get: {
                resourceName: "users",
                interceptor: apiInterceptor
            },
            save: {
                method: "POST",
                params: { auth: null },
                resourceName: "users",
                interceptor: apiInterceptor
            }
        });

        window.User = User;

        return User;
    });
