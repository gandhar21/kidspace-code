var s; // alias for settings object

// //References to DOM elements
var $window = $(window);
var $document = $(document);
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

	/*
	*   Getting the pressed key. Only if it's up or down arrow, we go to prev or next slide and prevent default behaviour
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
		evt.stopPropagation();
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
		//console.log(pageHeight * $currentSlide.index(".slide"));
		//If the slides are not changing and there's such a slide
		if(!isAnimating && $slide.length)
		{
			//setting animating flag to true
			isAnimating = true;
			$currentSlide = $slide;

			//console.log($currentSlide);
			// console.log($currentSlide.index(".slide"));

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

	/*
	*  Media query for desktop slide scrolling
	* */
	const mediaQuery = window.matchMedia('(min-width: 800px)');
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
				scrub: false
				}, 
				y: (i, target) => 200 * target.dataset.speed,
				ease: "none"
			});
		});

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
				start: "top 99%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".impact__1", {
			scrollTrigger: {
				trigger: ".impact__1",
				start: "top 90%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".finances__1", {
			scrollTrigger: {
				trigger: ".finances__1",
				start: "top 90%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".capital-improvements__2", {
			scrollTrigger: {
				trigger: ".capital-improvements__1",
				start: "top 90%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});
	
		gsap.from(".our-partners__1", {
			scrollTrigger: {
				trigger: ".our-partners__1",
				start: "top 90%",
			},
			transform: 'translateY(-200vh)',
			duration: 1,
		});

		gsap.from(".conclusion__2", {
			scrollTrigger: {
				trigger: ".conclusion__1",
				start: "top 90%",
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
	
	/*
	*  Exit animation
	* */
	var tl2 = gsap.timeline({
		scrollTrigger: {
			trigger: "conclusion__3",
			start: "top top",
		},
		repeat: 0,
	});
	// tl2.to(".conclusion__2", {
	// 	toggleClass: {
	// 		className: "conclusion__on",
	// 	},
	// }, "<3");
	tl2.to(".conclusion-anim-text", {
		duration: 3,
  		text: {
			value: "Inspiration",
			delimiter: " ",
		},
  		ease: "power1.out",
	}, "<3");
	tl2.to(".conclusion-anim-text", {
		duration: 3,
  		text: {
			value: "Mentorship",
			delimiter: " ",
		},
  		ease: "power1.out",
	}, "<3");
	tl2.to(".conclusion-anim-text", {
		duration: 3,
  		text: {
			value: "Nature",
			delimiter: " ",
		},
  		ease: "power1.out",
	}, "<3");
	tl2.to(".conclusion-anim-text", {
		duration: 3,
  		text: {
			value: "Play",
			delimiter: " ",
		},
  		ease: "power1.out",
	}, "<3");
	if(mediaQuery.matches) {
		tl2.to(".conclusion__4", {
			transform: 'translateY(-100vh)',
			duration: 1,
		}, "<");
		tl2.to(".conclusion__5", {
			transform: 'translateY(-100vh)',
			duration: 1,
		}, ">");
	}

	/*
	*  Chart1 animation
	* */
	var tl3 = gsap.timeline({
		scrollTrigger: {
			trigger: ".finances__4",
			start: "top 20%",
			//markers: true,
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
		},
		repeat: 0,
	});
	tl5.from(".chart3", { scale: 0, duration: 2, transformOrigin: 'center', ease: "bounce", }, ">");
	tl5.from(".chart3", { rotate: 180, duration: 2, transformOrigin: 'center', ease: "bounce", }, "<");
	tl5.from(".chart3--piece1", { rotate: 180, duration: 2, transformOrigin: 'right bottom', ease: "bounce", }, "<");

	/*
	*  Number counter animations
	* */
	gsap.utils.toArray(".number-animate-10").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false
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
	gsap.utils.toArray(".number-animate-100").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false
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
	gsap.utils.toArray(".number-animate-1000").forEach(layer => {
		gsap.from(layer, {
			scrollTrigger: {
				trigger: layer,
				start: "top bottom",
				end: "bottom top",
				scrub: false
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
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
});
$( window ).on( "load", function() {
	/*
	*  Splash logo animation
	* */
	var tl = gsap.timeline({repeat: 0});
	tl.from(".splash-logo__1", {
		transform: 'translateY(-200vh)',
		duration: 1,
	});
	tl.from(".splash-logo__2", {
		transform: 'translateY(200vh)',
		duration: 1,
	}, "<");
	tl.to(".splash-logo__1", {
		transform: 'translateY(100vh)',
		duration: 1,
	}, ">1");
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
});

/**
* Header Menu
*/
const mediaQuery2 = window.matchMedia('(max-width: 800px)');
var toggleMenuFlag = 0;
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
			console.log(selectedListItem);
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
* Partners menu
*/
const buttons = document.querySelectorAll('.our-partners__button') 
var partnerButtonFlag = 0;

buttons.forEach(function(button) {
	button.addEventListener("click", function(e) {
		const activeList = e.target.nextElementSibling;
		buttons.forEach(inactiveButton => {
			const inactiveList = inactiveButton.nextElementSibling;
			inactiveList.style.display = "none";
		});
		if(partnerButtonFlag == 0) {
			buttons.forEach(inactiveButton => {
				inactiveButton.style.setProperty('--scale', 0);
			});
			activeList.style.display = "block";
			partnerButtonFlag = 1;
			e.target.style.setProperty('--scale', 1.4);
		}
		else {
			buttons.forEach(inactiveButton => {
				inactiveButton.style.setProperty('--scale', 1);
			});
			activeList.style.display = "none";
			partnerButtonFlag = 0;
			e.target.style.setProperty('--scale', 1);
		}
		// const annotation = e.target.
	});
});

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






