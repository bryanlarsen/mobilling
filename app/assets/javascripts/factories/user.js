angular.module("moBilling.factories.user", [])

    .factory("User", function ($http) {
        function User(attributes) {
            angular.extend(this, attributes);
        }

        User.fetch = function (force) {
            return $http({
                url: "/v1/user.json",
                method: "GET",
                params: { auth: localStorage.getItem("authenticationToken") },
                cache: !force
            }).then(function (response) {
                // console.log(response);
            });
        };

        User.prototype.save = function () {
            var user = this;

            this.saving = true;

            return $http({
                url: "/v1/user.json",
                method: "POST",
                data: { user: user }
            }).success(function (response) {
                user.saving = false;
                angular.extend(user, response.users);
            }).error(function (response) {
                user.saving = false;
                angular.extend(user, response);
            });
        };

        User.prototype.toJSON = function () {
            return {
                email: this.email,
                name: this.name,
                password: this.password
            };
        };

        return User;
    });
