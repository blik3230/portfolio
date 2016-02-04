(function() {

	$(window).load(function(){
		var listWorks = $('.works__list');

		listWorks.alignRows(3, '.work', function($rowItems, height){
			var imgHeight = $rowItems.eq(0).find(".work__img").height();
			var lineHeight = height - imgHeight - 40; // 20 px - padding of the title.

			$rowItems.each(function(){			
				$(this).find(".work__title").css("lineHeight", lineHeight + 'px');
			});
		});

		$('.carousel').carousel3230();
	});	


})(jQuery);