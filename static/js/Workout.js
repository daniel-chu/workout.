var Workout = (function() {

    var $workoutContainer = $('#all-workouts-container');

    function renderGivenWorkout(config) {
        var $newWorkoutDiv = $('<div>').addClass('row').addClass('workout-row')
            .load('/static/html/item-structures/workout-item.html', function() {
                initWorkoutContainer($newWorkoutDiv, config.dateString);
                $newWorkoutDiv.attr('id', 'ws' + config['_id']);
                $workoutContainer.append($newWorkoutDiv);
            });
    }

    function initWorkoutContainer($workoutDiv, date) {
        $workoutDiv.find('.workout-date-header').text(date);
        $workoutDiv.find('.remove-workout-button').on('click', function() {
            $(this).prop('disabled', true);
            deleteWorkout($(this));
        });
        $workoutDiv.find('.add-set-button').on('click', function() {
            var workoutIdToStore = $(this).parents('.workout-row').attr('id').substring(2);
            $('#add-set-popup').data('workoutId', workoutIdToStore);
        });
    }

    function deleteWorkout($removeWorkoutButton) {
        // TODO ADD CONFIRMATION POPUP
        var $workoutContainerToRemove = $removeWorkoutButton.parents('.workout-row');
        var workoutSessionId = $workoutContainerToRemove.attr('id').substring(2);
        $.ajax({
                type: 'POST',
                url: '/deleteWorkoutSession',
                data: {
                    'workoutIdToRemove': workoutSessionId
                }
            })
            .done(function(response) {
                $removeWorkoutButton.prop('disabled', false);
                if (response['status'] === 'success') {
                    $workoutContainerToRemove.slideUp(300, function() {
                        $workoutContainerToRemove.remove();
                    });
                }
            });
    }

    return {
        createNewWorkout: function() {
            var dateString = GeneralUtil.getMonthDayYear(new Date());
            var $newWorkoutDiv = $('<div>').addClass('row').addClass('workout-row')
                .load('/static/html/item-structures/workout-item.html', function() {
                    initWorkoutContainer($newWorkoutDiv, dateString);
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
                            var newWorkoutSessionId = JSON.parse(response['newWorkoutSessionId']);
                            $newWorkoutDiv.attr('id', 'ws' + newWorkoutSessionId);
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
