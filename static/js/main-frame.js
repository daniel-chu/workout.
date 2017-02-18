$(document).ready(function() {

    var shiftDist = $('#title-container').width() / 2;
    $('#title-container').css('margin-left', 'calc(50% - ' + shiftDist + 'px)');
    $('#title-container').delay(500).fadeTo(100, 1);

    $.ajax({
            type: 'POST',
            url: '/getWorkouts',
            data: {}
        })
        .done(function(response) {
            if (response['status'] === 'error' && response['error'] === 'Not logged in.') {
                PageNavigationUtil.goToLoginPage();
            } else if (response['status'] === 'success') {
                PageNavigationUtil.goToMainTrackerPage();
            }
        });
});
