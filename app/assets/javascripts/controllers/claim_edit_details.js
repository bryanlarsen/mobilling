angular.module("moBilling.controllers")

    .controller("ClaimEditDetailsController", function ($scope, serviceCodes) {
        $scope.serviceCodes = {
            displayKey: "name",
            source: serviceCodes.ttAdapter(),
            templates: {
                suggestion: function (context) {
                    return "<p class='needsclick'>" + context.name + "</p>";
                }
            }
        };

        $scope.add = function (attributes) {
            $scope.claim.daily_details.push(angular.extend({ autogenerated: false }, attributes));
        };

        $scope.remove = function (detail) {
            var index = $scope.claim.daily_details.indexOf(detail);

            $scope.claim.daily_details.splice(index, 1);
        };

        $scope.isConsultTimeVisible = function (detail) {
            var code = detail.code || "";

            return ["A130A", "C130A", "A600A", "C600A", "A911A", "C911A", "A912A", "C912A"].indexOf(code) !== -1;
        };
    });
