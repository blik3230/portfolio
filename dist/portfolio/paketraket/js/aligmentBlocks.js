(function(){
	$.fn.alignmentBlocks=function(options){
		
		options = $.extend({
			blocks_in_row : "auto",
			alignment_item : ".item",
			alignment_selector : "h3",
			alignment_style : "all",
			adaptivity : false
		}, options);
		console.log("options ");

		var $el = this,
			$listItems=$el.find(options.alignment_item);

        var calcBlocksInRow = function(){
            return parseInt($el.width()/$listItems.eq(0).width());
        };

        var getNumBlocksInRow=function(){
            return (typeof options.alignment_item =="number")? options.alignment_item : calcBlocksInRow();
        };
		

        var alignmentRow=function($bloks){

            var maxHieghtItem = 0;
            //находим максимальную высоту блока
            $bloks.each(function(){
            	if($(this).height() > maxHieghtItem) maxHieghtItem = $(this).height();
            });

            //выравниваем меньшие по высоте блоки
            $bloks.each(function(){
            	//console.log("alignmentRow "+ $bloks);
            	if($(this).height() < maxHieghtItem){
            		var $alignmentEl = $(this).find(options.alignment_selector); // набор выравниваемых элементов
            		var countAlignetEl = $alignmentEl.length, // количество выравниваемых элементов
            			heightDifference = maxHieghtItem - $(this).height(); //разница высоты блоков
            		switch(options.alignment_style){
            			case "padding":
            				$alignmentEl.each(function(){
            					$(this).css({
        							paddingTop:'+='+heightDifference/countAlignetEl/2+'px',
        							paddingBottom:'+='+heightDifference/countAlignetEl/2+'px',
        						});
            				});
            				break;
        				case "margin": // todo: предусматреть слияние блоков с родительским       					
        					$alignmentEl.each(function(){
        						$(this).css({
        							marginTop:'+='+heightDifference/countAlignetEl/2+'px',
        							marginBottom:'+='+heightDifference/countAlignetEl/2+'px',
        						});
        					});
            				break;
        				default:
        					$alignmentEl.each(function(){
        						$(this).css({
        							marginTop:'+='+heightDifference/countAlignetEl/4+'px',
        							marginBottom:'+='+heightDifference/countAlignetEl/4+'px',
        							paddingTop:'+='+heightDifference/countAlignetEl/4+'px',
        							paddingBottom:'+='+heightDifference/countAlignetEl/4+'px'// todo: подумать над дробными частями
        						});
        						console.log($(this));
        					});
            				break;
            		}
            	}
            });
        };

    	var aligmentEl = function(){

			var blocksInRow = getNumBlocksInRow(),
				rows = parseInt($listItems.length/blocksInRow);

			for(var i=0; i<$listItems.length; i+=blocksInRow){
			    if((i+blocksInRow)/blocksInRow<=rows){ 
			        alignmentRow($listItems.slice(i,i+blocksInRow));
			        //console.log("first"+i+a);
			    }else{
			        alignmentRow($listItems.slice(i));
			    }
			}	

    	};

    	if(options.adaptivity){
	    	$(window).resize(aligmentEl);    		
    	}

    	
    	aligmentEl();
    };
})(jQuery);


