$(document).ready(function() {
    $.ajax({
            type: 'POST',
            url: '/getLog',
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
