//*****************
// Website scripts
//*****************

// ============================
// trigger events on Dom ready.
// ============================
var callback = function(){

  // =======
  // fitvids
  // =======
  fitvids();

  // ================
  // Lazy load images
  // ================
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
  
  // =====================
  // Scroll event listener
  // =====================
  window.addEventListener("scroll", adjustNavbar, false);

  // Fix navbar after scrolling
  var sNavbar = document.getElementById("navbar-default");

  // Search related actions
  var searchOpen = document.getElementById('search-open');
  var searchClose = document.getElementById('search-close');
  var searchField = document.getElementById('ghost-search-field');
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

  // ===========================
  // Adjust featured posts class
  // ===========================
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

  // ============================================================
  // Remove the "Other news" title if only 3 posts are in the tag
  // ============================================================
  if (location.href.indexOf("/tag/") !== -1) {
    var tagPostsTitle = document.getElementById("tag-posts-title");
    var tagPostsCount = document.getElementsByClassName('post-card').length;
    if (tagPostsCount === 0) {
      tagPostsTitle.style.display = "none";
    }
  }

  // ========================================================
  // Remove the "Posts by author" title if there are no posts
  // ========================================================
  if (location.href.indexOf("/author/") !== -1) {
    var authorPostsTitle = document.getElementById("author-posts-title");
    var authorPostsCount = document.getElementsByClassName('post-card').length;
    if (authorPostsCount === 0) {
      authorPostsTitle.style.display = "none";
    }
  }

  // ===========
  // Blog search
  // ===========
  var infoTemplate = '<p class="search__result-amount">{{amount}} results found</p>';
  var resultTemplate =  '<a href="{{link}}" class="search__result-link">' +
                          '<h4>{{title}}</h4>' +
                          '<p>{{pubDate}}</p>' +
                        '</a>';
  var searchSlider = document.getElementById("search__form-slider");

  // ===========
  // Blog search
  // ===========

  let ghostSearch = new GhostSearch({
    key: ghost_key,
    url: ghost_host,
    version: 'v3',
    // button: '#search-button',
    template: function(result) {
      let url = [location.protocol, '//', location.host].join('');
      return  '<a href=/"' + result.slug + '" class="search__result-link">' +
                '<h4>' + result.title + '</h4>' +
                '<p>' + moment(result.published_at).format("MMM Do YYYY") + '</p>' +
              '</a>';
    },
    trigger: 'focus',
    api: {
      resource: 'posts',
      parameters: {
          limit: 'all',
          fields: ['title', 'slug', 'published_at'],
          filter: '',
          include: '',
          order: '',
          formats: '',
      },
    }
  });

  // =============================
  // Load comments on button click
  // =============================
  var loadCommentsBtn = document.getElementById("load-comments");
    if ( loadCommentsBtn ) {
    loadCommentsBtn.onclick = function(){
      var url = loadCommentsBtn.dataset.url;
      var comment_id = loadCommentsBtn.dataset.comment_id;
      loadComments(url, comment_id);
    }
  }

  // ==========================
  // Disqus commen count script
  // ==========================
  (function() {
    var s = document.createElement('script'); s.async = true;
    s.src = '//' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('BODY')[0]).appendChild(s);
  }());
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

// ===============================
// Check if element is in viewport
// ===============================
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

// ==================
// Add class function
// ==================
function addClass(selector, myClass) {
  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.add(myClass);
  }
}

// =====================
// Remove class function
// =====================
function removeClass(selector, myClass) {  
  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // remove class from all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.remove(myClass);
  }
}

// ==================================================
// Helper function to get an element's exact position
// ==================================================
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

// =============
// Sticky navbar
// =============
function adjustNavbar() {
  var navbarDefault = document.getElementById("navbar-default");
  var navbarSocial = document.getElementById("navbar-social");
  navbarPosition = getPosition(navbarSocial);
  if (navbarPosition.y < -30) {
    addClass('.navbar__default', 'navbar__default--scrolled');
  }
  else {
    removeClass('.navbar__default', 'navbar__default--scrolled');
  }
}

// ===============
// Disqus comments
// ===============
function loadComments(url, id) {
  /**
   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
   */
  // var disqus_shortname = 'bironthemes'; // required: replace example with your forum shortname
  var disqus_config = function() {
    this.page.url = url;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = id; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };

  (function() {  // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
}