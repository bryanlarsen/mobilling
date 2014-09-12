angular.module("moBilling.factories")

    .factory("Photo", function ($resource, upload, API_URL, authenticationToken) {
        var Photo = $resource(API_URL + "/v1/photos/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return authenticationToken.get();
            }
        });

        Photo.upload = function (file) {
            return upload(file, API_URL + "/v1/photos.json?auth=" + auth.user ? auth.user.authentication_token : "", {
                fileKey: "photo[file]"
            });
        };

        return Photo;
    });
