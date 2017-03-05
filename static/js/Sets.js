var Sets = (function() {

    function createNewExerciseSection(setId, workoutId, exerciseDivFullId, exerciseName, optionOneType,
        optionOneValue, optionTwoType, optionTwoValue, callback) {
        callback = callback || function() { /*empty function*/ };
        var $newExerciseDiv = $('<div>').addClass('well').addClass('exerciseDiv').attr('id', exerciseDivFullId)
            .load('/static/html/item-structures/exercise-in-set-item.html', function() {
                initExerciseContainer($newExerciseDiv);
                $newExerciseDiv.find('.exercise-name-section').text(exerciseName);
                var $newSet = createSetListItem(optionOneType, optionOneValue, optionTwoType, optionTwoValue);
                var newSetFullId = exerciseDivFullId + "_st" + setId;
                $newSet.attr('id', newSetFullId);
                initSet($newSet);
                $newExerciseDiv.find('.set-info-section .set-list').append($newSet);
                (callback)();
            });
        $('#ws' + workoutId).find('.sets-container').append($newExerciseDiv);
    }

    function addToExistingExerciseSection(setId, $exerciseToAddTo, optionOneType,
        optionOneValue, optionTwoType, optionTwoValue) {
        var $newSet = createSetListItem(optionOneType, optionOneValue, optionTwoType, optionTwoValue);
        var newSetFullId = $exerciseToAddTo.attr('id') + "_st" + setId;
        $newSet.attr('id', newSetFullId);
        initSet($newSet);
        $exerciseToAddTo.find('.set-info-section .set-list').append($newSet);
    }

    function initExerciseContainer($exerciseDiv) {
        //TODO add anything that needs to be initialized for each exercise
    }

    function initSet($set) {
        $set.find('.remove-set-button').on('click', function() {
            removeSet($set);
        });
    }

    function removeSet($set) {
        var setFullId = $set.attr('id');
        var setToRemoveId = setFullId.substring(setFullId.indexOf("_st") + 3);
        $.ajax({
            type: 'POST',
            url: '/removeSet',
            data: {
                setId: setToRemoveId
            }
        });
        $set.animate({ opacity: 'toggle', height: 'toggle' }, 300, function() {
            $set.remove();
        });
        if ($set.siblings().length === 0) {
            var $parentExerciseDiv = $set.parents('.exerciseDiv');
            removeExerciseDiv($parentExerciseDiv);
        }

    }

    function removeExerciseDiv($exerciseDiv) {
        $exerciseDiv.animate({ opacity: 'toggle', height: 'toggle' }, 300, function() {
            $exerciseDiv.remove();
        });
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
        $newSet.append('<button type="button" class="close remove-set-button" style="display:none"><span>&times;</span></button>');
        return $newSet;
    }

    function renderAllSets(listOfSetConfigs, curIndex) {
        if (curIndex < listOfSetConfigs.length) {
            var setConfig = listOfSetConfigs[curIndex];
            var setId = setConfig['_id'];
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
                createNewExerciseSection(setId, workoutId, exerciseDivFullId, exerciseName, optionOneType,
                    optionOneValue, optionTwoType, optionTwoValue,
                    function() {
                        renderAllSets(listOfSetConfigs, curIndex + 1);
                    });
            } else {
                addToExistingExerciseSection(setId, $exerciseInWorkoutToAddTo, optionOneType, optionOneValue,
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
                    var setId = response['setId'];
                    var exerciseId = response['exerciseId'];
                    var exerciseDivFullId = 'ws' + workoutId + '_ex' + exerciseId;
                    var $exerciseInWorkoutToAddTo = $('#' + exerciseDivFullId);
                    if ($exerciseInWorkoutToAddTo.length == 0) {
                        createNewExerciseSection(setId, workoutId, exerciseDivFullId, exerciseName, optionOneType, optionOneValue,
                            optionTwoType, optionTwoValue);
                    } else {
                        addToExistingExerciseSection(setId, $exerciseInWorkoutToAddTo, optionOneType, optionOneValue,
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
