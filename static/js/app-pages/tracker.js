$(document).ready(function() {

    var $repsOrTimeSelector = $('#reps-or-time-selector');
    $repsOrTimeSelector.selectpicker();

    $('#add-workout-button').on('click', function() {
        Workout.createNewWorkout();
    });

    $repsOrTimeSelector.on('change', function() {
        var value = $repsOrTimeSelector.find(":selected").text()
        $('#reps-or-time-input').attr('placeholder', value);
    });

    $('#submit-set-info-button').on('click', function() {
        // TODO send to database and add to UI

    });

    $.ajax({
            type: 'POST',
            url: '/getWorkoutSessions'
        })
        .done(function(response) {
            if (response['status'] === 'success') {
                var allWorkoutSessions = JSON.parse(response['allWorkoutSessions']);
                //TODO do this
                Workout.renderMultipleWorkoutSessions(allWorkoutSessions);
            }
        });
});
