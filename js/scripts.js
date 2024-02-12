var s; // alias for settings object

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

}; // The end of APP Object
	
	
/**
* Start things off 
*/
$( document ).ready(function() {
	APP.init();
	gsap.registerPlugin(ScrollTrigger);

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

	//Key codes for up and down arrows on keyboard. We'll be using this to navigate change slides using the keyboard
	var keyCodes = {
		UP  : 38,
		DOWN: 40
	}

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
		goToSlide(prevInDOM($('.slide'), $currentSlide));
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
	function nextInDOM(_selector, _subject) {
		var next = getNext(_subject);
		while(next.length != 0) {
			var found = searchFor(_selector, next);
			if(found != null) return found;
			next = getNext(next);
		}
		return null;
	}
	function prevInDOM(_selector, _subject) {
		var next = getPrev(_subject);
		while(next.length != 0) {
			var found = searchFor(_selector, next);
			if(found != null) return found;
			next = getPrev(next);
		}
		return null;
	}
	function getNext(_subject) {
		if(_subject.next().length > 0) return _subject.next();
		return getNext(_subject.parent());
	}
	function getPrev(_subject) {
		if(_subject.prev().length > 0) return _subject.prev();
		return getPrev(_subject.parent());
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
	function vhToPixels(vh) {
		return Math.round(window.innerHeight / (100 / vh)) + 'px';
	}
	
	
	const mediaQuery = window.matchMedia('(min-width: 800px)');
	
	if(mediaQuery.matches) {
	
		//Going to the first slide
		goToSlide($currentSlide);
	
		/*
		*   Adding event listeners
		* */
		$window.on("resize", onResize).resize();
		$window.on("wheel", onMouseWheel);
		$document.on("keydown", onKeyDown);
	
		let panels = gsap.utils.toArray(".slide-gsap");
		// we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
		let tops = panels.map(panel => ScrollTrigger.create({trigger: panel, start: "top top"}));
	
		panels.forEach((panel, i) => {
			ScrollTrigger.create({
				trigger: panel,
				start: "top top", // if it's shorter than the viewport, we prefer to pin it at the top
				pin: true, 
				pinSpacing: false 
			});
		});
	
		/**
		* GSAP Scroll Trigger for slides sliding down
		*/
		gsap.from(".introduction__2", {
			scrollTrigger: {
				trigger: ".introduction__1",
				start: "top bottom",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".impact__1", {
			scrollTrigger: {
				trigger: ".impact__1",
				start: "top 99%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".finances__1", {
			scrollTrigger: {
				trigger: ".finances__1",
				start: "top 99%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".capital-improvements__2", {
			scrollTrigger: {
				trigger: ".capital-improvements__1",
				start: "top 99%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".our-partners__1", {
			scrollTrigger: {
				trigger: ".our-partners__1",
				start: "top 99%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		ScrollTrigger.create({
			trigger: ".impact__4",
			start: "top top",
			end: vhToPixels(100),
			endTrigger: ".impact__7",
			pin: true, 
			pinSpacing: false,
		});
	
		ScrollTrigger.create({
			trigger: ".capital-improvements__1",
			start: "top top",
			end: vhToPixels(100),
			endTrigger: ".capital-improvements__2-2",
			pin: true, 
			pinSpacing: false,
		});
	
		ScrollTrigger.create({
			trigger: ".capital-improvements__3",
			start: "top top",
			end: vhToPixels(100),
			endTrigger: ".capital-improvements__4-2",
			pin: true, 
			pinSpacing: false,
		});
	
		ScrollTrigger.create({
			trigger: ".capital-improvements__5",
			start: "top top",
			end: vhToPixels(100),
			endTrigger: ".capital-improvements__6-2",
			pin: true, 
			pinSpacing: false,
		});	
	}

	// const tl = gsap.timeline({
	// 	scrollTrigger: {
	// 	  trigger: "#parallax-container",
	// 	  start: "top top",
	// 	  end: "bottom top",
	// 	  scrub: true
	// 	}
	//   });
	  
	//   gsap.utils.toArray(".parallax").forEach(layer => {
	// 	const depth = layer.dataset.depth;
	// 	const movement = -(layer.offsetHeight * depth)
	// 	tl.to(layer, {y: movement, ease: "none"}, 0)
	//   });

	  gsap.to(".parallax", {
		scrollTrigger: {
		  trigger: ".parallax",
		  start: "top bottom",
		  end: "bottom top",
		  scrub: true
		}, 
		y: (i, target) => -200 * target.dataset.speed,
		ease: "none"
	  });
	

});






