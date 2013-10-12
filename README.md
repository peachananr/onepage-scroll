#One Page Scroll by Pete R.
Create an Apple-like one page scroll website (iPhone 5S website) with One Page Scroll plugin
Created by [Pete R.](http://www.thepetedesign.com), Founder of [BucketListly](http://www.bucketlistly.com)

[![One Page Scroll](http://www.thepetedesign.com/images/onepage_scroll_image.png "One Page Scroll")](http://www.thepetedesign.com/demos/onepage_scroll_demo.html)

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
   sectionContainer: "section", // sectionContainer accepts any kind of selector in case you don't want to use section
   easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
   animationTime: 1000, // AnimationTime let you define how long each section takes to animate
   pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.
   updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
<<<<<<< HEAD
   direction: 'vertical' // You can control the direction of scroll and order of sections to be "vertical" or "horizontal",
   touchTarget: '.top-layer' // You can attach the touch events to another container, for example if using multiple z-index div's
=======
   onBeforePageSwitch: null,
   onAfterPageSwitch: null,
   onPageJump: null
>>>>>>> bluefirex/master
});
````
And that's it. Now, your website should work the same way Apple's iPhone 5S website does. You should be able to swipe up/down as well (thanks to [Eike Send](https://github.com/eikes) for his swipe events!) when viewing your website on mobile phones.

## Callbacks
You can use callbacks to perform actions before, while or after page jumps.

### onBeforePageSwitch(currentPage)
Gets called before switching a page. `currentPage` is the index of the old page.

### onAfterPageSwitch(newPage)
Gets called after switching a page. `newPage` is the index of the new page.

### onPageJump(oldPage, newPage)
Gets called when jumping a page (i.e. clicking a dot in the pagination or using an URL). `oldPage` is the index of the old page, `newPage` of the new page.

## Public Methods
You can also trigger page move programmatically as well:

### $.fn.moveUp(increment)
This method allows you to move the page up by one. This action is equivalent to scrolling up/swiping down. The `increment` variable is an option which allows the moving of the page up by the given increment.

````javascript
  $(".main").moveUp();
````

### $.fn.moveDown(increment)
This method allows you to move the page down by one. This action is equivalent to scrolling down/swiping up. The `increment` variable is an option which allows the moving of the page down by the given increment.


````javascript
  $(".main").moveDown();
````

### $.fn.moveToSlide(newIndex)
This method allows you to move to a chosen page index. The `newIndex` variable is the destination page index.


````javascript
  $(".main").moveToSlide(3);
````

If you want to see more of my plugins, visit [The Pete Design](http://www.thepetedesign.com/#design), or follow me on [Twitter](http://www.twitter.com/peachananr) and [Github](http://www.github.com/peachananr).

## Other Resources
- [OnePageScroll.js: Creating an Apple’s iPhone 5S Website](http://www.onextrapixel.com/2013/09/18/onepagescroll-js-creating-an-apples-iphone-5s-website/)
- [Eike Send's jQuery Swipe Events](https://github.com/eikes/jquery.swipe-events.js)
- [CSS Easing generator by Matthew Lein](http://matthewlein.com/ceaser/)
