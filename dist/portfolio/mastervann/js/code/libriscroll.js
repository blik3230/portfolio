(function($) {

	$.fn.scrollToElement = function(options){

		// options of plugin
	    options = $.extend({
			menuChild: $("li"), // child of nav
			toScrollBlock: $(".js-toScrollBlock"), // class for blocks
			topBlock: $(".b-header") // the name of the menu (fixed)
	    }, options);
		// END options of plugin

		// creating variables
		var $window = $(window),

			block = this,

			li = block.find('li'),
			menuChild = options.menuChild,
			toScrollBlock = options.toScrollBlock,
			topBlock = options.topBlock,

			flagTop = true,
			activeListItem,
			item = [],
			nextItem = [];
		// END creating variables

		// creating functions
		function arrayFill() { // assign positions

			item = [];
			nextItem = [];

			li.data('change', true);

			toScrollBlock.each(function(val){

				var n = 0,
					m = 1,

					$this = toScrollBlock.eq(val + n),
					$next = toScrollBlock.eq(val + m),

					thisPosition,
					nextPosition;

				if ($this.css('display') == 'none') {

					for (n -= 1; $this.css('display') == 'none'; --n) {

						$this = toScrollBlock.eq(val - n);

						if($this.css('display') == 'block') {

							thisPosition = $this.offset().top - topBlock.innerHeight();

							item.push(thisPosition);
						}
					}
					
				} else {
					thisPosition = $this.offset().top  - topBlock.innerHeight();

					item.push(thisPosition);
				}

				if ($next.css('display') == 'none') {

					for (m += 1; $next.css('display') == 'none'; --m) {

						$next = toScrollBlock.eq(val + m);

						if($next.css('display') == 'block') {

							thisPosition = $next.offset().top - topBlock.innerHeight();

							nextItem.push(thisPosition);
						}
					}
					
				} else {

					if(val == toScrollBlock.length-1) {
						nextItem.push($(document).height());
					} else {
						nextPosition = $next.offset().top - topBlock.innerHeight();

						nextItem.push(nextPosition);
					}
				}
			});

		}

		function activeLi() { // the function adds a class to the active menu item and remove it from other

			var scrollTop = $window.scrollTop(); // Calculate only 1 time

			li.each(function (val) {

				var $this = $(this);

				if (item[val] <= scrollTop && nextItem[val] >= scrollTop) {

					if ($this.data('change')) {
						$this.data('change', false).addClass('active')
						.siblings().data('change', true).removeClass('active');

						flagTop = true;
					}; 
				}

			});

			if (scrollTop < item[0] && flagTop) {

				block.find('li').removeClass('active');

				li.data('change', true);

				flagTop = false;
			
			} else if(scrollTop == $(document).height() - $window.height()){
				
				var val = toScrollBlock.length-1;

				if (li.eq(val).data('change')) {

					li.eq(val).data('change', false).addClass('active')
					.siblings().data('change', true).removeClass('active');

					flagTop = true;
				}; 
			}
		}
		// END creating functions

		block.find(menuChild).click(function(){ // event when clicking on a menu item (scroll)
			
			var val = $(this).index(),
			// Need to scroll to section
				curPos = $(document).scrollTop(),
				height = item[val],
				scrollTime = Math.abs(height-curPos)/1.73;

				if ( height == 9999999 ) {
					return false;
				} else {
					$("body,html").stop().animate({"scrollTop":height},scrollTime);
				}

			return false;
		});

		// initialization of functions
		$window.ready(function() {
			arrayFill();
			activeLi();
		});

		$window.load(function() {
			arrayFill();
		});

		$window.scroll(function() {
			activeLi();
		});
		
		$window.resize(function() {
			arrayFill()
		});
		// END initialization of functions
	};

}) (jQuery);