const LARGE_WIDTH = 992;

let $views = {};
let $navs = {};

function init() {
    $views = {
        'home': $('#home'),
        'experience': $('#experience'),
        'education': $('#education'),
        'projects': $('#projects')
    };

    $navs = {
        'home': $('#home-nav'),
        'experience': $('#experience-nav'),
        'education': $('#education-nav'),
        'projects': $('#projects-nav')
    }

    showView('home');

    window.onresize = function() {
        let $header = $('#header');
        if (window.innerWidth >= LARGE_WIDTH) {
            $header.addClass('fixed-top');
        } else {
            $header.removeClass('fixed-top');
        }
    }
}

function clearViews() {
    for (let $view in $views) {
        if ($views.hasOwnProperty($view)) {
            $views[$view].detach();
            $navs[$view].removeClass('active');
        }
    }
}

function showView(id) {
    clearViews();
    const $view = $views[id];
    $navs[id].addClass('active');
    $('#content-holder').append($view);
    $view.show();
}
