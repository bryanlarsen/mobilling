angular.module("moBilling.constants")

    .constant("API_URL", (window.ENV && window.ENV.API_URL) || "");
