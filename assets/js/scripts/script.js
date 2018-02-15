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
  
  // Scroll event listener
  window.addEventListener("scroll", adjustNavbar, false);

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

  // Remove the "Other news" title if only 3 posts are in the tag
  if (location.href.indexOf("/tag/") !== -1) {
    var tagPostsTitle = document.getElementById("tag-posts-title");
    var tagPostsCount = document.getElementsByClassName('post-card').length;
    if (tagPostsCount === 0) {
      tagPostsTitle.style.display = "none";
    }
  }

  // Remove the "Posts by author" title if there are no posts
  if (location.href.indexOf("/author/") !== -1) {
    var authorPostsTitle = document.getElementById("author-posts-title");
    var authorPostsCount = document.getElementsByClassName('post-card').length;
    if (authorPostsCount === 0) {
      authorPostsTitle.style.display = "none";
    }
  }

  // Blog search
  var infoTemplate = '<p class="search__result-amount">{{amount}} results found</p>';
  var resultTemplate =  '<a href="{{link}}" class="search__result-link">' +
                          '<h4>{{title}}</h4>' +
                          '<p>{{pubDate}}</p>' +
                        '</a>';
  var searchSlider = document.getElementById("search__form-slider");

  var search = new GhostHunter(
    document.querySelector('#search-field')
  );

  search.init({
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


  // load comments on button click
  var loadCommentsBtn = document.getElementById("load-comments");
    if ( loadCommentsBtn ) {
    loadCommentsBtn.onclick = function(){
      var url = loadCommentsBtn.dataset.url;
      var comment_id = loadCommentsBtn.dataset.comment_id;
      loadComments(url, comment_id);
    }
  }

  // related posts
  var relatedPosts = document.getElementById("related-posts");
  // getCurrentPosts(relatedPosts.dataset.post_id);
  if ( relatedPosts ) {
    addRelatedPosts(relatedPosts.dataset.post_id)
    // getCurrentPostData(relatedPosts.dataset.post_id, getRelatedPosts);
  }
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

// Helper function to get an element's exact position
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

// adjust navbar
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

// Disqus comments
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

// Add related posts
function addRelatedPosts(id) {
  var apiOptions = {
    include: 'tags'
  }
  var url = ghost.url.api('posts/' + id, apiOptions);
  getGhostData(url, findRelatedPosts);
}

// get Ghost data
function getGhostData(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true); // true for asynchronous 
  xmlHttp.send(null);
}

// 
function findRelatedPosts(postData) {
  var tags = JSON.parse(postData).posts[0].tags;
  var postId = JSON.parse(postData).posts[0].id;
  var relatedTitle = document.getElementById("related-posts-title");
  var relatedPostsWrapper  = document.getElementById("related-posts");
  if (tags.length > 0) {
    tags = '[' + tags.map(function(obj) { return obj.slug; }).join(', ') + ']';
    var filter = 'id:-' + postId + '+tags:' + tags;
    var include = 'author, tags';

    var apiOptions = {
      limit: 6, 
      filter: filter,
      include: include
    };
    
    var url = ghost.url.api('posts', apiOptions);
    getGhostData(url, showRelatedPosts);
  } else {
    relatedTitle.style.display = "none";
    relatedPostsWrapper.style.display = "none";
  }
}

function showRelatedPosts(posts) {
  var relatedPosts = JSON.parse(posts).posts;
  var relatedTitle = document.getElementById("related-posts-title");
  var relatedPostsWrapper  = document.getElementById("related-posts");

  for (var i = relatedPosts.length - 1; i >= 0; i--) {
    var postImage = '';
    if (relatedPosts[i].feature_image) {
      var postImage = 'style="background-image: url(' + relatedPosts[i].feature_image + ')"';
    }
    relatedPostsWrapper.innerHTML += 
      '<div class="related-post">' +
        '<div class="related-post__image lazyload" ' + postImage + '></div>' +
        '<div class="related-post__content">' +
          '<h4 class="related-post__title">' +
            '<a href="' + relatedPosts[i].url + '">' +
              relatedPosts[i].title +
            '</a>' +
          '</h4>' +
          '<h6 class="related-post__author">' +
            '<a href="/author/' + relatedPosts[i].author.slug + '/">' +
              relatedPosts[i].author.name +
            '</a>' +
          '</h6>' +
        '</div>' +
      '</div>';
  }
}