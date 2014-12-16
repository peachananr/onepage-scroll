/* ===========================================================
 * jquery-onepage-scroll.js v1.4.1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/leftstick/onepage-scroll
 *
 * License: GPL v3
 *
 * ========================================================== */

(function ($) {

    var defaults = {
        sectionContainer: "section",
        easing: "ease",
        animationTime: 1000,
        pagination: true,
        updateURL: false,
        keyboard: true,
        beforeMove: null,
        afterMove: null,
        loop: false,
        responsiveFallback: false,
        responsiveHeightFallback: false,
        disableMouseMove: false,
        moveUpKeys: [33, 38],
        moveDownKeys: [34, 40],
        backtoTopKeys: [36],
        gotoBottom: [35]
    };

    /*------------------------------------------------*/
    /*  Credit: Eike Send for the awesome swipe event */
    /*------------------------------------------------*/

    $.fn.swipeEvents = function () {
        return this.each(function () {

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
                    event.preventDefault();
                }
            }

        });
    };


    $.fn.onepage_scroll = function (options) {
        var settings = $.extend({}, defaults, options),
            el = $(this),
            sections = $(settings.sectionContainer),
            total = sections.length,
            status = "off",
            topPos = 0,
            lastAnimation = 0,
            quietPeriod = 500,
            paginationList = "";

        $.fn.transformPage = function (settings, pos, index, next_el) {
            if (typeof settings.beforeMove == 'function') settings.beforeMove(index, next_el);
            $(this).css({
                "-webkit-transform": "translate3d(0, " + pos + "%, 0)",
                "-webkit-transition": "-webkit-transform " + settings.animationTime + "ms " + settings.easing,
                "-moz-transform": "translate3d(0, " + pos + "%, 0)",
                "-moz-transition": "-moz-transform " + settings.animationTime + "ms " + settings.easing,
                "-ms-transform": "translate3d(0, " + pos + "%, 0)",
                "-ms-transition": "-ms-transform " + settings.animationTime + "ms " + settings.easing,
                "transform": "translate3d(0, " + pos + "%, 0)",
                "transition": "transform " + settings.animationTime + "ms " + settings.easing
            });

            $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                if (typeof settings.afterMove == 'function') settings.afterMove(index, next_el);
            });
        };

        $.fn.moveDown = function () {
            var el = $(this),
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
            current.removeClass("active");
            next.addClass("active");
            if (settings.pagination === true) {
                $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
                $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
            }

            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-" + next.data("index"));

            if (history.replaceState && settings.updateURL === true) {
                var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index + 1);
                history.pushState({}, document.title, href);
            }
            el.transformPage(settings, pos, next.data("index"), next);
        };

        $.fn.moveUp = function () {
            var el = $(this),
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
            current.removeClass("active");
            next.addClass("active");
            if (settings.pagination === true) {
                $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
                $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
            }
            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-" + next.data("index"));

            if (history.replaceState && settings.updateURL === true) {
                var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index - 1);
                history.pushState({}, document.title, href);
            }
            el.transformPage(settings, pos, next.data("index"), next);
        };

        $.fn.moveTo = function (page_index) {
            current = $(settings.sectionContainer + ".active");
            next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
            if (next.length > 0) {
                current.removeClass("active");
                next.addClass("active");
                $(".onepage-pagination li a" + ".active").removeClass("active");
                $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
                $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
                $("body").addClass("viewing-page-" + next.data("index"));

                pos = ((page_index - 1) * 100) * -1;

                if (history.replaceState && settings.updateURL === true) {
                    var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (page_index - 1);
                    history.pushState({}, document.title, href);
                }
                el.transformPage(settings, pos, page_index, next);
            }
        };

        function responsive() {
            if ((settings.responsiveFallback && $(window).width() < settings.responsiveFallback) || (settings.responsiveHeightFallback && $(window).height() > settings.responsiveHeightFallback)) {
                $("body").addClass("disabled-onepage-scroll");
                $(document).unbind('mousewheel DOMMouseScroll');
                el.swipeEvents().unbind("swipeDown swipeUp touchstart touchmove");
            } else {
                if ($("body").hasClass("disabled-onepage-scroll")) {
                    $("body").removeClass("disabled-onepage-scroll");
                    $("html, body, .wrapper").animate({
                        scrollTop: 0
                    }, "fast");
                }


                el.swipeEvents().bind("swipeDown", function (event) {
                    if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
                    el.moveUp();
                }).bind("swipeUp", function (event) {
                    if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
                    el.moveDown();
                });

                if (!settings.disableMouseMove) {

                    $(document).bind('mousewheel DOMMouseScroll', function (event) {
                        // event.preventDefault();
                        current = $(settings.sectionContainer + ".active");
                        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                        if (current.height() >= current.find('.page-container').height() || (current.scrollTop() === 0 && delta >= 0) || ((current[0].scrollHeight - current.scrollTop() === current.height()) && delta < 0)) {
                            event.preventDefault();
                            init_scroll(event, delta);
                        }
                    });
                }
            }
        }


        function init_scroll(event, delta) {
            var deltaOfInterest = delta,
                timeNow = new Date().getTime();
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

        $('html').css('overflow', 'hidden').css('height', '100%');
        $('body').css('overflow', 'hidden').css('height', '100%');

        el.addClass("onepage-wrapper").css("position", "relative");
        $.each(sections, function (i) {
            $(this).addClass("ops-section").attr("data-index", i + 1);
            topPos = topPos + 100;
            if (settings.pagination === true) {
                paginationList += "<li><a data-index='" + (i + 1) + "' href='#" + (i + 1) + "'></a></li>";
            }
        });

        // Create Pagination and Display Them
        if (settings.pagination === true) {
            $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
            posTop = (el.find(".onepage-pagination").height() / 2) * -1;
            el.find(".onepage-pagination").css("margin-top", posTop);
        }

        if (window.location.hash !== "" && window.location.hash !== "#1" && $(settings.sectionContainer + "[data-index='" + window.location.hash.replace("#", "") + "']").length > 0) {
            init_index = window.location.hash.replace("#", "");
            $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active");
            $("body").addClass("viewing-page-" + init_index);
            if (settings.pagination === true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");

            next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
            if (next) {
                next.addClass("active");
                if (settings.pagination === true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
                $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
                $("body").addClass("viewing-page-" + next.data("index"));
                if (history.replaceState && settings.updateURL === true) {
                    var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (init_index);
                    history.pushState({}, document.title, href);
                }
            }
            pos = ((init_index - 1) * 100) * -1;
            el.transformPage(settings, pos, init_index);

        } else {
            $(settings.sectionContainer + "[data-index='1']").addClass("active");
            $("body").addClass("viewing-page-1");
            if (settings.pagination === true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
        }
        if (settings.pagination === true) {
            $(".onepage-pagination li a").click(function () {
                var page_index = $(this).data("index");
                el.moveTo(page_index);
            });
        }

        if (!settings.disableMouseMove) {
            $(document).bind('mousewheel DOMMouseScroll', function (event) {

                current = $(settings.sectionContainer + ".active");
                var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                if (current.height() >= current.find('.page-container').height() || (current.scrollTop() === 0 && delta >= 0) || ((current[0].scrollHeight - current.scrollTop() === current.height()) && delta < 0)) {
                    event.preventDefault();
                    if (!$("body").hasClass("disabled-onepage-scroll")) {
                        init_scroll(event, delta);
                    }
                }
            });
        }



        if (settings.responsiveFallback || settings.responsiveHeightFallback) {
            $(window).resize(function () {
                responsive();
            });

            responsive();
        }

        if (settings.keyboard === true) {
            $(document).keydown(function (e) {
                var tag = e.target.tagName.toLowerCase();

                if (!$("body").hasClass("disabled-onepage-scroll") && (tag !== 'input' && tag !== 'textarea')) {

                    if ($.inArray(e.which, settings.moveUpKeys) > -1) {
                        el.moveUp();
                    } else if ($.inArray(e.which, settings.moveDownKeys) > -1) {
                        el.moveDown();
                    } else if ($.inArray(e.which, settings.backtoTopKeys) > -1) {
                        el.moveTo(1);
                    } else if ($.inArray(e.which, settings.gotoBottom) > -1) {
                        var lastIndex = sections.last().data("index");
                        el.moveTo(lastIndex);
                    }
                }

            });
        }
        return false;
    };

    $.fn.destroy_onepage_scroll = function (options) {
        var settings = $.extend({}, defaults, options);
        var el = $(this);
        var sections = $(settings.sectionContainer);

        $('html').css('overflow', '').css('height', '');
        $('body').css('overflow', '').css('height', '');

        el.removeClass("onepage-wrapper");
        $.each(sections, function (i) {
            //removeData('index') is necessary because in some situations (when dynamic change html) pagination breaks
            $(this).removeClass("ops-section active").removeAttr("data-index").removeData('index');
        });

        el.swipeEvents().unbind("swipeDown swipeUp touchstart touchmove");
        $("body").removeClass("disabled-onepage-scroll");
        $('.onepage-pagination li a').unbind('click');
        $('ul.onepage-pagination').remove();

        var classListOnBody = $('body').attr('class').split(/\s+/);
        $.each(classListOnBody, function (index, item) {
            if (item.indexOf('viewing-page-') >= 0) {
                $('body').removeClass(item);
            }
        });

        $(document).unbind('mousewheel DOMMouseScroll');
        $(window).unbind('resize');
        $(document).unbind('keydown');
    };


})(window.jQuery);