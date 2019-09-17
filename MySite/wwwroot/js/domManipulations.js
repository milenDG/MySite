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
        'projects': $('#projects-nav'),
        'search': $('#search-nav')
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

    if (project.picture.source) {
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
    }

    //Create description.
    $projectContainer.append($('<div class="container">').append(project.description));

    return $projectContainer;
}

function appendSingleData(array, $container) {
    const projects = array;

    let counter = 0;
    const last = projects.length;
    for (let index in projects) {
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
    const $searchView = $views['search'];
    $('#search div').html('');

    replaceView('search');

    if (!string) {
        $searchView.append($('<div class="font-italic text-warning">Please enter text for search!</div>'));
        return;
    }

    const toSearch = string.toLowerCase();

    let hasMatch = false;

    for (let viewId in $views) {
        if ($views.hasOwnProperty(viewId)) {
            if(viewId === 'search') continue;

            const $view = $views[viewId];
            let index = -toSearch.length;
            let wasMatchFound = false;
            const $div = $(`<div class="container"><h4 class="font-weight-bold">${idToHeading[viewId]}</h4></div>`);
            const $ul = $('<ul>');
            $div.append($ul);

            do {
                index = $view.text().toLowerCase().indexOf(toSearch, index + toSearch.length);
                if (index !== -1) {
                    wasMatchFound = true;
                    hasMatch = true;

                    const $a = $(`<a href="#" onClick="replaceView('${viewId}')">`);
                    const viewText = $view.text();
                    const text = `${viewText.substr(index - 25, 25)}<strong><u><mark>${viewText.substr(index, toSearch.length)}</mark></u></strong>${viewText.substr(index + toSearch.length, 25)}`;

                    $a.html(text);

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

    if (!hasMatch) {
        $searchView.append($(`<div class="font-italic text-warning">No match for "${string}" was found in the text!</div>`));
    }
}

function clearInputField(id) {
    $(id).val('');
}