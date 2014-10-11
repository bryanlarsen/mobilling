angular.module("moBilling.controllers")

    .controller("ClaimListController", function ($scope, $route, $location, $anchorScroll, claims, user, Claim) {
        // HACK: Do not reload the current template if it is not necessary
        var lastRoute = $route.current;

        $scope.$on("$locationChangeSuccess", function () {
            if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
                $scope.$emit("loaded");
                $scope.initialize();
                $route.current = lastRoute;
            }
        });
        // KCAH

        $scope.reorder = function (orderBy) {
            $scope.orderBy = orderBy;
        };

        $scope.isActiveStep = function (step) {
            return $scope.step === step;
        };

        $scope.setActiveStep = function (step) {
            $scope.step = step;
            $location.hash(step).replace();
            $anchorScroll();
        };

        $scope.edit = function (claim) {
            if (["saved", "rejected_doctor_attention", "rejected_admin_attention"].indexOf(claim.status) !== -1) {
                $location.path("/claims/" + claim.id + "/edit").hash("");
            } else {
                $location.path("/claims/" + claim.id).hash("");
            }
        };

        $scope.removeConfirm = function (claim) {
            if (claim.status === "saved") {
                $scope.selectedClaim = claim;
                $scope.toggle("remove");
            }
        };

        $scope.removeOk = function () {
            Claim.remove({ id: $scope.selectedClaim.id }, $route.reload, $route.reload);
        };

        $scope.removeCancel = function () {
            $scope.selectedClaim = undefined;
        };

        $scope.initialize = function () {
            $scope.orderBy = "-number";
            $scope.step = $location.hash();

            if (!$scope.step || !/^(saved|submitted|rejected|paid)$/.test($scope.step)) {
                $scope.setActiveStep("saved");
            }

            $scope.user = user;

            $scope.statuses = {
                saved: ["saved"],
                submitted: ["unprocessed", "processed"],
                rejected: ["rejected_doctor_attention", "rejected_admin_attention"],
                paid: ["paid"]
            }[$scope.step];

            $scope.claims = claims.filter(function (claim) {
                return $scope.statuses.indexOf(claim.status) !== -1;
            });
        };

        $scope.initialize();
    });
