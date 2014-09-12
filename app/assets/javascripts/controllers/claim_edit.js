 angular.module("moBilling.controllers")

    .controller("ClaimEditController", function ($scope, $location, $route, $anchorScroll, claim, Claim, claims, hospitals, diagnoses, serviceCodes, detailsGenerator) {
        // HACK: Do not reload the current template if it is not necessary
        var lastRoute = $route.current;

        $scope.$on("$locationChangeSuccess", function () {
            if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
                $scope.$emit("loaded");
                $route.current = lastRoute;
            }
        });
        // KCAH

        $scope.claims = claims;
        $scope.claim = claim;

        $scope.hospitals = {
            displayKey: "name",
            source: hospitals.ttAdapter(),
            templates: {
                suggestion: function (context) {
                    return "<p class='needsclick'>" + context.name + "</p>";
                }
            }
        };

        $scope.diagnoses = {
            displayKey: "name",
            source: diagnoses.ttAdapter(),
            templates: {
                suggestion: function (context) {
                    return "<p class='needsclick'>" + context.name + "</p>";
                }
            }
        };

        $scope.serviceCodes = {
            displayKey: "name",
            source: serviceCodes.ttAdapter(),
            templates: {
                suggestion: function (context) {
                    return "<p class='needsclick'>" + context.name + "</p>";
                }
            }
        };

        $scope.isSimplifiedTemplate = function () {
            return ["surgical_assist", "psychotherapist", "anesthesiologist"].indexOf(claim.specialty) !== -1;
        };

        if (!claim.comments) {
            claim.comments = [];
        }

        if (!claim.diagnoses) {
            claim.diagnoses = [{ name: "" }];
        }

        if (!claim.status) {
            claim.status = "saved";
        }

        if (!$scope.isSimplifiedTemplate() && claim.most_responsible_physician === undefined) {
            claim.most_responsible_physician = true;
        }

        claim.daily_details || (claim.daily_details = []);

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
                claim.icu_transfer = false;
            }
        });

        $scope.$watch("claim.icu_transfer", function (value) {
            if (value) {
                claim.first_seen_consult = false;
            }
        });

        $scope.$watch("claim.procedure_on", function (value) {
            if (value) {
                if (claim.daily_details.length === 0) {
                    claim.daily_details.push({ day: value, autogenerated: false });
                } else if (claim.daily_details.length === 1) {
                    claim.daily_details[0].day = value;
                }
            }
        });

        $scope.isConsultVisible = function () {
            return !$scope.isSimplifiedTemplate()
                && (claim.admission_on === claim.first_seen_on && claim.first_seen_consult
                    || claim.admission_on !== claim.first_seen_on && claim.first_seen_consult && !claim.most_responsible_physician
                    || claim.admission_on !== claim.first_seen_on && claim.first_seen_consult && claim.most_responsible_physician && !claim.icu_transfer);
        };

        $scope.$watch($scope.isConsultVisible, function (isConsultVisible) {
            if (!isConsultVisible) {
                claim.consult_type           = undefined;
                claim.consult_premium_visit  = undefined;
                claim.consult_premium_travel = undefined;
                claim.consult_time_in        = undefined;
                claim.consult_time_out       = undefined;
            }
        });

        function back() {
            var hash = {
                saved:                     "saved",
                unprocessed:               "submitted",
                processed:                 "submitted",
                rejected_doctor_attention: "rejected",
                rejected_admin_attention:  "rejected",
                paid:                      "paid"
            }[claim.status];

            $location.path("/claims").hash(hash).replace();
        }

        $scope.cancel = back;

        function error() {
            $scope.submitting = false;
        }

        $scope.save = function () {
            $scope.submitting = true;
            Claim.save(claim, back, error);
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
                claim.status = "unprocessed";
                Claim.save(claim, back, error);
            } else {
                showError();
            }
        };

        $scope.generate = function () {
            var generated, custom;

            generated = detailsGenerator(claim);

            custom = claim.daily_details.filter(function (detail) {
                return !detail.autogenerated;
            });

            claim.daily_details = generated.concat(custom);
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

            existing = claim.daily_details.filter(function (detail) {
                return detail.autogenerated;
            });

            generated = detailsGenerator(claim);

            $scope.isGenerateDisabled = angular.equals(generated.sort(sortDetails), existing.sort(sortDetails));
        });

        $scope.minConsultTime = function () {
            return {
                comprehensive_er: 75,
                comprehensive_non_er: 75,
                special_er: 50,
                special_non_er: 50
            }[claim.consult_type];
        };
    });
