var pageLoadRequestSentAlreadyHashChangeTriggerUnneeded = false;

$(document).ready(function() {

    $(window).on('hashchange', function() {
        if (!pageLoadRequestSentAlreadyHashChangeTriggerUnneeded) {
            if (window.location.hash) {
                PageNavigationUtil.navigateToHashUrl(window.location.hash);
            }
        }
        pageLoadRequestSentAlreadyHashChangeTriggerUnneeded = false;
    });

    $('#fading-alert-message .close').on('click', function() {
        $('#fading-alert-message').hide();
    })

    var $titleContainer = $('#title-container');
    var shiftDist = $titleContainer.width() / 2;
    $titleContainer.css('margin-left', 'calc(50% - ' + shiftDist + 'px)');
    $titleContainer.delay(500).fadeTo(100, 1, function() {
        $.ajax({
                type: 'POST',
                url: '/',
                data: {}
            })
            .done(function(response) {
                if (response['status'] === 'error' && response['error'] === 'Not logged in.') {
                    if (window.location.hash == '#login') {
                        PageNavigationUtil.goToLoginPage();
                    } else {
                        window.location.hash = '#login';
                    }
                } else if (response['status'] === 'success') {
                    if (window.location.hash) {
                        PageNavigationUtil.navigateToHashUrl(window.location.hash);
                    } else {
                        window.location.hash = "#tracker";
                    }
                }
            });
    });
});
