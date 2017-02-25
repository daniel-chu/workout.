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
});
