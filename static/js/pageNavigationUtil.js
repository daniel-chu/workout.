var PageNavigationUtil = (function() {

    function fadeInTitleChange(title) {
        var $titleCategory = $('#title-category');
        var $titleContainer = $('#title-container');

        $titleCategory.text(title);
        var shiftDist = $titleContainer.width() / 2;
        $titleContainer.css('margin-left', 'calc(50% - ' + shiftDist + 'px)');
        $titleCategory.fadeTo(600, 1);
    }

    function renderPageFrom(title, htmlpath, callback) {
        var $contentWindow = $('#content-window');

        $('#title-category').fadeTo(300, 0);
        $contentWindow.fadeOut(300, function() {
            $contentWindow.load(htmlpath, function() {
                fadeInTitleChange(title);
                callback();
            });
            $contentWindow.fadeIn(600);
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
            })
            $navBarContentContainer.load('/static/html/navbar-content.html', function() {
                $('#nav-bar-user-name').text(username);
                $navBarContentContainer.fadeIn(400);
            });
        }
    }

    function removeNavBarItems() {
        var $navBarContentContainer = $('#nav-bar-content-container');
        $navBarContentContainer.fadeOut(400, function() {
            $navBarContentContainer.empty();
        });
    }

    return {
        goToLoginPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            window.location.hash = "#login";
            renderPageFrom('login', '/static/html/login.html', callback);
            removeNavBarItems();
        },

        goToRegistrationPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            window.location.hash = "#register";
            renderPageFrom('register', '/static/html/register.html', callback)
            removeNavBarItems();
        },

        goToMainTrackerPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            window.location.hash = "#tracker";
            renderPageFrom('tracker', '/static/html/main-tracker.html', callback);
            loadNavBarItems();
        },

        goToExercisesPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            window.location.hash = "#exercises";
            renderPageFrom('exercises', '/static/html/exercises.html', callback);
            loadNavBarItems();

        },

        goToStatsPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            window.location.hash = "#stats";
            renderPageFrom('stats', '/static/html/stats.html', callback);
            loadNavBarItems();
        },

        logOutUser: function(callback) {
            window.location.hash = "#";
            $.ajax({
                    type: 'POST',
                    url: '/logout',
                    data: {}
                })
                .done(function() {
                    PageNavigationUtil.goToLoginPage();
                });
            removeNavBarItems();
        },

        // TODO turn this into object/dict
        navigateToHashUrl: function(hashUrl, callback) {
            callback = callback || function() { /*empty function*/ };
            if (hashUrl == '#login') {
                PageNavigationUtil.goToLoginPage();
            } else if (hashUrl == '#register') {
                PageNavigationUtil.goToRegistrationPage();
            } else if (hashUrl == '#tracker') {
                PageNavigationUtil.goToMainTrackerPage();
            } else if (hashUrl == '#exercises') {
                PageNavigationUtil.goToExercisesPage();
            } else if (hashUrl == '#stats') {
                PageNavigationUtil.goToStatsPage();
            } else if (hashUrl == '#logout') {
                PageNavigationUtil.logOutUser();
            } else {
                // TODO if hash url doesn't exist, do something
            }
        }
    }
})();
