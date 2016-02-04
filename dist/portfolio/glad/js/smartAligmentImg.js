(function($){
	$.fn.smartAligmentImg = function() {
		var imgs = this;
		//console.log(imgs);
		var recalc = function(){
			imgs.each(function(){
				var curImg = $(this);
				if(curImg.width()<curImg.parent().width()){
					curImg.css({
						height : 'auto',
						width : '100%'
					});
				}
				if(curImg.height()<curImg.parent().height()){
					curImg.css({
						width : 'auto',
						height : '100%'
					});
				}
				//console.log(curImg.width());
			});
		};
		recalc();	
		$(window).resize(function(){
			recalc();			
		});
	}
})(jQuery);