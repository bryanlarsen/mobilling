angular.module("moBilling.directives.upload", [])

    .directive("upload", function () {
	return {
            restrict: "A",
	    link: function (scope, element, attributes) {
                var parent = scope.$parent;

                element.change(function (event) {
                    if (event.target.files.length) {
                        parent[attributes.upload] = event.target.files[0];
                        parent.$apply();
                    }

                    element.wrap("<form>");
                    element.get(0).parentNode.reset();
                    element.unwrap("<form>");
                });
	    }
	};
    });
