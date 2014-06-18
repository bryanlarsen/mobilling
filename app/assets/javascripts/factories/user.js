angular.module("moBilling.factories.user", [])

    .factory("User", function ($resource, $q, apiResponseTransformer) {
        var User = $resource("/v1/user.json?auth=:auth", {
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        }, {
            get: {
                transformResponse: apiResponseTransformer("users")
            },
            save: {
                method: "POST",
                params: { auth: null },
                transformResponse: apiResponseTransformer("users")
            }
        });

        return User;
    });
