var s; // alias for settings object

// //References to DOM elements
var $window = $(window);
var $document = $(document);
var $slidesContainer = $(".slides-container");
var $slides = $(".slide");
var $currentSlide = $slides.first();

//Unused
var videoFlag = 0;

//Splash logo animation loading flag
var isLoading = 1;

//Animating flag - is our app animating
var isAnimating = false;

//The height and width of the window
var pageHeight = document.documentElement.clientHeight;
var pageWidth = document.documentElement.clientWidth;

// const appHeight = () => {
// 	const doc = document.documentElement;
// 	doc.style.setProperty('--app-height', `${pageHeight}px`);
// 	//console.log(window.getComputedStyle(document.documentElement).getPropertyValue('--app-height'));
//    }
// window.addEventListener('resize', appHeight);
// appHeight();

// const appWidth = () => {
// 	const doc = document.documentElement;
// 	doc.style.setProperty('--app-width', `${pageWidth}px`);
// 	//console.log(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
//    }
// window.addEventListener('resize', appWidth);
// appWidth();

// const userAgent = navigator.userAgent.toLowerCase();
// const isTablet = detectMobile();
// console.log(isTablet);

// function detectMobile() {
// 	let isMobile = RegExp(/Android|webOS|iPhone|iPod|iPad/i).test(navigator.userAgent);
  
// 	if (!isMobile) {
// 	  const isMac = RegExp(/Macintosh/i).test(navigator.userAgent);
  
// 	  if (isMac && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
// 		isMobile = true;
// 	  }
// 	}
// 	return isMobile;
// }

//Key codes for up and down arrows on keyboard. We'll be using this to navigate change slides using the keyboard
var keyCodes = {
	UP  : 38,
	DOWN: 40,
	PGDOWN: 34,
	PGUP: 33,

}

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
const mediaQueryReloadDesktop = window.matchMedia('(min-width: 1245px)');
/**
* Scroll to top on reload
*/
$(window).on('beforeunload', function() {
	if(mediaQueryReloadDesktop.matches) { 
		$(window).scrollTop(0);
	}
});
$( document ).ready(function() {
	APP.init();
	gsap.registerPlugin(ScrollTrigger);

	/**
	* Splash logo animation
	*/
	var tl = gsap.timeline({repeat: 0, onComplete: loadingComplete});
	tl.to(".splash-logo__1", {
		transform: 'translateY(100vh)',
		duration: 1,
	}, "<2");
	tl.to(".splash-logo__2", {
		transform: 'translateY(-100vh)',
		duration: 1,
	}, "<");
	tl.to(".splash-logo__1", {
		opacity:0,
		zIndex: "-10",
		display:"none",
	}, ">");
	tl.to(".splash-logo__2", {
		opacity:0,
		display:"none",
		zIndex: "-10",
		transform: 'translateY(-300vh)',
	}, "<");
	tl.to(".splash-logo", {
		opacity:0,
		display:"none",
		zIndex: "-10",
	}, "<");
	tl.to(".splash-logo", {
		backgroundColor:"transparent",
		ease: "none",
		duration: 0.1,
	}, "<");

	/**
	* Disable scrolling on splash logo animation
	*/
	window.addEventListener('touchmove', function(e) {
		if(isLoading) {
			console.log("No Scroll");
			e.preventDefault();
		}
	}, { passive: false });
	function loadingComplete() {
		isLoading = 0;
		if(mediaQueryReloadDesktop.matches) {
			goToSlide($currentSlide, 1);
		}
	}

	/*
	*   Getting the pressed key. Only if it's up or down arrow or Page up and Page down, we go to prev or next slide and prevent default behaviour
	* */
	function onKeyDown(event)
	{

		var PRESSED_KEY = event.keyCode;

		if(PRESSED_KEY == keyCodes.UP || PRESSED_KEY == keyCodes.PGUP)
		{
			goToPrevSlide();
			event.preventDefault();
		}
		else if(PRESSED_KEY == keyCodes.DOWN || PRESSED_KEY == keyCodes.PGDOWN)
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
		var delta = event.wheelDelta / 30 || -event.detail;

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
		event.stopPropagation();
		return false;
	}

	/*
	*   If there's a previous slide, slide to it
	* */
	function goToPrevSlide()
	{
		goToSlide(prevInDOM($('.slide'), $currentSlide), 1);
	}

	/*
	*   If there's a next slide, slide to it
	* */
	function goToNextSlide()
	{
		goToSlide(nextInDOM($('.slide'), $currentSlide), 1);
	}

	/*
	*   Actual transition between slides
	* */
	function goToSlide($slide, duration)
	{
		//console.log(duration);
		//console.log(pageHeight * $currentSlide.index(".slide"));
		//If the slides are not changing and there's such a slide
		if(!isAnimating && $slide.length && !isLoading)
		{
			//setting animating flag to true
			isAnimating = true;
			$currentSlide = $slide;

			//console.log(pageHeight);
			//console.log(document.documentElement.clientHeight);

			//console.log($currentSlide);
			// console.log($currentSlide.index(".slide"));

			//Sliding to current slide
			gsap.to(window, duration, {scrollTo: {y: pageHeight * $currentSlide.index(".slide")}, onComplete: onSlideChangeEnd, ease: "power2.out"});

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
		var newPageHeight = document.documentElement.clientHeight;

		console.log(document.documentElement.clientHeight);

		/*
		*   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
		* */
		if(pageHeight !== newPageHeight)
		{
			pageHeight = newPageHeight;

			ScrollTrigger.clearScrollMemory();
			window.history.scrollRestoration = "manual";
			ScrollTrigger.refresh();
			location.reload();

			//This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
			TweenLite.set([$slidesContainer, $slides], {height: pageHeight + "px"});

			//The current slide should be always on the top
			TweenLite.set($slidesContainer, {scrollTo: {y: pageHeight * $currentSlide.index() }});
		}

	}

	window.addEventListener('resize', onResize, { passive: false });

	/*
	*  Media query for desktop slide scrolling
	* */
	const mediaQuery = window.matchMedia('(min-width: 1245px)');
	if(mediaQuery.matches) {
	
		/*
		*  Parallax scroll
		* */
		gsap.utils.toArray(".parallax").forEach(layer => {
			gsap.from(layer, {
				scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				toggleActions:'restart none none reset',
				scrub: false
				}, 
				y: (i, target) => 200 * target.dataset.speed,
				ease: "none"
			});
		});

		// var ts;
		// $(document).bind('touchstart', function (e){
		// ts = e.originalEvent.touches[0].clientY;
		// });
	
		// $(document).bind('touchend', function (e){
		// var te = e.originalEvent.changedTouches[0].clientY;
		// if(ts > te+5){
		// 	goToNextSlide();
		// }else if(ts < te-5){
		// 	goToPrevSlide();
		// }
		// });

		// document.addEventListener('touchstart', handleTouchStart, { passive: false });        
		// document.addEventListener('touchmove', handleTouchMove, { passive: false });

		// var xDown = null;                                                        
		// var yDown = null;

		// function getTouches(evt) {
		// return evt.touches ||             // browser API
		// 		evt.originalEvent.touches; // jQuery
		// }                                                     																
		// function handleTouchStart(evt) {
		// 	const firstTouch = getTouches(evt)[0];                                      
		// 	xDown = firstTouch.clientX;                                      
		// 	yDown = firstTouch.clientY;                                      
		// };                                                															
		// function handleTouchMove(evt) {
		// 	if ( ! xDown || ! yDown ) {
		// 		return;
		// 	}

		// 	var xUp = evt.touches[0].clientX;                                    
		// 	var yUp = evt.touches[0].clientY;

		// 	var xDiff = xDown - xUp;
		// 	var yDiff = yDown - yUp;
																				
		// 	if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
		// 		if ( xDiff > 0 ) {
		// 			/* right swipe */ 
		// 		} else {
		// 			/* left swipe */
		// 		}                       
		// 	} else {
		// 		if ( yDiff > 0 ) {
		// 			evt.preventDefault();
		// 			goToNextSlide();
		// 		} else { 
		// 			evt.preventDefault();
		// 			goToPrevSlide();
		// 		}                                                                 
		// 	}
		// 	/* reset values */
		// 	xDown = null;
		// 	yDown = null;                                             
		// };
		
		/*
		*   Adding event listeners
		* */
		window.addEventListener('wheel', onMouseWheel, { passive: false });
		$document.on("keydown", onKeyDown);

		//Going to the first slide
		goToSlide($currentSlide, 1);
	
		let panels = gsap.utils.toArray(".slide-gsap");
		// we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
		//let tops = panels.map(panel => ScrollTrigger.create({trigger: panel, start: "top top"}));
	
		panels.forEach((panel, i) => {
			ScrollTrigger.create({
				trigger: panel,
				// start: "top top", // if it's shorter than the viewport, we prefer to pin it at the top
				pin: true, 
				pinSpacing: false,
				normalizeScroll: true
			});
		});
	
		/**
		* GSAP Scroll Trigger for slides sliding down
		*/
		gsap.fromTo(".introduction__2", {
			scrollTrigger: {
				trigger: ".introduction__1",
				start: "top 90%",
				toggleActions:'restart none none reset',
			},
			transform: 'translateY(-200vh)',
			duration: 1,
			zIndex: -1,
		},
		{
			scrollTrigger: {
				trigger: ".introduction__1",
				start: "top 90%",
				toggleActions:'restart none none reset',
			},
			transform: 'translateY(0vh)',
			duration: 1,
			zIndex: 1,
		});
	
		gsap.fromTo(".impact__1", {
			scrollTrigger: {
				trigger: ".impact__2",
				start: "top 90%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(-200vh)',
			duration: 1,
			zIndex: -1,
		},
		{
			scrollTrigger: {
				trigger: ".impact__2",
				start: "top 90%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(0vh)',
			duration: 1,
			zIndex: 1,
		});
	
		gsap.fromTo(".finances__1", {
			scrollTrigger: {
				trigger: ".finances__2",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(-200vh)',
			duration: 1,
			zIndex: -1,
		},
		{
			scrollTrigger: {
				trigger: ".finances__2",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(0vh)',
			duration: 1,
			zIndex: 1,
		});
	
		gsap.fromTo(".capital-improvements__2", {
			scrollTrigger: {
				trigger: ".capital-improvements__1",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(-200vh)',
			duration: 1,
			zIndex: -1,
		},
		{
			scrollTrigger: {
				trigger: ".capital-improvements__1",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(0vh)',
			duration: 1,
			zIndex: 1,
		});
	
		gsap.fromTo(".our-partners__1", {
			scrollTrigger: {
				trigger: ".our-partners__2",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(-200vh)',
			duration: 1,
			zIndex: -1,
		},
		{
			scrollTrigger: {
				trigger: ".our-partners__2",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			transform: 'translateY(0vh)',
			duration: 1,
			zIndex: 1,
		});

		// gsap.from(".conclusion__2", {
		// 	scrollTrigger: {
		// 		trigger: ".conclusion__1",
		// 		start: "top 99%",
		// 		toggleActions:'restart none none reset'
		// 	},
		// 	transform: 'translateY(-200vh)',
		// 	duration: 1,
		// 	zIndex: -1,
		// 	pin: ".conclusion__2",
		// 	pinSpacing: false,
		// 	endTrigger: ".conclusion__3-4",
		// });
	
		ScrollTrigger.create({
			trigger: ".impact__4",
			start: "top top",
			endTrigger: ".impact__7",
			pin: true, 
			pinSpacing: false,
		});
	
		ScrollTrigger.create({
			trigger: ".capital-improvements__1",
			start: "top top",
			endTrigger: ".capital-improvements__2-1",
			pin: true, 
			pinSpacing: false,
		});
	
		ScrollTrigger.create({
			trigger: ".capital-improvements__3",
			start: "top top",
			endTrigger: ".capital-improvements__4-1",
			pin: true, 
			pinSpacing: false,
		});
	
		ScrollTrigger.create({
			trigger: ".capital-improvements__5",
			start: "top top",
			endTrigger: ".capital-improvements__6-1",
			pin: true, 
			pinSpacing: false,
		});	

		// ScrollTrigger.create({
		// 	trigger: ".conclusion__2",
		// 	start: "top top",
		// 	endTrigger: ".conclusion__3-4",
		// 	pin: true, 
		// 	pinSpacing: false,
		// });

		gsap.from(".impact__10-1", {
			scrollTrigger: {
				trigger: ".impact__11",
				start: "top 99%",
				toggleActions:'restart none none reset'
			},
			duration: 0.1,
			opacity: 0,
		});
		
	}
	/*
	*  Media query for mobile slide scrolling
	* */
	const mediaQueryScrollPanelMobile = window.matchMedia('(max-width: 1000px)');
	if(mediaQueryScrollPanelMobile.matches) {
		let panels = gsap.utils.toArray(".section-gsap");
		// we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
		//let tops = panels.map(panel => ScrollTrigger.create({trigger: panel, start: "top top"}));
		
		panels.forEach((panel, i) => {
		  ScrollTrigger.create({
			trigger: panel,
			start: () => panel.offsetHeight < window.innerHeight ? "top top" : "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
			pin: true, 
			pinSpacing: false,
			anticipatePin: 1,
		  });
		});
	}

	/*
	*  Exit animation
	* */
	var tl2 = gsap.timeline({
		scrollTrigger: {
			trigger: ".conclusion__2",
			start: "top top",
		},
		repeat: -1,
	});
	tl2.to(".conclusion-anim-text", {
		duration: 1,
		  text: {
			value: "Inspiration",
			delimiter: " ",
		},
		  ease: "power1.out",
	}, "<1");
	tl2.to(".conclusion-anim-text", {
		duration: 1,
		  text: {
			value: "Mentorship",
			delimiter: " ",
		},
		  ease: "power1.out",
	}, "<1");
	tl2.to(".conclusion-anim-text", {
		duration: 1,
		  text: {
			value: "Nature",
			delimiter: " ",
		},
		  ease: "power1.out",
	}, "<1");
	tl2.to(".conclusion-anim-text", {
		duration: 1,
		  text: {
			value: "Play",
			delimiter: " ",
		},
		  ease: "power1.out",
	}, "<1");

	/*
	*  Chart1 animation
	* */
	var tl3 = gsap.timeline({
		scrollTrigger: {
			trigger: ".finances__4",
			start: "top 20%",
			toggleActions:'restart none none none'
		},
		repeat: 0,
	});
	tl3.from(".chart1--bar1", { scaleY: 0, duration: 2, transformOrigin: '50% bottom', ease: "power1.out",}, "<0.2");
	tl3.from(".chart1--bar2", {	scaleY: 0, duration: 2,	transformOrigin: '50% bottom', ease: "power1.out",}, "<0.2");
	tl3.from(".chart1--bar3", {	scaleY: 0, duration: 2,	transformOrigin: '50% bottom', ease: "power1.out",}, "<0.2");
	tl3.from(".chart1--bar4", {	scaleY: 0, duration: 2,	transformOrigin: '50% bottom', ease: "power1.out",}, "<0.2");
	tl3.from(".chart1--bar5", {	scaleY: 0, duration: 2, transformOrigin: '50% bottom', ease: "power1.out",}, "<0.2");
	tl3.from(".chart1--bar6", {	scaleY: 0, duration: 2,	transformOrigin: '50% bottom', ease: "power1.out",}, "<0.2");
	tl3.from(".chart1--line1", { scaleX: 0,	duration: 0.5, transformOrigin: '50% bottom', ease: "bounce",}, "<0.2");
	tl3.from(".chart1--text1", { opacity: 0, duration: 0.5,	transformOrigin: '50% bottom', ease: "bounce",}, "<0.2");
	tl3.from(".chart1--opacity1", { opacity: 0,	duration: 0.5,	transformOrigin: '50% bottom', ease: "bounce",}, "<0.2");

	/*
	*  Chart2 animation
	* */
	var tl4 = gsap.timeline({
		scrollTrigger: {
			trigger: ".finances__5",
			start: "top 20%",
			toggleActions:'restart none none none'
		},
		repeat: 0,
	});
	tl4.from(".chart2", { scaleY: 0, duration: 2, transformOrigin: '50% bottom', ease: "power1.out", }, "<0.2");
	tl4.from(".chart2--number", { scale: 0, duration: 0.5, transformOrigin: '50% bottom', ease: "bounce", }, "<1");

	/*
	*  Chart3 animation
	* */
	var tl5 = gsap.timeline({
		scrollTrigger: {
			trigger: ".finances__7",
			start: "top 20%",
			toggleActions:'restart none none none'
		},
		repeat: 0,
	});
	tl5.from(".chart3", { scale: 0, duration: 2, transformOrigin: 'center', ease: "power1.out", }, ">");
	tl5.from(".chart3", { rotate: 180, duration: 2, transformOrigin: 'center', ease: "power1.out", }, "<");
	tl5.from(".chart3--piece1", { rotate: 180, duration: 2, transformOrigin: 'right bottom', ease: "power1.out", }, "<");

	/*
	*  Number counter animations
	* */
	gsap.utils.toArray(".number-animate").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false,
				toggleActions:'restart none none reset'
			  }, 
			textContent: 0,
			duration: 1.5,
			ease: "power1.in",
			snap: { textContent: 1 },
			stagger: {
				each: 1.0,
				onUpdate: function() {
				this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
				},
			}
		});
	});
	gsap.utils.toArray(".number-animate-10000").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false,
				toggleActions:'restart none none reset'
			  }, 
			textContent: 10000,
			duration: 1.5,
			ease: "power1.in",
			snap: { textContent: 1 },
			stagger: {
				each: 1.0,
				onUpdate: function() {
				this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
				},
			}
		});
	});
	gsap.utils.toArray(".number-animate-100000").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false,
				toggleActions:'restart none none reset'
			  }, 
			textContent: 100000,
			duration: 1.5,
			ease: "power1.in",
			snap: { textContent: 1 },
			stagger: {
				each: 1.0,
				onUpdate: function() {
				this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
				},
			}
		});
	});
	gsap.utils.toArray(".number-animate-10000000").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false,
				toggleActions:'restart none none reset'
			  }, 
			textContent: 10000000,
			duration: 1.5,
			ease: "power1.in",
			snap: { textContent: 1 },
			stagger: {
				each: 1.0,
				onUpdate: function() {
				this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
				},
			}
		});
	});
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
});

/**
* Header Menu
*/
const mediaQuery2 = window.matchMedia('(max-width: 900px)');
var toggleMenuFlag = 0;
/**
* Hamburger menu mobile
*/
if(mediaQuery2.matches) {
	function toggleMenu() {
		if(toggleMenuFlag == 0) {
			//document.getElementById("js-mobile-hamburger-menu").style.display = "block";
			document.getElementById("js-mobile-hamburger-menu").style.height = "100vh";
			document.getElementById("js-mobile-hamburger-menu").style.paddingTop = "4.5vh";
	
			document.getElementById("js-kidspace-header__logo").style.opacity = "0";
			document.getElementById("js-kidspace-header__title").style.opacity = "0";
			document.getElementById("js-kidspace-header__mobile-title").style.backgroundColor = "#24AD79";
			
			var list = document.getElementsByClassName('kidspace-header__menu-item');
			for (var i = 0; i < list.length; i++ ) {
				list[i].style.opacity = "100%";
				list[i].style.height = "12.5vh";
			}
			document.getElementById("js-mobile-hamburger-menu-icon").src = "images/hamburger-menu-close.svg";
			toggleMenuFlag = 1;
		}
		else if(toggleMenuFlag == 1) {
			//document.getElementById("js-mobile-hamburger-menu").style.display = "none";
			document.getElementById("js-mobile-hamburger-menu").style.height= "0%";
			document.getElementById("js-mobile-hamburger-menu").style.paddingTop = "0vh";
	
			document.getElementById("js-kidspace-header__logo").style.opacity = "1";
			document.getElementById("js-kidspace-header__title").style.opacity = "1";
			document.getElementById("js-kidspace-header__mobile-title").style.backgroundColor = "white";
	
			var list = document.getElementsByClassName('kidspace-header__menu-item');
			for (var i = 0; i < list.length; i++ ) {
				list[i].style.opacity = "0%";
				list[i].style.height = "0vh";
			}
			document.getElementById("js-mobile-hamburger-menu-icon").src = "images/hamburger-menu.svg";
			toggleMenuFlag = 0;
		}
	}
}
function headerMenu(id) {
	/**
	* Header Menu Mobile
	*/
	if(mediaQuery2.matches) {
		if(toggleMenuFlag == 0) {
			//document.getElementById("js-mobile-hamburger-menu").style.display = "block";
			document.getElementById("js-mobile-hamburger-menu").style.height = "100vh";
			document.getElementById("js-mobile-hamburger-menu").style.paddingTop = "4.5vh";

			document.getElementById("js-kidspace-header__logo").style.opacity = "0";
			document.getElementById("js-kidspace-header__title").style.opacity = "0";
			document.getElementById("js-kidspace-header__mobile-title").style.backgroundColor = "#24AD79";
			
			var list = document.getElementsByClassName('kidspace-header__menu-item');
			for (var i = 0; i < list.length; i++ ) {
				list[i].style.opacity = "100%";
				list[i].style.height = "12.5vh";
			}
			document.getElementById("js-mobile-hamburger-menu-icon").src = "images/hamburger-menu-close.svg";
			toggleMenuFlag = 1;
		}
		else if(toggleMenuFlag == 1) {
			if(id == "introduction-button") {
				gsap.to(window, {scrollTo: document.querySelector('#introduction')});
				//document.getElementById('introduction').scrollIntoView();
				//window.scrollBy(0, window.innerHeight);
			}
			if(id == "impact-button") {
				gsap.to(window, {scrollTo: document.querySelector('#impact')});
			}
			if(id == "finances-button") {
				gsap.to(window, {scrollTo: document.querySelector('#finances')});
				console.log('Reload2');
			}
			if(id == "capital-improvements-button") {
				gsap.to(window, {scrollTo: document.querySelector('#capital-improvements')});
			}
			if(id == "our-partners-button") {
				gsap.to(window, {scrollTo: document.querySelector('#our-partners')});
			}
			if(id == "financial-disclosures-button") {
				gsap.to(window, {scrollTo: document.querySelector('#financial-disclosures')});
			}
			// ScrollTrigger.clearScrollMemory();
			// window.history.scrollRestoration = "manual";
			// ScrollTrigger.refresh();
			document.getElementById("js-mobile-hamburger-menu").style.height= "0%";
			document.getElementById("js-mobile-hamburger-menu").style.paddingTop = "0vh";

			document.getElementById("js-kidspace-header__logo").style.opacity = "1";
			document.getElementById("js-kidspace-header__title").style.opacity = "1";
			document.getElementById("js-kidspace-header__mobile-title").style.backgroundColor = "white";

			var list = document.getElementsByClassName('kidspace-header__menu-item');
			for (var i = 0; i < list.length; i++ ) {
				list[i].style.opacity = "0%";
				list[i].style.height = "0vh";
			}
			document.getElementById("js-mobile-hamburger-menu-icon").src = "images/hamburger-menu.svg";
			toggleMenuFlag = 0;
		}
	}
	/**
	* Header Menu Desktop
	*/
	else {

		// 2. Impact : introduction__6
		// 3. Finances : impact__11
		// 4. Campus : impact__17
		// 5. Partners : hero color-context--rose
		// 6. Financial : improvements__3

		if(id == "introduction-button") {
			$currentSlide = $("#introduction-menu-slide"); //document.getElementById("introduction-menu-slide");
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "#000000";
			}
			buttonSelected.style.color = "#09B4A4";

			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--introduction");
			//console.log(selectedListItem);
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-introduction.svg)";
		}
		if(id == "impact-button") {
			$currentSlide = $("#impact-menu-slide"); //document.getElementById("impact-menu-slide");
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#03A2D6";

			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--impact");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-impact.svg)";
		}
		if(id == "finances-button") {
			$currentSlide = $("#finances-menu-slide");
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#733F8B";

			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--finances");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-fiannces.svg)";
		}
		if(id == "capital-improvements-button") {
			$currentSlide = $("#campus-menu-slide"); //document.getElementById("campus-menu-slide");
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#D4227C";

			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--campus-enhancements");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-campus.svg)";
		}
		if(id == "our-partners-button") {
			$currentSlide = $("#partners-menu-slide"); //document.getElementById("partners-menu-slide");
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#F53F4E";

			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--our-partners");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-partners.svg)";
		}
		if(id == "financial-disclosures-button") {
			$currentSlide = $("#financial-disclosures-menu-slide"); //document.getElementById("financial-disclosures-menu-slide");
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#FB7900";

			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--financial-disclosures");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-financial-disclosures.svg)";
		}
		
	}
}

/**
* Header Menu highlight on scroll (desktop)
*/
const mediaQuery3 = window.matchMedia('(min-width: 900px)');
if(mediaQuery3.matches) {
	gsap.utils.toArray(".section").forEach(section => {
		ScrollTrigger.create({
			trigger: section,
			start: "top 90%",
			end: "bottom 10%",
			onEnter: () => myEnterFunc(section),
			onEnterBack: () => myEnterFunc(section),
		  });
	});
	function myEnterFunc(section) {
		var id = section.id;
		id = id + "-button";

		//console.log(id);
	
		if(id == "introduction-button") {
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "#000000";
			}
			buttonSelected.style.color = "#09B4A4";
	
			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--introduction");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-introduction.svg)";
		}
		if(id == "impact-button") {
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#03A2D6";
	
			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--impact");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-impact.svg)";
		}
		if(id == "finances-button") {
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#733F8B";
	
			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--finances");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-fiannces.svg)";
		}
		if(id == "capital-improvements-button") {
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#D4227C";
	
			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--campus-enhancements");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-campus.svg)";
		}
		if(id == "our-partners-button") {
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#F53F4E";
	
			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--our-partners");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-partners.svg)";
		}
		if(id == "financial-disclosures-button") {
			let buttons = document.querySelectorAll(".kidspace-header__menu-item-button");
			const buttonSelected = document.getElementById(id);
			for(let i = 0; i<buttons.length; i++) {
				buttons[i].style.color = "black";
			}
			buttonSelected.style.color = "#FB7900";
	
			let listItems = document.querySelectorAll(".kidspace-header__menu-item");
			const selectedListItem = document.getElementsByClassName("kidspace-header__menu-item--financial-disclosures");
			for(let i = 0; i<buttons.length; i++) {
				listItems[i].style.backgroundImage = "none";
			}
			selectedListItem[0].style.backgroundImage = "url(../../images/underline-financial-disclosures.svg)";
		}
	}
}

/**
* Campus enhancements image scroller
*/
if(mediaQuery2.matches) {
	const boxes1 = gsap.utils.toArray(".scroller-1");
	const loop1 = gsap.timeline({repeat: -1});
	loop1.to (boxes1, {transform: 'translateX(-100vw)'}, "<2");
	loop1.to (boxes1, {transform: 'translateX(-200vw)'}, "<2");
	loop1.to (boxes1, {transform: 'translateX(0vw)'}, "<2");

	
	const boxes2 = gsap.utils.toArray(".scroller-2");
	const loop2 = gsap.timeline({repeat: -1});
	loop2.to (boxes2, {transform: 'translateX(-100vw)'}, "<2");
	loop2.to (boxes2, {transform: 'translateX(-200vw)'}, "<2");
	loop2.to (boxes2, {transform: 'translateX(0vw)'}, "<2");
	
	const boxes3 = gsap.utils.toArray(".scroller-3");
	const loop3 = gsap.timeline({repeat: -1});
	loop3.to (boxes3, {transform: 'translateX(-100vw)'}, "<2");
	loop3.to (boxes3, {transform: 'translateX(-200vw)'}, "<2");
	loop3.to (boxes3, {transform: 'translateX(0vw)'}, "<2");
}

/**
* Our Partners menu
*/
const buttons = document.querySelectorAll('.our-partners__button') 
var partnerButtonFlag = 0;
buttons.forEach(function(button) {
	button.addEventListener("click", function(e) {
		const activeList = e.target.nextElementSibling;
		console.log(activeList.style.display);
		if(activeList.style.display === "block") {
			buttons.forEach(inactiveButton => {
				const inactiveList = inactiveButton.nextElementSibling;
				inactiveButton.style.setProperty('--scale', 1);
				inactiveList.style.display = "none";
			});
			activeList.style.display = "none";
			e.target.style.setProperty('--scale', 1);
		}
		else {
			buttons.forEach(inactiveButton => {
				const inactiveList = inactiveButton.nextElementSibling;
				inactiveButton.style.setProperty('--scale', 1);
				inactiveList.style.display = "none";
			});
			activeList.style.display = "block";
			e.target.style.setProperty('--scale', "150%");
		}
	});
});

/**
* Video click
*/
const mediaQueryVideoTabletMax = window.matchMedia('(max-width: 900px)');
const mediaQueryVideoDesktop = window.matchMedia('(min-width: 900px)');
const mediaQueryVideoTablet = window.matchMedia('(min-width: 550px)');
const video1  = document.getElementsByClassName('section-content__videos-item--1');
const video2  = document.getElementsByClassName('section-content__videos-item--2');
const video3  = document.getElementsByClassName('section-content__videos-item--3');
if(mediaQueryVideoTabletMax.matches && mediaQueryVideoTablet.matches) {
	$('.section-content__videos-item--1').on('click', function() {
		video1[0].style.width = "80vw";
		video1[0].style.top = "7vh";
		video1[0].style.left = "9vw";
		video1[0].style.scale = "0.8";
		if(video1[0].paused) {
			console.log("Video 1 Play");
			video1[0].play();
		}
		else {
			console.log("Video 1 Pause");
			video1[0].pause();
		}
		video2[0].style.display = "none";
		video3[0].style.display = "none";
	});
	$('.section-content__videos-item--2').on('click', function() {
		video1[0].style.display = "none";
		video2[0].style.width = "80vw";
		video2[0].style.top = "7vh";
		video2[0].style.left = "9vw";
		video2[0].style.scale = "0.8";
		if(video2[0].paused) {
			console.log("Video 2 Play");
			video2[0].play();
		}
		else {
			console.log("Video 2 Pause");
			video2[0].pause();
		}
		video3[0].style.display = "none";
	});
	$('.section-content__videos-item--3').on('click', function() {
		video1[0].style.display = "none";
		video2[0].style.display = "none";
		video3[0].style.width = "80vw";
		video3[0].style.top = "7vh";
		video3[0].style.left = "9vw";
		video3[0].style.scale = "0.8";
		if(video3[0].paused) {
			console.log("Video 3 Play");
			video3[0].play();
		}
		else {
			console.log("Video 3 Pause");
			video3[0].pause();
		}
	});
	$(document).click(function(event) { 
		var $target = $(event.target);
		if(!$target.closest('.section-content__videos-item--1').length && !$target.closest('.section-content__videos-item--2').length && !$target.closest('.section-content__videos-item--3').length) {
			video1[0].style.display = "block";
			video2[0].style.display = "block";
			video3[0].style.display = "block";
	
				video1[0].style.width = "100%";
				video1[0].style.top = "-15%";
				video1[0].style.left = "-24%";
				video1[0].style.scale = "0.45";
		
				video2[0].style.width = "100%";
				video2[0].style.top = "14vh";
				video2[0].style.left = "13vw";
				video2[0].style.scale = "0.65";
		
				video3[0].style.width = "100%";
				video3[0].style.top = "46vh";
				video3[0].style.left = "-21vw";
				video3[0].style.scale = "0.5";
	
			video1[0].load();
			video2[0].load();
			video3[0].load();
		}        
	});
} else if(mediaQueryVideoDesktop.matches) {
	$('.section-content__videos-item--1').on('click', function() {
		video1[0].style.width = "80vw";
		video1[0].style.top = "7vh";
		video1[0].style.left = "9vw";
		video1[0].style.scale = "0.8";
		if(video1[0].paused) {
			console.log("Video 1 Play");
			video1[0].play();
		}
		else {
			console.log("Video 1 Pause");
			video1[0].pause();
		}
		video2[0].style.display = "none";
		video3[0].style.display = "none";
	});
	$('.section-content__videos-item--2').on('click', function() {
		video1[0].style.display = "none";
		video2[0].style.width = "80vw";
		video2[0].style.top = "7vh";
		video2[0].style.left = "9vw";
		video2[0].style.scale = "0.8";
		if(video2[0].paused) {
			console.log("Video 2 Play");
			video2[0].play();
		}
		else {
			console.log("Video 2 Pause");
			video2[0].pause();
		}
		video3[0].style.display = "none";
	});
	$('.section-content__videos-item--3').on('click', function() {
		video1[0].style.display = "none";
		video2[0].style.display = "none";
		video3[0].style.width = "80vw";
		video3[0].style.top = "7vh";
		video3[0].style.left = "9vw";
		video3[0].style.scale = "0.8";
		if(video3[0].paused) {
			console.log("Video 3 Play");
			video3[0].play();
		}
		else {
			console.log("Video 3 Pause");
			video3[0].pause();
		}
	});
	$(document).click(function(event) { 
		var $target = $(event.target);
		if(!$target.closest('.section-content__videos-item--1').length && !$target.closest('.section-content__videos-item--2').length && !$target.closest('.section-content__videos-item--3').length) {
			video1[0].style.display = "block";
			video2[0].style.display = "block";
			video3[0].style.display = "block";
	
			// if(mediaQuery2.matches) {
			// 	video1[0].style.width = "100%";
			// 	video1[0].style.top = "-12vh";
			// 	video1[0].style.left = "-18vw";
			// 	video1[0].style.scale = "0.5";
		
			// 	video2[0].style.width = "100%";
			// 	video2[0].style.top = "9vh";
			// 	video2[0].style.left = "6vw";
			// 	video2[0].style.scale = "0.75";
		
			// 	video3[0].style.width = "100%";
			// 	video3[0].style.top = "31vh";
			// 	video3[0].style.left = "-15vw";
			// 	video3[0].style.scale = "0.6";
			// }
			video1[0].style.width = "100%";
			video1[0].style.top = "1%";
			video1[0].style.left = "37%";
			video1[0].style.scale = "0.35";
	
			video2[0].style.width = "100%";
			video2[0].style.top = "17vh";
			video2[0].style.left = "-7vw";
			video2[0].style.scale = "0.55";
	
			video3[0].style.width = "100%";
			video3[0].style.top = "50vh";
			video3[0].style.left = "12vw";
			video3[0].style.scale = "0.4";
			// if(mediaQuery3.matches) {
			// 	video1[0].style.width = "100%";
			// 	video1[0].style.top = "1%";
			// 	video1[0].style.left = "37%";
			// 	video1[0].style.scale = "0.35";
		
			// 	video2[0].style.width = "100%";
			// 	video2[0].style.top = "17vh";
			// 	video2[0].style.left = "-7vw";
			// 	video2[0].style.scale = "0.55";
		
			// 	video3[0].style.width = "100%";
			// 	video3[0].style.top = "50vh";
			// 	video3[0].style.left = "12vw";
			// 	video3[0].style.scale = "0.4";
			// }
	
			video1[0].load();
			video2[0].load();
			video3[0].load();
		}        
	});
}
if(!mediaQueryVideoTablet.matches) {
	$('.section-content__videos-item--1').on('click', function() {
		window.open("https://www.youtube.com/watch?v=0LZA0s7ri_k", '_blank').focus();
	});
	$('.section-content__videos-item--2').on('click', function() {
		window.open("https://www.youtube.com/watch?v=yZGZsDW-NWI", '_blank').focus();
	});
	$('.section-content__videos-item--3').on('click', function() {
		window.open("https://www.youtube.com/watch?v=1jr1bnmhoCg&t=1s", '_blank').focus();
	});
	document.addEventListener('fullscreenchange', exitHandler, false);
	document.addEventListener('mozfullscreenchange', exitHandler, false);
	document.addEventListener('MSFullscreenChange', exitHandler, false);
	document.addEventListener('webkitfullscreenchange', exitHandler, false);
	function exitHandler() {
		console.log("Outer " + videoFlag);
		if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
		{
			videoFlag = 0;
			console.log("Inner " + videoFlag);

			video1[0].style.width = "100%";
			video1[0].style.scale = "0.5";

			video2[0].style.width = "100%";
			video2[0].style.scale = "0.75";
	
			video3[0].style.width = "100%";
			video3[0].style.scale = "0.6";
		}
	};
}

/*
*   Reload on orientation change tablet
* */
if(mediaQueryVideoTablet.matches) {
	if (window.DeviceOrientationEvent) {
		window.addEventListener('orientationchange', function() {
				location.reload();
		}, false);
		screen.orientation.addEventListener("change", function() {
				location.reload();
		});
		let portrait = window.matchMedia("(orientation: portrait)");

		portrait.addEventListener("change", function() {
				location.reload();
		});
	}
}

/*
*   Functions to find Next and Prev element by class in DOM
* */
function nextInDOM(_selector, _subject) {
	var next = getNext(_subject);
	while(next.length != 0) {
		var found = searchForFirst(_selector, next);
		if(found != null) return found;
		next = getNext(next);
	}
	return null;
}
function prevInDOM(_selector, _subject) {
	var next = getPrev(_subject);
	while(next.length != 0) {
		var found = searchForLast(_selector, next);
		if(found != null) {
			//console.log(_subject);
			//console.log(found);
			return found;
		}
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
function searchForFirst(_selector, _subject) {
	if(_subject.is(_selector)) return _subject;
	else {
		var found = null;
		_subject.children().each(function() {
			found = searchForFirst(_selector, $(this));
			if(found != null) return false;
		});
		return found;
	}
	return null; // will/should never get here
}
function searchForLast(_selector, _subject) {
	if(_subject.is(_selector)) return _subject;
	else {
		var found = null;
		var list = _subject.children();
		var reversedList = list;

		let len = list.length - 1;
		// console.log(len);

		for(let i = 0; i <= len; i++) {
			reversedList[i] = list[len - i];
		}
		// console.log(list[0]);
		// console.log(reversedList[0]);
		list.each(function() {
			found = searchForLast(_selector, $(this));
			if(found != null) return false;
		});
		return found;
	}
	return null; // will/should never get here
}
function vhToPixels(vh) {
	return Math.round(window.innerHeight / (100 / vh)) + 'px';
}

/*
*   Functions to loop images (For Campus enhancements image scroller)
* */
function horizontalLoop(items, config) {
	items = gsap.utils.toArray(items);
	config = config || {};
	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
	  length = items.length,
	  startX = items[0].offsetLeft,
	  times = [],
	  widths = [],
	  xPercents = [],
	  curIndex = 0,
	  pixelsPerSecond = (config.speed || 1) * 100,
	  snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
	  totalWidth, curX, distanceToStart, distanceToLoop, item, i;
	gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
	  xPercent: (i, el) => {
		let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
		xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
		return xPercents[i];
	  }
	});
	gsap.set(items, {x: 0});
	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
	for (i = 0; i < length; i++) {
	  item = items[i];
	  curX = xPercents[i] / 100 * widths[i];
	  distanceToStart = item.offsetLeft + curX - startX;
	  distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
	  tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
		.fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		.add("label" + i, distanceToStart / pixelsPerSecond);
	  times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
	  vars = vars || {};
	  (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
	  let newIndex = gsap.utils.wrap(0, length, index),
		time = times[newIndex];
	  if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
		vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
		time += tl.duration() * (index > curIndex ? 1 : -1);
	  }
	  curIndex = newIndex;
	  vars.overwrite = true;
	  return tl.tweenTo(time, vars);
	}
	tl.next = vars => toIndex(curIndex+1, vars);
	tl.previous = vars => toIndex(curIndex-1, vars);
	tl.current = () => curIndex;
	tl.toIndex = (index, vars) => toIndex(index, vars);
	tl.times = times;
	tl.progress(1, true).progress(0, true); // pre-render for performance
	if (config.reversed) {
	  tl.vars.onReverseComplete();
	  tl.reverse();
	}
	return tl;
}

/* Function to open fullscreen mode */
function openFullscreen(elem) {
	if (elem.requestFullscreen) {
	  elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) { /* Safari */
	  elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE11 */
	  elem.msRequestFullscreen();
	}
	// else if (elem.mozRequestFullScreen) {
    //   elem.mozRequestFullScreen();
    // }
}






