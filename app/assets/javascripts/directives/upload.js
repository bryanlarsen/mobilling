angular.module("moBilling.directives.upload", [])

    .directive("mbUpload", function () {
	return {
            restrict: "A",
	    link: function (scope, element, attributes) {
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
