var PageNavigationUtil = (function() {

    function handleTitleChange(title) {
        var $titleCategory = $('#title-category');
        var $titleContainer = $('#title-container');
        $titleCategory.stop();

        $titleCategory.fadeTo(300, 0, function() {
            $titleCategory.text(title);
            var shiftDist = $titleContainer.width() / 2;
            $titleContainer.css('margin-left', 'calc(50% - ' + shiftDist + 'px)');
            $titleCategory.fadeTo(600, 1);
        });
    }

    function renderPageFrom(title, htmlpath, callback) {
        var $contentWindow = $('#content-window');
        $contentWindow.stop();

        handleTitleChange(title);
        $contentWindow.fadeOut(300, function() {
            $contentWindow.load(htmlpath, function() {
                $contentWindow.fadeIn(600);
                (callback)();
            });
        });
    }

    function loadNavBarItems() {
        var $navBarContentContainer = $('#nav-bar-content-container');
        if ($.trim($navBarContentContainer.html()).length == 0) {
            var username = '';

            $.ajax({
                type: 'POST',
                url: '/retrieveUsername',
                data: {}
            }).done(function(response) {
                username = response;
                $navBarContentContainer.load('/static/html/navbar-content.html', function() {
                    $('#nav-bar-user-name').text(username);
                    $navBarContentContainer.fadeIn(400);
                });
            });
        }
    }

    function removeNavBarItems() {
        var $navBarContentContainer = $('#nav-bar-content-container');
        if ($.trim($navBarContentContainer.html()).length != 0) {
            $navBarContentContainer.fadeOut(400, function() {
                $navBarContentContainer.empty();
            });
        }
    }

    function goToPageIfLoggedIn(shouldGoTo, callback) {
        $.ajax({
                type: 'POST',
                url: '/',
                data: {}
            })
            .done(function(response) {
                if (response['status'] == 'success') {
                    if (shouldGoTo) {
                        (callback)();
                    } else {
                        window.location.hash = '#tracker';
                    }
                } else {
                    if (!shouldGoTo) {
                        (callback)();
                    } else {
                        window.location.hash = '#login';
                    }
                }
            });
    }

    return {
        goToLoginPage: function(callback) {
            goToPageIfLoggedIn(false, function() {
                callback = callback || function() { /*empty function*/ };
                window.location.hash = "#login";
                renderPageFrom('login', '/static/html/login.html', callback);
                removeNavBarItems();
            });
        },

        goToRegistrationPage: function(callback) {
            goToPageIfLoggedIn(false, function() {
                callback = callback || function() { /*empty function*/ };
                window.location.hash = "#register";
                renderPageFrom('register', '/static/html/register.html', callback)
                removeNavBarItems();
            });
        },

        goToMainTrackerPage: function(callback) {
            goToPageIfLoggedIn(true, function() {
                callback = callback || function() { /*empty function*/ };
                window.location.hash = "#tracker";
                renderPageFrom('tracker', '/static/html/main-tracker.html', callback);
                loadNavBarItems();
            });
        },

        goToExercisesPage: function(callback) {
            goToPageIfLoggedIn(true, function() {
                callback = callback || function() { /*empty function*/ };
                window.location.hash = "#exercises";
                renderPageFrom('exercises', '/static/html/exercises.html', callback);
                loadNavBarItems();
            });
        },

        goToStatsPage: function(callback) {
            goToPageIfLoggedIn(true, function() {
                callback = callback || function() { /*empty function*/ };
                window.location.hash = "#stats";
                renderPageFrom('stats', '/static/html/stats.html', callback);
                loadNavBarItems();
            });
        },

        logOutUser: function(callback) {
            $.ajax({
                    type: 'POST',
                    url: '/logout',
                    data: {}
                })
                .done(function() {
                    window.location.hash = "#login"
                });
            removeNavBarItems();
        },

        // TODO turn this into object/dict
        navigateToHashUrl: function(hashUrl, callback) {
            callback = callback || function() { /*empty function*/ };
            if (hashUrl == '#login') {
                PageNavigationUtil.goToLoginPage(callback);
            } else if (hashUrl == '#register') {
                PageNavigationUtil.goToRegistrationPage(callback);
            } else if (hashUrl == '#tracker') {
                PageNavigationUtil.goToMainTrackerPage(function() {
                    $('.nav-tab').removeClass('active');
                    $('#nav-tracker-tab').addClass('active');
                    (callback)();
                });
            } else if (hashUrl == '#exercises') {
                PageNavigationUtil.goToExercisesPage(function() {
                    $('.nav-tab').removeClass('active');
                    $('#nav-exercises-tab').addClass('active');
                    (callback)();
                });
            } else if (hashUrl == '#stats') {
                PageNavigationUtil.goToStatsPage(function() {
                    $('.nav-tab').removeClass('active');
                    $('#nav-stats-tab').addClass('active');
                    (callback)();
                });
            } else if (hashUrl == '#logout') {
                PageNavigationUtil.logOutUser(callback);
            } else {
                // TODO if hash url doesn't exist, do something
            }
        }
    }
})();
