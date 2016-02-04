(function($){
	/*
		Этот простой плагин объединяет объекты и по ховеру на один выставляются на оба класы .hover и снимаются
	*/
	$.fn.hoverCombined = function(options){
		var defould={
			items : [[0,1],[3,4],[2,5]],
			className : "hover",
			target : '.item'
		};
		options = $.extend(defould, options);
		var $el = this;
		var childs = $el.find(defould.target);

		var getCurArr = function($curInd){		
			var i,j;
			for (i = 0; i < options.items.length; i++) {
				for (j = 0; j < options.items[i].length; j++) {
					if($curInd==options.items[i][j]){						
						curInd = i;						
					}
				}

			}
		};
				
		childs.hover(
			function(){
				curArr = getCurArr($(this).index());
				for(var l = 0; l<options.items[curInd].length; l++){						
					childs.eq(options.items[curInd][l]).addClass(options.className);
				}
			},function(){
				curArr = getCurArr($(this).index());
				for(var l = 0; l<options.items[curInd].length; l++){						
					childs.eq(options.items[curInd][l]).removeClass(options.className);
				}
			}
		);	
			
	};

	$(window).ready(function(){
		$('.infoblock .list').hoverCombined();
	});

})(jQuery);