var GeneralUtil = (function() {

    return {
        displayFadeAlert: function(message) {
            $alertMessage = $('#fading-alert-message');
            $alertMessage.hide().stop();

            $('#fading-alert-message p').text(message);
            $alertMessage.fadeIn(2000, function() {
                $alertMessage.delay(5000).fadeOut(2000);
            })
        },

        getMonthDayYear: function(date) {
            var monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            var month = monthNames[date.getMonth()];
            var dayOfMonth = date.getDate();
            var year = date.getFullYear();
            return month + " " + dayOfMonth + ", " + year;
        }
    }

})();
