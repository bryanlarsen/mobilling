angular.module("moBilling.controllers.claimEdit", [])

    .controller("ClaimEditController", function ($scope, $location, $route, $anchorScroll, claim, claims, Claim, detailsGenerator) {
        // HACK: Do not reload the current template if it is not needed.
        var lastRoute = $route.current;

        $scope.$on("$locationChangeSuccess", function () {
            $scope.loading = false;
            if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
                $route.current = lastRoute;
            }
        });
        // KCAH

        $scope.claim = claim.toJSON();

        if (!$scope.claim.comments) {
            $scope.claim.comments = [];
        }

        if (!$scope.claim.status) {
            $scope.claim.status = "saved";
        }

        if ($scope.claim.most_responsible_physician === undefined) {
            $scope.claim.most_responsible_physician = true;
        }

        $scope.claim.daily_details || ($scope.claim.daily_details = []);

        $scope.isActiveStep = function (step) {
            return $scope.step === step;
        };

        $scope.setActiveStep = function (step) {
            $scope.step = step;
            $location.hash(step).replace();
            $anchorScroll();
        };

        $scope.step = $location.hash();

        if (!$scope.step || !/^(claim|consult|details|comments)$/.test($scope.step)) {
            $scope.setActiveStep("claim");
        }

        $scope.$watch("claim.first_seen_consult", function (value) {
            if (value) {
                $scope.claim.icu_transfer = false;
            }
        });

        $scope.$watch("claim.icu_transfer", function (value) {
            if (value) {
                $scope.claim.first_seen_consult = false;
            }
        });

        $scope.isConsultVisible = function () {
            return $scope.claim.admission_on === $scope.claim.first_seen_on && $scope.claim.first_seen_consult
                || $scope.claim.admission_on !== $scope.claim.first_seen_on && $scope.claim.first_seen_consult && !$scope.claim.most_responsible_physician
                || $scope.claim.admission_on !== $scope.claim.first_seen_on && $scope.claim.first_seen_consult && $scope.claim.most_responsible_physician && !$scope.claim.icu_transfer;
        };

        $scope.$watch($scope.isConsultVisible, function (isConsultVisible) {
            if (!isConsultVisible) {
                $scope.claim.consult_type = undefined;
                $scope.claim.consult_premium_visit = undefined;
                $scope.claim.consult_premium_travel = undefined;
                $scope.claim.consult_time_in = undefined;
                $scope.claim.consult_time_out = undefined;
            }
        });

        $scope.cancel = function () {
            var path = {
                saved: "saved",
                unprocessed: "submitted",
                processed: "submitted",
                rejected_doctor_attention: "rejected",
                rejected_admin_attention: "rejected",
                paid: "paid"
            }[$scope.claim.status];

            $location.path("/claims/" + path).hash("").replace();
        };

        $scope.save = function () {
            $scope.submitting = true;
            Claim.save($scope.claim, function () {
                if ($scope.claim.status === "rejected_doctor_attention") {
                    $location.path("/claims/rejected").hash("").replace();
                } else {
                    $location.path("/claims/saved").hash("").replace();
                }
            }, function () {
                $scope.submitting = false;
            });
        };

        $scope.remove = function () {
            $scope.submitting = true;
            Claim.remove({ id: $scope.claim.id }, function () {
                $location.path("/claims/saved").hash("").replace();
            }, function (error) {
                if (error.status === 404) {
                    $location.path("/claims/saved").hash("").replace();
                } else {
                    $scope.submitting = false;
                }
            });
        };

        function showError() {
            if ($scope.form.detailsForm.$invalid) {
                $scope.setActiveStep("details");
            }

            if ($scope.form.consultForm && $scope.form.consultForm.$invalid) {
                $scope.setActiveStep("consult");
            }

            if ($scope.form.claimForm.$invalid) {
                $scope.setActiveStep("claim");
            }
        }

        $scope.submit = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.submitting = true;
                $scope.claim.status = "unprocessed";
                Claim.save($scope.claim, function () {
                    $location.path("/claims/submitted").hash("").replace();
                }, function () {
                    $scope.submitting = false;
                });
            } else {
                showError();
            }
        };

        $scope.generate = function () {
            var generated, custom;

            generated = detailsGenerator($scope.claim);

            custom = $scope.claim.daily_details.filter(function (detail) {
                return !detail.autogenerated;
            });

            $scope.claim.daily_details = generated.concat(custom);
            $scope.setActiveStep("details");
        };

        function sortDetails(a, b) {
            var aString = a.day + a.code,
                bString = b.day + b.code;

            if (aString < bString) {
                return -1;
            } else if (aString > bString) {
                return 1;
            } else {
                return 0;
            }
        }

        $scope.$watchGroup([
            "claim.admission_on",
            "claim.first_seen_on",
            "claim.last_seen_on",
            "claim.most_responsible_physician",
            "claim.consult_type",
            "claim.consult_premium_visit",
            "claim.consult_premium_first",
            "claim.consult_premium_travel",
            "claim.icu_transfer",
            "claim.last_seen_discharge",
            "claim.daily_details",
            "claim.daily_details.length"
        ], function () {
            var existing, generated;

            existing = $scope.claim.daily_details.filter(function (detail) {
                return detail.autogenerated;
            });

            generated = detailsGenerator($scope.claim);

            $scope.isGenerateDisabled = angular.equals(generated.sort(sortDetails), existing.sort(sortDetails));
        });

        $scope.isER = function () {
            return /_er$/.test($scope.claim.consult_type) && !/_non_er$/.test($scope.claim.consult_type);
        };

        $scope.$watchGroup([
            "claim.first_seen_date",
            "claim.consult_type",
            "claim.consult_premium_visit"
        ], function () {
            var isER, others;

            isER = $scope.isER($scope.claim);

            others = claims.filter(function (claim) {
                return claim.id !== $scope.claim.id
                    && claim.first_seen_on === $scope.claim.first_seen_on
                    && $scope.isER($scope.claim) === isER
                    && claim.consult_premium_visit === $scope.claim.consult_premium_visit;
            });

            $scope.claim.consult_premium_number = others.length + 1;

            $scope.claim.consult_premium_first = others.filter(function (claim) {
                return claim.consult_premium_first;
            }).length === 0;
        });
    });
