(function($){
// swiper init
	var mySwiper = new Swiper ('.swiper-container', {
		// Optional parameters
		pagination: '.swiper-pagination',
		paginationClickable: true,
		loop: true
    });     
// End swiper init

// for navigations
	var $body = $('body');
	var $mainNav = $('#nav-main');
	var $listMenu = $mainNav.find('.menu li'); 
	var $btnNav = $('.btn-nav');
	var $listBlocks = $('.js-anchor');
	var curentBlock = 0;
	var arrAnchorsPos = [];

	var toggleNav = function(){
		if($mainNav.hasClass('open')){
			$mainNav.add($btnNav).removeClass('open');
			$body.removeClass('no-scroll');
		} else {
			$mainNav.add($btnNav).addClass('open');
			$body.addClass('no-scroll');
		}
	};

	var setCurentNav = function(){
		curentBlock = getActiveNav();	
		$listMenu.removeClass('active');
		$listMenu.eq(curentBlock).addClass('active');	
	};

	var initArrAnchorsPos = function(){
		$listBlocks.each(function(i){
			//arrAnchorsPos[i] = (i==0)? $listBlocks.eq(i).offset().top : $listBlocks.eq(i).offset().top - 50;
			arrAnchorsPos[i] = $listBlocks.eq(i).offset().top - 50;
		});
		console.log(arrAnchorsPos);
	};

	var getActiveNav = function(){
		var valScroll = $(window).scrollTop();
		for (var i = 0; i <= arrAnchorsPos.length; i++) {
			if(valScroll<=arrAnchorsPos[i] + $listBlocks.eq(i).height()-1){
				return i;
			}
		};
		return i-1;
	}

	$('.js-nav-open').on('click', toggleNav);

	$listMenu.on('click', function(){
		var $this = $(this);
		// $this.siblings('.active').removeClass('active');
		// $this.addClass('active');
		//setCurentNav();
		toggleNav();
		$("html, body").animate({
			scrollTop: arrAnchorsPos[$this.index()]
		},500);

	});

	$(window).load(function(){
		initArrAnchorsPos();
		setCurentNav();
	});

	$(window).scroll(function(){
		setCurentNav();
	});
// End for navigations
})(jQuery);