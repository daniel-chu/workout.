var Workout = (function() {

    var $workoutContainer = $('#all-workouts-container');

    function renderGivenWorkout(workoutConfig) {
        var $newWorkoutDiv = $('<div>').addClass('row').addClass('workout-row')
            .load('/static/html/item-structures/workout-item.html', function() {
                initWorkoutContainer($newWorkoutDiv, workoutConfig.dateString);
                $newWorkoutDiv.attr('id', 'ws' + workoutConfig['_id']);
                $newWorkoutDiv.hide();
                $workoutContainer.append($newWorkoutDiv);
                Sets.loadExistingSets(workoutConfig['_id']);
                $newWorkoutDiv.fadeIn(200);
            });
    }

    function initWorkoutContainer($workoutDiv, date) {
        $workoutDiv.find('.workout-date-header').text(date);
        $workoutDiv.find('.remove-workout-button').on('click', function() {
            $(this).prop('disabled', true);
            confirmDelete($(this).parents('.workout-row'));
        });
        $workoutDiv.find('.add-set-button').on('click', function() {
            Workout.exitRemoveSetMode($workoutDiv);
            var workoutIdToStore = $(this).parents('.workout-row').attr('id').substring(2);
            $('#add-set-popup').data('workoutId', workoutIdToStore);
        });
        $workoutDiv.find('.edit-workout-button').on('click', function() {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                Workout.enterRemoveSetMode($workoutDiv);
            } else {
                Workout.exitRemoveSetMode($workoutDiv);
            }
        })
    }

    function confirmDelete($workoutContainerToRemove) {
        if ($workoutContainerToRemove.find('.set-list').length === 0) {
            deleteWorkout($workoutContainerToRemove, false);
        } else {
            $('#confirm-delete-button').off('click');
            $('#confirm-delete-button').on('click', function() {
                deleteWorkout($workoutContainerToRemove, true);
                $('#confirm-delete-modal').modal('hide');
            });
            $('#confirm-delete-modal').on('hide.bs.modal', function() {
                $workoutContainerToRemove.find('.remove-workout-button').prop('disabled', false);
            })
            $('#confirm-delete-modal').modal('show');
        }
    }

    function deleteWorkout($workoutContainerToRemove, hasAssociatedSets) {
        var workoutSessionId = $workoutContainerToRemove.attr('id').substring(2);
        $.ajax({
                type: 'POST',
                url: '/deleteWorkoutSession',
                data: {
                    'workoutIdToRemove': workoutSessionId,
                    'hasAssociatedSets': hasAssociatedSets
                }
            })
            .done(function(response) {
                $workoutContainerToRemove.find('.remove-workout-button').prop('disabled', false);
                if (response['status'] === 'success') {
                    $workoutContainerToRemove.animate({ opacity: 'toggle', height: 'toggle' }, 300, function() {
                        $workoutContainerToRemove.remove();
                    });
                }
            });
    }

    function delayedLoopThroughWorkoutSessions(listOfWorkoutSessions, i, callback) {
        window.setTimeout(function() {
            if (i < listOfWorkoutSessions.length) {
                renderGivenWorkout(listOfWorkoutSessions[i]);
                i++;
                delayedLoopThroughWorkoutSessions(listOfWorkoutSessions, i, callback);
            } else {
                (callback)();
            }
        }, 200);
    }

    return {
        enterRemoveSetMode: function($workoutDiv) {
            $workoutDiv.find('.sets-container .remove-set-button').animate({ width: 'show' }, 250);
        },
        exitRemoveSetMode: function($workoutDiv) {
            $workoutDiv.find('.edit-workout-button').removeClass('active');
            $workoutDiv.find('.sets-container .remove-set-button').animate({ width: 'hide' }, 250);
        },
        createNewWorkout: function() {
            //TODO don't save until there is at least one set in it
            var dateString = GeneralUtil.getMonthDayYear(new Date());
            var $newWorkoutDiv = $('<div>').addClass('row').addClass('workout-row')
                .load('/static/html/item-structures/workout-item.html', function() {
                    initWorkoutContainer($newWorkoutDiv, dateString);
                    $newWorkoutDiv.find('.add-set-button').prop('disabled', true);
                    $newWorkoutDiv.hide();
                    $newWorkoutDiv.find('.sets-container.panel-body').show();
                    $newWorkoutDiv.find('.workout-loading-mask-div').hide();
                    $workoutContainer.prepend($newWorkoutDiv);

                    $newWorkoutDiv.animate({ opacity: 'toggle', height: 'toggle' }, 300);
                    $.ajax({
                            type: 'POST',
                            url: '/addWorkoutSession',
                            data: {
                                'dateString': dateString,
                                'dateNumber': new Date().getTime()
                            }
                        })
                        .done(function(response) {
                            var newWorkoutSessionId = JSON.parse(response['newWorkoutSessionId']);
                            $newWorkoutDiv.attr('id', 'ws' + newWorkoutSessionId);
                            $newWorkoutDiv.find('.add-set-button').prop('disabled', false);
                        });
                });
        },
        //TODO render only a certain amount, load more as you scroll
        renderMultipleWorkoutSessions: function(listOfWorkoutSessions) {
            delayedLoopThroughWorkoutSessions(listOfWorkoutSessions, 0, function() {
                $('#all-workouts-container').fadeIn(500);
            });
        }
    }
})();
