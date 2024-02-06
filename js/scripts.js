var s; // alias for settings object

// var $window = $(window);
// var $document = $(document);
// var $slidesContainer = $(".slides-container");
// var $slides = $(".slide");
// var $currentSlide = $slides.first();

// //Animating flag - is our app animating
// var isAnimating = false;

// //The height of the window
// var pageHeight = $window.innerHeight();

// //Key codes for up and down arrows on keyboard. We'll be using this to navigate change slides using the keyboard
// var keyCodes = {
// 	UP  : 38,
// 	DOWN: 40
// }

// Now, the App object...
APP = { 
	
	/**
	* SETTINGS
	*/
	settings: {
    },
        
        
	/**
	* FUNCTION: init()
	* ********
	* Initiate things
	*/
	init : function() {
        s = APP.settings; // setup alias for settings object
	},

	// fullPageScroll : function() {
	// 	$window.on("resize", this.onResize).resize();
	// 	$window.on("mousewheel DOMMouseScroll", this.onMouseWheel);
	// 	$document.on("keydown", this.onKeyDown);
	// },

	// onKeyDown : function(event) {

	// 	var PRESSED_KEY = event.keyCode;

	// 	if(PRESSED_KEY == keyCodes.UP)
	// 	{
	// 		goToPrevSlide();
	// 		event.preventDefault();
	// 	}
	// 	else if(PRESSED_KEY == keyCodes.DOWN)
	// 	{
	// 		goToNextSlide();
	// 		event.preventDefault();
	// 	}

	// },

	// onMouseWheel : function(event)	{
	// 	//Normalize event wheel delta
	// 	var delta = event.originalEvent.wheelDelta / 30 || -event.originalEvent.detail;

	// 	//If the user scrolled up, it goes to previous slide, otherwise - to next slide
	// 	if(delta < -1)
	// 	{
	// 		goToNextSlide();
	// 	}
	// 	else if(delta > 1)
	// 	{
	// 		goToPrevSlide();
	// 	}

	// 	event.preventDefault();
	// },

	// goToSlide : function($slide) {
	// 	//If the slides are not changing and there's such a slide
	// 	if(!isAnimating && $slide.length)
	// 	{
	// 		//setting animating flag to true
	// 		isAnimating = true;
	// 		$currentSlide = $slide;

	// 		//Sliding to current slide
	// 		TweenLite.to($slidesContainer, 1, {scrollTo: {y: pageHeight * $currentSlide.index() }, onComplete: this.onSlideChangeEnd});

	// 	}
	// },

	// onSlideChangeEnd : function()
	// {
	// 	isAnimating = false;
	// },

	// onResize : function(event) {

	// 	//This will give us the new height of the window
	// 	var newPageHeight = $window.innerHeight();

	// 	/*
	// 	*   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
	// 	* */
	// 	if(pageHeight !== newPageHeight)
	// 	{
	// 		pageHeight = newPageHeight;

	// 		//This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
	// 		TweenLite.set([$slidesContainer, $slides], {height: pageHeight + "px"});

	// 		//The current slide should be always on the top
	// 		TweenLite.set($slidesContainer, {scrollTo: {y: pageHeight * $currentSlide.index() }});
	// 	}

	// },

}; // The end of APP Object
	
	
/**
* Start things off 
*/
$( document ).ready(function() {
	APP.init();
	// APP.goToSlide($currentSlide);
	// APP.fullPageScroll();

	//First the variables our app is going to use need to be declared

	// //References to DOM elements
	var $window = $(window);
	var $document = $(document);
	//Only links that starts with #
	var $slidesContainer = $(".slides-container");
	var $slides = $(".slide");
	var $currentSlide = $slides.first();

	//Animating flag - is our app animating
	var isAnimating = false;

	//The height of the window
	var pageHeight = window.innerHeight;
	console.log(pageHeight);

	//Key codes for up and down arrows on keyboard. We'll be using this to navigate change slides using the keyboard
	var keyCodes = {
		UP  : 38,
		DOWN: 40
	}

	//Going to the first slide
	goToSlide($currentSlide);


	/*
	*   Adding event listeners
	* */

	$window.on("resize", onResize).resize();
	$window.on("mousewheel DOMMouseScroll", onMouseWheel);
	$document.on("keydown", onKeyDown);

	/*
	*   Internal functions
	* */


	/*
	*   Getting the pressed key. Only if it's up or down arrow, we go to prev or next slide and prevent default behaviour
	*   This way, if there's text input, the user is still able to fill it
	* */
	function onKeyDown(event)
	{

		var PRESSED_KEY = event.keyCode;

		if(PRESSED_KEY == keyCodes.UP)
		{
			goToPrevSlide();
			event.preventDefault();
		}
		else if(PRESSED_KEY == keyCodes.DOWN)
		{
			goToNextSlide();
			event.preventDefault();
		}

	}

	/*
	*   When user scrolls with the mouse, we have to change slides
	* */
	function onMouseWheel(event)
	{
		//Normalize event wheel delta
		var delta = event.originalEvent.wheelDelta / 30 || -event.originalEvent.detail;

		//If the user scrolled up, it goes to previous slide, otherwise - to next slide
		if(delta <= -1)
		{
			goToNextSlide();
		}
		else if(delta > 1)
		{
			goToPrevSlide();
		}

		event.preventDefault();
	}

	/*
	*   If there's a previous slide, slide to it
	* */
	function goToPrevSlide()
	{
		if($currentSlide.prev().length)
		{
			goToSlide($currentSlide.prev());
		}
	}

	/*
	*   If there's a next slide, slide to it
	* */
	function goToNextSlide()
	{
		goToSlide(nextInDOM($('.slide'), $currentSlide));
	}

	/*
	*   Actual transition between slides
	* */
	function goToSlide($slide)
	{
		//console.log($currentSlide);
		console.log(pageHeight * $currentSlide.index(".slide"));
		//If the slides are not changing and there's such a slide
		if(!isAnimating && $slide.length)
		{
			//setting animating flag to true
			isAnimating = true;
			$currentSlide = $slide;

			//Sliding to current slide
			gsap.to(window, 1, {scrollTo: {y: pageHeight * $currentSlide.index(".slide")}, onComplete: onSlideChangeEnd});

		}
	}

	/*
	*   Once the sliding is finished, we need to restore "isAnimating" flag.
	*   You can also do other things in this function, such as changing page title
	* */
	function onSlideChangeEnd()
	{
		isAnimating = false;
	}

	/*
	*   When user resize it's browser we need to know the new height, so we can properly align the current slide
	* */
	function onResize(event)
	{

		//This will give us the new height of the window
		var newPageHeight = window.innerHeight;

		/*
		*   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
		* */
		if(pageHeight !== newPageHeight)
		{
			pageHeight = newPageHeight;

			//This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
			TweenLite.set([$slidesContainer, $slides], {height: pageHeight + "px"});

			//The current slide should be always on the top
			TweenLite.set($slidesContainer, {scrollTo: {y: pageHeight * $currentSlide.index() }});
		}

	}

});

function nextInDOM(_selector, _subject) {
    var next = getNext(_subject);
    while(next.length != 0) {
        var found = searchFor(_selector, next);
        if(found != null) return found;
        next = getNext(next);
    }
    return null;
}
function getNext(_subject) {
    if(_subject.next().length > 0) return _subject.next();
    return getNext(_subject.parent());
}
function searchFor(_selector, _subject) {
    if(_subject.is(_selector)) return _subject;
    else {
        var found = null;
        _subject.children().each(function() {
            found = searchFor(_selector, $(this));
            if(found != null) return false;
        });
        return found;
    }
    return null; // will/should never get here
}

gsap.registerPlugin(ScrollTrigger);

let panels = gsap.utils.toArray(".slide");
// we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
let tops = panels.map(panel => ScrollTrigger.create({trigger: panel, start: "top top"}));

panels.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
    pin: true, 
    pinSpacing: false 
  });
});



