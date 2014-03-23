#One Page Scroll by Pete R.
Create an Apple-like one page scroll website (iPhone 5S website) with One Page Scroll plugin
Created by [Pete R.](http://www.thepetedesign.com), Founder of [BucketListly](http://www.bucketlistly.com)

License: [Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/deed.en_US)

[![One Page Scroll](http://www.thepetedesign.com/images/onepage_scroll_image.png "One Page Scroll")](http://www.thepetedesign.com/demos/onepage_scroll_demo.html)

## Requirement

jQuery (1.9.0 or later)

note: jQuery 1.9.0 or later is strongly recommended because using jQuery less than 1.8.3 and jquery.onepage-scroll.js together turns out to be a hash-based XSS vulnerabiliry.

see: http://jsfiddle.net/33WJx/

## Demo
[View demo](http://www.thepetedesign.com/demos/onepage_scroll_demo.html)

## Compatibility
Modern browsers such as Chrome, Firefox, and Safari on both desktop and smartphones have been tested. Not tested on IE.

## Basic Usage
One Page Scroll let you transform your website into a one page scroll website that allows users to scroll one page at a time. It is perfect for creating a website in which you want to present something to the viewers. For example, [Apple's iPhone 5S website](http://www.apple.com/iphone-5s/) uses the same technique.


To add this to your website, simply include the latest jQuery library together with `jquery.onepage-scroll.js`, `onepage-scroll.css` into your document's `<head>` and call the function as follows:

````html
<body>
  ...
  <div class="main">
    <section>...</section>
    <section>...</section>
    ...
  </div>
  ...
</body>
````
Container "Main" must be one level below the `body` tag in order to make it work full page. Now call the function to activate as follows:
 
````javascript
$(".main").onepage_scroll({
   sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
   easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", 
                                    // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
   animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
   pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
   beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
   afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
   loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
   keyboard: true,                  // You can activate the keyboard controls
   responsiveFallback: false        // You can fallback to normal page scroll by defining the width of the browser in which
                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever 
                                    // the browser's width is less than 600, the fallback will kick in.
});
````
And that's it. Now, your website should work the same way Apple's iPhone 5S website does. You should be able to swipe up/down as well (thanks to [Eike Send](https://github.com/eikes) for his swipe events!) when viewing your website on mobile phones.

## Public Methods
You can also trigger page move programmatically as well:

### $.fn.moveUp()
This method allows you to move the page up by one. This action is equivalent to scrolling up/swiping down.

````javascript
  $(".main").moveUp();
````

### $.fn.moveDown()
This method allows you to move the page down by one. This action is equivalent to scrolling down/swiping up.

````javascript
  $(".main").moveDown();
````

### $.fn.moveTo(page_index)
This method allows you to move to the specified page index programatically.

````javascript
  $(".main").moveTo(3);
````

## Callbacks
You can use callbacks to perform actions before or after the page move.

### beforeMove(next_page_index, next_section_element)
This callback gets called before the plugin performs its move.

````javascript
  $(".main").onepage_scroll({
    beforeMove: function(index, next_el) {
      ...
    }
  });
````

### afterMove(next_page_index, next_section_element)
This callback gets called after the move animation was performed.

````javascript
  $(".main").onepage_scroll({
    afterMove: function(index, next_el) {
      ...
    }
  });
````

If you want to see more of my plugins, visit [The Pete Design](http://www.thepetedesign.com/#design), or follow me on [Twitter](http://www.twitter.com/peachananr) and [Github](http://www.github.com/peachananr).

## Other Resources
- [OnePageScroll.js: Creating an Apple’s iPhone 5S Website](http://www.onextrapixel.com/2013/09/18/onepagescroll-js-creating-an-apples-iphone-5s-website/)
- [Eike Send's jQuery Swipe Events](https://github.com/eikes/jquery.swipe-events.js)
- [CSS Easing generator by Matthew Lein](http://matthewlein.com/ceaser/)
