let currentView = 'home';

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
}

function replaceView(id) {
    if (currentView !== id) {
        $navs[currentView].removeClass('active');
        $views[currentView].addClass('hidden');

        currentView = id;

        $navs[id].addClass('active');
        $views[id].removeClass('hidden');
    }
}
