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
    const $dataContainer = $(`<div id ="${project.id}" class="container clearfix">`);
    if (project.class) {
        $dataContainer.addClass(project.class);
    }

    const $h4 = $('<h4 class="font-weight-bold">');
    $h4.html(project.heading);
    $h4.append($('<br />'));

    const $small = $('<small class="font-italic text-muted secondary-text">');
    $small.html(project.secondaryHeading);
    $dataContainer.append($h4.append($small));

    if (project.picture.source) {
        const $a = $(`<a target="_blank" class="floating-anchor" href="${project.picture.link}">`);
        const $img = $(`<img width="${project.picture.width}" src="${project.picture.source}" alt="${project.picture.alternative}" class="clickable-img">`);

        if (!project.picture.isRounded) {
            $img.addClass('shadow-img rounded-img');
        }

        $a.append($img);
        $dataContainer.append($a);
    }

    $dataContainer.append(project.description)
        .append($('<br />'));

    if (project.class === 'project-link') {
        $dataContainer.append('<em>Link to the project: </em>')
            .append($(`<a class="secondary-text" href="${project.picture.link}" target="_blank">`).text(project.picture.link));
    }

    return $dataContainer;
}

function appendSingleData(array, $container) {
    const projects = array;

    let counter = 0;
    const last = projects.length;
    for (let index in projects) {
        if (projects.hasOwnProperty(index)) {
            counter++;
            const $dataContainer = createDataContainer(projects[index]);
            $container.append($dataContainer);
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