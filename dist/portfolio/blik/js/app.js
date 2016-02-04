(function($){		
	//паралакс для облоков
	var jFirstBg=$('.wrap-bg').eq(0),
		jSecondBg=$('.wrap-bg').eq(1);
	setInterval(function(){
		var pos1=parseInt(jFirstBg.css('backgroundPosition'));
		var pos2=parseInt(jSecondBg.css('backgroundPosition'));
		pos1=(pos1+3<1460)?pos1+3:pos1+3-1460;
		pos2=(pos2>-1460)?pos2-1:0;
		jFirstBg.css({
			backgroundPositionX: pos1
		});	
		jSecondBg.css({
			backgroundPositionX: pos2
		});
	},50);

	//аккардион для вертикального меню
	$('.sidebar span').toggle(
		function(){
			//$(this).closest('open');
			var mainLi=$(this).closest('li').addClass('open');
			mainLi.siblings('.open').children('span').click();
			mainLi.children('ul').slideDown(400);
		},
		function(){
			$(this).closest('li').find('.open span').click();
			var mainLi=$(this).closest('li').removeClass('open');
			mainLi.children('ul').slideUp(400);
		}	
	);

	//вызов мод. окон
	$('.btn-sizing a').click(function(){
		$('.white-bg').fadeIn(400);
		$('.modal-sizing').fadeIn(400);
		return false;
	});
	$('.btn-calculation a').click(function(){
		$('.white-bg').fadeIn(400);
		$('.modal-calculation').fadeIn(400);
		return false;
	});

	//close modal
	$('.btn-close').click(function(){
		$(this).closest('[class^="modal-"]').slideUp(200,function(){
			$('.white-bg').fadeOut(200);
		});
	});
})(jQuery);