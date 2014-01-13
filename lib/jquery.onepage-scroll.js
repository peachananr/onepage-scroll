/* ===========================================================
 * jquery-onepage-scroll.js v1.1.1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/onepage-scroll
 *
 * License: GPL v3
 *
 * ========================================================== */
(function ($, Modernizr) {
  "use strict";

  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    paginationTarget: "body",
    updateURL: false,
    touchEnabled: true,
    mousewheelEnabled: true,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: false
  };

  /*------------------------------------------------*/
  /*  Credit: Eike Send for the awesome swipe event */
  /*------------------------------------------------*/

  $.fn.swipeEvents = function () {
    return this.each(function () {

      var startX, startY, $this = $(this);

      function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind('touchmove', touchmove);
        }
        event.preventDefault();
      }

      function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;
          var triggerOffset = 50;

          if (deltaX >= triggerOffset) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -triggerOffset) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= triggerOffset) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -triggerOffset) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= triggerOffset || Math.abs(deltaY) >= triggerOffset) {
            $this.unbind('touchmove', touchmove);
          }
        }
        event.preventDefault();
      }

      $this.bind('touchstart', touchstart);

    });
  };

  $.fn.onepage_scroll = function (options) {
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer),
        bodyElement = $('body'),
        paginationLinks,
        total = sections.length,
        topPos = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";


    el.bind('beforeMove', function(event, index, nextIndex) {
      if (settings.pagination === true) {
        updatePagination(nextIndex);
      }

      updateBodyClass(index);
      updateHash(index);

      if (typeof settings.beforeMove === 'function') {
        settings.beforeMove(index, nextIndex);
      }
    });

    el.bind('afterMove', function(event, index, nextIndex) {
      if (typeof settings.afterMove === 'function') {
        settings.afterMove(index, nextIndex);
      }
    });

    $.fn.transformPage = function (settings, pos, currentIndex, nextIndex) {
      el.trigger('beforeMove', [currentIndex, nextIndex]);
      if (!Modernizr.csstransitions) {
        el.animate({top: pos +'%'}, settings.animationTime, 'swing', function() {
          el.trigger('afterMove', [currentIndex, nextIndex]);
        });
      } else {
        el.css({
          "-webkit-transform": "translate3d(0, " + pos + "%, 0)",
          "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
          "-moz-transform": "translate3d(0, " + pos + "%, 0)",
          "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
          "-ms-transform": "translate3d(0, " + pos + "%, 0)",
          "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
          "transform": "translate3d(0, " + pos + "%, 0)",
          "transition": "all " + settings.animationTime + "ms " + settings.easing
        }).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
          el.trigger('afterMove', [currentIndex, nextIndex]);
        });
      }
    };

    function updatePagination(index) {
        paginationLinks
          .removeClass("active")
          .filter("[data-index='" + index + "']")
          .addClass("active");
    }

    function updateBodyClass(index) {
        bodyElement[0].className = bodyElement[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        bodyElement.addClass("viewing-page-" + index);
    }

    function updateHash(index) {
      if (window.history.replaceState && settings.updateURL === true) {
        var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + index;
        window.history.pushState({}, window.document.title, href);
      }
    }

    function getCurrentIndex() {
      return sections.filter(".active").data("index");
    }

    function getCurrent() {
      return sections.filter(".active");
    }

    function getSection(index) {
      return sections.filter("[data-index='" + index + "']");
    }

    $.fn.moveTo = function (nextIndex) {
      var index, current, next, pos;
      index = getCurrentIndex();

      // if index egals nextIndex then no need to do anything !
      if(index === nextIndex) {
        return;
      }

      if (settings.loop === true) {
        nextIndex = ((nextIndex - 1 + total) % total) + 1;
      }

      next = getSection(nextIndex);

      if (!next.length) {
        return;
      }

      pos = (1 - nextIndex) * 100;

      current = getCurrent();
      current.removeClass("active");
      next.addClass("active");

      el.transformPage(settings, pos, index, nextIndex);
    };

    $.fn.move = function (direction) {
      var index = sections.filter(".active").data("index");

      if(direction === 'up') {
        index = index - 1;
      } else {
        index = index + 1;
      }

      el.moveTo(index);
    };

    $.fn.moveDown = function () {
      el.move('down');
    };

    $.fn.moveUp = function () {
      el.move('up');
    };

    function init_scroll(event, delta) {
      var deltaOfInterest = delta;
      var timeNow = new Date().getTime();
      // Cancel scroll if currently animating or within quiet period
      if (timeNow - lastAnimation < quietPeriod + settings.animationTime) {
        event.preventDefault();
        return;
      }

      if (deltaOfInterest < 0) {
        el.moveDown();
      } else {
        el.moveUp();
      }
      lastAnimation = timeNow;
    }

    // Prepare everything before binding wheel scroll
    el.addClass("onepage-wrapper").css("position", "relative");
    $.each(sections, function (i) {
      $(this).css({
        position: "absolute",
        top: topPos + "%"
      }).addClass("section").attr("data-index", i + 1);
      topPos = topPos + 100;
      if (settings.pagination === true) {
        paginationList += "<li><a data-index='" + (i + 1) + "' href='#" + (i + 1) + "'></a></li>";
      }
    });

    if(settings.touchEnabled === true) {
      el.swipeEvents().bind("swipeDown", function () {
        el.moveUp();
      }).bind("swipeUp", function () {
        el.moveDown();
      });
    }

    // Create Pagination and Display Them
    if (settings.pagination === true) {
      $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo(settings.paginationTarget);
      var posTop = (el.find(".onepage-pagination").height() / 2) * -1;
      el.find(".onepage-pagination").css("margin-top", posTop);
      paginationLinks = $('.onepage-pagination li a');
    }

    if (window.location.hash !== "" && window.location.hash !== "#1") {
      var init_index = window.location.hash.replace("#", "");

      var next = sections.filter("[data-index='" + (init_index) + "']");
      if (next) {
        updateHash(init_index);
      }

      el.moveTo(init_index);

    } else {
      getSection(1).addClass("active");
      updateBodyClass(1);
      if (settings.pagination === true) {
        updatePagination(1);
      }
    }
    if (settings.pagination === true) {
      paginationLinks.click(function (event) {
        var page_index = $(this).data("index");
        if (!$(this).hasClass("active")) {
          el.moveTo(page_index);
        }
        if (settings.updateURL === false) {
          event.preventDefault();
        }
      });
    }

    if (settings.mousewheelEnabled === true) {
      el.bind('mousewheel DOMMouseScroll', function (event) {

        if(event.target.tagName === 'SELECT') {
          return;
        }

        event.preventDefault();
        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        init_scroll(event, delta);

      });
    }

    if (settings.keyboard === true) {
      $(window.document).keydown(function (e) {
        var tag = e.target.tagName.toLowerCase();
        switch (e.which) {
        case 38:
          if (tag !== 'input' && tag !== 'textarea') {
            el.moveUp();
          }
          break;
        case 40:
          if (tag !== 'input' && tag !== 'textarea') {
            el.moveDown();
          }
          break;
        default:
          return;
        }
        e.preventDefault();
      });
    }

    return this;

  };

})(jQuery, window.Modernizr);


