angular.module("moBilling.directives")

    .directive("mbUpload", function ($timeout) {
	return {
            restrict: "A",
	    link: function (scope, element, attributes) {
                // camera triggers pause event - we need to
                // unlock screen explicitely here
                function unlock() {
                    scope.$emit("unlock");
                }

                element.click(function (event) {
                    if (navigator.camera && navigator.camera.getPicture) {
                        event.preventDefault();

                        navigator.notification.confirm("Would you like to take a new photo or choose an existing one from the library?", function (index) {
                            var sourceType = [undefined, 1, 0][index];

                            if (sourceType !== undefined) {
                                navigator.camera.getPicture(function (file) {
                                    scope.$parent[attributes.mbUpload] = file;
                                    scope.$parent.$apply();
                                    $timeout(unlock);
                                }, function (error) {
                                    // add some error handling
                                    $timeout(unlock);
                                }, {
                                    quality: 75,
                                    sourceType: sourceType,
                                    destinationType: 1 // Return image file URI
                                });
                            }
                        }, "Select source", ["Take a photo", "Photo library", "Cancel"]);
                    }
                });

                element.change(function (event) {
                    if (event.target.files.length) {
                        scope.$parent[attributes.mbUpload] = event.target.files[0];
                        scope.$parent.$apply();
                    }

                    element.wrap("<form>");
                    element.get(0).parentNode.reset();
                    element.unwrap("<form>");
                });
	    }
	};
    });
