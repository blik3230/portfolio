(function($){
	var lastPoint = {
		x: 0,
		y: 0
	};

	$(window).on('mousemove', function(e){
		lastPoint.x = e.pageX + $(".main-wrap").scrollLeft();
		lastPoint.y = e.pageY + $(".main-wrap").scrollTop();

		console.log( lastPoint);
		
	});

	$('.work').hover(function(){
		

		var $this = $(this);

		$this.removeClass('toBottom toTop toLeft toRight');
		$this.addClass(getClassNameFrom(lastPoint, $this));
		

		return false;
	}, function(e){
		var $this = $(this);

		$this.removeClass('fromBottom fromTop fromLeft fromRight');
		$this.addClass(getClassNameTo(e, $this));

		return false;
	});

	$('.work').on('mousemove', function(){
		return false;
	});

	var getClassNameFrom = function (lastPoint, $this) {
		var offset = $this.offset();

		var width = $this.width();
		var height = $this.height();

		var elOffset = {
			top: $this.offset().top + $(".main-wrap").scrollTop(),
			right: offset.left + width + $(".main-wrap").scrollLeft(),
			bottom: offset.top + height + $(".main-wrap").scrollTop(),
			left: offset.left + $(".main-wrap").scrollLeft()
		}

		/*console.log('lastPoin', lastPoint);
		//console.log('offset', elOffset);*/


		if(lastPoint.y <= elOffset.top){
			return "fromTop";
		}

		if(lastPoint.y >= elOffset.bottom){
			return "fromBottom";
		}

		if(lastPoint.x <= elOffset.left){
			return "fromLeft";
		}

		//console.log(lastPoint.x, '>=',elOffset.right);

		if(lastPoint.x >= elOffset.right){
			return "fromRight";
		}

		/*console.log('no');*/
	};

	var getClassNameTo = function (e, $this) {
		var offset = $this.offset();
		var width = $this.width();
		var height = $this.height();

		var mouseX = e.pageX + $(".main-wrap").scrollLeft();
		var mouseY = e.pageY + $(".main-wrap").scrollTop();

		var elOffset = {
			top: offset.top + $(".main-wrap").scrollTop(),
			right: offset.left + width + $(".main-wrap").scrollLeft(),
			bottom: offset.top + height + $(".main-wrap").scrollTop(),
			left: offset.left + $(".main-wrap").scrollLeft()
		}

		console.log('lastPoin', {x: mouseX, y: mouseY});
		console.log('offset', elOffset);


		if(mouseY <= elOffset.top){
			return "toTop";
		}

		if(mouseY >= elOffset.bottom){
			return "toBottom";
		}

		//console.log(mouseX, '>=',elOffset.left);
		if(mouseX <= elOffset.left){
			return "toLeft";
		}


		if(mouseX >= elOffset.right){
			return "toRight";
		}

		//console.log('no');
	};
})(jQuery);

// http://xn--b1aebcc8algc.xn--p1ai/