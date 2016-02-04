(function() {
	$.fn.alignRows = function(column, selector, callback){
		var $parent = this;
		selector = selector? selector: 'li';
		var $listItems = $parent.find(selector);

		var alignRow = function($rowItems){
			var maxHeight = 0;

			$rowItems.each(function(){
				var thisHeight = $(this).height();

				if(thisHeight > maxHeight){
					maxHeight = thisHeight;
				}
			});

			$rowItems.height(maxHeight);

			console.log(maxHeight, 'maxHeight');

			if(typeof callback == "function") {
				callback($rowItems, maxHeight);
			}
		};

		var fullRow = parseInt($listItems.length / column);

		for(var i = 0; i < $listItems.length; i += column){

		    if( (i+column) / column <= fullRow){
		        alignRow($listItems.slice(i, i + column));
		    }else{
		        alignRow($listItems.slice(i));
		    }
		}
	};
})(jQuery);