//*****************
// Website scripts
//*****************

// Event DOM ready
var callback = function(){
  // trigger events on Dom ready.

  // Fix navbar after scrolling
  var sNavbar = document.getElementById("navbar-default");

  // On click open search
  var searchOpen = document.getElementById('search-open');
  var searchClose = document.getElementById('search-close');
  var searchField = document.getElementById('search-field');
  var searchView = document.getElementById("search");
  var searchStyle = searchView.style;

  searchOpen.onclick = function () {
    searchStyle.display = "block";
    document.body.style.overflowY = "hidden";
    searchField.focus();
  };

  searchClose.onclick = function () {
    searchStyle.display = "none";
    document.body.style.overflowY = "auto";
  };

  // Determine color
  var color = window.getComputedStyle(
    document.getElementById('search-field')
  ).getPropertyValue('color')
  // Blog search
  document.querySelector('#search-field').ghostHunter.init({
    results         : '#results',
    onKeyUp         : true,
    includepages    : true,
    onPageLoad      : true,
    info_template   : '<p class="search__result-amount">{{amount}} results found</p>',
    result_template : '<div class="search__result-item">' +
                        '<a href="{{link}}" class="search__result-link">' +
                          '<h4>{{title}}</h4>' +
                          '<p>{{pubDate}}</p>' +
                        '</a>' +
                      '</div>'
  });

};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

// Check if element is in viewport
function isInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

function addClass(selector, myClass) {
  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.add(myClass);
  }
}

function removeClass(selector, myClass) {  
  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // remove class from all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.remove(myClass);
  }
}