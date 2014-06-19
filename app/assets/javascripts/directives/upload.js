angular.module("moBilling.directives.upload", [])

    .directive("upload", function () {
	return {
            restrict: "A",
            scope: {
                upload: "="
            },
	    link: function (scope, element, attributes) {
                element.change(function (event) {
                    if (event.target.files.length) {
                        scope.upload = event.target.files[0];
                        scope.$apply();
                    }

                    element.wrap("<form>");
                    element.get(0).parentNode.reset();
                    element.unwrap("<form>");
                });
	    }
	};
    });
