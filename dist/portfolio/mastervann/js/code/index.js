;(function($){
	$(document).ready(function () {
		
		// init libriScroll for nav
		$('.b-header .nav-main').scrollToElement();

		//initialize swiper when document ready  
		var mySwiper = new Swiper ('.b-gallery .list', {
			pagination: '.swiper-nav',
			bulletClass: 'swiper-bullet',
			bulletActiveClass: 'active',
			slidesPerView: 4,
			slidesPerGroup: 4,
			autoplay: 5000,
			autoplayDisableOnInteraction: false,
			paginationClickable: true,
			spaceBetween: 30
		});

		$('#js-btn-home').on('click', function() {

			var offset = window.innerHeight || document.documentElement.clientHeight,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop,
				scrollTime = Math.abs(offset - scrollTop) / 1.73;

			$("body,html").stop().animate({"scrollTop":offset},scrollTime);
		});

		// for animations
		$.veg3230.init();

		$('.b-advantages, .b-principles').veg3230(
			function(){ 
				$(this).addClass('on'); 
			}, 
			function(){},
			false);

		$('.b-works dl dd:first li').veg3230(
			function(){ 
				$(this).addClass('on'); 
			}, 
			function(){},
			true);

		$('.b-gallery').veg3230(
			function(){ 
				var $slides = $(this).find('.swiper-slide');
				$slides.each(function(i){
					var $slide = $(this);
					setTimeout(function(){
						$slide.addClass('on');
					}, 300*i);
				}); 
			},
			function(){},
			false);


		var $bReviews = $('.b-reviews');
		var $listReviews = $bReviews.find('li');
		var lastReview = 0;
		var scrollSetings = {

		};

		var nextReviews = function(){            
			var $nextTwoReviews;

			$bReviews.removeClass('rw-hide');
			$bReviews.find('.rw-show').removeClass('rw-show').addClass('rw-hide');

			if($listReviews.length > lastReview+1){
				$nextTwoReviews = $listReviews.slice(lastReview, lastReview+2);
				lastReview += 2;
				
			}else if($listReviews.length == lastReview+1){
					$nextTwoReviews = $listReviews.eq(0).add($listReviews.eq($listReviews.length-1));
					lastReview = 1;
				}else{
					$nextTwoReviews = $listReviews.slice(0, 2);
					lastReview = 2;
				}
			
		   if($nextTwoReviews.eq(0).index() == 0 && $nextTwoReviews.eq(1).index() != 1){
				$nextTwoReviews.eq(0).addClass('rw-right');
				$nextTwoReviews.eq(1).addClass('rw-left');
				console.log('true');
			} else {
				$nextTwoReviews.eq(0).addClass('rw-left');
				$nextTwoReviews.eq(1).addClass('rw-right');
				console.log('false');
			}

			$nextTwoReviews.addClass('rw-show');

			setTimeout(function(){
				$bReviews.find('.rw-hide').removeClass('rw-left').removeClass('rw-right').removeClass('rw-hide');
			},400)
		};

		$bReviews.find('.btn-more').on('click', function(){
			nextReviews();
		});

		$('.b-reviews').veg3230(
			function(){ 
				if(!$(this).hasClass('on')){
					nextReviews(); 
					console.log('gh');
					$(this).addClass('on')
				}
			},
			function(){},
			false);
		
	});
			
	// image gallery
	$('.b-gallery img').glisse({
		changeSpeed: 550, 
		speed: 500,
		effect:'bounce',
		//fullscreen: true
	});

	// for change header
	var $header = $('.b-header'),
		$bHome = $('.b-home');
		headerOffsetTop = $bHome.height() ;

	var checkScroll = function(){
		if($(this).scrollTop() == 0){
			if(!$header.hasClass("small")){
				$header.addClass("small");
			}
		}else{
			$header.removeClass("small");
		}

		if($(this).scrollTop() > headerOffsetTop){
			if(!$header.hasClass("pos-f")){
				$header.addClass("pos-f");
				$bHome.addClass("mb");
			}
		}else{
			if($header.hasClass("pos-f")){
				$header.removeClass("pos-f");
				$bHome.removeClass("mb");
			}
		}
	};

	// Scroll the page when clicking on the logo
	$('.logo').on('click', function(){
		var duration = ($('body').scrollTop())? parseInt($('body').scrollTop()/3) : 0;
		console.log(duration);
		$('html, body').animate({scrollTop: 0},duration);
		return false;
	});

	$( window ).scroll(function() {
		checkScroll();
	});

	$( document ).ready(function() {
		checkScroll();
	});
})(jQuery);