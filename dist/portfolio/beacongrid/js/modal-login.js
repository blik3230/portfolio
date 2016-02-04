(function($){
	var $modalContainer = $('.modal-login'),
		$tabs = $('[class^=tab-]'),
		$btnBack = $('.js-back'),
		$btnHome = $('.js-home'),
		fAnim = false;

	$tabs.find('.btn-next').on('click', function(){	
		if(!fAnim){
			var $this = $(this),
				$cur = $tabs.filter('.active'),
				$next = $(this).closest('[class^=tab-]');

			fAnim = true;

			$cur.removeClass('active').addClass('toLeft');
			$next.addClass('active');

			setTimeout(function(){
				$cur.addClass('right');

				setTimeout(function(){
					$cur.removeClass('right toLeft');	

					setTimeout(function(){
						fAnim = false;		
					},400);

				}, 60);

			}, 350);			
			
		}	
		
	});

	$btnBack.on('click',function(){
		$modalContainer.remove()
		window.history.back();		
	});

	$btnHome.on('click',function(){
		$modalContainer.remove();		
	});
})(jQuery);