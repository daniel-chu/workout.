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

    function renderPageFrom(title, htmlpath) {
        handleTitleChange(title);
        var $contentWindow = $('#content-window');
        $contentWindow.fadeOut(300, function() {
            $contentWindow.load(htmlpath);
            $contentWindow.fadeIn(600);
        });

    }

    return {
        goToLoginPage: function() {
            renderPageFrom('login', '/static/html/login-page.html');
        },
        goToMainTrackerPage: function() {
            renderPageFrom('tracker', '/static/html/main-tracker.html');
        },
        changeTitle: function(title) {
            handleTitleChange(title);
        }
    }
})();
