(function ($) {
	$(document).ready(function(){
		//hover for submenu
		var timeout;
		$('.nav-top-2>ul>li').hover(function(){
			var hoverEl=$(this);
			timeout= setTimeout(function() {
				$(hoverEl).find('ul').slideDown(300);
			}, 200);
			
			console.log(this);
		},function(){
			clearTimeout(timeout);
			$(this).find('ul').slideUp(250);
		});
		//fixed footer
		if($(".footer").offset().top+$(".footer").outerHeight()<$(window).height())
		$(".footer").css({
			position: "absolute",
			width: "100%",
			bottom: 0
		});
	});	
})(jQuery);