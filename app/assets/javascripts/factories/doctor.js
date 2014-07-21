angular.module("moBilling.factories.doctor", [])

    .factory("Doctor", function ($resource, API_URL) {
        var Doctor = $resource(API_URL + "/v1/doctor.json?auth=:auth", {
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