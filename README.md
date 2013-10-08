#One Page Scroll by Pete R. remixed by Michael Humphries
Create an Apple-like one page scroll website (iPhone 5S website) with One Page Scroll plugin
Originally Created by [Pete R.](http://www.thepetedesign.com), Founder of [BucketListly](http://www.bucketlistly.com)

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
   quietPeriod: 200 //Lets you define how long the page ignores new scroll/swipe events while animation is occuring
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
### $.fn.moveTop()
This method allows you to move the page up to the first section. 

````javascript
  $(".main").moveTop();
````

### $.fn.moveBottom()
This method allows you to move the page down to the last section.

````javascript
  $(".main").moveBottom();
````

### $.fn.moveTo(i)
This method allows you to move the page to the desired section by index.

````javascript
  var index = 3;
  $(".main").moveTo(index);
````

If you want to see more of my plugins, visit [The Pete Design](http://www.thepetedesign.com/#design), or follow me on [Twitter](http://www.twitter.com/peachananr) and [Github](http://www.github.com/peachananr).

## Other Resources
- [OnePageScroll.js: Creating an Apple’s iPhone 5S Website](http://www.onextrapixel.com/2013/09/18/onepagescroll-js-creating-an-apples-iphone-5s-website/)
- [Eike Send's jQuery Swipe Events](https://github.com/eikes/jquery.swipe-events.js)
- [CSS Easing generator by Matthew Lein](http://matthewlein.com/ceaser/)
