/* ===========================================================
 * jquery-onepage-scroll.js v1.3.1
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
 * Credit: Ken Frederick for the "direction", "touchTarget", bower.json and "onLoad" options
 * https://github.com/frederickk
 *
 * Credit: Jay Contonio for the moveTo method
 * https://github.com/jcontonio
 *
 * ========================================================== */

!function($) {

  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 750,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: false,

    // additions
    direction: "vertical",
    touchTarget: null,
    onLoad: null
  };

  /*------------------------------------------------*/
  /*  Credit: Eike Send for the awesome swipe event */
  /*------------------------------------------------*/

  $.fn.swipeEvents = function() {
      return this.each(function() {

      var startX,
          startY,
          $this = $(this);

      $this.bind('touchstart', touchstart);

      function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind('touchmove', touchmove);
        }
        event.preventDefault();
      };

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
      };

      });
    };

  $.fn.onepage_scroll = function(options) {
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer)
        total = sections.length,
        status = "off",
        topPos = 0,
        leftPos = 0,
        currentPos = 0,
        lastAnimation = 0,
        quietPeriod = 300,
        paginationList = "";

    $.fn.transformPage = function(settings, pos, index) {
      $(this).css({
        "-webkit-transform": ( settings.direction == 'horizontal' )
          ? "translate3d(" + pos + "%, 0, 0)"
          : "translate3d(0, " + pos + "%, 0)",
        "-moz-transform": ( settings.direction == 'horizontal' )
          ? "translate3d(" + pos + "%, 0, 0)"
          : "translate3d(0, " + pos + "%, 0)",
        "-ms-transform": ( settings.direction == 'horizontal' )
          ? "translate3d(" + pos + "%, 0, 0)"
          : "translate3d(0, " + pos + "%, 0)",
        "transform": ( settings.direction == 'horizontal' )
          ? "translate3d(" + pos + "%, 0, 0)"
          : "translate3d(0, " + pos + "%, 0)",

        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "transition": "all " + settings.animationTime + "ms " + settings.easing
      });
      $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        if (typeof settings.afterMove == 'function') settings.afterMove(index);
      });
    };

    $.fn.moveDown = function(increment) {
      var el = $(this);
      increment = (increment != undefined) ? increment : 1;
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + increment) + "']");

      if(next.length < 1) {
        if (settings.loop == true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return
        }

      }
      else {
        // pos = (index * 100) * -1;
        pos = ((next.data("index") - 1) * 100) * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove( current.data("index"));
      current.removeClass("active")
      next.addClass("active");
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }

      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))

      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + increment);
        history.pushState( {}, document.title, href );
      }
      el.transformPage(settings, pos, index);
    };

    $.fn.moveUp = function(increment) {
      var el = $(this);
      increment = (increment != undefined) ? increment : 1;
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - increment) + "']");

      if(next.length < 1) {
        if (settings.loop == true) {
          pos = ((total - 1) * 100) * -1;
          next = $(settings.sectionContainer + "[data-index='"+total+"']");
        }
        else {
          return
        }
      }
      else {
        pos = ((next.data("index") - 1) * 100) * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove(current.data("index"));
      current.removeClass("active")
      next.addClass("active")
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))

      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index - increment);
        history.pushState( {}, document.title, href );
      }
      el.transformPage(settings, pos, index);
    };

    $.fn.moveTo = function(slideIndex) {
      var el = $(this);
      index = $(settings.sectionContainer +".active").data("index");

      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + slideIndex + "']");
      if (next) {
        current.removeClass("active");
        next.addClass("active");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"));
      pos = ((next.data("index") - 1) * 100) * -1;
      el.transformPage(settings, pos);
    };

    function init_scroll(event, delta) {
        deltaOfInterest = delta;
        var timeNow = new Date().getTime();
        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          el.moveDown()
        } else {
          el.moveUp()
        }
        // el.trigger('swiped', [(parseInt($(settings.sectionContainer +".active").data("index")) - 1)]);
        lastAnimation = timeNow;
    };

    // Prepare everything before binding wheel scroll
    el.addClass("onepage-wrapper").css("position","relative");
    $.each( sections, function(i) {
      $(this).css({
        position: "absolute",
        left: ( settings.direction == 'horizontal' )
          ? leftPos + "%"
          : 0,
        top: ( settings.direction == 'vertical' || settings.direction != 'horizontal' )
          ? topPos + "%"
          : 0,
      }).addClass("section").attr("data-index", i+1);
      if( settings.direction == 'horizontal' ) {
        leftPos = leftPos + 100;
      }
      else {
        topPos = topPos + 100;
      }
      if(settings.pagination == true) {
        paginationList += "<li><a data-index='"+(i+1)+"' href='#" + (i+1) + "'></a></li>"
      }
    });

    if( settings.direction == 'horizontal' ) {
      if( settings.touchTarget != null ) {
        $(settings.touchTarget).swipeEvents().bind("swipeRight", function(){
          el.moveUp();
        }).bind("swipeLeft", function(){
          el.moveDown();
        });
      }

      el.swipeEvents().bind("swipeRight", function(){
        el.moveUp();
      }).bind("swipeLeft", function(){
        el.moveDown();
      });
    }
    else {
      if( settings.touchTarget != null ) {
        $(settings.touchTarget).swipeEvents().bind("swipeDown",  function(){
          el.moveUp();
        }).bind("swipeUp", function(){
          el.moveDown();
        });
      }

      el.swipeEvents().bind("swipeDown",  function(){
        el.moveUp();
      }).bind("swipeUp", function(){
        el.moveDown();
      });
    }

    // Create Pagination and Display Them
    if(settings.pagination == true) {
      $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
      if( settings.direction == 'horizontal' ) {
        posLeft = (el.find(".onepage-pagination").width() / 2) * -1;
        el.find(".onepage-pagination").css("margin-left", posLeft);
      }
      else {
        posTop = (el.find(".onepage-pagination").height() / 2) * -1;
        el.find(".onepage-pagination").css("margin-top", posTop);
      }
    }

    // Check URL for slide index
    if(window.location.hash != "" && window.location.hash != "#1") {
      init_index =  window.location.hash.replace("#", "")
      $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active")
      $("body").addClass("viewing-page-"+ init_index)
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");

      if (typeof settings.onPageJump == 'function') settings.onPageJump(0, init_index);

      next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
      if(next) {
        next.addClass("active")
        if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"))
        if (history.replaceState && settings.updateURL == true) {
          var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (init_index);
          history.pushState( {}, document.title, href );
        }
      }
      pos = ((init_index - 1) * 100) * -1;
      el.transformPage(settings, pos, init_index);

    }
    else{
      $(settings.sectionContainer + "[data-index='1']").addClass("active")
      $("body").addClass("viewing-page-1")
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
    }
    if(settings.pagination == true)  {
      $(".onepage-pagination li a").click(function (){
        var page_index = $(this).data("index");
        if (!$(this).hasClass("active")) {
          current = $(settings.sectionContainer + ".active")
          next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");

          if (typeof settings.onPageJump == 'function') settings.onPageJump(current, page_index);

          if(next) {
            current.removeClass("active")
            next.addClass("active")
            $(".onepage-pagination li a" + ".active").removeClass("active");
            $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-"+next.data("index"))
          }
          pos = ((page_index - 1) * 100) * -1;
          el.transformPage(settings, pos, page_index);
        }
        if (settings.updateURL == false) return false;
      });
    }

    $(document).bind('mousewheel DOMMouseScroll', function(event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      init_scroll(event, delta);
    });


    if(settings.keyboard == true) {
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();
        switch(e.which) {
          case 38:
            if (tag != 'input' && tag != 'textarea') el.moveUp()
          break;
          case 40:
            if (tag != 'input' && tag != 'textarea') el.moveDown()
          break;
          default: return;
        }
        e.preventDefault();
      });
    }

    if (typeof settings.onLoad == 'function') settings.onLoad( $(settings.sectionContainer +".active").data("index") );
    return false;

  };

}(window.jQuery);

