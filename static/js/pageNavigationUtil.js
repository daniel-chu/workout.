var PageNavigationUtil = (function() {

    function handleTitleChange(title) {
        var $titleCategory = $('#title-category');
        var $titleContainer = $('#title-container');

        $titleCategory.fadeTo(300, 0, function() {
            $titleCategory.text(title);
            var shiftDist = $titleContainer.width() / 2;
            $titleContainer.css('margin-left', 'calc(50% - ' + shiftDist + 'px)');
            $titleCategory.fadeTo(600, 1);
        });
    }

    function renderPageFrom(title, htmlpath, callback) {
        handleTitleChange(title);
        var $contentWindow = $('#content-window');
        $contentWindow.fadeOut(300, function() {
            $contentWindow.load(htmlpath, callback);
            $contentWindow.fadeIn(600);
        });

    }

    return {
        goToLoginPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            renderPageFrom('login', '/static/html/login.html', callback);
        },
        goToMainTrackerPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            renderPageFrom('tracker', '/static/html/main-tracker.html', callback);
        },
        goToRegistrationPage: function(callback) {
            callback = callback || function() { /*empty function*/ };
            renderPageFrom('register', '/static/html/register.html', callback)
        }
    }
})();
