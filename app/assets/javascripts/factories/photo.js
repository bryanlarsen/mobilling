angular.module("moBilling.factories")

    .factory("Photo", function ($resource, upload, API_URL) {
        var Photo = $resource(API_URL + "/v1/photos/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        Photo.upload = function (file) {
            return upload(file, API_URL + "/v1/photos.json?auth=" + window.localStorage.getItem("authenticationToken"), {
                fileKey: "photo[file]"
            });
        };

        return Photo;
    });
