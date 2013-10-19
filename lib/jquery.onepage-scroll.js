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
(function ($) {
  "use strict";

  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false,
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

          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
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
        total = sections.length,
        topPos = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";

    $.fn.transformPage = function (settings, pos, index) {
      $(this).css({
        "-webkit-transform": "translate3d(0, " + pos + "%, 0)",
        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-moz-transform": "translate3d(0, " + pos + "%, 0)",
        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-ms-transform": "translate3d(0, " + pos + "%, 0)",
        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "transform": "translate3d(0, " + pos + "%, 0)",
        "transition": "all " + settings.animationTime + "ms " + settings.easing
      });
      $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        if (typeof settings.afterMove === 'function') {
          settings.afterMove(index);
        }
      });
    };

    $.fn.moveDown = function () {
      var el, index, current, next, pos;
      el = $(this);
      index = $(settings.sectionContainer + ".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
      if (next.length < 1) {
        if (settings.loop === true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return;
        }

      } else {
        pos = (index * 100) * -1;
      }
      if (typeof settings.beforeMove === 'function') {
        settings.beforeMove(current.data("index"));
      }
      current.removeClass("active");
      next.addClass("active");
      if (settings.pagination === true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }

      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-" + next.data("index"));

      if (window.history.replaceState && settings.updateURL === true) {
        var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index + 1);
        window.history.pushState({}, window.document.title, href);
      }
      el.transformPage(settings, pos, index);
    };

    $.fn.moveUp = function () {
      var el, index, current, next, pos;
      el = $(this);
      index = $(settings.sectionContainer + ".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");

      if (next.length < 1) {
        if (settings.loop === true) {
          pos = ((total - 1) * 100) * -1;
          next = $(settings.sectionContainer + "[data-index='" + total + "']");
        } else {
          return;
        }
      } else {
        pos = ((next.data("index") - 1) * 100) * -1;
      }
      if (typeof settings.beforeMove === 'function') {
        settings.beforeMove(current.data("index"));
      }
      current.removeClass("active");
      next.addClass("active");
      if (settings.pagination === true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-" + next.data("index"));

      if (window.history.replaceState && settings.updateURL === true) {
        var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index - 1);
        window.history.pushState({}, window.document.title, href);
      }
      el.transformPage(settings, pos, index);
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

    el.swipeEvents().bind("swipeDown", function () {
      el.moveUp();
    }).bind("swipeUp", function () {
      el.moveDown();
    });

    // Create Pagination and Display Them
    if (settings.pagination === true) {
      $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
      var posTop = (el.find(".onepage-pagination").height() / 2) * -1;
      el.find(".onepage-pagination").css("margin-top", posTop);
    }

    if (window.location.hash !== "" && window.location.hash !== "#1") {
      var init_index = window.location.hash.replace("#", "");
      $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active");
      $("body").addClass("viewing-page-" + init_index);
      if (settings.pagination === true) {
        $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");
      }

      var next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
      if (next) {
        next.addClass("active");
        if (settings.pagination === true) {
          $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
        }
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-" + next.data("index"));
        if (window.history.replaceState && settings.updateURL === true) {
          var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (init_index);
          window.history.pushState({}, window.document.title, href);
        }
      }
      var pos = ((init_index - 1) * 100) * -1;
      el.transformPage(settings, pos, init_index);

    } else {
      $(settings.sectionContainer + "[data-index='1']").addClass("active");
      $("body").addClass("viewing-page-1");
      if (settings.pagination === true) {
        $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
      }
    }
    if (settings.pagination === true) {
      $(".onepage-pagination li a").click(function () {
        var page_index = $(this).data("index");
        if (!$(this).hasClass("active")) {
          var current, next;
          current = $(settings.sectionContainer + ".active");
          next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
          if (next) {
            current.removeClass("active");
            next.addClass("active");
            $(".onepage-pagination li a" + ".active").removeClass("active");
            $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-" + next.data("index"));
          }
          pos = ((page_index - 1) * 100) * -1;
          el.transformPage(settings, pos, page_index);
        }
        if (settings.updateURL === false) {
          return false;
        }
      });
    }



    $(window.document).bind('mousewheel DOMMouseScroll', function (event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      init_scroll(event, delta);
    });

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
    return false;

  };

})(jQuery);
