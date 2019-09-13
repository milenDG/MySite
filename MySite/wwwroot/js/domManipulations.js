let currentView = 'about';

let $views = {};
let $navs = {};

$(document).ready(() => {
    setViewsAndNavs();
    appendAllData();
});

function setViewsAndNavs() {
    $views = {
        'about': $('#about'),
        'experience': $('#experience'),
        'education': $('#education'),
        'projects': $('#projects')
    };

    $navs = {
        'about': $('#about-nav'),
        'experience': $('#experience-nav'),
        'education': $('#education-nav'),
        'projects': $('#projects-nav')
    }
}

function appendAllData() {
    $.getJSON('/json/about.json', (json) => appendSingleData(json, $('#about')));
    $.getJSON('/json/experience.json', (json) => appendSingleData(json, $('#experience')));
    $.getJSON('/json/education.json', (json) => appendSingleData(json, $('#education')));
    $.getJSON('/json/projects.json', (json) => appendSingleData(json, $('#projects')));
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

function createDataContainer(project) {
    const $projectContainer = $('<div class="row" >');
    $projectContainer.attr('id', project.id);

    //Create container.
    const $div = $('<div class="col-xl-10 col-lg-9 col-md-8 col-sm-9">');

    //Create h4.
    const $h4 = $('<h4 class="font-weight-bold">');
    $h4.text(project.heading);
    $h4.append($('<br />'));

    const $small = $('<small class="font-italic text-muted secondary-text">');
    $small.html(project.secondaryHeading);
    $h4.append($small);
    $div.append($h4);

    //Create description.
    $div.append(project.description);
    $projectContainer.append($div);

    const $linkPictureContainer = $('<div class="col-xl-2 col-lg-3 col-md-4 col-sm-3">');
    //Create link picture.
    const $linkPicture = $('<p class="text-right">');
    const $a = $('<a target="_blank">');
    $a.attr('href', project.picture.link);

    const $img = $('<img>');
    $img.attr('width', project.picture.width);
    $img.attr('src', project.picture.source);
    $img.attr('alt', project.picture.alternative);
    $img.addClass('rounded-img');
    if (!project.picture.isRounded) {
        $img.addClass('shadow-img');
    }

    $a.append($img);
    $linkPicture.append($a);
    $linkPictureContainer.append($linkPicture);

    $projectContainer.append($linkPictureContainer);

    return $projectContainer;
}

function appendSingleData(array, $container) {
    const projects = array;

    let counter = 0;
    const last = projects.length;
    for (const index in projects) {
        if (projects.hasOwnProperty(index)) {
            counter++;
            const $projectContainer = createDataContainer(projects[index]);
            $container.append($projectContainer);
            if (counter !== last) {
                $container.append($('<hr />'));
            }
        }
    }
}