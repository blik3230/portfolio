(function($){
	jQuery.fn.scrollToElement = function(options){

// настройки плагина
	    options = $.extend({
			toScrollBlock: $(".toScrollBlock"), //  класс к которому проматывается при клике на пункт меню
			topBlock: $(".b-main-header"), // название меню (если есть фиксированное)
	    }, options);
// END настройки плагина

// создание переменных
		var $window = $(window),

			block = $(this),

			li = block.find('li'),
			menuChild = block.find('li'),
			toScrollBlock = options.toScrollBlock,
			topBlock = options.topBlock,

			flagTop = true,
			activeListItem,
			item = [],
			nextItem = []; // тут будет храниться число строк которые появятся при клике
// END создание переменных

// создание функций
		function arrayFill(){// присвоение позиций

			item = [];
			nextItem = [];

			li.data('change', true);

			toScrollBlock.each(function(val){
				
				var n = 0,
					m = 1,

					$this = toScrollBlock.eq(val + n),
					$next = toScrollBlock.eq(val + m),

					thisPosition,
					nextPosition;

				if ($this.css('display') == 'none') {

					for (n -= 1; $this.css('display') == 'none'; --n) {

						$this = toScrollBlock.eq(val - n);

						if($this.css('display') == 'block') {

							thisPosition = $this.offset().top - topBlock.innerHeight();

							item.push(thisPosition);
						}
					}
					
				} else {
					thisPosition = $this.offset().top - topBlock.innerHeight();

					item.push(thisPosition);
				}

				if ($next.css('display') == 'none') {

					for (m += 1; $next.css('display') == 'none'; --m) {

						$next = toScrollBlock.eq(val + m);

						if($next.css('display') == 'block') {

							thisPosition = $next.offset().top - topBlock.innerHeight();

							nextItem.push(thisPosition);
						}
					}
					
				} else {

					if(val == toScrollBlock.length-1) {
						nextItem.push($(document).height());
					} else {
						nextPosition = $next.offset().top - topBlock.innerHeight();

						nextItem.push(nextPosition);
					}
				}
			});

		}

		function activeLi(){// функция добавляющая класс для активного пункта меню и удаление его у других
			
			var scrollTop = $window.scrollTop(); //Вычислили только 1 раз

			li.each(function (val) {

				var $this = $(this);

				if (item[val] <= scrollTop && nextItem[val] >= scrollTop) {

					if ($this.data('change')) {
						// console.log(1); проверка флагов при скролле
						$this.data('change', false).addClass('active')
						.siblings().data('change', true).removeClass('active');

						flagTop = true;
					}; 
				}

			});

			if (scrollTop < item[0] && flagTop) {

				block.find('li').removeClass('active');

				li.data('change', true);

				flagTop = false;
			
			} else if(scrollTop == $(document).height() - $window.height()){
				
				var val = toScrollBlock.length-1;

				if (li.eq(val).data('change')) {

					li.eq(val).data('change', false).addClass('active')
					.siblings().data('change', true).removeClass('active');

					flagTop = true;
				}
			}
		}

// END создание функций

		block.find(menuChild).click(function(){// событие при клике по пункту меню (прокрутка)
			
			var val = $(this).index(),
			//Необходимо прокрутить до раздела
				curPos = $(document).scrollTop(),
				height = item[val],
				scrollTime = Math.abs(height-curPos)/1.73;

			$("body,html").animate({"scrollTop":height},scrollTime);

			return false;
		});
// инициализация функций
		$window.ready(function() {
			arrayFill();
			activeLi();
		});
		$window.load(function() {
			arrayFill();
		});
		$window.scroll(function() {
			activeLi();
		});
// END инициализация функций
	};

})(jQuery);