angular.module("moBilling.factories")

    .factory("User", function ($resource, API_URL) {
        var User = $resource(API_URL + "/v1/user.json?auth=:auth", {
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        },
        {
          update: {
              method: "PUT"
          }
      });

        return User;
    });
