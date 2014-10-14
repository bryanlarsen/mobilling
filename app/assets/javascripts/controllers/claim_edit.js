 angular.module("moBilling.controllers")

    .controller("ClaimEditController", function ($scope, $location, $route, $anchorScroll, claim, Claim, claims, hospitals, diagnoses, serviceCodes, detailsGenerator, $timeout, $q, feeGenerator) {
        // HACK: Do not reload the current template if it is not necessary
        var lastRoute = $route.current;

        $scope.$on("$locationChangeSuccess", function () {
            if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
                $scope.$emit("loaded");
                $route.current = lastRoute;
            }
        });
        // KCAH

        $scope.initialize = function () {
            $scope.claim = claim;
            $scope.claims = claims;
            $scope.submitted = false;
            $scope.submitting = false;

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

            if (!claim.comments) {
                claim.comments = [];
            }

            if (!claim.diagnoses) {
                claim.diagnoses = [{ name: "" }];
            }

            if (!claim.status) {
                claim.status = "saved";
            }

            if (!claim.patient_province) {
                claim.patient_province = "ON";
                claim.payment_program = "HCP";
            }

            if (!claim.patient_sex) {
                claim.patient_sex = "2";
            }

            if (!claim.payee) {
                claim.payee = "P";
            }

            if (!$scope.isSimplifiedTemplate() && claim.most_responsible_physician === undefined) {
                claim.most_responsible_physician = true;
            }


            if (!claim.hospital) {
                var last = claims.filter(function (claim) {
                    return claim.hospital;
                }).reverse()[0];

                if (last) {
                    claim.hospital = last.hospital;
                }
            }

            claim.daily_details || (claim.daily_details = []);

            $scope.step = $location.hash();

            if (!$scope.step || !/^(claim|consult|details|comments)$/.test($scope.step)) {
                $scope.setActiveStep("claim");
            }

            $scope.today = new Date().toISOString().slice(0,10);
        };

        $scope.$on("submitting", function () {
            $scope.submitted = true;
            $scope.submitting = true;
        });

        $scope.$on("submitted", function () {
            $scope.submitted = true;
            $scope.submitting = false;
        });

        $scope.$on("uploading", function () {
            $scope.uploading = true;
        });

        $scope.$on("uploaded", function () {
            $scope.uploading = false;
        });

        $scope.isSimplifiedTemplate = function () {
            return ["surgical_assist", "psychotherapist", "anesthesiologist"].indexOf(claim.specialty) !== -1;
        };

        $scope.isActiveStep = function (step) {
            return $scope.step === step;
        };

        $scope.setActiveStep = function (step) {
            $scope.step = step;
            $location.hash(step).replace();
            $anchorScroll();
        };

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
            $scope.$emit("submitted");
        }

        $scope.save = function () {
            $scope.$emit("submitting");
            Claim.save(claim, back, error);
        };

        function showError() {
            $scope.toggle("snackbar-error", "on");

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
                $scope.$emit("submitting");
                claim.status = "unprocessed";
                Claim.save(claim, back, error);
            } else {
                showError();
            }
        };

        $scope.generate = function () {
            var generated, custom;

            $scope.generating = true;

            $timeout(function () {
                generated = detailsGenerator(claim);

                custom = claim.daily_details.filter(function (detail) {
                    return !detail.autogenerated;
                });

                claim.daily_details = generated.concat(custom);
                $scope.setActiveStep("details");

                $scope.generating = false;
            });
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

        // FIXME:  watch list is incomplete
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

            $scope.generating = true;  // FIXME: race

            $q.all(generated.map(function (genDetail) {
                return feeGenerator(claim, genDetail);
            })).then(function () {
                $scope.isGenerateDisabled = angular.equals(generated.sort(sortDetails), existing.sort(sortDetails));
                $scope.generating = false;
            });
        });

        $scope.minConsultTime = function () {
            return {
                comprehensive_er: 75,
                comprehensive_non_er: 75,
                special_er: 50,
                special_non_er: 50
            }[claim.consult_type];
        };

        $scope.initialize();
    });
