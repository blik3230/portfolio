(function($){
	$.fn.centeringWithLeft = function() {
		var imgs = this;
		var findRel = function($current){
			if($current.css('position')=='absolute'){
				return $current;
			}
			findRel($current.parent())
		}
	}
})(jQuery);