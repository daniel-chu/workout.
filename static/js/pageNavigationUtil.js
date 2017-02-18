var PageNavigationUtil = (function() {

    function renderPageFrom(title, htmlpath) {
        var $contentWindow = $('#content-window');
        var $titleCategory = $('#title-category');
        $contentWindow.fadeOut(300, function() {
            $contentWindow.load(htmlpath);
            $contentWindow.fadeIn(600);
        });

        $titleCategory.fadeOut(300, function() {
            $titleCategory.text(title);
            $titleCategory.fadeIn(600);
        });
    }

    return {
        goToLoginPage: function() {
            renderPageFrom('login', '/static/html/login-page.html');
        },
        goToMainTrackerPage: function() {
            renderPageFrom('tracker', '/static/html/main-tracker.html');
        }
    }
})();
