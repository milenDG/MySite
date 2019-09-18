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
    return appendSingleData(json, $('#about'));
  });
  $.getJSON('/json/experience.json', function (json) {
    return appendSingleData(json, $('#experience'));
  });
  $.getJSON('/json/education.json', function (json) {
    return appendSingleData(json, $('#education'));
  });
  $.getJSON('/json/projects.json', function (json) {
    return appendSingleData(json, $('#projects'));
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

  var $h4 = $('<h4 class="font-weight-bold">');
  $h4.html(data.heading);
  $h4.append($('<br />'));
  var $small = $('<small class="font-italic text-muted secondary-text">');
  $small.html(data.secondaryHeading);
  $dataContainer.append($h4.append($small));

  if (data.picture.source) {
    var $a = $("<a target=\"_blank\" class=\"floating-anchor\" href=\"".concat(data.picture.link, "\" title=\"").concat(data.picture.link, "\">"));
    var $img = $("<img width=\"".concat(data.picture.width, "\" src=\"").concat(data.picture.source, "\" alt=\"").concat(data.picture.alternative, "\" class=\"clickable-img\">"));

    if (!data.picture.isRounded) {
      $img.addClass('shadow-img rounded-img');
    }

    $a.append($img);
    $dataContainer.append($a);
  }

  $dataContainer.append(data.description).append($('<br />'));

  if (data.class === 'project-link') {
    $dataContainer.append('<em>Link to the project: </em>').append($("<a class=\"secondary-text\" href=\"".concat(data.picture.link, "\" target=\"_blank\">")).text(data.picture.link));
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

      do {
        index = $view.text().toLowerCase().indexOf(toSearch, index + toSearch.length);

        if (index !== -1) {
          wasMatchFound = true;
          hasMatch = true;
          var $a = $("<a href=\"#\" onClick=\"replaceView('".concat(viewId, "')\">"));
          var viewText = $view.text();
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