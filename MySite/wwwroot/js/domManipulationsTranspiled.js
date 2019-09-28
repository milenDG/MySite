"use strict";

var currentView = 'about';
var $views = {};
var $navs = {};
var idToHeading = {
    'about': 'About me',
    'experience': 'Experience',
    'education': 'Education',
    'projects': 'Projects'
};
var htmlInInnerHtml = {
    'about': [],
    'experience': [],
    'education': [],
    'projects': []
};
$(document).ready(function () {
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
    };
}

function appendAllData() {
    $.getJSON('/json/about.json', function (json) {
        appendSingleData(json, $('#about'));
        findHtmlInInnerHtml('about');
    });
    $.getJSON('/json/experience.json', function (json) {
        appendSingleData(json, $('#experience'));
        findHtmlInInnerHtml('experience');
    });
    $.getJSON('/json/education.json', function (json) {
        appendSingleData(json, $('#education'));
        findHtmlInInnerHtml('education');
    });
    $.getJSON('/json/projects.json', function (json) {
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
    var $dataContainer = $("<div id =\"".concat(data.id, "\" class=\"container clearfix\">"));

    if (data.class) {
        $dataContainer.addClass(data.class);
    }

    var $h4 = $('<h3 class="font-weight-bold">');
    $h4.html(data.heading);
    $h4.append($('<br />'));
    var $small = $('<small class="font-italic text-muted secondary-text">');
    $small.html(data.secondaryHeading);
    $dataContainer.append($h4.append($small));

    if (data.picture.source) {
        var $a = $("<a target=\"_blank\" class=\"floating-anchor\" href=\"".concat(data.picture.link, "\" title=\"").concat(data.picture.link, "\">"));
        var $img = $("<img width=\"".concat(data.picture.width, "\" src=\"").concat(data.picture.source, "\" alt=\"").concat(data.picture.alternative, "\" class=\"clickable-img data-img\">"));

        if (!data.picture.isRounded) {
            $img.addClass('shadow-img rounded-img');
        }

        $a.append($img);
        $dataContainer.append($a);
    }

    $dataContainer.append(data.description).append($('<br />'));

    if (data.class === 'project-link') {
        $dataContainer.append('<em>Link to the project: </em>').append($("<a class=\"btn link-button font-weight-bold font-italic\" href=\"".concat(data.picture.link, "\" target=\"_blank\" role=\"button\">")).text(data['short-heading']));
    }

    return $dataContainer;
}

function appendSingleData(array, $container) {
    var projects = array;
    var counter = 0;
    var last = projects.length;

    for (var index in projects) {
        if (projects.hasOwnProperty(index)) {
            counter++;
            var $dataContainer = createDataContainer(projects[index]);
            $container.append($dataContainer);

            if (counter !== last) {
                $container.append($('<hr />'));
            }
        }
    }
}

function search(string) {
    var $searchView = $views['search'];
    $('#search div').html('');
    replaceView('search');

    if (!string) {
        $searchView.append($('<div class="font-italic text-warning">Please enter text for search!</div>'));
        return;
    }

    var toSearch = string.toLowerCase();
    var hasMatch = false;

    for (var viewId in $views) {
        if ($views.hasOwnProperty(viewId)) {
            if (viewId === 'search') continue;
            var $view = $views[viewId];
            var index = -toSearch.length;
            var wasMatchFound = false;
            var $div = $("<div class=\"container\"><h4 class=\"font-weight-bold\">".concat(idToHeading[viewId], "</h4></div>"));
            var $ul = $('<ul>');
            $div.append($ul);
            var viewText = $view.text();
            var viewTextLower = $view.text().toLowerCase();

            do {
                index = viewTextLower.indexOf(toSearch, index + toSearch.length);

                if (index !== -1) {
                    wasMatchFound = true;
                    hasMatch = true;
                    var $a = $("<a href=\"#\" onClick=\"replaceView('".concat(viewId, "'); highlightTextInView('").concat(toSearch, "', '").concat(viewId, "')\">"));
                    var text = "".concat(viewText.substr(index - 25, 25), "<strong><u><mark>").concat(viewText.substr(index, toSearch.length), "</mark></u></strong>").concat(viewText.substr(index + toSearch.length, 25));
                    $a.html(text);
                    var $li = $('<li>');
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
        $searchView.append($("<div class=\"font-italic text-warning\">No match for \"".concat(string, "\" was found in the text!</div>")));
    }

    $('#search-text').val(string);
    $('#search-text-page').val(string);
}

function highlightTextInView(toSearch, viewId) {
    var $view = $("#".concat(viewId));
    var index = -toSearch.length - 30;
    var viewHtml = $view.html();
    var viewHtmlLower = $view.html().toLowerCase();

    do {
        index = viewHtmlLower.indexOf(toSearch, index + toSearch.length + 30);

        if (index !== -1) {
            var isInHtml = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = htmlInInnerHtml[viewId][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var el = _step.value;

                    if (el[0] <= index && index <= el[1]) {
                        isInHtml = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
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
}

function findHtmlInInnerHtml(viewId) {
    htmlInInnerHtml[viewId] = [];

    if ($views.hasOwnProperty(viewId) && viewId !== 'search') {
        var innerHtml = $("#".concat(viewId)).html();
        var begin = -1,
            end;

        for (var i = 0; i < innerHtml.length; i++) {
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
}

;

function removeHighlight() {
    for (var viewId in $views) {
        if ($views.hasOwnProperty(viewId)) {
            var html = $views[viewId].html();
            html = html.replace(/<mark class="searched">/g, '');
            html = html.replace(/<\/mark>/g, '');
            $views[viewId].html(html);
            findHtmlInInnerHtml(viewId);
        }
    }
}

function initMap() {
    var location = {
        lat: 51.237508,
        lng: -0.592832
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}