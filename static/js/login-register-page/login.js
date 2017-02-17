$(document).ready(function() {
    var $loginButton = $('#loginButton');

    function loginSubmit() {
        $loginButton.attr('disable', true);
        $.ajax({
                type: 'POST',
                url: '/login',
                data: {
                    'username': $('#username').val(),
                    'password': $('#password').val()
                }
            })
            .done(function(response) {
                $loginButton.attr('disable', false);
                $('#error-message-login').hide()
                if (response['status'] == 'error') {
                    $('#error-message-login').text(response['error']).show()
                        .effect("shake", { direction: "up", times: 3, distance: 2 });
                } else {
                    // TODO manage session/login 
                    alert(response);
                }
            })
            .fail(function(response) {
                $loginButton.attr('disable', false);
            });
    }

    $loginButton.on('click', loginSubmit);

    $('#login-window .enter-to-submit').on('keydown', function(event) {
        if ($loginButton.attr('disable') == undefined || $loginButton.attr('disable') == 'false') {
            if (event.which == 13) {
                loginSubmit();
            }
        }
    });

});
