(function($) {

// click on btn-sound
	function addClassClick($el) {
		$el.addClass('click');
		setTimeout(function() {
			$el.removeClass('click');
		}, 300);
	}

	function muted($btnSound){
		var $video = $btnSound.closest('.ps-slide').find('video');
		if(($btnSound).hasClass('on')){
			$btnSound.removeClass('on');
			$video.prop('muted', true);
		}else{
			$btnSound.addClass('on');
			$video.prop('muted', false);
		}
		addClassClick($btnSound);
	}

	$('.btn-sound').on('click', function() {
		muted($(this));
		return false;
	});
// End click on btn-sound

// pageSlider
	var $pageSlider = $('#page-slider');
	var $listSlides = $pageSlider.find('.ps-slide');
	var $header = $pageSlider.find('#header-main');
	var $listNavItems = $header.find('.nav-main a');
	var curentSlideIndex =  0;
	var fAnim = false;

	var checkedVideo = function($curent, $next){
		var curVideo = $curent.find('video'),
			nextVideo = $next.find('video');
		
		if(curVideo[0]){
			curVideo.get(0).pause();
			curVideo.get(0).muted = true;
			$curent.find('.btn-sound').removeClass('on');
		}

		if(nextVideo[0]){
			nextVideo.get(0).play();
		}
	};

	var checkedInnerSlider = function($curent){
		var $innerSlider = $curent.find('.inner-slider');
		if($innerSlider[0]){

			setStyleHeader('inverse-2', $curent.data('header-style'));

			window.setTimeout(function(){
				$listBtnsNav.removeClass('active').eq(0).addClass('active');
				$listInnerSlides.removeClass('active').eq(0).addClass('active');
			},600)
		}
	};

	var toSlide = function(index){
		var $next = $listSlides.eq(index);
		var $active = $listSlides.eq(curentSlideIndex);

		var curentStyle = $active.data('header-style');
		var nextStyle = $next.data('header-style');		
		
		if(index > curentSlideIndex){
			//..toTop (next)
			$next.addClass('toTop');
			$active.addClass('js-darken');

			window.setTimeout(function(){
				$active.removeClass('active js-darken');
				$next.removeClass('toTop').addClass('active');
				fAnim = false;
			},600)

		} else {
			//..toBot (prev)
			$next.addClass('prev');
			$active.addClass('toBot ');

			window.setTimeout(function(){
				$active.removeClass('active toBot ');
				$next.removeClass('prev').addClass('active');
				fAnim = false;
			},600)
		}
		
		checkedVideo($active, $next);
		checkedInnerSlider($active);
		setStyleHeader(curentStyle, nextStyle);
		setNavActive(index);
		fAnim = true;
		curentSlideIndex = index;		
	};

	var nextSlide = function(){
		if(curentSlideIndex + 1 < $listSlides.length){
			toSlide(curentSlideIndex + 1);			
		}
	};

	var prevSlide = function(){
		if(curentSlideIndex != 0){
			toSlide(curentSlideIndex -1);			
		}
	};

	var setNavActive = function(index){
		console.log($listNavItems.eq(index));
		$listNavItems.removeClass('active').eq(index).addClass('active');
	};

	var setStyleHeader = function(curentStyle, nextStyle){
		if(curentStyle){
			$header.removeClass(curentStyle);
		}
		if(nextStyle){
			$header.addClass(nextStyle);
		}
	};

	var handlerNav = function(){
		var index = $(this).index();
		if(index != curentSlideIndex && !fAnim){
			toSlide(index);		
		}
		return false;
	};

	// click on nav
	$listNavItems.on('click', handlerNav);
	// End click on nav

	// click on btn-scroll
	$pageSlider.find('.btn-scroll').on('click', function(){
		nextSlide();
		return false;
	});
	// End click on btn-scroll

	// mousewheel
	$pageSlider.on('mousewheel', function(e){
		if(!fAnim){
			if(e.deltaY > 0){
				prevSlide();
			}else{
				nextSlide();
			}
		}
	});
	// End mousewheel

	// touche
	var clY = null;
	var movingSize = 30;
	$pageSlider.on('touchstart', function(event){
		var e = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0]
		clY = e.clientY;
	});

	$pageSlider.on('touchend', function(event){
		var e = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0]
		
		if(clY < e.clientY &&  e.clientY - clY > movingSize){
			prevSlide();
		}else if( clY > e.clientY &&  clY - e.clientY > movingSize){
			nextSlide();
		}
	});
	// end touche

	// keydown
	$(window).on('keydown', function(event){
		if(event.keyCode == 38){
			prevSlide();
		}else if( event.keyCode == 40){
			nextSlide();
		}
	});
	// End keydown

// end pageSlider

// inner-slider
	var $innerSlider = $('#b-presentation .inner-slider');
	var $listInnerSlides = $innerSlider.find('.slide');
	var $navInnerSlides = $('<ul></ul>').appendTo($innerSlider.find('.slider-nav'));
	var fAnimInnerSlides = false;
	var curentInnerSlide = 0;

	var toInnerSlide = function(index){
		if(!fAnimInnerSlides){
			var $active = $listInnerSlides.filter('.active');
			var $next = $listInnerSlides.eq(index);

			$listBtnsNav.removeClass('active');
			$listBtnsNav.eq(index).addClass('active');

			$next.addClass('next');
			fAnimInnerSlides = true;
			//console.log('active',$active.data('header-style'),'next',$next.data('header-style'))
			setStyleHeader($active.data('header-style'), $next.data('header-style'));
			curentInnerSlide = index;

			window.setTimeout(function(){
				$active.removeClass('active');
				$next.addClass('active').removeClass('next');
				fAnimInnerSlides = false;
			},600);
		}
	};

	var nextInnerSlide = function(){
		var nextSlide = (curentInnerSlide+1 < $listInnerSlides.length)? curentInnerSlide+1 : 0;
		toInnerSlide(nextSlide);
	};

	$listInnerSlides.each(function(index){
		$navInnerSlides.append('<li></li>');
	});

	var $listBtnsNav = $navInnerSlides.find('li');

	// inner slider init
	$listBtnsNav.eq(curentInnerSlide).add($listInnerSlides.eq(curentInnerSlide)).addClass('active');

	$listBtnsNav.on('click', function(){
		var $this = $(this);
		var index = $this.index();
		toInnerSlide(index);	
	});

	$listInnerSlides.on('click', nextInnerSlide);
// End inner-slider	

// for rating
/*	var $wrapRating = $('#b-sale .rating');
	var $listRatingItems = $wrapRating.find('.list li');

	$listRatingItems.on('click', function(){
		var $this = $(this);
		var rating = 5-$this.index();
		//if(!checkCook() || 1){
		if(true){
			$.ajax({
				url: 'handler_rating.php',
				data: {'rating': rating},
				type: "POST",
				dataType: "json",
				success: function(json){
					var average = Math.round(json.average);
					var count = json.count;
					var index = 5-json.average;
					$listRatingItems.removeClass('active').eq(index).addClass('active');
					$wrapRating.find('.average').text(count);
				}
			});
		}
	});*/
// for rating

})(jQuery);
