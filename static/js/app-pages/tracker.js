$(document).ready(function() {

    var $exerciseNameInput = $('#exercise-name-input');
    var $weightOrDistSelector = $('#weight-or-dist-selector');
    var $repsOrTimeSelector = $('#reps-or-time-selector');
    $exerciseNameInput.selectpicker();
    $repsOrTimeSelector.selectpicker();
    $weightOrDistSelector.selectpicker();

    // TODO fix css for zoom in breaking modal -> .modal.fade.in { top: auto } issue

    function handleCreateNewExercise() {
        if ($('#create-exercise-option').length > 0) {
            $('#create-exercise-option').remove();
        }
        if ($('.no-results').length > 0) {
            $('.no-results').remove();
            var $dropdownMenu = $('.dropdown-menu.inner');
            var $createExerciseListItem = $('<li>').attr('id', 'create-exercise-option').addClass('active');
            var $innerLink = $('<a>');
            var $optionText = $('<span>').addClass('text').text('"' + $('.bs-searchbox>input').val() + '" will be created*');
            $innerLink.append($optionText);
            $createExerciseListItem.append($innerLink);
            $dropdownMenu.append($createExerciseListItem);

            $('#create-exercise-option').on('click', function() {
                var newExerciseName = $('.bs-searchbox>input').val();
                $exerciseNameInput.append($('<option>').text(newExerciseName));
                $exerciseNameInput.selectpicker('refresh');
                $exerciseNameInput.selectpicker('val', newExerciseName);
            });
        }
    }

    function submitNewSet() {
        var workoutIdToAddTo = $('#add-set-popup').data('workoutId');
        $('#add-set-popup').modal('hide');
        Sets.handleNewSetInWorkout(workoutIdToAddTo);
    }

    function changeOptionsForExercise(exerciseName) {
        $.ajax({
                type: 'GET',
                url: '/retrieveExerciseOptions',
                data: {
                    'exerciseName': exerciseName
                }
            })
            .done(function(response) {
                if (response['status'] === 'success') {
                    var optionOneToChangeTo = response['optionOneType'];
                    var optionTwoToChangeTo = response['optionTwoType'];
                    $weightOrDistSelector.selectpicker('val', optionOneToChangeTo);
                    $repsOrTimeSelector.selectpicker('val', optionTwoToChangeTo);
                }
            })
    }

    $('#exercise-select-picker-container').on('click', function() {
        $('.bs-searchbox>input').off('input', handleCreateNewExercise).on('input', handleCreateNewExercise);
        if ($('.no-results').length == 0) {
            $('#create-exercise-option').remove();
        }
    });

    $('#exercise-name-input').on('change', function() {
        changeOptionsForExercise($('#exercise-name-input').val());
    });

    $('#add-workout-button').on('click', function() {
        Workout.createNewWorkout();
    });

    $repsOrTimeSelector.on('change', function() {
        var value = $repsOrTimeSelector.find(":selected").text();
        $('#reps-or-time-input').attr('placeholder', value);
    });

    $repsOrTimeSelector.on('change', function() {
        $('#reps-or-time-input').val('');
    });

    $weightOrDistSelector.on('change', function() {
        var value = $weightOrDistSelector.find(':selected').text();
        $('#weight-or-dist-input').attr('placeholder', value);
        if (window.matchMedia('(max-width: 767px)').matches) {
            if (value == 'distance*') {
                $('button[data-id="weight-or-dist-selector"]').css('font-size', '11px');
            }
        }
        if (value !== 'distance*') {
            $('button[data-id="weight-or-dist-selector"]').css('font-size', '14px');
        }
    });

    $weightOrDistSelector.on('change', function() {
        $('#weight-or-dist-input').val('');
    });

    $('#submit-set-info-button').on('click', submitNewSet);

    $('#add-set-popup .enter-to-submit').on('keydown', function(event) {
        if ($('#submit-set-info-button').prop('disabled') == undefined || $('#submit-set-info-button').prop('disabled') == false) {
            if (event.which == 13) {
                submitNewSet();
            }
        }
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

    $.ajax({
            type: 'GET',
            url: '/getExercisesForUser'
        })
        .done(function(response) {
            if (response['status'] === 'success') {
                var allUserExercises = JSON.parse(response['allExercisesForUser']);
                for (var i = 0; i < allUserExercises.length; i++) {
                    $exerciseNameInput.append($('<option>').text(allUserExercises[i]['name']));
                }
                $exerciseNameInput.selectpicker('refresh');
            }
        });
});
