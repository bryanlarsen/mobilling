angular.module("moBilling.services")

    .service("virtualKeyboard", function ($window) {
        var virtualKeyboard = this;

        function close() {
            if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard && $window.cordova.plugins.Keyboard.close) {
                $window.cordova.plugins.Keyboard.close();
            }
        }

        virtualKeyboard.close = close;
    });
