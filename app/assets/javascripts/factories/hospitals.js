angular.module("moBilling.factories.hospitals", [])

    .factory("hospitals", function (API_URL) {
        var hospitals = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: API_URL + "/v1/hospitals.json",
                filter: function (response) {
                    return response.map(function (name) {
                        return { name: name };
                    });
                }
            }
        });

        hospitals.initialize();

        window.H = hospitals;

        return hospitals;
    });
