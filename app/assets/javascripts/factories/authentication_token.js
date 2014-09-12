angular.module("moBilling.factories")

    .factory("authenticationToken", function () {
        var localStorage = window.localStorage;

        return {
            get: function () {
                return localStorage.getItem("authenticationToken");
            },
            set: function (token) {
                if (!token) {
                    localStorage.removeItem("authenticationToken");
                } else {
                    localStorage.setItem("authenticationToken", token);
                }
            }
        };
    });
