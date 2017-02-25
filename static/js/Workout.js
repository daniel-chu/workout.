var Workout = (function() {

    var $workoutContainer = $('#all-workouts-container');

    function renderGivenWorkout(config) {
        var $newWorkoutDiv = $('<div>').addClass('row')
            .load('/static/html/item-structures/workout-item.html', function() {
                $newWorkoutDiv.find('.workout-date-header').text(config.dateString);
                $workoutContainer.append($newWorkoutDiv);
            });
    }

    return {
        createNewWorkout: function() {
            var dateString = GeneralUtil.getMonthDayYear(new Date());
            var $newWorkoutDiv = $('<div>').addClass('row')
                .load('/static/html/item-structures/workout-item.html', function() {

                    $newWorkoutDiv.find('.workout-date-header').text(dateString);
                    $newWorkoutDiv.find('.add-set-button').prop('disabled', true);
                    $newWorkoutDiv.hide();
                    $workoutContainer.prepend($newWorkoutDiv);
                    $newWorkoutDiv.slideDown(200);

                    $.ajax({
                            type: 'POST',
                            url: '/addWorkoutSession',
                            data: {
                                'dateString': dateString,
                                'dateNumber': new Date().getTime()
                            }
                        })
                        .done(function(response) {
                            $newWorkoutDiv.find('.add-set-button').prop('disabled', false);
                        });
                });
        },
        //TODO render only a certain amount, load more as you scroll
        renderMultipleWorkoutSessions: function(listOfWorkoutSessions) {
            $('#all-workouts-container').hide()
            for (var i = 0; i < listOfWorkoutSessions.length; i++) {
                renderGivenWorkout(listOfWorkoutSessions[i]);
            }
            $('#all-workouts-container').fadeIn(500);
        }
    }
})();
