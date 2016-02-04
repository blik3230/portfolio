(function ($) {
	////для вкладок внутри вкладок
		$.fn.tabs2tabs=function(options){	
			var settings = $.extend( {
				selectors:{
					tabsNav: '.slider-nav',
					tabsScreen: '.slider'
				}
			}, options);	
			var wrapTabs=this.find(settings.selectors.tabsScreen);
			var wrapNavs=this.find(settings.selectors.tabsNav);
			var listTabs=wrapTabs.find('li').detach();
			var listNavs=wrapNavs.find('li').detach();

			wrapNavs.find("ul").append(listNavs.slice(0,8));
			wrapTabs.find("ul").append(listTabs.eq(0));

			listNavs.find("a").click(function(){
				if($(this).closest('li').hasClass('active')){	
					return false;
				}
				//выставляем класс актив для нажимаемой кнопки
				$(wrapNavs).find(".active").removeClass("active");
				var indexTab=$(this).closest('li').addClass("active").index();
				//вставляем вкладку
					//старую уменшаем и удаляем новая выезжает скрая или
					//старуя уезжает всторону новая увеличивается с центра
				wrapTabs.find("ul").empty().append(listTabs.eq(indexTab).clone());
				$(".wrap-slider").tabs2tabs();
				return false;
			});
		};

	$(document).ready(function(){
		//Вкладки во вкладках
		////главная вкладка
		var tabsList=$(".tabs-view [class^=tab-]").detach();
		var btnList=$(".wrap-tabs-nav .tabs-nav li");
		var hideTab=function(){};
		var showTab=function(){};
		var visContainer=$(".tabs-view ul").append(tabsList.eq(0).clone());
		btnList.eq(0).addClass("active");

		//обработчики кликов на навигационые кнопки
		btnList.find('a').click(function(){
			//если кнопка активная
			if($(this).closest('li').hasClass('active')){
				console.log("active");	
				return false;
			}
			//выставляем класс актив для нажимаемой кнопки
			$(".wrap-tabs-nav .active").removeClass("active");
			var indexTab=$(this).closest('li').addClass("active").index();
			//ставим стрелку на место
			var arrowLeft=($(this).closest('li').position().left+($(this).closest('li').width())/2)-9;
			console.log(arrowLeft);	
			$(".wrap-tabs-nav .arrow").css("left",arrowLeft);
			//вставляем вкладку
				//старую уменшаем и удаляем новая выезжает скрая или
				//старуя уезжает всторону новая увеличивается с центра
			visContainer.empty().append(tabsList.eq(indexTab).clone());
			$(".wrap-slider").tabs2tabs();
			return false;
		});
		
	});
})(jQuery);