﻿const LARGE_WIDTH = 992;

let $views = {};
let $navs = {};

function init() {
    fixNavbarPadding();

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

    window.onresize = fixNavbarPadding;
}

function fixNavbarPadding() {
    const $header = $('#header'), $main = $('#main-content');
    if (window.innerWidth >= LARGE_WIDTH) {
        $header.addClass('fixed-top');
        $main.css('margin-top', '90px');
    } else {
        $header.removeClass('fixed-top');
        $main.css('margin-top', '25px');
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
    $('#text-content-holder').append($view);
    $view.show();
}
