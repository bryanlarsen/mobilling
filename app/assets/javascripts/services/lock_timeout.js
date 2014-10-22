angular.module("moBilling.services")

    .service("lockTimeout", function ($rootScope, $timeout) {
        var lockTimeout = this;

        function start(ms) {
            ms || (ms = 15 * 60 * 1000);

            $timeout.cancel(lockTimeout.timeout);

            lockTimeout.timeout = $timeout(function () {
                $rootScope.$broadcast("lock");
            }, ms);
        }

        lockTimeout.start = start;
    });
