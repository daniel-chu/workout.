var GeneralUtil = (function() {

    return {
        displayFadeWarning: function(message) {
            var $warningMessage = $('#fading-warning-message');
            $warningMessage.hide().stop({ clearQueue: true });

            $('#fading-warning-message p').text(message);
            $warningMessage.fadeIn(2000, function() {
                $warningMessage.delay(5000).fadeOut(2000);
            })
        },

        displayFadeInfo: function(message) {
            var $infoMessage = $('#fading-info-message');
            $infoMessage.hide().stop({ clearQueue: true });

            $('#fading-info-message p').text(message);
            $infoMessage.fadeIn(2000, function() {
                $infoMessage.delay(5000).fadeOut(2000);
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
            return month + ' ' + dayOfMonth + ', ' + year;
        }
    }

})();
