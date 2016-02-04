// (function() {
// 	'use strict'

// 	var $tabNav  = document.querySelectorAll('.js-inside-tab > li'),
// 		$tabBody = document.querySelectorAll('.js-inside-tab__body > li');

// 	function addClass(element) {

// 		for (var i = 0; i < $tabNav.length; i++) {
// 			$tabNav[i].classList.remove('active');
// 			$tabBody[i].classList.remove('active');
// 		};

// 		var $tabNavThis = element,
// 			$tabNavArr = Array.prototype.slice.call($tabNav),
// 			tabActive = $tabNavArr.indexOf($tabNavThis);

// 		$tabNavThis.classList.add('active');
// 		$tabBody[tabActive].classList.add('active')
// 	}

// 	addClass($tabNav[0]);

// 	for (var i = 0; i < $tabNav.length; i++) {

// 		$tabNav[i].addEventListener( 'click', function() {
// 			addClass(this);
// 		});
// 	};
// }());