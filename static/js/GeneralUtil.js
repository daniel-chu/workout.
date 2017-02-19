var GeneralUtil = (function() {

    return {
        displayFadeAlert: function(message) {
            $alertMessage = $('#fading-alert-message');
            $alertMessage.hide().stop();

            $('#fading-alert-message p').text(message);
            $alertMessage.fadeIn(2000, function() {
                $alertMessage.delay(5000).fadeOut(2000);
            })
        }
    }
})();
