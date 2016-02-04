(function($){

	// for center block with left
	$.fn.centeringWithTopLeft = function() {
		/*var $centerBlock = this;
		var findRel = function($current){
			if($current.parent().css('position')=='relative'){
				return $current.parent();
			}
			findRel($current.parent());
		};
		var parentRel = findRel($centerBlock);
		var left = $(parentRel).width()/3;
		var top = $(parentRel).height()/3;
		$centerBlock.each(function(){
			$(this).css({
				left : left,
				top : top
			});
		});*/

		this.each(function() {
			var $centerBlock = $(this);
			var findRel = function($current){
				if($current.parent().css('position')=='relative'){
					return $current.parent();
				}
				findRel($current.parent());
			};
			var parentRel = findRel($centerBlock);
			var left = ($(parentRel).width()-$centerBlock.innerWidth())/2;
			var top =($(parentRel).height()-$centerBlock.innerHeight())/2;
			$centerBlock.each(function(){
				$(this).css({
					left : left,
					top : top
				});
			});
		});
	};

	// выситывает высоту для introtext и ставит кнобку readmore если текст не влезает в блок
	$.fn.calcHeightIntrotext = function() {
		this.each(function(){
			var wrapText = $(this);
			var centerBlock = wrapText.closest('.center-block');
			var introtext = centerBlock.find('.introtext');
			var h2 = centerBlock.find('h2');
			var wrapBtn = centerBlock.find('.wrap-btn');
			if(introtext.height()>centerBlock.height()-h2.outerHeight()){
				var wrapTextHeight = parseInt((centerBlock.height()-h2.outerHeight()-54)/16)*16;

				wrapText.height(wrapTextHeight);
				wrapBtn.css({
					height: centerBlock.height()-h2.outerHeight()-wrapTextHeight,
					display: 'block'
				});
			}else{
				wrapText.height(centerBlock.height()-h2.outerHeight());	
				wrapBtn.css({
					display: 'none'				
				});
			}
		});		
	};

	// выситывает высоту для review и ставит кнобку readmore если текст не влезает в блок
	$.fn.calcHeightReview = function() {
		this.each(function(){
			var wrapText = $(this),
				introtext = wrapText.find('.introtext'),
				item = wrapText.closest('.item'),
				wrapImg = item.find('.wrap-img'),
				h2 = item.find('h2'),
				wrapBtn = item.find('.wrap-btn'),
				hieghtToIntrotext = item.height()-wrapImg.innerHeight()-h2.innerHeight();

			if(hieghtToIntrotext<introtext.height()){
				var wrapTextHeight = parseInt((hieghtToIntrotext-54)/16)*16;
				wrapText.height(wrapTextHeight);
				wrapBtn.css({
					height: item.height()-wrapImg.outerHeight()-h2.outerHeight()-wrapTextHeight,
					display: 'block'
				});
			}else{
				wrapText.height(item.height()-h2.outerHeight()-wrapImg.outerHeight());	
				wrapBtn.css({
					display: 'none'				
				});
			}
		});
		
	};

	//расчитывает оставщуюся высоту для заданого блока вычетая у родительской высоты 
	//высоты всех дочерних элементов
	$.fn.remainingHeight = function(){
		this.each(function(){
			var el = $(this),
				parent = el.parent(),
				siblings = el.siblings();
			var elHeight = parent.height();
			if(siblings.length){
				siblings.each(function(){
					elHeight-=$(this).innerHeight(); 
			 	});
			 	el.height(elHeight)// vj;tn innerheight()???
			}else{
				el.css({
					top: (parent.height()-el.height())/2
				});			
			} 
		});		
	};

	var $content = $('.content');
	var $aside = $('aside');
	var calcContentSize = function(){
		var $window = $(window);
		var widthScreen = $window.width()-290;
		var heightScreen = $window.height();
		//$content.width(widthScreen-290);//290-ширина сайдабара

		$content.css({
			width : (widthScreen>670)? widthScreen : 670,
			height : heightScreen
			//minHeight : heightScreen
		});//290-ширина сайдабара

		// выравниваю секцию 1
		aligmentSection1();
		//отцентравка центральных блоков
		$('.center-block').centeringWithTopLeft();


		$('.center-block .wrap-text').calcHeightIntrotext();
		$('.grid-review .wrap-text').calcHeightReview();
		$('.main').remainingHeight()
		$('.grid-review').remainingHeight()

		//расчет высоты сайдаба
		asideCulcHeight(heightScreen);
	};

	var aligmentSection1 = function(){
		var sect1 = $('#section-1 .content');
		var childs = sect1.children();
		var countIndents = childs.length+1;
		var minHeight = 0;
		childs.each(function(){
			minHeight += $(this).height();
		});
		var indent = ($(window).height()-minHeight)/countIndents;
		childs.each(function(i){
			if(i){
				$(this).css('marginTop',indent);
			}else{
				$(this).css('paddingTop',indent);				
			}
		});
	};


	// расчитывает высоту для сайдбара, выставляет 2 класса каторыми задаётся отступы и размеры элементов 
	// разницу между пограничными размерами заполняет margin-bottom для li и задает нужную высоту для ul
	var asideCulcHeight = function(heightScreen){		
		//if(heightScreen<653 && heightScreen >=517){   вариант ели будет расмер эрана меньше
		if(heightScreen<653){
			$aside.removeClass('small').addClass('very-small');
		}	

		if(heightScreen<879 && heightScreen >=653){
			$aside.removeClass('very-small').addClass('small');
		}	

		if(heightScreen>879){
			$aside.removeClass('very-small small');
		}
		var $navUl = $aside.find('ul');
		var $navLi = $navUl.find('li');

		$navUl.height($aside.find('ul').height()+heightScreen-$aside.height());

		var marginBottom = ($navUl.height()-($navLi.innerHeight()*$navLi.length))/$navLi.length;
		$navLi.css('marginBottom', marginBottom);
	};


	$(window).resize(function(){
		calcContentSize();		
	});


	$(window).load(function(){
		calcContentSize();	
		$('.grid-4 img, .grid-8 img').smartAligmentImg();
		$('.btn-more').fancybox({
			margin : [100,310,100,310],
			afterLoad   : function() {
		        this.content =  this.content.html();
		    }
		});
		$('.grid-4 a').fancybox();
		$('.grid-8 a').fancybox();
		$('.wrap-slider').cssSlider();
	});

	$(window).ready(function(){
		$('#fullpage').fullpage({
			anchors: ['section1', 'section2', 'section3', 'section4', 'section5', 'section6','section7', 'section8', 'section9'],
	    	menu: '#mainMenu',
	    	slideSelector: '.slide-fullpage',
	    	verticalCentered: false,
    		resize : false,
		});
	});

	$(document).scroll(function(event) {
		/* Act on the event */
		$aside.css('left', -$(document).scrollLeft());
		//$(window).scrollLeft(0);
	});

	$('input').each(function(){
        var tmpVal=$(this).val();

        $(this).bind('focus',function(){
            if($(this).val()==tmpVal){
                $(this).val('');
            }
        });
        $(this).bind('blur',function(){
            if($(this).val()==''){
                $(this).val(tmpVal);
            }
        });
    });

    //валидация формы
    $('form').submit(function(){
        var name=$(this).find('[name^="name"]'),
            phone=$(this).find('[name^="phone"]');
        var regexPhone = /^\+?(\(?\d+\)?)?\d+((-|\s)*\d)*$/;//телефон
        var err = false;

        if(!regexPhone.test(phone.val())){
        	err=true;
        	phone.addClass('err').val("Ошибка!");
        	phone.on('click.err',function(){
        		$(this).val('').removeClass('err').off('click.err');
        	});
        }

        if(name.val()==''|| name.val()=='Ошибка!' || name.val()=='Ваше имя:'){
        	err=true;
        	name.addClass('err').val("Ошибка!");
        	name.on('click.err',function(){
        		$(this).val('').removeClass('err').off('click.err');
        	});
        }

        if(err){            
            return false;
        }
    });

})(jQuery);