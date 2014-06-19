angular.module("moBilling.factories.photo", [])

    .factory("Photo", function ($resource, API_URL) {
        var Photo = $resource(API_URL + "/v1/photos/:id.json?auth=:auth", {
            id: "@id",
            auth: function () {
                return window.localStorage.getItem("authenticationToken");
            }
        });

        Photo.upload = function (file) {
            var photo = this,
                formData = new FormData();

            formData.append("photo[file]", file);

            return $.ajax({
                url: API_URL + "/v1/photos.json?auth=" + window.localStorage.getItem("authenticationToken"),
                contentType: false,
                data: formData,
                dataType: "json",
                processData: false,
                type: "POST"
            });
        };

        return Photo;
    });
