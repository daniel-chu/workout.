$(document).ready(function() {
    var $registerButton = $('#registerButton');
    var $registerCancel = $('#registerCancel');
    var $allRegisterButtons = $('#register-window button');
    var $registerMessage = $('#message-register');

    function registerSubmit() {
        $allRegisterButtons.prop('disabled', true);
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
                $registerMessage.hide();
                if (response['status'] === 'error') {
                    $allRegisterButtons.prop('disabled', false);
                    $registerMessage.text(response['error']).show()
                        .effect("shake", { direction: "up", times: 3, distance: 2 });
                } else if (response['status'] === 'success') {
                    PageNavigationUtil.goToLoginPage(function() {
                        $('#message-login').text('Registration successful! You can now login.').fadeIn(600);
                    });
                }
            })
            .fail(function(response) {
                $allRegisterButtons.prop('disabled', false);
            });
    }

    $registerButton.on('click', registerSubmit);

    $registerCancel.on('click', function() {
        PageNavigationUtil.goToLoginPage();
    })

    $('#register-window .enter-to-submit').on('keydown', function(event) {
        if ($registerButton.prop('disabled') == undefined || $registerButton.prop('disabled') == false) {
            if (event.which == 13) {
                registerSubmit();
            }
        }
    });



});
