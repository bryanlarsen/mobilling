angular.module("moBilling.factories")

    .factory("specialties", function () {
        return [
            { name: "family_medicine" },
            { name: "anesthesiologist" },
            { name: "surgical_assist" },
            { name: "psychotherapist" },
            { name: "internal_medicine" },
            { name: "cardiology" }
        ];
    });
