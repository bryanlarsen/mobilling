angular.module("moBilling.factories")

    .factory("Photo", function ($resource, upload, API_URL, authenticationToken) {
        var Photo = $resource(API_URL + "/v1/photos/:id.json?auth=:auth", {
            id: "@id",
            auth: authenticationToken.get
        });

        Photo.upload = function (file) {
            return upload(file, API_URL + "/v1/photos.json?auth=" + authenticationToken.get(), {
                fileKey: "photo[file]"
            });
        };

        return Photo;
    });
