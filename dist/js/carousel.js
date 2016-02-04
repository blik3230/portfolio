(function() {
	$.fn.carousel3230 = function(){
		var time;
		var $this = this;
		var container = this.find('.carousel__container');
		var items = this.find('.carousel__item');
	    var left = 0;

		function step() {
		    requestAnimationFrame(step);


		    var now = new Date().getTime(),
		        dt = now - (time || now);

		    time = now;
		    console.log(dt);
		    //
		    left -= ~~(dt / 10);

		    if( left < -290){
	    		left = left + 290;
			    console.log(left, "left");

    			container.append(container.find('.carousel__item').eq(0));
		    }
		    
		    container.css('transform', 'translateZ(0) translateX(' + left + 'px)');

		}

		step();
	};
})(jQuery);