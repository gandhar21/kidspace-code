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

	// toggleMenu : function() {

	// 	$('body').on('click', '.js-header__menu-button', function(e) { 
	// 		if(toggleMenuFlag == 0) {
	// 			document.getElementById("overlay-menu-js").style.width = "100%";
	// 			document.getElementById("overlay-menu-js").style.opacity = "100%";
	// 			if( document.getElementById("js-filters--button")) {
	// 				document.getElementById("js-filters--button").style.opacity = "0";
	// 			}
	// 			document.getElementById("header__menu-button-js").src = "images/global/menu-icon-close.png";
	// 			toggleMenuFlag = 1;
	// 		}
	// 		else if(toggleMenuFlag == 1) {
	// 			document.getElementById("overlay-menu-js").style.width = "0%";
	// 			document.getElementById("overlay-menu-js").style.opacity = "0";
	// 			if( document.getElementById("js-filters--button")) {
	// 				document.getElementById("js-filters--button").style.opacity = "100%";
	// 			}
	// 			document.getElementById("header__menu-button-js").src = "images/global/menu-icon.png";
	// 			toggleMenuFlag = 0;
	// 		}
	// 	});

	// },

}; // The end of APP Object
	
	
/**
* Start things off 
*/
$( document ).ready(function() {
	APP.init();

});

