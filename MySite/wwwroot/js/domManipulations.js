let currentView = 'about';

let $views = {};
let $navs = {};
let idToHeading = {
    'about': 'About me',
    'experience': 'Experience',
    'education': 'Education',
    'projects': 'Projects'
};

$(document).ready(() => {
    setViewsAndNavs();
    appendAllData();
});

function setViewsAndNavs() {
    $views = {
        'about': $('#about'),
        'experience': $('#experience'),
        'education': $('#education'),
        'projects': $('#projects'),
        'search': $('#search')
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
        if($navs[currentView]) $navs[currentView].removeClass('active');
        $views[currentView].addClass('hidden');

        currentView = id;

        if($navs[id]) $navs[id].addClass('active');
        $views[id].removeClass('hidden');
    }
}

function createDataContainer(project) {
    const $projectContainer = $('<div class="row" >');
    $projectContainer.attr('id', project.id);
    if (project.class) {
        $projectContainer.addClass(project.class);
    }

    //Create container.
    const $div = $('<div class="col-xl-9 col-lg-8 col-md-7 col-sm-8">');

    //Create h4.
    const $h4 = $('<h4 class="font-weight-bold">');
    $h4.html(project.heading);
    $h4.append($('<br />'));

    const $small = $('<small class="font-italic text-muted secondary-text">');
    $small.html(project.secondaryHeading);
    $h4.append($small);
    $div.append($h4);

    $projectContainer.append($div);

    const $linkPictureContainer = $('<div class="col-xl-3 col-lg-4 col-md-5 col-sm-4">');
    //Create link picture.
    const $linkPicture = $('<p class="text-right">');
    const $a = $('<a target="_blank">');
    $a.attr('href', project.picture.link);

    const $img = $('<img>');
    $img.attr('width', project.picture.width);
    $img.attr('src', project.picture.source);
    $img.attr('alt', project.picture.alternative);
    if (!project.picture.isRounded) {
        $img.addClass('shadow-img');
        $img.addClass('rounded-img');
    }

    $a.append($img);
    $linkPicture.append($a);
    $linkPictureContainer.append($linkPicture);

    $projectContainer.append($linkPictureContainer);

    //Create description.
    $projectContainer.append($('<div class="container">').append(project.description));

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

function search(string) {
    if (!string) {
        return;
    }

    $('#search div').html('');
    string = string.toLowerCase();
    const $searchView = $views['search'];

    for (const viewId in $views) {
        if ($views.hasOwnProperty(viewId)) {
            if(viewId === 'search') continue;

            const $view = $views[viewId];
            let index = -string.length;
            let wasMatchFound = false;
            const $div = $(`<div class="container">
                <h4 class="font-weight-bold">${idToHeading[viewId]}</h4>
            </div>`);
            const $ul = $('<ul>');
            $div.append($ul);

            do {
                index = $view.text().toLowerCase().indexOf(string, index + string.length);
                if (index !== -1) {
                    wasMatchFound = true;

                    console.log(viewId);
                    const $a = $(`<a href="#" onClick="replaceView('${viewId}')">`);
                    $a.text($view.text().substr(index - 20, string.length + 40));

                    const $li = $('<li>');
                    $li.append($a);

                    $ul.append($li);
                }
            } while (index !== -1);

            if (wasMatchFound) {
                $searchView.append($div);
            }
        }
    }

    replaceView('search');
}