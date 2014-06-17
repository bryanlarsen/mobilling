//= require_tree ./templates

angular.module("moBilling", ["ngRoute", "mobile-angular-ui", "templates"])

    .config(function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "main.html"
        });

        $routeProvider.otherwise({
            redirectTo: "/"
        });
    });
