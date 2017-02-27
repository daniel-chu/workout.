$(document).ready(function() {

    var $repsOrTimeSelector = $('#reps-or-time-selector');
    var $weightOrDistSelector = $('#weight-or-dist-selector');
    $repsOrTimeSelector.selectpicker();
    $weightOrDistSelector.selectpicker();

    $('#add-workout-button').on('click', function() {
        Workout.createNewWorkout();
    });

    $repsOrTimeSelector.on('change', function() {
        var value = $repsOrTimeSelector.find(":selected").text();
        $('#reps-or-time-input').attr('placeholder', value);
    });

    $weightOrDistSelector.on('change', function() {
        var value = $weightOrDistSelector.find(":selected").text();
        $('#weight-or-dist-input').attr('placeholder', value);
    })

    $('#submit-set-info-button').on('click', function() {
        var workoutIdToAddTo = $(this).parents('#add-set-popup').data('workoutId');
        $('#add-set-popup').modal('hide');
        Sets.handleNewSetInWorkout(workoutIdToAddTo);
    });

    $.ajax({
            type: 'GET',
            url: '/getWorkoutSessions'
        })
        .done(function(response) {
            if (response['status'] === 'success') {
                var allWorkoutSessions = JSON.parse(response['allWorkoutSessions']);
                Workout.renderMultipleWorkoutSessions(allWorkoutSessions);
            }
        });
});
