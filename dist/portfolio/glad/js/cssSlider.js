(function($){
	$.fn.cssSlider = function(){
		this.each(function(){
			//инициализация
			var	wrapSlider = $(this),
				slides = wrapSlider.find('.slide'),
				btnPrev = wrapSlider.find('.btn-prev'),
				btnNext = wrapSlider.find('.btn-next'),
				bubbleNav = wrapSlider.find('.bubble-nav ul'),
				current = 0;

				// create bubbles nav
				var strBubles = '';
				for(var i=0; i<slides.length; i++){
					if(i){
						strBubles+='<li><a href="#"></a></li> ';					
					}else{
						strBubles+='<li class="active"><a href="#"></a></li> ';
					}
				}
				console.log(slides.length);
				// устанавливаю 1-ый слайд
				bubbleNav.html(strBubles);
				slides.eq(current).addClass('current');

				//
			//

			//next slide
			var next = function(){
				var nextSlide;
				//если не последний
				(slides.length-1==current)? nextSlide = 0 : nextSlide = current+1;
				animSlide(nextSlide);			
				return false;			
			};

			//previous slide
			var prev = function(){
				var nextSlide;
				//если не последний
				(current===0)? nextSlide = slides.length-1 : nextSlide = current-1;
				animSlide(nextSlide);
				return false;
			};

			// click handler on the bubble btn
			var hBubbles = function(){
				var nextSlide = $(this).index();
				animSlide(nextSlide);
			};

			//
			var animSlide = function(next){
				var tmpNext = slides.eq(next).addClass('next');
				var tmpCur = slides.eq(current).addClass('flipOutY');
				var timer = setTimeout(function(){
					tmpCur.removeClass('current flipOutY');
					tmpNext.removeClass('next').addClass('current');

					bubbleNav.find('li').eq(current).removeClass('active');
					bubbleNav.find('li').eq(next).addClass('active');
					current = next;
					console.log(current);
				},750);
			};

			btnPrev.on('click',prev);
			btnNext.on('click',next);
			bubbleNav.find('a').on('click',function(){
				if(!($(this).parent().index()==current)){
					animSlide($(this).parent().index());
				}			
				return false;
			});
		});
	};
})(jQuery);