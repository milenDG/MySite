let currentView = 'about';
let $views = {};
let $navs = {};
let highlighted = false;

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

function onLoad(homeTitle) {
    if (document.title === homeTitle) {
        setViewsAndNavs();
        appendAllData();
    }

    showCookieNotice();
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB-wmIAGPIA5GYoWHHe8z4H22Gcy0p3rZE&maptype=satellite&callback=initMap', function () {});
};

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
    $.getJSON('/json/about.json',
        (json) => {
            appendSingleData(json, $('#about-text'));
            findHtmlInInnerHtml('about');
        });
    $.getJSON('/json/experience.json',
        (json) => {
            appendSingleData(json, $('#experience'));
            findHtmlInInnerHtml('experience');
        });
    $.getJSON('/json/education.json',
        (json) => {
            appendSingleData(json, $('#education'));
            findHtmlInInnerHtml('education');
        });
    $.getJSON('/json/projects.json',
        (json) => {
            appendSingleData(json, $('#projects'));
            findHtmlInInnerHtml('projects');
        });
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

    const $h4 = $('<h3 class="font-weight-bold">');
    $h4.html(data.heading);
    $h4.append($('<br />'));

    const $small = $('<small class="font-italic secondary-text">');
    $small.html(data.secondaryHeading);
    $dataContainer.append($h4.append($small));

    if (data.picture.source) {
        const $a = $(`<a target="_blank" class="floating-anchor" href="${data.picture.link}" title="${data.picture.link}">`);
        const $img = $(`<img width="${data.picture.width}" src="${data.picture.source}" alt="${data.picture.alternative}" class="clickable-img data-img">`);

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
            .append($(`<a class="btn link-button font-weight-bold font-italic" href="${data.picture.link}" target="_blank" role="button">`)
                .text(data['short-heading']));
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

            const viewText = $view.text();
            const viewTextLower = $view.text().toLowerCase();

            do {
                index = viewTextLower.indexOf(toSearch, index + toSearch.length);
                if (index !== -1) {
                    wasMatchFound = true;
                    hasMatch = true;

                    const $a = $(`<a href="#" onClick="replaceView('${viewId}'); highlightTextInView('${toSearch}', '${viewId}')">`);
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
        $searchView.append($(`<div class="font-italic secondary-text">No match for "${string}" was found in the text!</div>`));
    }

    $('#search-text').val(string);
    $('#search-text-page').val(string);
}

function highlightTextInView(toSearch, viewId) {
    const $view = $(`#${viewId}`);

    let index = -toSearch.length - 30;
    let viewHtml = $view.html();
    let viewHtmlLower = $view.html().toLowerCase();

    do {
        index = viewHtmlLower.indexOf(toSearch, index + toSearch.length + 30);
        if (index !== -1) {
            let isInHtml = false;

            for (const el of htmlInInnerHtml[viewId]) {
                if (el[0] <= index && index <= el[1]) {
                    isInHtml = true;
                    break;
                }
            }

            if (isInHtml) {
                continue;
            }

            viewHtml = insertInString(viewHtml, index, 0, '<mark class="searched">');
            viewHtml = insertInString(viewHtml, index + toSearch.length + 23, 0, '</mark>');
            $view.html(viewHtml);
            findHtmlInInnerHtml(viewId);
        }

        viewHtmlLower = viewHtml.toLowerCase();
    } while (index !== -1);

    setTimeout(() => highlighted = true, 2000);    
}

function findHtmlInInnerHtml(viewId) {
    htmlInInnerHtml[viewId] = [];
    if ($views.hasOwnProperty(viewId) && viewId !== 'search') {

        const innerHtml = $(`#${viewId}`).html();
        
        let begin = -1, end;

        for (let i = 0; i<innerHtml.length; i++){
            if (innerHtml.charAt(i) === '<') {
                begin = i;
            }
            if (innerHtml.charAt(i) === '>') {
                end = i;
                htmlInInnerHtml[viewId].push([begin, end]);
            }
        }
    }
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

function insertInString(string, idx, rem, str) {
    return string.slice(0, idx) + str + string.slice(idx + Math.abs(rem));
};

function removeHighlight() {
    if (!highlighted) {
        return;
    }
    for (const viewId in $views) {
        if ($views.hasOwnProperty(viewId)) {
            let html = $views[viewId].html();
            html = html.replace(/<mark class="searched">/g, '');
            html = html.replace(/<\/mark>/g, '');

            $views[viewId].html(html);
            findHtmlInInnerHtml(viewId);
        }
    }
    highlighted = false;
}

function initMap() {
    const location = { lat: 51.242901, lng: -0.588698 };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: location
    });

    const marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = 'text/javascript';
    if (script.readyState) {  // only required for IE <9
        script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}