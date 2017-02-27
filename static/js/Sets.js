var Sets = (function() {

    function createNewExerciseSection(workoutId, exerciseDivFullId, exerciseName, optionOneType,
        optionOneValue, optionTwoType, optionTwoValue, callback) {
        callback = callback || function() { /*empty function*/ };
        var $newExerciseDiv = $('<div>').addClass('well').attr('id', exerciseDivFullId)
            .load('/static/html/item-structures/exercise-in-set-item.html', function() {
                initExerciseContainer($newExerciseDiv);
                $newExerciseDiv.find('.exercise-name-section').text(exerciseName);
                var $newSet = createSetListItem(optionOneType, optionOneValue, optionTwoType, optionTwoValue);
                $newExerciseDiv.find('.set-info-section .set-list').append($newSet);
                (callback)();
            });
        $('#ws' + workoutId).find('.sets-container').append($newExerciseDiv);
    }

    function addToExistingExerciseSection($exerciseToAddTo, optionOneType,
        optionOneValue, optionTwoType, optionTwoValue) {
        var $newSet = createSetListItem(optionOneType, optionOneValue, optionTwoType, optionTwoValue);
        $exerciseToAddTo.find('.set-info-section .set-list').append($newSet);
    }

    function initExerciseContainer($exerciseDiv) {
        //TODO add anything that needs to be initialized for each exercise
    }

    function createSetListItem(optionOneType, optionOneValue, optionTwoType, optionTwoValue) {
        var optionOneUnits;
        var optionTwoUnits;
        var connectorWord;

        var $newSet = $('<li>').addClass('set-info-list-item');
        if (optionOneType === 'weight') {
            //TODO provide option for kg
            optionOneUnits = 'lbs';
            if (optionTwoType === 'reps') {
                connectorWord = 'x';
                optionTwoUnits = 'reps';
            } else if (optionTwoType === 'time') {
                connectorWord = 'for';
                optionTwoUnits = '';
            }
        } else if (optionOneType === 'distance') {
            //TODO provide option for km
            optionOneUnits = 'mi.'
            if (optionTwoType === 'reps') {
                connectorWord = 'for';
                optionTwoUnits = 'reps';
            } else if (optionTwoType === 'time') {
                connectorWord = 'in';
                optionTwoUnits = '';
            }
        }
        var dataString = optionOneValue + " " + optionOneUnits + " " + connectorWord + " " + optionTwoValue + " " + optionTwoUnits;
        $newSet.text(dataString);
        return $newSet;
    }

    function renderAllSets(listOfSetConfigs, curIndex) {
        if (curIndex < listOfSetConfigs.length) {
            var setConfig = listOfSetConfigs[curIndex];
            var workoutId = setConfig['workoutId'];
            var exerciseId = setConfig['exerciseId'];
            var exerciseName = setConfig['exerciseName'];
            var optionOneType = setConfig['optionOneType'];
            var optionOneValue = setConfig['optionOneValue'];;
            var optionTwoType = setConfig['optionTwoType'];;
            var optionTwoValue = setConfig['optionTwoValue'];;

            var exerciseDivFullId = "ws" + workoutId + "_ex" + exerciseId;
            var $exerciseInWorkoutToAddTo = $('#' + exerciseDivFullId);
            if ($exerciseInWorkoutToAddTo.length == 0) {
                createNewExerciseSection(workoutId, exerciseDivFullId, exerciseName, optionOneType,
                    optionOneValue, optionTwoType, optionTwoValue,
                    function() {
                        renderAllSets(listOfSetConfigs, curIndex + 1);
                    });
            } else {
                addToExistingExerciseSection($exerciseInWorkoutToAddTo, optionOneType, optionOneValue,
                    optionTwoType, optionTwoValue);
                renderAllSets(listOfSetConfigs, curIndex + 1);
            }
        }
    }

    return {
        handleNewSetInWorkout: function(workoutId) {
            var exerciseName = $('#exercise-name-input').val();
            var optionOneType = $('#weight-or-dist-selector').val();
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
                        createNewExerciseSection(workoutId, exerciseDivFullId, exerciseName, optionOneType, optionOneValue,
                            optionTwoType, optionTwoValue);
                    } else {
                        addToExistingExerciseSection($exerciseInWorkoutToAddTo, optionOneType, optionOneValue,
                            optionTwoType, optionTwoValue);
                    }
                });
        },

        loadExistingSets: function(workoutId) {
            $.ajax({
                    type: 'GET',
                    url: '/getSets',
                    data: {
                        'workoutId': workoutId
                    }
                })
                .done(function(response) {
                    if (response['status'] === 'success') {
                        var allSetsInWorkout = JSON.parse(response['setsInWorkout']);
                        if (allSetsInWorkout.length > 0) {
                            renderAllSets(allSetsInWorkout, 0);
                        }
                    }
                });
        }
    }
})();
