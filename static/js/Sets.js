var Sets = (function() {

    var $setsContainer = $('.sets-container');

    function createNewExerciseSection(exerciseDivFullId, exerciseName, optionOneType,
        optionOneValue, optionTwoType, optionTwoValue) {
        console.log('CREATING NEW SECTION');
    }

    function addToExistingExerciseSection($exerciseToAddTo, optionOneType,
        optionOneValue, optionTwoType, optionTwoValue) {
        console.log('ADDING TO EXISTING SECTION');
    }

    return {
        handleNewSetInWorkout: function(workoutId) {
            //TODO add the set to workout if exercise not already there
            var $workoutDivToAddTo = $('#ws' + workoutId);

            var exerciseName = $('#exercise-name-input').val();
            var optionOneType = 'weight';
            var optionOneValue = $('#weight-or-dist-input').val();
            var optionTwoType = $('#reps-or-time-selector').val();
            var optionTwoValue = $('#reps-or-time-input').val();

            var repsOrTime = $('#reps-or-time-input').val();
            $.ajax({
                    type: 'POST',
                    url: '/addNewSet',
                    data: {
                        'workoutId': workoutId,
                        'exerciseName': exerciseName,
                        'optionOneType': optionOneType,
                        'optionOneValue': optionOneValue,
                        'optionTwoType': optionTwoType,
                        'optionTwoValue': optionTwoValue,
                        'dateTimePerformed': new Date().getTime()
                    }
                })
                .done(function(response) {
                    var exerciseId = response['exerciseId'];
                    var exerciseDivFullId = 'ws' + workoutId + '_ex' + exerciseId;
                    var $exerciseInWorkoutToAddTo = $('#' + exerciseDivFullId);
                    if ($exerciseInWorkoutToAddTo.length == 0) {
                        createNewExerciseSection(exerciseDivFullId, exerciseName, optionOneType, optionOneValue,
                            optionTwoType, optionTwoValue);
                    } else {
                        addToExistingExerciseSection($exerciseInWorkoutToAddTo, optionOneType, optionOneValue,
                            optionTwoType, optionTwoValue);
                    }
                });

        }
    }
})();
