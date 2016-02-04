(function($){
	jQuery.fn.scrollToElement = function(options){
// создание переменных
		var block = $(this),
			arr = [], // создание массива в котором храниться расположение "привязок" - toScrollBlock
			prodActive = 11, // число изначально показываемых материалов (начинается с 0)
			item = $('.range .item'),
			allProd = item.length-1;

// END создание переменных

// настройки плагина
	    options = $.extend({
	      menuChild: "li",// назначение детей меню
	      toScrollBlock: ".toScrollBlock", //  класс к которому проматывается при клике на пункт меню
	      topBlock: ".header" // название меню (если есть фиксированное)
	    }, options);
// END настройки плагина

// создание функций
		function activNextProd(){// функция добавляющая класс для след. пака продуктов
			for(var i=0;i<=prodActive && i<=allProd ;i++){
				item.eq(i).addClass('active');
			}
		}
		function arrayFill(){// заполнение массива
			$(options.toScrollBlock).each(function(){
				var a = $(this).offset().top-$(options.topBlock).innerHeight(); // число равное позиции блока раздела
				arr.push(a); // добавляем в массив
			});
		}
		function activeLi(){// функция добавляющая класс для активного пункта меню и удаление его у других
			for(var i=0;i<arr.length;i++){
				if($(window).scrollTop()>=arr[i]){
					block.find('li').eq(i).addClass('active').siblings().removeClass('active');
				}
				else if($(window).scrollTop()<arr[0]){
					block.find('li').removeClass('active');
				}
				else if($(window).scrollTop()==$(document).height()-$(window).height()){
					block.find('li').eq(arr.length-1).addClass('active').siblings().removeClass('active');
				}
			}
		}
// END создание функций

		block.find(options.menuChild).click(function(){// событие при клике по пункту меню (прокрутка)
			var val = $(this).index(),
			//Необходимо прокрутить до раздела
				curPos = $(document).scrollTop(),
				offset = $(options.topBlock).innerHeight(),
				height = $(options.toScrollBlock).eq(val).offset().top - offset,
				scrollTime = Math.abs(height-curPos)/1.73;
			$("body,html").animate({"scrollTop":height},scrollTime);
			return false;
		});


		$('.btn-more').click(function() {// при клике на '.show-more a' показываем больше материалов
			var a = allProd-prodActive;
			var b;
			(a>=12)? b=3: b=Math.ceil(a/4);

			$('.range .list').animate(
				{
					height: "+="+item.eq(0).outerHeight(true)*b
				},
				400, 'swing',
				function(){
					prodActive += 12; // сколько прибавлять при клике на "показать ещё"
					activNextProd();
					if(prodActive>=item.length-1){
						$('.btn-more').css('display','none');
						$('.range').css('paddingBottom','12px');
					}
					else{
						$('.btn-more').removeClass('none');
					}
					arr = [];
					arrayFill();
					activeLi();
				}
			);
			
			return false;
		});
// инициализация функций
		$(window).scroll(function() {
			activeLi();
		});
		$(window).ready(function() {
			activNextProd();
			arrayFill();
			activeLi();
		});
// END инициализация функций
	};
})(jQuery);