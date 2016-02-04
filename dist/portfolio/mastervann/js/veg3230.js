/*
 * Visibility Event Generation
 * для выбраных элементов генерирует событие появления и изчезновения из видимой облости документа
 * (inscreen, outscreen)
 * для инициализации $.veg3230.init();
 * и как препер добовления объекта $('.sites').veg3230(fanIn,fanOut,true,'имя класса');
 * все параметры не обязательны
 * 1-й параметр - функция каторая будет вызвана при inscreen
 * 2-й параметр - функция каторая будет вызвана при outscreen
 * 3-й параметр - выберает прописывать или нет клас элементу при событии inscreen
 * 4-й параметр - имя прописываемого класса
 * можно задавать разные обработчики для разных груп елементов по силектору
 * $('.group1').veg3230(fanIn1,fanOut1,true,'class1');
 * $('.group2').veg3230(fanIn2,fanOut2,true,'class2');
 * 
*/
;(function($) {
	$.fn.veg3230 = function(funIn,funOut,bAddClass,sClassName) {
        var objVis={};
        funIn=(!funIn)? $.veg3230.funIn: funIn;
        funOut=(!funOut)? $.veg3230.funOut: funOut;
        //регестрируем обработчики
        $(this).bind('inscreen',funIn);
        $(this).bind('outscreen',funOut);
        //заполняю поля объекта        
        objVis.jEl=$(this);
        objVis.bAddClass=(bAddClass===false)? false: true;
        objVis.sClassName=(!sClassName)? 'inscreen': sClassName;
		//добавляю в массив элемент для отслежывания события		
		$.veg3230.arrObj.push(objVis);
	};

	$.veg3230= {
		arrObj: [],
		funIn: function(){
			//todo: обработчик по умолчанию
		},
		funOut: function(){
			//todo: обработчик по умолчанию
		},
		GetViewable : function(){
            var viewable={};
            viewable.top=$(document).scrollTop();
            viewable.bottom=viewable.top+$(window).height();
            return viewable;    
        },
        CheckVisibleItems: function(){
        	for(var i=0;i<$.veg3230.arrObj.length;i++){
        		$.veg3230.arrObj[i].jEl.each(function(){

	    			var elOffsetTop=$(this).offset().top;
	    			var elOffsetBottom=elOffsetTop+$(this).outerHeight();
	    			var viewableTop=$.veg3230.GetViewable().top;
	    			var viewableBottom=$.veg3230.GetViewable().bottom;


	    			if(elOffsetBottom>viewableTop && elOffsetTop<viewableBottom){
	    				if(!$(this).data('flag')){
	    					$(this).trigger('inscreen');
		    				if($.veg3230.arrObj[i].bAddClass){
		    					$(this).addClass($.veg3230.arrObj[i].sClassName);
		    				}
		    				$(this).data('flag',true);
	    				}	    				
	    			}

	    			if(elOffsetTop>viewableBottom || elOffsetBottom<viewableTop){
	    				if($(this).data('flag')){
		    				$(this).trigger('outscreen');
		    				if($.veg3230.arrObj[i].bAddClass){
		    					$(this).removeClass($.veg3230.arrObj[i].sClassName);
		    				}
		    				$(this).data('flag','');
		    			}
	    			}
	        	});// end each
        	}// end for        	
        },
        init : function(){
        	$(document).scroll(function(){
        		$.veg3230.CheckVisibleItems();
        	});
        }
	}


	//вызов в app.js
	/*$(document).ready(function(){
		//todo:перенести в app.js
		$.veg3230.init();
		//$('.sites').veg3230(null,null,false);
		$('.info, .sites').veg3230();
		//$('.header').veg3230(function(){},function(){},true,'veg3230');
		//var app=$('body>div').veg3230(function(){},function(){},true,'veg3230');
	});*/
})(jQuery);