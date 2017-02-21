$(document).ready(function() {
    $('#logout-button').on('click', function() {
        $.ajax({
                type: 'POST',
                url: '/logout',
                data: {}
            })
            .done(function() {
                if ($('#collapsible-navigationbar').hasClass('collapse in')) {
                    $('.navbar-toggle').click();
                    window.setTimeout(function() {
                        window.location.hash = "#login"
                    }, 300);
                } else {
                    window.location.hash = "#login"
                }
            });
    });

    $('.nav-bar-page-tab').on('click', function() {
        if ($('#collapsible-navigationbar').hasClass('collapse in')) {
            $('.navbar-toggle').click();
        }
    });
});
