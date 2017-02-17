$(document).ready(function() {
    var $registerButton = $('#registerButton');
    var $registerPopup = $('#register-popup');

    function registerSubmit() {
        $registerButton.attr('disable', true);
        $.ajax({
                type: 'POST',
                url: '/registerUser',
                data: {
                    'name': $('#name-register').val(),
                    'email': $('#email-register').val(),
                    'username': $('#username-register').val(),
                    'password': $('#password-register').val(),
                    'passwordConfirm': $('#password-confirm-register').val()
                }
            })
            .done(function(response) {
                $registerButton.attr('disable', false);
                $('#error-message-register').hide();
                if (response['status'] == 'error') {
                    $('#error-message-register').text(response['error']).show()
                        .effect("shake", { direction: "up", times: 3, distance: 2 });
                } else {
                    // TODO manage session/login
                    $registerPopup.modal('hide');
                    alert(response);
                }
            })
            .fail(function(response) {
                $registerButton.attr('disable', false);
            });
    }

    $registerButton.on('click', registerSubmit);

    $('#register-popup .enter-to-submit').on('keydown', function(event) {
        if ($registerButton.attr('disable') == undefined || $registerButton.attr('disable') == 'false') {
            if (event.which == 13) {
                registerSubmit();
            }
        }
    });

});
