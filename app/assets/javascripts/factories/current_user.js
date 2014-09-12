angular.module("moBilling.factories")

    .factory("currentUser", function (authenticationToken, User) {
        function CurrentUser() {}
        CurrentUser.prototype = new User();

        CurrentUser.prototype.signIn = function (user) {
            angular.extend(this, user);
            authenticationToken.set(this.authentication_token);
        };

        CurrentUser.prototype.signOut = function () {
            authenticationToken.set(undefined);
        };

        CurrentUser.prototype.init = function () {
            if (!this.$resolved) {
                this.refresh();
            }
            return this;
        };

        CurrentUser.prototype.refresh = function () {
            this.$promise = this.$get();
            return this;
        };

        CurrentUser.prototype.clear = function () {
            delete this.id;
            delete this.name;
            delete this.email;
            delete this.authentication_token;
            delete this.agent_id;
            delete this.specialties;
            delete this.pin;
        };

        return new CurrentUser();
    });
