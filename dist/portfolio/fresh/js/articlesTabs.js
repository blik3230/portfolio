(function($){
	var content = $('.content');

	var ulArticles = content.find('.list-articles');
	var listArticles = ulArticles.find('li');

	var ulPreviews = content.find('.list-previews');
	var listPreviews = ulPreviews.find('li');

	var hendler = function(){

		ulPreviews.find('.off').removeClass('off');
		var index = $(this).closest('li').addClass('off').index();

		ulArticles.find('.on').removeClass('on');
		listArticles.eq(index).addClass('on');
		setTimeout(function(){listArticles.eq(index).find('.wrap-border').addClass('on');},10);

		/*or*/
		// ulArticles.find('.onn').fadeOut(400);
		// listArticles.eq(index).addClass('onn').fadeIn(400);


		console.log(index);

		return false;
	};

	listPreviews.on('click','a',hendler);

})(jQuery);