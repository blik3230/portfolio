/*  Данный слайдер v1.1.1 поддерживает три режима
    1) С навигацией стрелочками
    2) С навигацией кликом по картинке (не доделан)
    3) С навигацией табами
    Все основные ностройки задаются в опциях.
    Внимание! Если Ваш слайд имеет другие классы то измените их
    через настройки или в css и html у себя!
    #libri-slider - имеет сам блок к которому была инициализация плагина
    .slide - имеет каждый слайд
    .contol-slide - имеет список табов
    все остальные настройки прокомментированы на против значений
*/
(function($) {
    jQuery.fn.libriSlider = function(options) {
        // Блок настроек
        options = $.extend({
            slideSpeed: 0, // скорость анимации
            timeOut: 5000, // автопереключение через...
            firstTime: 1, // время первого переключения (если 1, то равно timeOut, если больше то timeOut/firstTime)

            slidesNumber: 1, // сколько слайдов показывается одновременно
            asynchronouslyAmination:  false, // асинхронная анимация нескольких слайдов

            autoSwitch: true, // авто переключение
            hoverSwitch: true, // переключение при ховере на слайдер

            arrow: false, // имеются стрелочки навигации
            listNav: false, // имеется навигация списка

            pause: false, // по умолчанию слайдер не остановлен

            clickSwich: false, // при клике на слайдер переключается
            inBlockSwich: false, // если нужно данные из слайда перетащить любой другой блок (in-block)

            inBlock: $('#in-block'),
            fromBlock: $('.from-block'),

            slide: $('.slide')
        }, options);
        // END блок настроек
        // Блок переменных
        var block = $(this), 
            winW = $(window).width(), 
            winH = $(window).height(),

        slideSpeed = options.slideSpeed,
        timeOut = options.timeOut,
        firstTime = options.timeOut / options.firstTime,

        slidesNumber = options.slidesNumber,
        asynchronouslyAmination = options.asynchronouslyAmination,
        autoSwitch = options.autoSwitch,
        hoverSwitch = options.hoverSwitch,
        arrow = options.arrow,
        listNav = options.listNav,
        pause = options.pause,
        clickSwich = options.clickSwich,
        inBlockSwich = options.inBlockSwich,
        inBlock = options.inBlock,
        fromBlock = options.fromBlock,
        slide = options.slide,

        slideNum = 0,
        numberSlideSwitch = 0,
        controlSlide, // будет хранить control-slide - круги навигации
        slideTime,  // функция rotator записывает переключение след. слайда
        slideCount = block.find(slide).size(), // количество слайдов
        flag = true;
        // END блок переменных
        // Блок функций
        function animSlide(arrow) { // Функция переключает слайды
                console.log(timeOut)
            clearTimeout(slideTime); // отменяет автопереключение (подробнее в функции rotator)
            block.find(slide).eq(slideNum).fadeOut(slideSpeed, function() {// сначала прячет активный слайд
                // тут определяет что было передано и перезаписывает активный слайд в соответствии с переданным
                if (arrow == 'next') {
                    if (slideNum == (slideCount - 1)) {
                        slideNum = 0;
                    }
                    else {
                        slideNum++
                    }
                }
                else if (arrow == 'prev') {
                    if (slideNum == 0) {
                        slideNum = slideCount - 1;
                    } 
                    else {
                        slideNum -= 1
                    }
                } 
                else {
                    slideNum = arrow;
                };

                if (inBlockSwich) { //данные для изменения
                    inBlock.html(slide.eq(slideNum).find(fromBlock).html());
                }

                block.find(slide).eq(slideNum).fadeIn(slideSpeed, rotator); // показывает новый активный слайд
                numberSlideSwitch ++;

                if (listNav) {
                    controlSlide.eq(slideNum).addClass('active').siblings().removeClass('active'); // активизирует соответсвующий контроллер
                }

            });
        // заметка для libris
        // необходимо проверить затратность siblings()
        // по отношению к удалению актива у элеммента с классом актив
        // и послед. добавлению актива для соответствующего эл-та
        }
        
        function rotator() {
            if (!pause) { // по каким то причинам слайдер не остановлен то выполняем
                if (numberSlideSwitch == 0) {
                    timeOutNew = firstTime;
                }
                else {
                    timeOutNew = timeOut;
                }
                slideTime = setTimeout(function() {
                    animSlide('next')
                }, timeOutNew);
            }
            flag = true
        }
        // END блок функций
        
        block.find(slide).hide().eq(0).show();
        // Блок условий
        // выполнение условий зависит от настроек
        if (arrow) {
            block.prepend('<a id="prev" href="#"></a><a id="next" href="#"></a>');
            
            block.find('#next').on('click', function() {
                if (flag) {
                    animSlide('next');
                    flag = true;
                    return false;
                }
            });
            block.find('#prev').on('click', function() {
                animSlide('prev');
                return false;
            });
        }
        
        if (clickSwich) {
            block.click(function() {
                if (flag) {
                    flag = false;
                    animSlide('next');
                }
            });
            block.dblclick(function() {
                if (flag) {
                    flag = false;
                    animSlide('prev');
                }
            });
        }
        
        if (listNav) {
            var adderSpan = '';
            slide.each(function(index) {
                adderSpan += '<li class = "control-slide">' + index + '</li>';
            });
            $('<ul class ="slider-links clfx">' + adderSpan + '</ul>').appendTo(block);
            controlSlide = $('.control-slide');
            controlSlide.filter(':first').addClass("active");
            
            controlSlide.click(function() {
                var goToNum = parseFloat($(this).text());
                animSlide(goToNum);
            });
        }
        
        if (!hoverSwitch) {
            block.hover(function() {
                clearTimeout(slideTime);
                pause = true;
            }, 
            function() {
                pause = false;
                rotator();
            });
        }
        
        if (autoSwitch) {
            rotator();
        }
    // END блок условий
    }
})(jQuery);
