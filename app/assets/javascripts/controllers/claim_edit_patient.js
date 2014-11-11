angular.module("moBilling.controllers")

    .controller("ClaimEditPatientController", function ($scope, $window, Photo) {
        var claim = $scope.claim;

        $scope.province_codes = [
            { name: 'Ontario', code: 'ON' },
            { name: 'Alberta', code: 'AB' },
            { name: 'British Columbia', code: 'BC' },
            { name: 'Manitoba', code: 'MB' },
            { name: 'Newfoundland and Labrador', code: 'NL' },
            { name: 'New Brunswick', code: 'NB' },
            { name: 'Northwest Territories', code: 'NT' },
            { name: 'Nova Scotia', code: 'NS' },
            { name: 'Prince Edward Island', code: 'PE' },
            { name: 'Saskatchewan', code: 'SK' },
            { name: 'Nunavut', code: 'NU' },
            { name: 'Yukon', code: 'YT' }
        ];

        function updatePhoto() {
            if (claim.photo_id) {
                Photo.get({ id: claim.photo_id }, function (photo) {
                    $scope.photo = photo;
                });
            }
        }
        updatePhoto();

        function success(data) {
            $scope.$emit("uploaded");
            claim.photo_id = data.id;
            updatePhoto();
        }

        function error() {
            $scope.$emit("uploaded");
        }

        $scope.$on('photoChanged', function(event, file) {
            $scope.$emit("uploading");
            Photo.upload(file).then(success, error);
        });
    });

