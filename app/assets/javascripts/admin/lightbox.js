$.fn.lightbox = function () {
    return this.each(function (_, element) {
        $(element).on("click", function (event) {
            var lightbox = $(element).data("lightbox") || $(element).attr("src");
            $("#lightbox .modal-body").html($("<img>").attr({ src: lightbox, width: "100%" }));
            $("#lightbox").modal();
            event.preventDefault();
        });
    });
};
