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

    var shiftDist = $('#title-container').width() / 2;
    $('#title-container').css('margin-left', 'calc(50% - ' + shiftDist + 'px)');
    $('#title-container').delay(500).fadeTo(100, 1, function() {

        if (window.location.hash == '#login') {
            PageNavigationUtil.goToLoginPage();
        } else {
            window.location.hash = '#login';
        }

        // don't think this is needed anymore

        // $.ajax({
        //         type: 'POST',
        //         url: '/',
        //         data: {}
        //     })
        //     .done(function(response) {
        //         if (response['status'] === 'error' && response['error'] === 'Not logged in.') {
        //             if (window.location.hash == '#login') {
        //                 PageNavigationUtil.goToLoginPage();
        //             } else {
        //                 window.location.hash = '#login';
        //             }
        //         } else if (response['status'] === 'success') {
        //             if (window.location.hash) {
        //                 PageNavigationUtil.navigateToHashUrl(window.location.hash);
        //             } else {
        //                 window.location.hash = "#tracker";
        //             }
        //         }
        //     });
    });
});
