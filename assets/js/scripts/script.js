//*****************
// Website scripts
//*****************

// Event DOM ready
var callback = function(){
  // trigger events on Dom ready.

  // Lazy load images
  var lazyLoad = new LazyLoad({
    elements_selector: ".lazyload",
    class_loading: "loading",
    class_loaded: "loaded",    
    callback_enter: function() {
      addClass('.lazyload', 'loading');
    },
    callback_load: function() {
      removeClass('.lazyload', 'loading');
      addClass('.lazyload', 'loaded');
    },
    callback_set: function() {
      removeClass('.lazyload', 'loading');
      addClass('.lazyload', 'loaded');
    }
  });

  lazyLoad.update();

  // Fix navbar after scrolling
  var sNavbar = document.getElementById("navbar-default");

  // Search related actions
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

  // Detect how many featured posts are to be shown and adjust the class
  var featuredPostCount = document.querySelectorAll(".grid-story").length;
  switch(featuredPostCount) {
    case 1:
      removeClass('.grid', 'grid-2');
      removeClass('.grid', 'grid-3');
      removeClass('.grid', 'grid-4');
      break;
    case 2:
      removeClass('.grid', 'grid-1');
      removeClass('.grid', 'grid-3');
      removeClass('.grid', 'grid-4');
      break;
    case 3:
      removeClass('.grid', 'grid-1');
      removeClass('.grid', 'grid-2');
      removeClass('.grid', 'grid-4');
      break;
    case 4:
      removeClass('.grid', 'grid-1');
      removeClass('.grid', 'grid-2');
      removeClass('.grid', 'grid-3');
      break;
    default: 
      removeClass('.grid', 'grid-1');
      removeClass('.grid', 'grid-2');
      removeClass('.grid', 'grid-3');
      break;
  }

  // Blog search
  var infoTemplate = '<p class="search__result-amount">{{amount}} results found</p>';
  var resultTemplate =  '<a href="{{link}}" class="search__result-link">' +
                          '<h4>{{title}}</h4>' +
                          '<p>{{pubDate}}</p>' +
                        '</a>';
  var searchSlider = document.getElementById("search__form-slider");

  document.querySelector('#search-field').ghostHunter.init({
    results         : '#results',
    onKeyUp         : true,
    includepages    : true,
    onPageLoad      : true,
    info_template   : infoTemplate,
    result_template : resultTemplate,
    before          : function() {
                        searchSlider.style.transition= 'width 0.5s ease';
                        searchSlider.style.width = '100%';
                      },
    onComplete      : function() { 
                        setTimeout(function(){ 
                          searchSlider.style.transition= 'width 0s ease';
                          searchSlider.style.width = '0%'; 
                        }, 500);
                      }
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