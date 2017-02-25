var Workout = (function() {

    var $workoutContainer = $('#all-workouts-container');

    return {
        createNewWorkout: function() {
            var $newWorkoutDiv = $('<div>').addClass('row').load('/static/html/item-structures/workout-item.html',
                function() {
                    $newWorkoutDiv.find('.workout-date-header').text(GeneralUtil.getMonthDayYear(new Date()));
                    $newWorkoutDiv.hide();
                    $workoutContainer.prepend($newWorkoutDiv);
                    $newWorkoutDiv.slideDown(200);
                }
            );
        }

    }


})();
