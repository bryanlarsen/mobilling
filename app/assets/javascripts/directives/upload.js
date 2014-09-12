angular.module("moBilling.directives")

    .directive("mbUpload", function () {
	return {
            restrict: "A",
	    link: function (scope, element, attributes) {
                element.click(function (event) {
                    if (navigator.camera && navigator.camera.getPicture) {
                        navigator.camera.getPicture(function (file) {
                            scope.$emit("unlock"); // prevent locking screen
                            scope.$parent[attributes.mbUpload] = file;
                            scope.$parent.$apply();
                        }, function (error) {
                            // add some error handling
                        }, {
                            destinationType: 1 // Return image file URI
                        });
                        event.preventDefault();
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
