﻿let currentView = 'about';
let $views = {};
let $navs = {};

let idToHeading = {
    'about': 'About me',
    'experience': 'Experience',
    'education': 'Education',
    'projects': 'Projects'
};

let htmlInInnerHtml = {
    'about': [],
    'experience': [],
    'education': [],
    'projects': []
}

$(document).ready(() => {
    setViewsAndNavs();
    $.when(appendAllData()).then(() =>
        findHtmlInInnerHtml());
    console.dir(htmlInInnerHtml);
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
    return [
        $.getJSON('/json/about.json', (json) => appendSingleData(json, $('#about'))),
        $.getJSON('/json/experience.json', (json) => appendSingleData(json, $('#experience'))),
        $.getJSON('/json/education.json', (json) => appendSingleData(json, $('#education'))),
        $.getJSON('/json/projects.json', (json) => appendSingleData(json, $('#projects')))
    ];
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

function createDataContainer(data) {
    const $dataContainer = $(`<div id ="${data.id}" class="container clearfix">`);
    if (data.class) {
        $dataContainer.addClass(data.class);
    }

    const $h4 = $('<h4 class="font-weight-bold">');
    $h4.html(data.heading);
    $h4.append($('<br />'));

    const $small = $('<small class="font-italic text-muted secondary-text">');
    $small.html(data.secondaryHeading);
    $dataContainer.append($h4.append($small));

    if (data.picture.source) {
        const $a = $(`<a target="_blank" class="floating-anchor" href="${data.picture.link}" title="${data.picture.link}">`);
        const $img = $(`<img width="${data.picture.width}" src="${data.picture.source}" alt="${data.picture.alternative}" class="clickable-img">`);

        if (!data.picture.isRounded) {
            $img.addClass('shadow-img rounded-img');
        }

        $a.append($img);
        $dataContainer.append($a);
    }

    $dataContainer.append(data.description)
        .append($('<br />'));

    if (data.class === 'project-link') {
        $dataContainer.append('<em>Link to the project: </em>')
            .append($(`<a class="secondary-text" href="${data.picture.link}" target="_blank">`).text(data.picture.link));
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
    console.dir('done');
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

//function highlightTextInView(string, $view) {
//    if (string.contains('<')) {
        

//    }
//    $.innerHTML.replace

//}

function findHtmlInInnerHtml() {
    for (const viewName in $views) {
        if ($views.hasOwnProperty(viewName) && viewName !== 'search') {
            
            const innerHtml = $views[viewName].html();
            console.dir(innerHtml);
            let begin = -1, end;

            for (let i = 0; i<innerHtml.length; i++){
                if (innerHtml.charAt(i) === '<') {
                    begin = i;
                }
                if (innerHtml.charAt(i) === '>') {
                    end = i;
                    htmlInInnerHtml[viewName].push({
                        'begin': begin,
                        'end': end
                    });
                }
            }
        }
    }
}

function clearInputField(id) {
    $(id).val('');
}

function showProjects() {
    $('#projects-nav').attr('aria-expanded', 'true');
    $('#projects-dropdown').addClass('show');
    $('#projects-dropdown-menu').addClass('show');
}

function hideProjects() {
    $('#projects-nav').attr('aria-expanded', 'false');
    $('#projects-dropdown').removeClass('show');
    $('#projects-dropdown-menu').removeClass('show');
}