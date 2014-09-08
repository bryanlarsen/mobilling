angular.module("moBilling.factories")

    .factory("upload", function ($q) {
        function formData(file, url, options) {
            var formData = new window.FormData();

            formData.append(options.fileKey, file);

            Object.keys(options.params || {}).forEach(function (key) {
                formData.append(key, options.params[key]);
            });

            return $q(function (resolve, reject) {
                $.ajax(url, {
                    contentType: false,
                    data: formData,
                    dataType: "json",
                    processData: false,
                    type: "POST",
                    success: resolve,
                    error: reject
                });
            });
        }

        function fileTransfer(file, url, options) {
            var response,
                fileUploadOptions = new window.FileUploadOptions(),
                fileTransfer = new window.FileTransfer();

            return $q(function (resolve, reject) {
                fileTransfer.upload(file, url, function (result) {
                    try {
                        resolve(JSON.parse(result.response));
                    } catch (error) {
                        reject(result);
                    }
                }, function (result) {
                    try {
                        reject(JSON.parse(result.response));
                    } catch (error) {
                        reject(result);
                    }
                }, options);
            });
        }

        return window.FileTransfer ? fileTransfer : formData;
    });
