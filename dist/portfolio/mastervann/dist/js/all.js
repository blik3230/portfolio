/*
* jQuery Glisse plugin
* v1.1.1
* ---
* @author: Victor
* @authorurl: http://victorcoulon.fr
* @twitter: http://twitter.com/_victa
*
* Based on jQuery Plugin Boilerplate 1.3
*
*/
(function ($, document) {
    $.glisse = function (element, options) {

        var plugin = this,
            $element = $(element),
            defaults = {
                dataName: 'data-glisse-big',
                speed: 300,
                changeSpeed: 1000,
                effect: 'bounce',
                mobile: false,
                fullscreen: false,
                disablindRightClick: false,
                parent: null // jQuery selector to find the container
            },
            // Private var
            pictureUrl,
            group,
            isChange = false,
            mobile = {},
            touch = {},
            cache = [],
            getFullUrl = function ($el) {
                return $el.attr(plugin.settings.dataName) || $el.attr('src');
            };

        plugin.settings = {};
        plugin.els = {};

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);

            // Set vars
            group = $element.attr('rel') || null;
            plugin.settings.mobile = !!navigator.userAgent.match(/iPhone|iPod|iPad|Android/i);

            // Set events
            $element.on('click', function () {
                pictureUrl = getFullUrl($element);

                createElements();
                setChangeStyle();
                addImage(pictureUrl);
                setChangeStatus();
                setTitle();
                preloadImgs();

                // Bind Keyboard events
                $(document).keydown(function(event) {
                    if(event.keyCode.toString() === '27'){ closeLightbox(); }
                    if(event.keyCode.toString() === '39'){ changePicture('next'); }
                    if(event.keyCode.toString() === '37'){ changePicture('prev'); }
                });

                if(plugin.settings.disablindRightClick){
                    plugin.els['content'].on('contextmenu', function(e){
                        return false;
                    });
                }
                // ==== Mobile support =================
                if(plugin.settings.mobile){
                    mobile = {
                        touching: false,
                        nx: 0,
                        oX:0, // Original X-coordinate
                        scrollX: null
                    };

                    document.ontouchmove = document.ontouchstart = document.ontouchend = touchHandler;
                }
            });
        };

        var preloadImgs = function preloadImgs(){
            var current, image_urls = [], i;

            $('img[rel="'+group+'"]').each(function(i,el){
                image_urls.push(getFullUrl($(this)));
            });
            function loaded(current){
                cache.push(current);
            }
            for (i = 0; i < image_urls.length; i += 1) {
                current = jQuery("<img>").attr("src", image_urls[i]);
                current.load(loaded(image_urls[i]));
            }
        };

        var createElements = function createElements() {
            $('body').addClass("no-scroll");
            $element.addClass('active');

            var cssProp = getPrefix('transition')+'transition',
                cssVal = 'opacity '+plugin.settings.speed+'ms ease, '+getPrefix('transform')+'transform '+plugin.settings.speed+'ms ease';

            // Create Glisse HTML structure
            plugin.els['wrapper']       = $(document.createElement('div')).attr('id','glisse-wrapper');
            plugin.els['overlay']       = $(document.createElement('div')).attr('id','glisse-overlay').css(cssProp, cssVal);
            plugin.els['spinner']       = $(document.createElement('div')).attr('id','glisse-spinner');
            plugin.els['close']         = $(document.createElement('span')).attr('id','glisse-close').css(cssProp, cssVal);
            plugin.els['content']       = $(document.createElement('div')).attr('id','glisse-overlay-content').css(cssProp, cssVal)
                                            .css(getPrefix('transform')+'transform', 'scale(0)');
            plugin.els['controls']      = $(document.createElement('div')).attr('id','glisse-controls').css(cssProp, cssVal);
            plugin.els['controlNext']   = $(document.createElement('span')).attr('class','glisse-next')
                                            .append( $(document.createElement('a')).attr("href", "#"));
            plugin.els['controlLegend'] = $(document.createElement('span')).attr('class','glisse-legend');
            plugin.els['controlPrev']   = $(document.createElement('span')).attr('class','glisse-prev')
                                            .append($(document.createElement('a')).attr("href", "#"));

            // Add structure
            plugin.els['overlay'].append(plugin.els['spinner']);
            plugin.els['controls'].append(
                    plugin.els['controlNext'],
                    plugin.els['controlLegend'],
                    plugin.els['controlPrev']);
            plugin.els['wrapper'].append(
                    plugin.els['overlay'],
                    plugin.els['close'],
                    plugin.els['content'],
                    plugin.els['controls']
                );
            $('body').append(plugin.els['wrapper']);

            readyElement.observe('glisse-overlay', function(){ plugin.els['overlay'].css('opacity',1); });
            readyElement.observe('glisse-close', function(){ plugin.els['close'].css('opacity',1); });
            readyElement.observe('glisse-controls', function(){ plugin.els['controls'].css('opacity',1); });

            // Bind events
            plugin.els['controls'].delegate('a','click', function(e){
                e.preventDefault();
                var changeTo = ($(this).parent().hasClass('glisse-next')) ? 'next' : 'prev';
                changePicture(changeTo);
            });

            //plugin.els['overlay'].on('click', function() { closeLightbox(); });
            //plugin.els['content'].on('click', function() { closeLightbox(); });
            plugin.els['close'].on('click', function() { closeLightbox(); });

            if(plugin.settings.fullscreen){
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
            }
        };

        var closeLightbox = function closeLightbox() {

            // Hide lightbox
            plugin.els['content'].css({opacity: 0}).css(getPrefix('transform')+'transform', 'scale(1.2)');
            plugin.els['overlay'].css({opacity: 0});
            plugin.els['close'].css({opacity: 0});
            plugin.els['controls'].css({opacity: 0});

            // remove lightbox from dom
            setTimeout(function(){
                plugin.els['content'].remove();
                plugin.els['overlay'].remove();
                plugin.els['close'].remove();
                plugin.els['controls'].remove();
                plugin.els['wrapper'].remove();
                $('#glisse-transition-css').remove();
            }, plugin.settings.speed);

            $element.removeClass('active');

            // Unbinds
            document.ontouchmove = function(e){ return true; };
            document.ontouchstart = function(e){ return true; };
            document.ontouchend = function(e){ return true; };
            $(document).unbind("keydown");

            if(plugin.settings.fullscreen){
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }

            $('body').removeClass("no-scroll");
        };

        var addImage = function addImage(pic) {
            spinner(true);
            var img = $('<img/>',{src: pic}).appendTo(plugin.els['content']);
            plugin.els['content'].css({ backgroundImage: 'url("'+pic+'")'});

            img.load(function() {
                img.remove();
                spinner(false);
                plugin.els['content'].css({visibility: 'visible', opacity: 1})
                                     .css(getPrefix('transform')+'transform','scale(1)');
            });
        };

        var changePicture = function changePicture(direction) {
            var $currentEl = $('img['+plugin.settings.dataName+'="'+pictureUrl+'"][rel='+group+']'),
                currentId  = $('img[rel='+group+']').index($currentEl),
                totGroup   = $('img[rel='+group+']').length,
                change     = true;

            if((currentId === 0 && direction === 'prev') || (currentId === (totGroup-1) && direction === 'next')) {
                change = false;
            }

            if(change && isChange === false){
                isChange = true;
                var $next = (direction === 'next') ? $('img[rel='+group+']').eq(currentId+1) : $('img[rel='+group+']').eq(currentId-1);
                if(plugin.settings.mobile){
                    if(direction !== 'next'){
                        plugin.els['content'].css(getPrefix('transform')+'transform', 'translateX(2000px)');
                    } else {
                        plugin.els['content'].css(getPrefix('transform')+'transform', 'translateX(-2000px)');
                    }
                } else {
                    plugin.els['content'].addClass('glisse-transitionOut-'+direction);
                    var cssProp = getPrefix('transition')+'transition',
                        cssVal = 'opacity '+plugin.settings.speed+'ms ease, '+getPrefix('transform')+'transform '+plugin.settings.speed+'ms ease';
                    plugin.els['content'].css(cssProp, '');
                }

                pictureUrl = getFullUrl($next);

                if($.inArray(pictureUrl, cache) === -1)
                    spinner(true);

                $currentEl.removeClass('active');
                $next.addClass('active');

                setChangeStatus();
                setTitle();

                setTimeout(function() {
                    if(plugin.settings.mobile){
                        plugin.els['content'].css(getPrefix('transform')+'transform', 'translateX(0px)')
                            .css('display','none');
                    }

                    var img = $('<img/>',{src: pictureUrl}).appendTo(plugin.els['content']);
                    plugin.els['content'].css({ backgroundImage: 'url("'+pictureUrl+'")'});
                    
                    img.load(function() {
                        img.remove();
                        
                        if($.inArray(pictureUrl, cache) === -1)
                            spinner(false);

                        if(plugin.settings.mobile){
                            plugin.els['content'].css('display','block');
                        }
                        plugin.els['content'].removeClass('glisse-transitionOut-'+direction)
                                                    .addClass('glisse-transitionIn-'+direction);
                        setTimeout(function(){
                            plugin.els['content'].removeClass('glisse-transitionIn-'+direction).css(cssProp, cssVal);
                            isChange = false;
                        }, plugin.settings.changeSpeed);
                    });
                }, plugin.settings.changeSpeed);
            } else if(change === false && isChange === false){
                if(plugin.settings.mobile){
                    plugin.els['content'].css(getPrefix('transform')+'transform', 'translateX(0px)');
                }
                plugin.els['content'].addClass('shake');
                setTimeout(function(){
                    plugin.els['content'].removeClass('shake');
                }, 600);
            }
        };

        var setChangeStyle = function setChangeStyle(){
            // Set change picture keyframes
            var prefix = getPrefix('transform'),
                prefixAnimation = getPrefix('animation'),
                effect = [];

            if(!isValidEffect(plugin.settings.effect))
                plugin.settings.effect = 'bounce';

            switch(plugin.settings.effect){
                case 'bounce':
                    effect = [
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% { '+prefix+'transform: translateX(0);}',
                            '20% { opacity: 1;'+prefix+'transform: translateX(20px);}',
                            '100% { opacity: 0;'+prefix+'transform: translateX(-2000px);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% {opacity: 0;'+prefix+'transform: translateX(-2000px);}',
                            '60% {opacity: 1;'+prefix+'transform: translateX(30px);}',
                            '80% {'+prefix+'transform: translateX(-10px);}',
                            '100% {'+prefix+'transform: translateX(0);}',
                        '}',
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% {'+prefix+'transform: translateX(0);}',
                            '20% {opacity: 1;'+prefix+'transform: translateX(-20px);}',
                            '100% {opacity: 0;'+prefix+'transform: translateX(2000px);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% {opacity: 0;'+prefix+'transform: translateX(2000px);}',
                            '60% {opacity: 1;'+prefix+'transform: translateX(-30px);}',
                            '80% {'+prefix+'transform: translateX(10px);}',
                            '100% {'+prefix+'transform: translateX(0);}',
                        '}'
                    ].join('');
                break;
                case 'fadeBig':
                     effect = [
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% { opacity: 1;'+prefix+'transform: translateX(0);}',
                            '100% {opacity: 0;'+prefix+'transform: translateX(-2000px);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% { opacity: 0;'+prefix+'transform: translateX(-2000px);}',
                            '100% {opacity: 1;'+prefix+'transform: translateX(0);}',
                        '}',
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% { opacity: 1;'+prefix+'transform: translateX(0);}',
                            '100% {opacity: 0;'+prefix+'transform: translateX(2000px);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% { opacity: 0;'+prefix+'transform: translateX(2000px);}',
                            '100% {opacity: 1;'+prefix+'transform: translateX(0);}',
                        '}'
                    ].join('');
                break;
                case 'fade':
                     effect = [
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% { opacity: 1;'+prefix+'transform: translateX(0);}',
                            '100% {opacity: 0;'+prefix+'transform: translateX(-200px);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% { opacity: 0;'+prefix+'transform: translateX(-200px);}',
                            '100% {opacity: 1;'+prefix+'transform: translateX(0);}',
                        '}',
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% { opacity: 1;'+prefix+'transform: translateX(0);}',
                            '100% {opacity: 0;'+prefix+'transform: translateX(200px);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% { opacity: 0;'+prefix+'transform: translateX(200px);}',
                            '100% {opacity: 1;'+prefix+'transform: translateX(0);}',
                        '}'
                    ].join('');
                break;
                case 'roll':
                     effect = [
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% { opacity: 1;'+prefix+'transform: translateX(0px) rotate(0deg);}',
                            '100% {opacity: 0;'+prefix+'transform: translateX(-100%) rotate(-120deg);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% { opacity: 0;'+prefix+'transform: translateX(-100%) rotate(-120deg);}',
                            '100% {opacity: 1;'+prefix+'transform:  translateX(0px) rotate(0deg);}',
                        '}',
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% { opacity: 1;'+prefix+'transform:translateX(0px) rotate(0deg);}',
                            '100% {opacity: 0;'+prefix+'transform:translateX(100%) rotate(120deg);}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% { opacity: 0;'+prefix+'transform: translateX(100%) rotate(120deg);}',
                            '100% {opacity: 1;'+prefix+'transform:  translateX(0px) rotate(0deg);}',
                        '}'
                    ].join('');
                break;
                case 'rotate':
                     effect = [
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% { opacity: 1;'+prefix+'transform: rotate(0deg);'+prefix+'transform-origin:left bottom;}',
                            '100% {opacity: 0;'+prefix+'transform: rotate(-90deg);'+prefix+'transform-origin:left bottom;}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% { opacity: 0;'+prefix+'transform: rotate(90deg);'+prefix+'transform-origin:left bottom;}',
                            '100% {opacity: 1;'+prefix+'transform: rotate(0deg);'+prefix+'transform-origin:left bottom;}',
                        '}',
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% { opacity: 1;'+prefix+'transform: rotate(0deg);'+prefix+'transform-origin:right bottom;}',
                            '100% {opacity: 0;'+prefix+'transform: rotate(90deg);'+prefix+'transform-origin:right bottom;}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% { opacity: 0;'+prefix+'transform: rotate(-90deg);'+prefix+'transform-origin:right bottom;}',
                            '100% {opacity: 1;'+prefix+'transform: rotate(0deg);'+prefix+'transform-origin:right bottom;}',
                        '}'
                    ].join('');
                break;
                case 'flipX':
                    effect = [
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% {'+prefix+'transform: perspective(400px) rotateX(0deg);opacity: 1;}',
                            '100% {'+prefix+'transform: perspective(400px) rotateX(90deg);opacity: 0;}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% {'+prefix+'transform: perspective(400px) rotateX(90deg);opacity: 0;}',
                            '40% {'+prefix+'transform: perspective(400px) rotateX(-10deg);}',
                            '70% {'+prefix+'transform: perspective(400px) rotateX(10deg);}',
                            '100% {'+prefix+'transform: perspective(400px) rotateX(0deg);opacity: 1;}',
                        '}',
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% {'+prefix+'transform: perspective(400px) rotateX(0deg);opacity: 1;}',
                            '100% {'+prefix+'transform: perspective(400px) rotateX(90deg);opacity: 0;}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% {'+prefix+'transform: perspective(400px) rotateX(90deg);opacity: 0;}',
                            '40% {'+prefix+'transform: perspective(400px) rotateX(-10deg);}',
                            '70% {'+prefix+'transform: perspective(400px) rotateX(10deg);}',
                            '100% {'+prefix+'transform: perspective(400px) rotateX(0deg);opacity: 1;}',
                        '}'
                    ].join('');
                break;
                case 'flipY':
                    effect = [
                        '@'+prefixAnimation+'keyframes outLeft {',
                            '0% {'+prefix+'transform: perspective(400px) rotateY(0deg);opacity: 1;}',
                            '100% {'+prefix+'transform: perspective(400px) rotateY(90deg);opacity: 0;}',
                        '}',
                        '@'+prefixAnimation+'keyframes inLeft {',
                            '0% {'+prefix+'transform: perspective(400px) rotateY(90deg);opacity: 0;}',
                            '40% {'+prefix+'transform: perspective(400px) rotateY(-10deg);}',
                            '70% {'+prefix+'transform: perspective(400px) rotateY(10deg);}',
                            '100% {'+prefix+'transform: perspective(400px) rotateY(0deg);opacity: 1;}',
                        '}',
                        '@'+prefixAnimation+'keyframes outRight {',
                            '0% {'+prefix+'transform: perspective(400px) rotateY(0deg);opacity: 1;}',
                            '100% {'+prefix+'transform: perspective(400px) rotateY(-90deg);opacity: 0;}',
                        '}',
                        '@'+prefixAnimation+'keyframes inRight {',
                            '0% {'+prefix+'transform: perspective(400px) rotateY(90deg);opacity: 0;}',
                            '40% {'+prefix+'transform: perspective(400px) rotateY(-10deg);}',
                            '70% {'+prefix+'transform: perspective(400px) rotateY(10deg);}',
                            '100% {'+prefix+'transform: perspective(400px) rotateY(0deg);opacity: 1;}',
                        '}'
                    ].join('');
                break;
            }
            var changeClass = [
                        '.glisse-transitionOut-next {',
                            prefixAnimation+'animation: '+plugin.settings.changeSpeed+'ms ease;',
                            prefixAnimation+'animation-name: outLeft;',
                            prefixAnimation+'animation-fill-mode: both;',
                        '}',
                        '.glisse-transitionIn-prev {',
                            prefixAnimation+'animation: '+plugin.settings.changeSpeed+'ms ease;',
                            prefixAnimation+'animation-name: inLeft;',
                            prefixAnimation+'animation-fill-mode: both;',
                        '}',
                        '.glisse-transitionOut-prev {',
                            prefixAnimation+'animation: '+plugin.settings.changeSpeed+'ms ease;',
                            prefixAnimation+'animation-name: outRight;',
                            prefixAnimation+'animation-fill-mode: both;',
                        '}',
                        '.glisse-transitionIn-next {',
                            prefixAnimation+'animation: '+plugin.settings.changeSpeed+'ms ease;',
                            prefixAnimation+'animation-name: inRight;',
                            prefixAnimation+'animation-fill-mode: both;',
                        '}'
                    ].join('');

            if(!document.getElementById('glisse-css')) {
                $('<style type="text/css" id="glisse-css">'+effect+changeClass+'</style>').appendTo('head');
            } else {
                $('#glisse-css').html(effect+changeClass);
            }
        };

        // === Controls actions  =================

        var setChangeStatus = function setChangeStatus() {
            var $currentEl = $('img['+plugin.settings.dataName+'="'+pictureUrl+'"]'),
                parent = plugin.settings.parent?
                    $currentEl.closest(plugin.settings.parent):
                    $currentEl.parent();
            if(!parent.next().find('img[rel='+group+']').length) {
                plugin.els['controls'].find('.glisse-next').addClass('ended');
            } else {
                plugin.els['controls'].find('.glisse-next').removeClass('ended');
            }
            if(!parent.prev().find('img[rel='+group+']').length) {
                plugin.els['controls'].find('.glisse-prev').addClass('ended');
            } else {
                plugin.els['controls'].find('.glisse-prev').removeClass('ended');
            }
        };

        var setTitle = function setTitle() {
            var $legend     = plugin.els['controls'].find('.glisse-legend');
            var $currentEl = $('img['+plugin.settings.dataName+'="'+pictureUrl+'"]');
            var title      = $currentEl.attr('title');
             $legend.html( (title) ? title : '');
        };

        // Spinner =========================================
        var spinner = function spinner(action) {
            plugin.els['overlay'].toggleClass('loading', action);
        };


        // Get Vendor prefix
        var getPrefix = function getPrefix(prop){
            var prefixes = ['Moz','Khtml','Webkit','O','ms'],
                elem     = document.createElement('div'),
                upper    = prop.charAt(0).toUpperCase() + prop.slice(1);

            for (var len = prefixes.length; len--; ){
                if ((prefixes[len] + upper)  in elem.style)
                    return ('-'+prefixes[len].toLowerCase()+'-');
            }

            return false;
        };

        var readyElement = (function(){
          return {
            observe : function(id,callback){
              var interval = setInterval(function(){
                if(document.getElementById(id)){
                  callback(document.getElementById(id));
                  clearInterval(interval);
                }
              },60);
            }
          };
        })();

        var isValidEffect = function isValidEffect(effect){
            return !!~$.inArray(effect, ['bounce', 'fadeBig', 'fade', 'roll', 'rotate', 'flipX', 'flipY']);
        };

       // Swipe support
        var touchHandler = function touchHandler(e) {
            if (e.type == "touchstart") {
                mobile.touching = true;
                // If there's only one finger touching
                if (e.touches.length == 1) {
                    // Remove transition
                    plugin.els['content'].css(getPrefix('transition')+'transition', '');

                    var touch = e.touches[0];
                    // If they user tries clicking on a link
                    if(touch.target.onclick) {
                        touch.target.onclick();
                    }
                    // The originating X-coord (point where finger first touched the screen)
                    mobile.oX = touch.pageX;
                    // Reset default values for current X-coord and scroll distance
                    mobile.nX = 0;
                    mobile.scrollX = 0;
                }
            } else if (e.type == "touchmove") {
                // Prevent the default scrolling behaviour (notice: This disables vertical scrolling as well)
                e.preventDefault();
                mobile.scrollX = null;

                // If there's only one finger touching
                if (e.touches.length == 1) {
                    var touch = e.touches[0];
                    // The current X-coord of the users finger
                    mobile.nX = touch.pageX;

                    // If the user moved the finger from the right to the left
                    if (mobile.oX > mobile.nX) {
                        // Find the scrolling distance
                        mobile.scrollX = -(mobile.oX-mobile.nX);
                    // If the user moved the finger from the left to the right
                    } else if(mobile.nX > mobile.oX) {
                        // Find the scrolling distance
                        mobile.scrollX = mobile.nX-mobile.oX;
                    }
                    plugin.els['content'].css(getPrefix('transform')+'transform', 'translateX('+(mobile.scrollX)+'px)');
                }
            // If the user has removed the finger from the screen
            } else if (e.type == "touchend" || e.type == "touchcancel") {
                // Defines the finger as not touching
                mobile.touching = false;
                var cssProp = getPrefix('transition')+'transition',
                    cssVal = 'opacity '+plugin.settings.speed+'ms ease, '+getPrefix('transform')+'transform '+plugin.settings.speed+'ms ease';
                plugin.els['content'].css(cssProp, cssVal);

                if(mobile.scrollX > 140){
                    changePicture('prev');
                } else if(mobile.scrollX < -(140)){
                    changePicture('next');
                } else {
                    plugin.els['content'].css(getPrefix('transform')+'transform', 'translateX(0px)');
                }

            } else {
                // Nothing
            }
        };


        // Public method
        plugin.changeEffect = function(effect) {
            if(isValidEffect(effect)){
                plugin.settings.effect = effect;
                setChangeStyle();
            }
        };


        plugin.init();

    };
    // Return
    $.fn.glisse = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('glisse')) {
                var plugin = new $.glisse(this, options);
                $(this).data('glisse', plugin);
            }
        });
    };
})(jQuery, window.document);

;(function($){
	$(document).ready(function () {
		$('#js-btn-call').on('click', function() {

			var offset = $('#b-footer').offset().top,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop,
				scrollTime = Math.abs(offset - scrollTop) / 1.73;

			$("body,html").stop().animate({"scrollTop":offset},scrollTime);
		});

		$('.b-header .nav-main').scrollToElement();
		$('#js-form').libriform({
			singleError: false
		});

		$('#js-form .btn').click(function(event) {
			setTimeout(function(){
				document.getElementById('js-form').classList.remove('error');
			}, 500);
		});
	});
})(jQuery);
;(function($){
    $(document).ready(function () {
		//initialize swiper when document ready  
		var mySwiper = new Swiper ('.b-gallery .list', {
			pagination: '.swiper-nav',
			bulletClass: 'swiper-bullet',
			bulletActiveClass: 'active',
			slidesPerView: 4,
			paginationClickable: true,
			spaceBetween: 30
		})

        $('#js-btn-home').on('click', function() {

            var offset = window.innerHeight || document.documentElement.clientHeight,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop,
                scrollTime = Math.abs(offset - scrollTop) / 1.73;

            $("body,html").stop().animate({"scrollTop":offset},scrollTime);
        });

        // for animations
        $.veg3230.init();

        $('.js-about').veg3230(
        	function(){ 
        		$(this).addClass('on'); 
        	}, 
        	function(){},
        	false);

        $('.b-works dl dd:first li').veg3230(
        	function(){ 
        		$(this).addClass('on'); 
        	}, 
        	function(){},
        	true);

        $('.b-gallery').veg3230(
        	function(){ 
        		var $slides = $(this).find('.swiper-slide');
        		$slides.each(function(i){
        			var $slide = $(this);
        			setTimeout(function(){
    					$slide.addClass('on');
        			}, 300*i);
        		}); 
        	},
        	function(){},
        	false);


        var $bReviews = $('.b-reviews');
        var $listReviews = $bReviews.find('li');
        var lastReview = 0;
        var scrollSetings = {

        };

        var nextReviews = function(){            
        	var $nextTwoReviews;

            $bReviews.removeClass('rw-hide');
        	$bReviews.find('.rw-show').removeClass('rw-show').addClass('rw-hide');

        	if($listReviews.length > lastReview+1){
        		$nextTwoReviews = $listReviews.slice(lastReview, lastReview+2);
        		lastReview += 2;
	    		
        	}else if($listReviews.length == lastReview+1){
        			$nextTwoReviews = $listReviews.eq(0).add($listReviews.eq($listReviews.length-1));
        			lastReview = 1;
        		}else{
        			$nextTwoReviews = $listReviews.slice(0, 2);
        			lastReview = 2;
        		}
            
           if($nextTwoReviews.eq(0).index() == 0 && $nextTwoReviews.eq(1).index() != 1){
                $nextTwoReviews.eq(0).addClass('rw-right');
                $nextTwoReviews.eq(1).addClass('rw-left');
                console.log('true');
            } else {
                $nextTwoReviews.eq(0).addClass('rw-left');
                $nextTwoReviews.eq(1).addClass('rw-right');
                console.log('false');
            }

            $nextTwoReviews.addClass('rw-show');

            setTimeout(function(){
                $bReviews.find('.rw-hide').removeClass('rw-left').removeClass('rw-right').removeClass('rw-hide');
                console.log($listReviews.find('.rw-hide'));
    		},400)
        };

        $bReviews.find('.btn-more').on('click', function(){
        	nextReviews();
        });

        $('.b-reviews').veg3230(
        	function(){ 
        		if(!$(this).hasClass('on')){
                    nextReviews(); 
                    console.log('gh');
                    $(this).addClass('on')
                }
        	},
        	function(){},
        	false);
        
    });
			
	// image gallery
	$('.b-gallery img').glisse({
		changeSpeed: 550, 
		speed: 500,
		effect:'bounce',
		//fullscreen: true
	});

	// for change header
	var $header = $('.b-header'),
		$bHome = $('.b-home');
		headerOffsetTop = $bHome.height() ;

	var checkScroll = function(){
		if($(this).scrollTop() == 0){
			if(!$header.hasClass("small")){
				$header.addClass("small");
			}
		}else{
			$header.removeClass("small");
		}

		if($(this).scrollTop() > headerOffsetTop){
			if(!$header.hasClass("pos-f")){
				$header.addClass("pos-f");
				$bHome.addClass("mb");
			}
		}else{
			if($header.hasClass("pos-f")){
				$header.removeClass("pos-f");
				$bHome.removeClass("mb");
			}
		}
	};

    $( window ).scroll(function() {
    	checkScroll();
	});

	$( document ).ready(function() {
		checkScroll();
	});
})(jQuery);
// для обязательных полей добавить присвоить required
// блоку который высвечивается после отправки присвоить класс send-block
// для включении проверки формы data-type = email
// для включении проверки номера data-type = phone

(function($){

    jQuery.fn.libriform = function(options){

    // BEGIN plagin options
        options = $.extend({
            parentClass: true,
            singleError: true,
            blockError: true,
            nextBlock: '.send-block'
        }, options);
    // END plagin options

            var form = $(this),

                inputs = form.find('input.required'),
                inputsVal = [],

                regexMail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,

                regexPhone = /\b[+]?[-0-9\(\) ]{7,20}\b/;

                error = false;

            inputs.each(function(index) {
                inputsVal.push($(this).val());
            });

            var parentClass = options.parentClass,
                blockError = options.blockError,
                singleError = options.singleError,
                nextBlock = form.next(options.nextBlock);

            function errorActive(inputError) {
                inputError.addClass('error');

                if (parentClass) {
                    inputError.parent().addClass('error');
                }

                if (blockError) {
                    form.addClass('error');
                }

                error = true; // определяем индекс ошибки  
            }

        form.submit(function(){

            form.find('.error').removeClass('error');

            if (parentClass) {
                form.find('.error').parent().removeClass('error');
            }

            if (blockError) {
                form.removeClass('error');
            }

            error = false;

            inputs.each(function(index) {

                var $this = $(this);
                var thisFirstVal = inputsVal[index];

                if ( !singleError || (!error && singleError) ) {

                    if ($this.val() == thisFirstVal) {
                        errorActive($this);
                    }

                    if ($this.attr('data-type') == 'email') {

                        if ($this.val() == thisFirstVal || !regexMail.test($this.val())) {
                            errorActive($this);
                        }

                    }

                    if ($this.attr('data-type') == 'phone') {

                        if ($this.val() == thisFirstVal || !regexPhone.test($this.val())) {
                            errorActive($(this));
                        }

                    }
                }

            });

            if(!error){ // если ошибок нет то отправляем данные
                var str = form.serialize();

                error = true;

                $.ajax({
                    type: "POST",
                    url: "./report.php",
                    data: str,
                    // Выводим то что вернул PHP
                    success: function(html) {
                    //предварительно очищаем нужный элемент страницы
                        form.fadeOut(100, function(){
                            form.next(nextBlock).addClass('active').fadeIn(100, function(){
                                form.trigger("reset");
                            });
                        });
                    }
                });
            }
            return false;
        });
// END проверка формы

        nextBlock.find('button').click(function(){

            nextBlock.removeClass('active').fadeOut(100, function(){
                form.fadeIn(100);
            });

            error = false;
        });

    }

})(jQuery);
(function($) {

	$.fn.scrollToElement = function(options){

		// options of plugin
	    options = $.extend({
			menuChild: $("li"), // child of nav
			toScrollBlock: $(".js-toScrollBlock"), // class for blocks
			topBlock: $(".b-header") // the name of the menu (fixed)
	    }, options);
		// END options of plugin

		// creating variables
		var $window = $(window),

			block = this,

			li = block.find('li'),
			menuChild = options.menuChild,
			toScrollBlock = options.toScrollBlock,
			topBlock = options.topBlock,

			flagTop = true,
			activeListItem,
			item = [],
			nextItem = [];
		// END creating variables

		// creating functions
		function arrayFill() { // assign positions

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
					thisPosition = $this.offset().top  - topBlock.innerHeight();

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

		function activeLi() { // the function adds a class to the active menu item and remove it from other

			var scrollTop = $window.scrollTop(); // Calculate only 1 time

			li.each(function (val) {

				var $this = $(this);

				if (item[val] <= scrollTop && nextItem[val] >= scrollTop) {

					if ($this.data('change')) {
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
				}; 
			}
		}
		// END creating functions

		block.find(menuChild).click(function(){ // event when clicking on a menu item (scroll)
			
			var val = $(this).index(),
			// Need to scroll to section
				curPos = $(document).scrollTop(),
				height = item[val],
				scrollTime = Math.abs(height-curPos)/1.73;

				if ( height == 9999999 ) {
					return false;
				} else {
					$("body,html").stop().animate({"scrollTop":height},scrollTime);
				}

			return false;
		});

		// initialization of functions
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
		// END initialization of functions

	};

}) (jQuery);
function tabDl(element) {

	var $this = element;
		$dt = $this.querySelectorAll('dt');
		$dd = $this.querySelectorAll('dd');
		
	$dt[0].classList.add('active');
	$dt[0].nextElementSibling.classList.add('active');

	for (var z = 0; z < $dt.length; z++) {

		$dt[z].addEventListener('click', function(event) {

			for (var z = 0; z < $dt.length; z++) {
				$dt[z].classList.remove('active');
			}

			for (var z = 0; z < $dd.length; z++) {
				$dd[z].classList.remove('active');
			}

			this.classList.add('active');
			this.nextElementSibling.classList.add('active');
		}, false);
	};
}

tabDl(document.getElementById('js-tab-dl'));
/*!
 * jScrollPane - v2.0.22 - 2015-04-25
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2014 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.fn.jScrollPane=function(b){function c(b,c){function d(c){var f,h,j,k,l,o,p=!1,q=!1;if(N=c,void 0===O)l=b.scrollTop(),o=b.scrollLeft(),b.css({overflow:"hidden",padding:0}),P=b.innerWidth()+ra,Q=b.innerHeight(),b.width(P),O=a('<div class="jspPane" />').css("padding",qa).append(b.children()),R=a('<div class="jspContainer" />').css({width:P+"px",height:Q+"px"}).append(O).appendTo(b);else{if(b.css("width",""),p=N.stickToBottom&&A(),q=N.stickToRight&&B(),k=b.innerWidth()+ra!=P||b.outerHeight()!=Q,k&&(P=b.innerWidth()+ra,Q=b.innerHeight(),R.css({width:P+"px",height:Q+"px"})),!k&&sa==S&&O.outerHeight()==T)return void b.width(P);sa=S,O.css("width",""),b.width(P),R.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}O.css("overflow","auto"),S=c.contentWidth?c.contentWidth:O[0].scrollWidth,T=O[0].scrollHeight,O.css("overflow",""),U=S/P,V=T/Q,W=V>1,X=U>1,X||W?(b.addClass("jspScrollable"),f=N.maintainPosition&&($||ba),f&&(h=y(),j=z()),e(),g(),i(),f&&(w(q?S-P:h,!1),v(p?T-Q:j,!1)),F(),C(),L(),N.enableKeyboardNavigation&&H(),N.clickOnTrack&&m(),J(),N.hijackInternalLinks&&K()):(b.removeClass("jspScrollable"),O.css({top:0,left:0,width:R.width()-ra}),D(),G(),I(),n()),N.autoReinitialise&&!pa?pa=setInterval(function(){d(N)},N.autoReinitialiseDelay):!N.autoReinitialise&&pa&&clearInterval(pa),l&&b.scrollTop(0)&&v(l,!1),o&&b.scrollLeft(0)&&w(o,!1),b.trigger("jsp-initialised",[X||W])}function e(){W&&(R.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'),a('<div class="jspDragBottom" />'))),a('<div class="jspCap jspCapBottom" />'))),ca=R.find(">.jspVerticalBar"),da=ca.find(">.jspTrack"),Y=da.find(">.jspDrag"),N.showArrows&&(ha=a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",k(0,-1)).bind("click.jsp",E),ia=a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",k(0,1)).bind("click.jsp",E),N.arrowScrollOnHover&&(ha.bind("mouseover.jsp",k(0,-1,ha)),ia.bind("mouseover.jsp",k(0,1,ia))),j(da,N.verticalArrowPositions,ha,ia)),fa=Q,R.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){fa-=a(this).outerHeight()}),Y.hover(function(){Y.addClass("jspHover")},function(){Y.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",E),Y.addClass("jspActive");var c=b.pageY-Y.position().top;return a("html").bind("mousemove.jsp",function(a){p(a.pageY-c,!1)}).bind("mouseup.jsp mouseleave.jsp",o),!1}),f())}function f(){da.height(fa+"px"),$=0,ea=N.verticalGutter+da.outerWidth(),O.width(P-ea-ra);try{0===ca.position().left&&O.css("margin-left",ea+"px")}catch(a){}}function g(){X&&(R.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'),a('<div class="jspDragRight" />'))),a('<div class="jspCap jspCapRight" />'))),ja=R.find(">.jspHorizontalBar"),ka=ja.find(">.jspTrack"),_=ka.find(">.jspDrag"),N.showArrows&&(na=a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",k(-1,0)).bind("click.jsp",E),oa=a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",k(1,0)).bind("click.jsp",E),N.arrowScrollOnHover&&(na.bind("mouseover.jsp",k(-1,0,na)),oa.bind("mouseover.jsp",k(1,0,oa))),j(ka,N.horizontalArrowPositions,na,oa)),_.hover(function(){_.addClass("jspHover")},function(){_.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",E),_.addClass("jspActive");var c=b.pageX-_.position().left;return a("html").bind("mousemove.jsp",function(a){r(a.pageX-c,!1)}).bind("mouseup.jsp mouseleave.jsp",o),!1}),la=R.innerWidth(),h())}function h(){R.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){la-=a(this).outerWidth()}),ka.width(la+"px"),ba=0}function i(){if(X&&W){var b=ka.outerHeight(),c=da.outerWidth();fa-=b,a(ja).find(">.jspCap:visible,>.jspArrow").each(function(){la+=a(this).outerWidth()}),la-=c,Q-=c,P-=b,ka.parent().append(a('<div class="jspCorner" />').css("width",b+"px")),f(),h()}X&&O.width(R.outerWidth()-ra+"px"),T=O.outerHeight(),V=T/Q,X&&(ma=Math.ceil(1/U*la),ma>N.horizontalDragMaxWidth?ma=N.horizontalDragMaxWidth:ma<N.horizontalDragMinWidth&&(ma=N.horizontalDragMinWidth),_.width(ma+"px"),aa=la-ma,s(ba)),W&&(ga=Math.ceil(1/V*fa),ga>N.verticalDragMaxHeight?ga=N.verticalDragMaxHeight:ga<N.verticalDragMinHeight&&(ga=N.verticalDragMinHeight),Y.height(ga+"px"),Z=fa-ga,q($))}function j(a,b,c,d){var e,f="before",g="after";"os"==b&&(b=/Mac/.test(navigator.platform)?"after":"split"),b==f?g=b:b==g&&(f=b,e=c,c=d,d=e),a[f](c)[g](d)}function k(a,b,c){return function(){return l(a,b,this,c),this.blur(),!1}}function l(b,c,d,e){d=a(d).addClass("jspActive");var f,g,h=!0,i=function(){0!==b&&ta.scrollByX(b*N.arrowButtonSpeed),0!==c&&ta.scrollByY(c*N.arrowButtonSpeed),g=setTimeout(i,h?N.initialDelay:N.arrowRepeatFreq),h=!1};i(),f=e?"mouseout.jsp":"mouseup.jsp",e=e||a("html"),e.bind(f,function(){d.removeClass("jspActive"),g&&clearTimeout(g),g=null,e.unbind(f)})}function m(){n(),W&&da.bind("mousedown.jsp",function(b){if(void 0===b.originalTarget||b.originalTarget==b.currentTarget){var c,d=a(this),e=d.offset(),f=b.pageY-e.top-$,g=!0,h=function(){var a=d.offset(),e=b.pageY-a.top-ga/2,j=Q*N.scrollPagePercent,k=Z*j/(T-Q);if(0>f)$-k>e?ta.scrollByY(-j):p(e);else{if(!(f>0))return void i();e>$+k?ta.scrollByY(j):p(e)}c=setTimeout(h,g?N.initialDelay:N.trackClickRepeatFreq),g=!1},i=function(){c&&clearTimeout(c),c=null,a(document).unbind("mouseup.jsp",i)};return h(),a(document).bind("mouseup.jsp",i),!1}}),X&&ka.bind("mousedown.jsp",function(b){if(void 0===b.originalTarget||b.originalTarget==b.currentTarget){var c,d=a(this),e=d.offset(),f=b.pageX-e.left-ba,g=!0,h=function(){var a=d.offset(),e=b.pageX-a.left-ma/2,j=P*N.scrollPagePercent,k=aa*j/(S-P);if(0>f)ba-k>e?ta.scrollByX(-j):r(e);else{if(!(f>0))return void i();e>ba+k?ta.scrollByX(j):r(e)}c=setTimeout(h,g?N.initialDelay:N.trackClickRepeatFreq),g=!1},i=function(){c&&clearTimeout(c),c=null,a(document).unbind("mouseup.jsp",i)};return h(),a(document).bind("mouseup.jsp",i),!1}})}function n(){ka&&ka.unbind("mousedown.jsp"),da&&da.unbind("mousedown.jsp")}function o(){a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"),Y&&Y.removeClass("jspActive"),_&&_.removeClass("jspActive")}function p(a,b){W&&(0>a?a=0:a>Z&&(a=Z),void 0===b&&(b=N.animateScroll),b?ta.animate(Y,"top",a,q):(Y.css("top",a),q(a)))}function q(a){void 0===a&&(a=Y.position().top),R.scrollTop(0),$=a||0;var c=0===$,d=$==Z,e=a/Z,f=-e*(T-Q);(ua!=c||wa!=d)&&(ua=c,wa=d,b.trigger("jsp-arrow-change",[ua,wa,va,xa])),t(c,d),O.css("top",f),b.trigger("jsp-scroll-y",[-f,c,d]).trigger("scroll")}function r(a,b){X&&(0>a?a=0:a>aa&&(a=aa),void 0===b&&(b=N.animateScroll),b?ta.animate(_,"left",a,s):(_.css("left",a),s(a)))}function s(a){void 0===a&&(a=_.position().left),R.scrollTop(0),ba=a||0;var c=0===ba,d=ba==aa,e=a/aa,f=-e*(S-P);(va!=c||xa!=d)&&(va=c,xa=d,b.trigger("jsp-arrow-change",[ua,wa,va,xa])),u(c,d),O.css("left",f),b.trigger("jsp-scroll-x",[-f,c,d]).trigger("scroll")}function t(a,b){N.showArrows&&(ha[a?"addClass":"removeClass"]("jspDisabled"),ia[b?"addClass":"removeClass"]("jspDisabled"))}function u(a,b){N.showArrows&&(na[a?"addClass":"removeClass"]("jspDisabled"),oa[b?"addClass":"removeClass"]("jspDisabled"))}function v(a,b){var c=a/(T-Q);p(c*Z,b)}function w(a,b){var c=a/(S-P);r(c*aa,b)}function x(b,c,d){var e,f,g,h,i,j,k,l,m,n=0,o=0;try{e=a(b)}catch(p){return}for(f=e.outerHeight(),g=e.outerWidth(),R.scrollTop(0),R.scrollLeft(0);!e.is(".jspPane");)if(n+=e.position().top,o+=e.position().left,e=e.offsetParent(),/^body|html$/i.test(e[0].nodeName))return;h=z(),j=h+Q,h>n||c?l=n-N.horizontalGutter:n+f>j&&(l=n-Q+f+N.horizontalGutter),isNaN(l)||v(l,d),i=y(),k=i+P,i>o||c?m=o-N.horizontalGutter:o+g>k&&(m=o-P+g+N.horizontalGutter),isNaN(m)||w(m,d)}function y(){return-O.position().left}function z(){return-O.position().top}function A(){var a=T-Q;return a>20&&a-z()<10}function B(){var a=S-P;return a>20&&a-y()<10}function C(){R.unbind(za).bind(za,function(a,b,c,d){ba||(ba=0),$||($=0);var e=ba,f=$,g=a.deltaFactor||N.mouseWheelSpeed;return ta.scrollBy(c*g,-d*g,!1),e==ba&&f==$})}function D(){R.unbind(za)}function E(){return!1}function F(){O.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(a){x(a.target,!1)})}function G(){O.find(":input,a").unbind("focus.jsp")}function H(){function c(){var a=ba,b=$;switch(d){case 40:ta.scrollByY(N.keyboardSpeed,!1);break;case 38:ta.scrollByY(-N.keyboardSpeed,!1);break;case 34:case 32:ta.scrollByY(Q*N.scrollPagePercent,!1);break;case 33:ta.scrollByY(-Q*N.scrollPagePercent,!1);break;case 39:ta.scrollByX(N.keyboardSpeed,!1);break;case 37:ta.scrollByX(-N.keyboardSpeed,!1)}return e=a!=ba||b!=$}var d,e,f=[];X&&f.push(ja[0]),W&&f.push(ca[0]),O.bind("focus.jsp",function(){b.focus()}),b.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(b){if(b.target===this||f.length&&a(b.target).closest(f).length){var g=ba,h=$;switch(b.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:d=b.keyCode,c();break;case 35:v(T-Q),d=null;break;case 36:v(0),d=null}return e=b.keyCode==d&&g!=ba||h!=$,!e}}).bind("keypress.jsp",function(a){return a.keyCode==d&&c(),!e}),N.hideFocus?(b.css("outline","none"),"hideFocus"in R[0]&&b.attr("hideFocus",!0)):(b.css("outline",""),"hideFocus"in R[0]&&b.attr("hideFocus",!1))}function I(){b.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"),O.unbind(".jsp")}function J(){if(location.hash&&location.hash.length>1){var b,c,d=escape(location.hash.substr(1));try{b=a("#"+d+', a[name="'+d+'"]')}catch(e){return}b.length&&O.find(d)&&(0===R.scrollTop()?c=setInterval(function(){R.scrollTop()>0&&(x(b,!0),a(document).scrollTop(R.position().top),clearInterval(c))},50):(x(b,!0),a(document).scrollTop(R.position().top)))}}function K(){a(document.body).data("jspHijack")||(a(document.body).data("jspHijack",!0),a(document.body).delegate("a[href*=#]","click",function(b){var c,d,e,f,g,h,i=this.href.substr(0,this.href.indexOf("#")),j=location.href;if(-1!==location.href.indexOf("#")&&(j=location.href.substr(0,location.href.indexOf("#"))),i===j){c=escape(this.href.substr(this.href.indexOf("#")+1));try{d=a("#"+c+', a[name="'+c+'"]')}catch(k){return}d.length&&(e=d.closest(".jspScrollable"),f=e.data("jsp"),f.scrollToElement(d,!0),e[0].scrollIntoView&&(g=a(window).scrollTop(),h=d.offset().top,(g>h||h>g+a(window).height())&&e[0].scrollIntoView()),b.preventDefault())}}))}function L(){var a,b,c,d,e,f=!1;R.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(g){var h=g.originalEvent.touches[0];a=y(),b=z(),c=h.pageX,d=h.pageY,e=!1,f=!0}).bind("touchmove.jsp",function(g){if(f){var h=g.originalEvent.touches[0],i=ba,j=$;return ta.scrollTo(a+c-h.pageX,b+d-h.pageY),e=e||Math.abs(c-h.pageX)>5||Math.abs(d-h.pageY)>5,i==ba&&j==$}}).bind("touchend.jsp",function(a){f=!1}).bind("click.jsp-touchclick",function(a){return e?(e=!1,!1):void 0})}function M(){var a=z(),c=y();b.removeClass("jspScrollable").unbind(".jsp"),O.unbind(".jsp"),b.replaceWith(ya.append(O.children())),ya.scrollTop(a),ya.scrollLeft(c),pa&&clearInterval(pa)}var N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta=this,ua=!0,va=!0,wa=!1,xa=!1,ya=b.clone(!1,!1).empty(),za=a.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";"border-box"===b.css("box-sizing")?(qa=0,ra=0):(qa=b.css("paddingTop")+" "+b.css("paddingRight")+" "+b.css("paddingBottom")+" "+b.css("paddingLeft"),ra=(parseInt(b.css("paddingLeft"),10)||0)+(parseInt(b.css("paddingRight"),10)||0)),a.extend(ta,{reinitialise:function(b){b=a.extend({},N,b),d(b)},scrollToElement:function(a,b,c){x(a,b,c)},scrollTo:function(a,b,c){w(a,c),v(b,c)},scrollToX:function(a,b){w(a,b)},scrollToY:function(a,b){v(a,b)},scrollToPercentX:function(a,b){w(a*(S-P),b)},scrollToPercentY:function(a,b){v(a*(T-Q),b)},scrollBy:function(a,b,c){ta.scrollByX(a,c),ta.scrollByY(b,c)},scrollByX:function(a,b){var c=y()+Math[0>a?"floor":"ceil"](a),d=c/(S-P);r(d*aa,b)},scrollByY:function(a,b){var c=z()+Math[0>a?"floor":"ceil"](a),d=c/(T-Q);p(d*Z,b)},positionDragX:function(a,b){r(a,b)},positionDragY:function(a,b){p(a,b)},animate:function(a,b,c,d){var e={};e[b]=c,a.animate(e,{duration:N.animateDuration,easing:N.animateEase,queue:!1,step:d})},getContentPositionX:function(){return y()},getContentPositionY:function(){return z()},getContentWidth:function(){return S},getContentHeight:function(){return T},getPercentScrolledX:function(){return y()/(S-P)},getPercentScrolledY:function(){return z()/(T-Q)},getIsScrollableH:function(){return X},getIsScrollableV:function(){return W},getContentPane:function(){return O},scrollToBottom:function(a){p(Z,a)},hijackInternalLinks:a.noop,destroy:function(){M()}}),d(c)}return b=a.extend({},a.fn.jScrollPane.defaults,b),a.each(["arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){b[this]=b[this]||b.speed}),this.each(function(){var d=a(this),e=d.data("jsp");e?e.reinitialise(b):(a("script",d).filter('[type="text/javascript"],:not([type])').remove(),e=new c(d,b),d.data("jsp",e))})},a.fn.jScrollPane.defaults={showArrows:!1,maintainPosition:!0,stickToBottom:!1,stickToRight:!1,clickOnTrack:!0,autoReinitialise:!1,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:void 0,animateScroll:!1,animateDuration:300,animateEase:"linear",hijackInternalLinks:!1,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:3,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:!1,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:!0,hideFocus:!1,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8}});
/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

/**
 * Swiper 3.0.8
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: June 14, 2015
 */
!function(){"use strict";function e(e){e.fn.swiper=function(t){var s;return e(this).each(function(){var e=new a(this,t);s||(s=e)}),s}}var a=function(e,t){function s(){return"horizontal"===h.params.direction}function r(){h.autoplayTimeoutId=setTimeout(function(){h.params.loop?(h.fixLoop(),h._slideNext()):h.isEnd?t.autoplayStopOnLast?h.stopAutoplay():h._slideTo(0):h._slideNext()},h.params.autoplay)}function i(e,a){var t=v(e.target);if(!t.is(a))if("string"==typeof a)t=t.parents(a);else if(a.nodeType){var s;return t.parents().each(function(e,t){t===a&&(s=a)}),s?a:void 0}return 0===t.length?void 0:t[0]}function n(e,a){a=a||{};var t=window.MutationObserver||window.WebkitMutationObserver,s=new t(function(e){e.forEach(function(e){h.onResize(!0),h.emit("onObserverUpdate",h,e)})});s.observe(e,{attributes:"undefined"==typeof a.attributes?!0:a.attributes,childList:"undefined"==typeof a.childList?!0:a.childList,characterData:"undefined"==typeof a.characterData?!0:a.characterData}),h.observers.push(s)}function o(e){e.originalEvent&&(e=e.originalEvent);var a=e.keyCode||e.charCode;if(!h.params.allowSwipeToNext&&(s()&&39===a||!s()&&40===a))return!1;if(!h.params.allowSwipeToPrev&&(s()&&37===a||!s()&&38===a))return!1;if(!(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||document.activeElement&&document.activeElement.nodeName&&("input"===document.activeElement.nodeName.toLowerCase()||"textarea"===document.activeElement.nodeName.toLowerCase()))){if(37===a||39===a||38===a||40===a){var t=!1;if(h.container.parents(".swiper-slide").length>0&&0===h.container.parents(".swiper-slide-active").length)return;var r={left:window.pageXOffset,top:window.pageYOffset},i=window.innerWidth,n=window.innerHeight,o=h.container.offset();h.rtl&&(o.left=o.left-h.container[0].scrollLeft);for(var l=[[o.left,o.top],[o.left+h.width,o.top],[o.left,o.top+h.height],[o.left+h.width,o.top+h.height]],d=0;d<l.length;d++){var p=l[d];p[0]>=r.left&&p[0]<=r.left+i&&p[1]>=r.top&&p[1]<=r.top+n&&(t=!0)}if(!t)return}s()?((37===a||39===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),(39===a&&!h.rtl||37===a&&h.rtl)&&h.slideNext(),(37===a&&!h.rtl||39===a&&h.rtl)&&h.slidePrev()):((38===a||40===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),40===a&&h.slideNext(),38===a&&h.slidePrev())}}function l(e){e.originalEvent&&(e=e.originalEvent);var a=h.mousewheel.event,t=0;if(e.detail)t=-e.detail;else if("mousewheel"===a)if(h.params.mousewheelForceToAxis)if(s()){if(!(Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)))return;t=e.wheelDeltaX}else{if(!(Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX)))return;t=e.wheelDeltaY}else t=e.wheelDelta;else if("DOMMouseScroll"===a)t=-e.detail;else if("wheel"===a)if(h.params.mousewheelForceToAxis)if(s()){if(!(Math.abs(e.deltaX)>Math.abs(e.deltaY)))return;t=-e.deltaX}else{if(!(Math.abs(e.deltaY)>Math.abs(e.deltaX)))return;t=-e.deltaY}else t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?-e.deltaX:-e.deltaY;if(h.params.mousewheelInvert&&(t=-t),h.params.freeMode){var r=h.getWrapperTranslate()+t;if(r>0&&(r=0),r<h.maxTranslate()&&(r=h.maxTranslate()),h.setWrapperTransition(0),h.setWrapperTranslate(r),h.updateProgress(),h.updateActiveIndex(),h.params.freeModeSticky&&(clearTimeout(h.mousewheel.timeout),h.mousewheel.timeout=setTimeout(function(){h.slideReset()},300)),0===r||r===h.maxTranslate())return}else{if((new window.Date).getTime()-h.mousewheel.lastScrollTime>60)if(0>t)if(h.isEnd){if(h.params.mousewheelReleaseOnEdges)return!0}else h.slideNext();else if(h.isBeginning){if(h.params.mousewheelReleaseOnEdges)return!0}else h.slidePrev();h.mousewheel.lastScrollTime=(new window.Date).getTime()}return h.params.autoplay&&h.stopAutoplay(),e.preventDefault?e.preventDefault():e.returnValue=!1,!1}function d(e,a){e=v(e);var t,r,i;t=e.attr("data-swiper-parallax")||"0",r=e.attr("data-swiper-parallax-x"),i=e.attr("data-swiper-parallax-y"),r||i?(r=r||"0",i=i||"0"):s()?(r=t,i="0"):(i=t,r="0"),r=r.indexOf("%")>=0?parseInt(r,10)*a+"%":r*a+"px",i=i.indexOf("%")>=0?parseInt(i,10)*a+"%":i*a+"px",e.transform("translate3d("+r+", "+i+",0px)")}function p(e){return 0!==e.indexOf("on")&&(e=e[0]!==e[0].toUpperCase()?"on"+e[0].toUpperCase()+e.substring(1):"on"+e),e}if(!(this instanceof a))return new a(e,t);var u={direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,autoplay:!1,autoplayDisableOnInteraction:!0,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeSticky:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},cube:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94},fade:{crossFade:!1},parallax:!1,scrollbar:null,scrollbarHide:!0,keyboardControl:!1,mousewheelControl:!1,mousewheelReleaseOnEdges:!1,mousewheelInvert:!1,mousewheelForceToAxis:!1,hashnav:!1,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,onlyExternal:!1,threshold:0,touchMoveStopPropagation:!0,pagination:null,paginationClickable:!1,paginationHide:!1,paginationBulletRender:null,resistance:!0,resistanceRatio:.85,nextButton:null,prevButton:null,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,lazyLoading:!1,lazyLoadingInPrevNext:!1,lazyLoadingOnTransitionStart:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,control:void 0,controlInverse:!1,allowSwipeToPrev:!0,allowSwipeToNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",buttonDisabledClass:"swiper-button-disabled",paginationHiddenClass:"swiper-pagination-hidden",observer:!1,observeParents:!1,a11y:!1,prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",runCallbacksOnInit:!0},c=t&&t.virtualTranslate;t=t||{};for(var m in u)if("undefined"==typeof t[m])t[m]=u[m];else if("object"==typeof t[m])for(var f in u[m])"undefined"==typeof t[m][f]&&(t[m][f]=u[m][f]);var h=this;h.version="3.0.8",h.params=t,h.classNames=[];var v;if(v="undefined"==typeof Dom7?window.Dom7||window.Zepto||window.jQuery:Dom7,v&&(h.$=v,h.container=v(e),0!==h.container.length)){if(h.container.length>1)return void h.container.each(function(){new a(this,t)});h.container[0].swiper=h,h.container.data("swiper",h),h.classNames.push("swiper-container-"+h.params.direction),h.params.freeMode&&h.classNames.push("swiper-container-free-mode"),h.support.flexbox||(h.classNames.push("swiper-container-no-flexbox"),h.params.slidesPerColumn=1),(h.params.parallax||h.params.watchSlidesVisibility)&&(h.params.watchSlidesProgress=!0),["cube","coverflow"].indexOf(h.params.effect)>=0&&(h.support.transforms3d?(h.params.watchSlidesProgress=!0,h.classNames.push("swiper-container-3d")):h.params.effect="slide"),"slide"!==h.params.effect&&h.classNames.push("swiper-container-"+h.params.effect),"cube"===h.params.effect&&(h.params.resistanceRatio=0,h.params.slidesPerView=1,h.params.slidesPerColumn=1,h.params.slidesPerGroup=1,h.params.centeredSlides=!1,h.params.spaceBetween=0,h.params.virtualTranslate=!0,h.params.setWrapperSize=!1),"fade"===h.params.effect&&(h.params.slidesPerView=1,h.params.slidesPerColumn=1,h.params.slidesPerGroup=1,h.params.watchSlidesProgress=!0,h.params.spaceBetween=0,"undefined"==typeof c&&(h.params.virtualTranslate=!0)),h.params.grabCursor&&h.support.touch&&(h.params.grabCursor=!1),h.wrapper=h.container.children("."+h.params.wrapperClass),h.params.pagination&&(h.paginationContainer=v(h.params.pagination),h.params.paginationClickable&&h.paginationContainer.addClass("swiper-pagination-clickable")),h.rtl=s()&&("rtl"===h.container[0].dir.toLowerCase()||"rtl"===h.container.css("direction")),h.rtl&&h.classNames.push("swiper-container-rtl"),h.rtl&&(h.wrongRTL="-webkit-box"===h.wrapper.css("display")),h.params.slidesPerColumn>1&&h.classNames.push("swiper-container-multirow"),h.device.android&&h.classNames.push("swiper-container-android"),h.container.addClass(h.classNames.join(" ")),h.translate=0,h.progress=0,h.velocity=0,h.lockSwipeToNext=function(){h.params.allowSwipeToNext=!1},h.lockSwipeToPrev=function(){h.params.allowSwipeToPrev=!1},h.lockSwipes=function(){h.params.allowSwipeToNext=h.params.allowSwipeToPrev=!1},h.unlockSwipeToNext=function(){h.params.allowSwipeToNext=!0},h.unlockSwipeToPrev=function(){h.params.allowSwipeToPrev=!0},h.unlockSwipes=function(){h.params.allowSwipeToNext=h.params.allowSwipeToPrev=!0},h.params.grabCursor&&(h.container[0].style.cursor="move",h.container[0].style.cursor="-webkit-grab",h.container[0].style.cursor="-moz-grab",h.container[0].style.cursor="grab"),h.imagesToLoad=[],h.imagesLoaded=0,h.loadImage=function(e,a,t,s){function r(){s&&s()}var i;e.complete&&t?r():a?(i=new window.Image,i.onload=r,i.onerror=r,i.src=a):r()},h.preloadImages=function(){function e(){"undefined"!=typeof h&&null!==h&&(void 0!==h.imagesLoaded&&h.imagesLoaded++,h.imagesLoaded===h.imagesToLoad.length&&(h.params.updateOnImagesReady&&h.update(),h.emit("onImagesReady",h)))}h.imagesToLoad=h.container.find("img");for(var a=0;a<h.imagesToLoad.length;a++)h.loadImage(h.imagesToLoad[a],h.imagesToLoad[a].currentSrc||h.imagesToLoad[a].getAttribute("src"),!0,e)},h.autoplayTimeoutId=void 0,h.autoplaying=!1,h.autoplayPaused=!1,h.startAutoplay=function(){return"undefined"!=typeof h.autoplayTimeoutId?!1:h.params.autoplay?h.autoplaying?!1:(h.autoplaying=!0,h.emit("onAutoplayStart",h),void r()):!1},h.stopAutoplay=function(e){h.autoplayTimeoutId&&(h.autoplayTimeoutId&&clearTimeout(h.autoplayTimeoutId),h.autoplaying=!1,h.autoplayTimeoutId=void 0,h.emit("onAutoplayStop",h))},h.pauseAutoplay=function(e){h.autoplayPaused||(h.autoplayTimeoutId&&clearTimeout(h.autoplayTimeoutId),h.autoplayPaused=!0,0===e?(h.autoplayPaused=!1,r()):h.wrapper.transitionEnd(function(){h&&(h.autoplayPaused=!1,h.autoplaying?r():h.stopAutoplay())}))},h.minTranslate=function(){return-h.snapGrid[0]},h.maxTranslate=function(){return-h.snapGrid[h.snapGrid.length-1]},h.updateContainerSize=function(){var e,a;e="undefined"!=typeof h.params.width?h.params.width:h.container[0].clientWidth,a="undefined"!=typeof h.params.height?h.params.height:h.container[0].clientHeight,0===e&&s()||0===a&&!s()||(h.width=e,h.height=a,h.size=s()?h.width:h.height)},h.updateSlidesSize=function(){h.slides=h.wrapper.children("."+h.params.slideClass),h.snapGrid=[],h.slidesGrid=[],h.slidesSizesGrid=[];var e,a=h.params.spaceBetween,t=0,r=0,i=0;"string"==typeof a&&a.indexOf("%")>=0&&(a=parseFloat(a.replace("%",""))/100*h.size),h.virtualSize=-a,h.slides.css(h.rtl?{marginLeft:"",marginTop:""}:{marginRight:"",marginBottom:""});var n;h.params.slidesPerColumn>1&&(n=Math.floor(h.slides.length/h.params.slidesPerColumn)===h.slides.length/h.params.slidesPerColumn?h.slides.length:Math.ceil(h.slides.length/h.params.slidesPerColumn)*h.params.slidesPerColumn);var o,l=h.params.slidesPerColumn,d=n/l,p=d-(h.params.slidesPerColumn*d-h.slides.length);for(e=0;e<h.slides.length;e++){o=0;var u=h.slides.eq(e);if(h.params.slidesPerColumn>1){var c,m,f;"column"===h.params.slidesPerColumnFill?(m=Math.floor(e/l),f=e-m*l,(m>p||m===p&&f===l-1)&&++f>=l&&(f=0,m++),c=m+f*n/l,u.css({"-webkit-box-ordinal-group":c,"-moz-box-ordinal-group":c,"-ms-flex-order":c,"-webkit-order":c,order:c})):(f=Math.floor(e/d),m=e-f*d),u.css({"margin-top":0!==f&&h.params.spaceBetween&&h.params.spaceBetween+"px"}).attr("data-swiper-column",m).attr("data-swiper-row",f)}"none"!==u.css("display")&&("auto"===h.params.slidesPerView?o=s()?u.outerWidth(!0):u.outerHeight(!0):(o=(h.size-(h.params.slidesPerView-1)*a)/h.params.slidesPerView,s()?h.slides[e].style.width=o+"px":h.slides[e].style.height=o+"px"),h.slides[e].swiperSlideSize=o,h.slidesSizesGrid.push(o),h.params.centeredSlides?(t=t+o/2+r/2+a,0===e&&(t=t-h.size/2-a),Math.abs(t)<.001&&(t=0),i%h.params.slidesPerGroup===0&&h.snapGrid.push(t),h.slidesGrid.push(t)):(i%h.params.slidesPerGroup===0&&h.snapGrid.push(t),h.slidesGrid.push(t),t=t+o+a),h.virtualSize+=o+a,r=o,i++)}h.virtualSize=Math.max(h.virtualSize,h.size);var v;if(h.rtl&&h.wrongRTL&&("slide"===h.params.effect||"coverflow"===h.params.effect)&&h.wrapper.css({width:h.virtualSize+h.params.spaceBetween+"px"}),(!h.support.flexbox||h.params.setWrapperSize)&&h.wrapper.css(s()?{width:h.virtualSize+h.params.spaceBetween+"px"}:{height:h.virtualSize+h.params.spaceBetween+"px"}),h.params.slidesPerColumn>1&&(h.virtualSize=(o+h.params.spaceBetween)*n,h.virtualSize=Math.ceil(h.virtualSize/h.params.slidesPerColumn)-h.params.spaceBetween,h.wrapper.css({width:h.virtualSize+h.params.spaceBetween+"px"}),h.params.centeredSlides)){for(v=[],e=0;e<h.snapGrid.length;e++)h.snapGrid[e]<h.virtualSize+h.snapGrid[0]&&v.push(h.snapGrid[e]);h.snapGrid=v}if(!h.params.centeredSlides){for(v=[],e=0;e<h.snapGrid.length;e++)h.snapGrid[e]<=h.virtualSize-h.size&&v.push(h.snapGrid[e]);h.snapGrid=v,Math.floor(h.virtualSize-h.size)>Math.floor(h.snapGrid[h.snapGrid.length-1])&&h.snapGrid.push(h.virtualSize-h.size)}0===h.snapGrid.length&&(h.snapGrid=[0]),0!==h.params.spaceBetween&&h.slides.css(s()?h.rtl?{marginLeft:a+"px"}:{marginRight:a+"px"}:{marginBottom:a+"px"}),h.params.watchSlidesProgress&&h.updateSlidesOffset()},h.updateSlidesOffset=function(){for(var e=0;e<h.slides.length;e++)h.slides[e].swiperSlideOffset=s()?h.slides[e].offsetLeft:h.slides[e].offsetTop},h.updateSlidesProgress=function(e){if("undefined"==typeof e&&(e=h.translate||0),0!==h.slides.length){"undefined"==typeof h.slides[0].swiperSlideOffset&&h.updateSlidesOffset();var a=h.params.centeredSlides?-e+h.size/2:-e;h.rtl&&(a=h.params.centeredSlides?e-h.size/2:e);{h.container[0].getBoundingClientRect(),s()?"left":"top",s()?"right":"bottom"}h.slides.removeClass(h.params.slideVisibleClass);for(var t=0;t<h.slides.length;t++){var r=h.slides[t],i=h.params.centeredSlides===!0?r.swiperSlideSize/2:0,n=(a-r.swiperSlideOffset-i)/(r.swiperSlideSize+h.params.spaceBetween);if(h.params.watchSlidesVisibility){var o=-(a-r.swiperSlideOffset-i),l=o+h.slidesSizesGrid[t],d=o>=0&&o<h.size||l>0&&l<=h.size||0>=o&&l>=h.size;d&&h.slides.eq(t).addClass(h.params.slideVisibleClass)}r.progress=h.rtl?-n:n}}},h.updateProgress=function(e){"undefined"==typeof e&&(e=h.translate||0);var a=h.maxTranslate()-h.minTranslate();0===a?(h.progress=0,h.isBeginning=h.isEnd=!0):(h.progress=(e-h.minTranslate())/a,h.isBeginning=h.progress<=0,h.isEnd=h.progress>=1),h.isBeginning&&h.emit("onReachBeginning",h),h.isEnd&&h.emit("onReachEnd",h),h.params.watchSlidesProgress&&h.updateSlidesProgress(e),h.emit("onProgress",h,h.progress)},h.updateActiveIndex=function(){var e,a,t,s=h.rtl?h.translate:-h.translate;for(a=0;a<h.slidesGrid.length;a++)"undefined"!=typeof h.slidesGrid[a+1]?s>=h.slidesGrid[a]&&s<h.slidesGrid[a+1]-(h.slidesGrid[a+1]-h.slidesGrid[a])/2?e=a:s>=h.slidesGrid[a]&&s<h.slidesGrid[a+1]&&(e=a+1):s>=h.slidesGrid[a]&&(e=a);(0>e||"undefined"==typeof e)&&(e=0),t=Math.floor(e/h.params.slidesPerGroup),t>=h.snapGrid.length&&(t=h.snapGrid.length-1),e!==h.activeIndex&&(h.snapIndex=t,h.previousIndex=h.activeIndex,h.activeIndex=e,h.updateClasses())},h.updateClasses=function(){h.slides.removeClass(h.params.slideActiveClass+" "+h.params.slideNextClass+" "+h.params.slidePrevClass);var e=h.slides.eq(h.activeIndex);if(e.addClass(h.params.slideActiveClass),e.next("."+h.params.slideClass).addClass(h.params.slideNextClass),e.prev("."+h.params.slideClass).addClass(h.params.slidePrevClass),h.bullets&&h.bullets.length>0){h.bullets.removeClass(h.params.bulletActiveClass);var a;h.params.loop?(a=Math.ceil(h.activeIndex-h.loopedSlides)/h.params.slidesPerGroup,a>h.slides.length-1-2*h.loopedSlides&&(a-=h.slides.length-2*h.loopedSlides),a>h.bullets.length-1&&(a-=h.bullets.length)):a="undefined"!=typeof h.snapIndex?h.snapIndex:h.activeIndex||0,h.paginationContainer.length>1?h.bullets.each(function(){v(this).index()===a&&v(this).addClass(h.params.bulletActiveClass)}):h.bullets.eq(a).addClass(h.params.bulletActiveClass)}h.params.loop||(h.params.prevButton&&(h.isBeginning?(v(h.params.prevButton).addClass(h.params.buttonDisabledClass),h.params.a11y&&h.a11y&&h.a11y.disable(v(h.params.prevButton))):(v(h.params.prevButton).removeClass(h.params.buttonDisabledClass),h.params.a11y&&h.a11y&&h.a11y.enable(v(h.params.prevButton)))),h.params.nextButton&&(h.isEnd?(v(h.params.nextButton).addClass(h.params.buttonDisabledClass),h.params.a11y&&h.a11y&&h.a11y.disable(v(h.params.nextButton))):(v(h.params.nextButton).removeClass(h.params.buttonDisabledClass),h.params.a11y&&h.a11y&&h.a11y.enable(v(h.params.nextButton)))))},h.updatePagination=function(){if(h.params.pagination&&h.paginationContainer&&h.paginationContainer.length>0){for(var e="",a=h.params.loop?Math.ceil((h.slides.length-2*h.loopedSlides)/h.params.slidesPerGroup):h.snapGrid.length,t=0;a>t;t++)e+=h.params.paginationBulletRender?h.params.paginationBulletRender(t,h.params.bulletClass):'<span class="'+h.params.bulletClass+'"></span>';h.paginationContainer.html(e),h.bullets=h.paginationContainer.find("."+h.params.bulletClass)}},h.update=function(e){function a(){s=Math.min(Math.max(h.translate,h.maxTranslate()),h.minTranslate()),h.setWrapperTranslate(s),h.updateActiveIndex(),h.updateClasses()}if(h.updateContainerSize(),h.updateSlidesSize(),h.updateProgress(),h.updatePagination(),h.updateClasses(),h.params.scrollbar&&h.scrollbar&&h.scrollbar.set(),e){var t,s;h.params.freeMode?a():(t="auto"===h.params.slidesPerView&&h.isEnd&&!h.params.centeredSlides?h.slideTo(h.slides.length-1,0,!1,!0):h.slideTo(h.activeIndex,0,!1,!0),t||a())}},h.onResize=function(e){if(h.updateContainerSize(),h.updateSlidesSize(),h.updateProgress(),("auto"===h.params.slidesPerView||h.params.freeMode||e)&&h.updatePagination(),h.params.scrollbar&&h.scrollbar&&h.scrollbar.set(),h.params.freeMode){var a=Math.min(Math.max(h.translate,h.maxTranslate()),h.minTranslate());h.setWrapperTranslate(a),h.updateActiveIndex(),h.updateClasses()}else h.updateClasses(),"auto"===h.params.slidesPerView&&h.isEnd&&!h.params.centeredSlides?h.slideTo(h.slides.length-1,0,!1,!0):h.slideTo(h.activeIndex,0,!1,!0)};var g=["mousedown","mousemove","mouseup"];window.navigator.pointerEnabled?g=["pointerdown","pointermove","pointerup"]:window.navigator.msPointerEnabled&&(g=["MSPointerDown","MSPointerMove","MSPointerUp"]),h.touchEvents={start:h.support.touch||!h.params.simulateTouch?"touchstart":g[0],move:h.support.touch||!h.params.simulateTouch?"touchmove":g[1],end:h.support.touch||!h.params.simulateTouch?"touchend":g[2]},(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&("container"===h.params.touchEventsTarget?h.container:h.wrapper).addClass("swiper-wp8-"+h.params.direction),h.initEvents=function(e){var a=e?"off":"on",s=e?"removeEventListener":"addEventListener",r="container"===h.params.touchEventsTarget?h.container[0]:h.wrapper[0],i=h.support.touch?r:document,n=h.params.nested?!0:!1;h.browser.ie?(r[s](h.touchEvents.start,h.onTouchStart,!1),i[s](h.touchEvents.move,h.onTouchMove,n),i[s](h.touchEvents.end,h.onTouchEnd,!1)):(h.support.touch&&(r[s](h.touchEvents.start,h.onTouchStart,!1),r[s](h.touchEvents.move,h.onTouchMove,n),r[s](h.touchEvents.end,h.onTouchEnd,!1)),!t.simulateTouch||h.device.ios||h.device.android||(r[s]("mousedown",h.onTouchStart,!1),document[s]("mousemove",h.onTouchMove,n),document[s]("mouseup",h.onTouchEnd,!1))),window[s]("resize",h.onResize),h.params.nextButton&&(v(h.params.nextButton)[a]("click",h.onClickNext),h.params.a11y&&h.a11y&&v(h.params.nextButton)[a]("keydown",h.a11y.onEnterKey)),h.params.prevButton&&(v(h.params.prevButton)[a]("click",h.onClickPrev),h.params.a11y&&h.a11y&&v(h.params.prevButton)[a]("keydown",h.a11y.onEnterKey)),h.params.pagination&&h.params.paginationClickable&&v(h.paginationContainer)[a]("click","."+h.params.bulletClass,h.onClickIndex),(h.params.preventClicks||h.params.preventClicksPropagation)&&r[s]("click",h.preventClicks,!0)},h.attachEvents=function(e){h.initEvents()},h.detachEvents=function(){h.initEvents(!0)},h.allowClick=!0,h.preventClicks=function(e){h.allowClick||(h.params.preventClicks&&e.preventDefault(),h.params.preventClicksPropagation&&h.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))},h.onClickNext=function(e){e.preventDefault(),h.slideNext()},h.onClickPrev=function(e){e.preventDefault(),h.slidePrev()},h.onClickIndex=function(e){e.preventDefault();var a=v(this).index()*h.params.slidesPerGroup;h.params.loop&&(a+=h.loopedSlides),h.slideTo(a)},h.updateClickedSlide=function(e){var a=i(e,"."+h.params.slideClass),t=!1;if(a)for(var s=0;s<h.slides.length;s++)h.slides[s]===a&&(t=!0);if(!a||!t)return h.clickedSlide=void 0,void(h.clickedIndex=void 0);if(h.clickedSlide=a,h.clickedIndex=v(a).index(),h.params.slideToClickedSlide&&void 0!==h.clickedIndex&&h.clickedIndex!==h.activeIndex){var r,n=h.clickedIndex;if(h.params.loop)if(r=v(h.clickedSlide).attr("data-swiper-slide-index"),n>h.slides.length-h.params.slidesPerView)h.fixLoop(),n=h.wrapper.children("."+h.params.slideClass+'[data-swiper-slide-index="'+r+'"]').eq(0).index(),setTimeout(function(){h.slideTo(n)},0);else if(n<h.params.slidesPerView-1){h.fixLoop();var o=h.wrapper.children("."+h.params.slideClass+'[data-swiper-slide-index="'+r+'"]');n=o.eq(o.length-1).index(),setTimeout(function(){h.slideTo(n)},0)}else h.slideTo(n);else h.slideTo(n)}};var w,y,b,x,T,S,C,M,P,z="input, select, textarea, button",I=Date.now(),k=[];h.animating=!1,h.touches={startX:0,startY:0,currentX:0,currentY:0,diff:0};var E,D;if(h.onTouchStart=function(e){if(e.originalEvent&&(e=e.originalEvent),E="touchstart"===e.type,E||!("which"in e)||3!==e.which){if(h.params.noSwiping&&i(e,"."+h.params.noSwipingClass))return void(h.allowClick=!0);if(!h.params.swipeHandler||i(e,h.params.swipeHandler)){if(w=!0,y=!1,x=void 0,D=void 0,h.touches.startX=h.touches.currentX="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,h.touches.startY=h.touches.currentY="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY,b=Date.now(),h.allowClick=!0,h.updateContainerSize(),h.swipeDirection=void 0,h.params.threshold>0&&(C=!1),"touchstart"!==e.type){var a=!0;v(e.target).is(z)&&(a=!1),document.activeElement&&v(document.activeElement).is(z)&&document.activeElement.blur(),a&&e.preventDefault()}h.emit("onTouchStart",h,e)}}},h.onTouchMove=function(e){if(e.originalEvent&&(e=e.originalEvent),!(E&&"mousemove"===e.type||e.preventedByNestedSwiper)){if(h.params.onlyExternal)return y=!0,void(h.allowClick=!1);if(E&&document.activeElement&&e.target===document.activeElement&&v(e.target).is(z))return y=!0,void(h.allowClick=!1);if(h.emit("onTouchMove",h,e),!(e.targetTouches&&e.targetTouches.length>1)){if(h.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,h.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,"undefined"==typeof x){var a=180*Math.atan2(Math.abs(h.touches.currentY-h.touches.startY),Math.abs(h.touches.currentX-h.touches.startX))/Math.PI;x=s()?a>h.params.touchAngle:90-a>h.params.touchAngle}if(x&&h.emit("onTouchMoveOpposite",h,e),"undefined"==typeof D&&h.browser.ieTouch&&(h.touches.currentX!==h.touches.startX||h.touches.currentY!==h.touches.startY)&&(D=!0),w){if(x)return void(w=!1);if(D||!h.browser.ieTouch){h.allowClick=!1,h.emit("onSliderMove",h,e),e.preventDefault(),h.params.touchMoveStopPropagation&&!h.params.nested&&e.stopPropagation(),y||(t.loop&&h.fixLoop(),S=h.getWrapperTranslate(),h.setWrapperTransition(0),h.animating&&h.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),h.params.autoplay&&h.autoplaying&&(h.params.autoplayDisableOnInteraction?h.stopAutoplay():h.pauseAutoplay()),P=!1,h.params.grabCursor&&(h.container[0].style.cursor="move",h.container[0].style.cursor="-webkit-grabbing",h.container[0].style.cursor="-moz-grabbin",h.container[0].style.cursor="grabbing")),y=!0;var r=h.touches.diff=s()?h.touches.currentX-h.touches.startX:h.touches.currentY-h.touches.startY;r*=h.params.touchRatio,h.rtl&&(r=-r),h.swipeDirection=r>0?"prev":"next",T=r+S;var i=!0;if(r>0&&T>h.minTranslate()?(i=!1,h.params.resistance&&(T=h.minTranslate()-1+Math.pow(-h.minTranslate()+S+r,h.params.resistanceRatio))):0>r&&T<h.maxTranslate()&&(i=!1,h.params.resistance&&(T=h.maxTranslate()+1-Math.pow(h.maxTranslate()-S-r,h.params.resistanceRatio))),i&&(e.preventedByNestedSwiper=!0),!h.params.allowSwipeToNext&&"next"===h.swipeDirection&&S>T&&(T=S),!h.params.allowSwipeToPrev&&"prev"===h.swipeDirection&&T>S&&(T=S),h.params.followFinger){if(h.params.threshold>0){if(!(Math.abs(r)>h.params.threshold||C))return void(T=S);if(!C)return C=!0,h.touches.startX=h.touches.currentX,h.touches.startY=h.touches.currentY,T=S,void(h.touches.diff=s()?h.touches.currentX-h.touches.startX:h.touches.currentY-h.touches.startY)}(h.params.freeMode||h.params.watchSlidesProgress)&&h.updateActiveIndex(),h.params.freeMode&&(0===k.length&&k.push({position:h.touches[s()?"startX":"startY"],time:b}),k.push({position:h.touches[s()?"currentX":"currentY"],time:(new window.Date).getTime()})),h.updateProgress(T),h.setWrapperTranslate(T)}}}}}},h.onTouchEnd=function(e){if(e.originalEvent&&(e=e.originalEvent),h.emit("onTouchEnd",h,e),w){h.params.grabCursor&&y&&w&&(h.container[0].style.cursor="move",h.container[0].style.cursor="-webkit-grab",h.container[0].style.cursor="-moz-grab",h.container[0].style.cursor="grab");var a=Date.now(),t=a-b;if(h.allowClick&&(h.updateClickedSlide(e),h.emit("onTap",h,e),300>t&&a-I>300&&(M&&clearTimeout(M),M=setTimeout(function(){h&&(h.params.paginationHide&&h.paginationContainer.length>0&&!v(e.target).hasClass(h.params.bulletClass)&&h.paginationContainer.toggleClass(h.params.paginationHiddenClass),h.emit("onClick",h,e))},300)),300>t&&300>a-I&&(M&&clearTimeout(M),h.emit("onDoubleTap",h,e))),I=Date.now(),setTimeout(function(){h&&(h.allowClick=!0)},0),!w||!y||!h.swipeDirection||0===h.touches.diff||T===S)return void(w=y=!1);w=y=!1;var s;if(s=h.params.followFinger?h.rtl?h.translate:-h.translate:-T,h.params.freeMode){if(s<-h.minTranslate())return void h.slideTo(h.activeIndex);if(s>-h.maxTranslate())return void h.slideTo(h.slides.length<h.snapGrid.length?h.snapGrid.length-1:h.slides.length-1);if(h.params.freeModeMomentum){if(k.length>1){var r=k.pop(),i=k.pop(),n=r.position-i.position,o=r.time-i.time;h.velocity=n/o,h.velocity=h.velocity/2,Math.abs(h.velocity)<.02&&(h.velocity=0),(o>150||(new window.Date).getTime()-r.time>300)&&(h.velocity=0)}else h.velocity=0;k.length=0;var l=1e3*h.params.freeModeMomentumRatio,d=h.velocity*l,p=h.translate+d;h.rtl&&(p=-p);var u,c=!1,m=20*Math.abs(h.velocity)*h.params.freeModeMomentumBounceRatio;if(p<h.maxTranslate())h.params.freeModeMomentumBounce?(p+h.maxTranslate()<-m&&(p=h.maxTranslate()-m),u=h.maxTranslate(),c=!0,P=!0):p=h.maxTranslate();else if(p>h.minTranslate())h.params.freeModeMomentumBounce?(p-h.minTranslate()>m&&(p=h.minTranslate()+m),u=h.minTranslate(),c=!0,P=!0):p=h.minTranslate();else if(h.params.freeModeSticky){var f,g=0;for(g=0;g<h.snapGrid.length;g+=1)if(h.snapGrid[g]>-p){f=g;break}p=Math.abs(h.snapGrid[f]-p)<Math.abs(h.snapGrid[f-1]-p)||"next"===h.swipeDirection?h.snapGrid[f]:h.snapGrid[f-1],h.rtl||(p=-p)}if(0!==h.velocity)l=Math.abs(h.rtl?(-p-h.translate)/h.velocity:(p-h.translate)/h.velocity);else if(h.params.freeModeSticky)return void h.slideReset();h.params.freeModeMomentumBounce&&c?(h.updateProgress(u),h.setWrapperTransition(l),h.setWrapperTranslate(p),h.onTransitionStart(),h.animating=!0,h.wrapper.transitionEnd(function(){h&&P&&(h.emit("onMomentumBounce",h),h.setWrapperTransition(h.params.speed),h.setWrapperTranslate(u),h.wrapper.transitionEnd(function(){h&&h.onTransitionEnd()}))})):h.velocity?(h.updateProgress(p),h.setWrapperTransition(l),h.setWrapperTranslate(p),h.onTransitionStart(),h.animating||(h.animating=!0,h.wrapper.transitionEnd(function(){h&&h.onTransitionEnd()}))):h.updateProgress(p),h.updateActiveIndex()}return void((!h.params.freeModeMomentum||t>=h.params.longSwipesMs)&&(h.updateProgress(),h.updateActiveIndex()))}var x,C=0,z=h.slidesSizesGrid[0];for(x=0;x<h.slidesGrid.length;x+=h.params.slidesPerGroup)"undefined"!=typeof h.slidesGrid[x+h.params.slidesPerGroup]?s>=h.slidesGrid[x]&&s<h.slidesGrid[x+h.params.slidesPerGroup]&&(C=x,z=h.slidesGrid[x+h.params.slidesPerGroup]-h.slidesGrid[x]):s>=h.slidesGrid[x]&&(C=x,z=h.slidesGrid[h.slidesGrid.length-1]-h.slidesGrid[h.slidesGrid.length-2]);var E=(s-h.slidesGrid[C])/z;if(t>h.params.longSwipesMs){if(!h.params.longSwipes)return void h.slideTo(h.activeIndex);"next"===h.swipeDirection&&h.slideTo(E>=h.params.longSwipesRatio?C+h.params.slidesPerGroup:C),"prev"===h.swipeDirection&&h.slideTo(E>1-h.params.longSwipesRatio?C+h.params.slidesPerGroup:C)}else{if(!h.params.shortSwipes)return void h.slideTo(h.activeIndex);"next"===h.swipeDirection&&h.slideTo(C+h.params.slidesPerGroup),"prev"===h.swipeDirection&&h.slideTo(C)}}},h._slideTo=function(e,a){return h.slideTo(e,a,!0,!0)},h.slideTo=function(e,a,t,r){"undefined"==typeof t&&(t=!0),"undefined"==typeof e&&(e=0),0>e&&(e=0),h.snapIndex=Math.floor(e/h.params.slidesPerGroup),h.snapIndex>=h.snapGrid.length&&(h.snapIndex=h.snapGrid.length-1);var i=-h.snapGrid[h.snapIndex];if(!h.params.allowSwipeToNext&&i<h.translate&&i<h.minTranslate())return!1;if(!h.params.allowSwipeToPrev&&i>h.translate&&i>h.maxTranslate())return!1;h.params.autoplay&&h.autoplaying&&(r||!h.params.autoplayDisableOnInteraction?h.pauseAutoplay(a):h.stopAutoplay()),h.updateProgress(i);for(var n=0;n<h.slidesGrid.length;n++)-i>=h.slidesGrid[n]&&(e=n);if("undefined"==typeof a&&(a=h.params.speed),h.previousIndex=h.activeIndex||0,h.activeIndex=e,i===h.translate)return h.updateClasses(),!1;h.updateClasses(),h.onTransitionStart(t);s()?i:0,s()?0:i;return 0===a?(h.setWrapperTransition(0),h.setWrapperTranslate(i),h.onTransitionEnd(t)):(h.setWrapperTransition(a),h.setWrapperTranslate(i),h.animating||(h.animating=!0,h.wrapper.transitionEnd(function(){h&&h.onTransitionEnd(t)}))),!0},h.onTransitionStart=function(e){"undefined"==typeof e&&(e=!0),h.lazy&&h.lazy.onTransitionStart(),e&&(h.emit("onTransitionStart",h),h.activeIndex!==h.previousIndex&&h.emit("onSlideChangeStart",h))},h.onTransitionEnd=function(e){h.animating=!1,h.setWrapperTransition(0),"undefined"==typeof e&&(e=!0),h.lazy&&h.lazy.onTransitionEnd(),e&&(h.emit("onTransitionEnd",h),h.activeIndex!==h.previousIndex&&h.emit("onSlideChangeEnd",h)),h.params.hashnav&&h.hashnav&&h.hashnav.setHash()},h.slideNext=function(e,a,t){if(h.params.loop){if(h.animating)return!1;h.fixLoop();{h.container[0].clientLeft}return h.slideTo(h.activeIndex+h.params.slidesPerGroup,a,e,t)}return h.slideTo(h.activeIndex+h.params.slidesPerGroup,a,e,t)},h._slideNext=function(e){return h.slideNext(!0,e,!0)},h.slidePrev=function(e,a,t){if(h.params.loop){if(h.animating)return!1;h.fixLoop();{h.container[0].clientLeft}return h.slideTo(h.activeIndex-1,a,e,t)}return h.slideTo(h.activeIndex-1,a,e,t)},h._slidePrev=function(e){return h.slidePrev(!0,e,!0)},h.slideReset=function(e,a,t){return h.slideTo(h.activeIndex,a,e)},h.setWrapperTransition=function(e,a){h.wrapper.transition(e),"slide"!==h.params.effect&&h.effects[h.params.effect]&&h.effects[h.params.effect].setTransition(e),h.params.parallax&&h.parallax&&h.parallax.setTransition(e),h.params.scrollbar&&h.scrollbar&&h.scrollbar.setTransition(e),h.params.control&&h.controller&&h.controller.setTransition(e,a),h.emit("onSetTransition",h,e)},h.setWrapperTranslate=function(e,a,t){var r=0,i=0,n=0;s()?r=h.rtl?-e:e:i=e,h.params.virtualTranslate||h.wrapper.transform(h.support.transforms3d?"translate3d("+r+"px, "+i+"px, "+n+"px)":"translate("+r+"px, "+i+"px)"),
h.translate=s()?r:i,a&&h.updateActiveIndex(),"slide"!==h.params.effect&&h.effects[h.params.effect]&&h.effects[h.params.effect].setTranslate(h.translate),h.params.parallax&&h.parallax&&h.parallax.setTranslate(h.translate),h.params.scrollbar&&h.scrollbar&&h.scrollbar.setTranslate(h.translate),h.params.control&&h.controller&&h.controller.setTranslate(h.translate,t),h.emit("onSetTranslate",h,h.translate)},h.getTranslate=function(e,a){var t,s,r,i;return"undefined"==typeof a&&(a="x"),h.params.virtualTranslate?h.rtl?-h.translate:h.translate:(r=window.getComputedStyle(e,null),window.WebKitCSSMatrix?i=new window.WebKitCSSMatrix("none"===r.webkitTransform?"":r.webkitTransform):(i=r.MozTransform||r.OTransform||r.MsTransform||r.msTransform||r.transform||r.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=i.toString().split(",")),"x"===a&&(s=window.WebKitCSSMatrix?i.m41:parseFloat(16===t.length?t[12]:t[4])),"y"===a&&(s=window.WebKitCSSMatrix?i.m42:parseFloat(16===t.length?t[13]:t[5])),h.rtl&&s&&(s=-s),s||0)},h.getWrapperTranslate=function(e){return"undefined"==typeof e&&(e=s()?"x":"y"),h.getTranslate(h.wrapper[0],e)},h.observers=[],h.initObservers=function(){if(h.params.observeParents)for(var e=h.container.parents(),a=0;a<e.length;a++)n(e[a]);n(h.container[0],{childList:!1}),n(h.wrapper[0],{attributes:!1})},h.disconnectObservers=function(){for(var e=0;e<h.observers.length;e++)h.observers[e].disconnect();h.observers=[]},h.createLoop=function(){h.wrapper.children("."+h.params.slideClass+"."+h.params.slideDuplicateClass).remove();var e=h.wrapper.children("."+h.params.slideClass);h.loopedSlides=parseInt(h.params.loopedSlides||h.params.slidesPerView,10),h.loopedSlides=h.loopedSlides+h.params.loopAdditionalSlides,h.loopedSlides>e.length&&(h.loopedSlides=e.length);var a,t=[],s=[];for(e.each(function(a,r){var i=v(this);a<h.loopedSlides&&s.push(r),a<e.length&&a>=e.length-h.loopedSlides&&t.push(r),i.attr("data-swiper-slide-index",a)}),a=0;a<s.length;a++)h.wrapper.append(v(s[a].cloneNode(!0)).addClass(h.params.slideDuplicateClass));for(a=t.length-1;a>=0;a--)h.wrapper.prepend(v(t[a].cloneNode(!0)).addClass(h.params.slideDuplicateClass))},h.destroyLoop=function(){h.wrapper.children("."+h.params.slideClass+"."+h.params.slideDuplicateClass).remove(),h.slides.removeAttr("data-swiper-slide-index")},h.fixLoop=function(){var e;h.activeIndex<h.loopedSlides?(e=h.slides.length-3*h.loopedSlides+h.activeIndex,e+=h.loopedSlides,h.slideTo(e,0,!1,!0)):("auto"===h.params.slidesPerView&&h.activeIndex>=2*h.loopedSlides||h.activeIndex>h.slides.length-2*h.params.slidesPerView)&&(e=-h.slides.length+h.activeIndex+h.loopedSlides,e+=h.loopedSlides,h.slideTo(e,0,!1,!0))},h.appendSlide=function(e){if(h.params.loop&&h.destroyLoop(),"object"==typeof e&&e.length)for(var a=0;a<e.length;a++)e[a]&&h.wrapper.append(e[a]);else h.wrapper.append(e);h.params.loop&&h.createLoop(),h.params.observer&&h.support.observer||h.update(!0)},h.prependSlide=function(e){h.params.loop&&h.destroyLoop();var a=h.activeIndex+1;if("object"==typeof e&&e.length){for(var t=0;t<e.length;t++)e[t]&&h.wrapper.prepend(e[t]);a=h.activeIndex+e.length}else h.wrapper.prepend(e);h.params.loop&&h.createLoop(),h.params.observer&&h.support.observer||h.update(!0),h.slideTo(a,0,!1)},h.removeSlide=function(e){h.params.loop&&(h.destroyLoop(),h.slides=h.wrapper.children("."+h.params.slideClass));var a,t=h.activeIndex;if("object"==typeof e&&e.length){for(var s=0;s<e.length;s++)a=e[s],h.slides[a]&&h.slides.eq(a).remove(),t>a&&t--;t=Math.max(t,0)}else a=e,h.slides[a]&&h.slides.eq(a).remove(),t>a&&t--,t=Math.max(t,0);h.params.loop&&h.createLoop(),h.params.observer&&h.support.observer||h.update(!0),h.params.loop?h.slideTo(t+h.loopedSlides,0,!1):h.slideTo(t,0,!1)},h.removeAllSlides=function(){for(var e=[],a=0;a<h.slides.length;a++)e.push(a);h.removeSlide(e)},h.effects={fade:{setTranslate:function(){for(var e=0;e<h.slides.length;e++){var a=h.slides.eq(e),t=a[0].swiperSlideOffset,r=-t;h.params.virtualTranslate||(r-=h.translate);var i=0;s()||(i=r,r=0);var n=h.params.fade.crossFade?Math.max(1-Math.abs(a[0].progress),0):1+Math.min(Math.max(a[0].progress,-1),0);a.css({opacity:n}).transform("translate3d("+r+"px, "+i+"px, 0px)")}},setTransition:function(e){if(h.slides.transition(e),h.params.virtualTranslate&&0!==e){var a=!1;h.slides.transitionEnd(function(){if(!a&&h){a=!0,h.animating=!1;for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],t=0;t<e.length;t++)h.wrapper.trigger(e[t])}})}}},cube:{setTranslate:function(){var e,a=0;h.params.cube.shadow&&(s()?(e=h.wrapper.find(".swiper-cube-shadow"),0===e.length&&(e=v('<div class="swiper-cube-shadow"></div>'),h.wrapper.append(e)),e.css({height:h.width+"px"})):(e=h.container.find(".swiper-cube-shadow"),0===e.length&&(e=v('<div class="swiper-cube-shadow"></div>'),h.container.append(e))));for(var t=0;t<h.slides.length;t++){var r=h.slides.eq(t),i=90*t,n=Math.floor(i/360);h.rtl&&(i=-i,n=Math.floor(-i/360));var o=Math.max(Math.min(r[0].progress,1),-1),l=0,d=0,p=0;t%4===0?(l=4*-n*h.size,p=0):(t-1)%4===0?(l=0,p=4*-n*h.size):(t-2)%4===0?(l=h.size+4*n*h.size,p=h.size):(t-3)%4===0&&(l=-h.size,p=3*h.size+4*h.size*n),h.rtl&&(l=-l),s()||(d=l,l=0);var u="rotateX("+(s()?0:-i)+"deg) rotateY("+(s()?i:0)+"deg) translate3d("+l+"px, "+d+"px, "+p+"px)";if(1>=o&&o>-1&&(a=90*t+90*o,h.rtl&&(a=90*-t-90*o)),r.transform(u),h.params.cube.slideShadows){var c=r.find(s()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),m=r.find(s()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===c.length&&(c=v('<div class="swiper-slide-shadow-'+(s()?"left":"top")+'"></div>'),r.append(c)),0===m.length&&(m=v('<div class="swiper-slide-shadow-'+(s()?"right":"bottom")+'"></div>'),r.append(m));{r[0].progress}c.length&&(c[0].style.opacity=-r[0].progress),m.length&&(m[0].style.opacity=r[0].progress)}}if(h.wrapper.css({"-webkit-transform-origin":"50% 50% -"+h.size/2+"px","-moz-transform-origin":"50% 50% -"+h.size/2+"px","-ms-transform-origin":"50% 50% -"+h.size/2+"px","transform-origin":"50% 50% -"+h.size/2+"px"}),h.params.cube.shadow)if(s())e.transform("translate3d(0px, "+(h.width/2+h.params.cube.shadowOffset)+"px, "+-h.width/2+"px) rotateX(90deg) rotateZ(0deg) scale("+h.params.cube.shadowScale+")");else{var f=Math.abs(a)-90*Math.floor(Math.abs(a)/90),g=1.5-(Math.sin(2*f*Math.PI/360)/2+Math.cos(2*f*Math.PI/360)/2),w=h.params.cube.shadowScale,y=h.params.cube.shadowScale/g,b=h.params.cube.shadowOffset;e.transform("scale3d("+w+", 1, "+y+") translate3d(0px, "+(h.height/2+b)+"px, "+-h.height/2/y+"px) rotateX(-90deg)")}var x=h.isSafari||h.isUiWebView?-h.size/2:0;h.wrapper.transform("translate3d(0px,0,"+x+"px) rotateX("+(s()?0:a)+"deg) rotateY("+(s()?-a:0)+"deg)")},setTransition:function(e){h.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),h.params.cube.shadow&&!s()&&h.container.find(".swiper-cube-shadow").transition(e)}},coverflow:{setTranslate:function(){for(var e=h.translate,a=s()?-e+h.width/2:-e+h.height/2,t=s()?h.params.coverflow.rotate:-h.params.coverflow.rotate,r=h.params.coverflow.depth,i=0,n=h.slides.length;n>i;i++){var o=h.slides.eq(i),l=h.slidesSizesGrid[i],d=o[0].swiperSlideOffset,p=(a-d-l/2)/l*h.params.coverflow.modifier,u=s()?t*p:0,c=s()?0:t*p,m=-r*Math.abs(p),f=s()?0:h.params.coverflow.stretch*p,g=s()?h.params.coverflow.stretch*p:0;Math.abs(g)<.001&&(g=0),Math.abs(f)<.001&&(f=0),Math.abs(m)<.001&&(m=0),Math.abs(u)<.001&&(u=0),Math.abs(c)<.001&&(c=0);var w="translate3d("+g+"px,"+f+"px,"+m+"px)  rotateX("+c+"deg) rotateY("+u+"deg)";if(o.transform(w),o[0].style.zIndex=-Math.abs(Math.round(p))+1,h.params.coverflow.slideShadows){var y=o.find(s()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),b=o.find(s()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===y.length&&(y=v('<div class="swiper-slide-shadow-'+(s()?"left":"top")+'"></div>'),o.append(y)),0===b.length&&(b=v('<div class="swiper-slide-shadow-'+(s()?"right":"bottom")+'"></div>'),o.append(b)),y.length&&(y[0].style.opacity=p>0?p:0),b.length&&(b[0].style.opacity=-p>0?-p:0)}}if(h.browser.ie){var x=h.wrapper[0].style;x.perspectiveOrigin=a+"px 50%"}},setTransition:function(e){h.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}}},h.lazy={initialImageLoaded:!1,loadImageInSlide:function(e,a){if("undefined"!=typeof e&&("undefined"==typeof a&&(a=!0),0!==h.slides.length)){var t=h.slides.eq(e),s=t.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");!t.hasClass("swiper-lazy")||t.hasClass("swiper-lazy-loaded")||t.hasClass("swiper-lazy-loading")||s.add(t[0]),0!==s.length&&s.each(function(){var e=v(this);e.addClass("swiper-lazy-loading");var s=e.attr("data-background"),r=e.attr("data-src");h.loadImage(e[0],r||s,!1,function(){if(s?(e.css("background-image","url("+s+")"),e.removeAttr("data-background")):(e.attr("src",r),e.removeAttr("data-src")),e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),t.find(".swiper-lazy-preloader, .preloader").remove(),h.params.loop&&a){var i=t.attr("data-swiper-slide-index");if(t.hasClass(h.params.slideDuplicateClass)){var n=h.wrapper.children('[data-swiper-slide-index="'+i+'"]:not(.'+h.params.slideDuplicateClass+")");h.lazy.loadImageInSlide(n.index(),!1)}else{var o=h.wrapper.children("."+h.params.slideDuplicateClass+'[data-swiper-slide-index="'+i+'"]');h.lazy.loadImageInSlide(o.index(),!1)}}h.emit("onLazyImageReady",h,t[0],e[0])}),h.emit("onLazyImageLoad",h,t[0],e[0])})}},load:function(){var e;if(h.params.watchSlidesVisibility)h.wrapper.children("."+h.params.slideVisibleClass).each(function(){h.lazy.loadImageInSlide(v(this).index())});else if(h.params.slidesPerView>1)for(e=h.activeIndex;e<h.activeIndex+h.params.slidesPerView;e++)h.slides[e]&&h.lazy.loadImageInSlide(e);else h.lazy.loadImageInSlide(h.activeIndex);if(h.params.lazyLoadingInPrevNext)if(h.params.slidesPerView>1){for(e=h.activeIndex+h.params.slidesPerView;e<h.activeIndex+h.params.slidesPerView+h.params.slidesPerView;e++)h.slides[e]&&h.lazy.loadImageInSlide(e);for(e=h.activeIndex-h.params.slidesPerView;e<h.activeIndex;e++)h.slides[e]&&h.lazy.loadImageInSlide(e)}else{var a=h.wrapper.children("."+h.params.slideNextClass);a.length>0&&h.lazy.loadImageInSlide(a.index());var t=h.wrapper.children("."+h.params.slidePrevClass);t.length>0&&h.lazy.loadImageInSlide(t.index())}},onTransitionStart:function(){h.params.lazyLoading&&(h.params.lazyLoadingOnTransitionStart||!h.params.lazyLoadingOnTransitionStart&&!h.lazy.initialImageLoaded)&&h.lazy.load()},onTransitionEnd:function(){h.params.lazyLoading&&!h.params.lazyLoadingOnTransitionStart&&h.lazy.load()}},h.scrollbar={set:function(){if(h.params.scrollbar){var e=h.scrollbar;e.track=v(h.params.scrollbar),e.drag=e.track.find(".swiper-scrollbar-drag"),0===e.drag.length&&(e.drag=v('<div class="swiper-scrollbar-drag"></div>'),e.track.append(e.drag)),e.drag[0].style.width="",e.drag[0].style.height="",e.trackSize=s()?e.track[0].offsetWidth:e.track[0].offsetHeight,e.divider=h.size/h.virtualSize,e.moveDivider=e.divider*(e.trackSize/h.size),e.dragSize=e.trackSize*e.divider,s()?e.drag[0].style.width=e.dragSize+"px":e.drag[0].style.height=e.dragSize+"px",e.track[0].style.display=e.divider>=1?"none":"",h.params.scrollbarHide&&(e.track[0].style.opacity=0)}},setTranslate:function(){if(h.params.scrollbar){var e,a=h.scrollbar,t=(h.translate||0,a.dragSize);e=(a.trackSize-a.dragSize)*h.progress,h.rtl&&s()?(e=-e,e>0?(t=a.dragSize-e,e=0):-e+a.dragSize>a.trackSize&&(t=a.trackSize+e)):0>e?(t=a.dragSize+e,e=0):e+a.dragSize>a.trackSize&&(t=a.trackSize-e),s()?(a.drag.transform(h.support.transforms3d?"translate3d("+e+"px, 0, 0)":"translateX("+e+"px)"),a.drag[0].style.width=t+"px"):(a.drag.transform(h.support.transforms3d?"translate3d(0px, "+e+"px, 0)":"translateY("+e+"px)"),a.drag[0].style.height=t+"px"),h.params.scrollbarHide&&(clearTimeout(a.timeout),a.track[0].style.opacity=1,a.timeout=setTimeout(function(){a.track[0].style.opacity=0,a.track.transition(400)},1e3))}},setTransition:function(e){h.params.scrollbar&&h.scrollbar.drag.transition(e)}},h.controller={setTranslate:function(e,t){function s(a){e=a.rtl&&"horizontal"===a.params.direction?-h.translate:h.translate,r=(a.maxTranslate()-a.minTranslate())/(h.maxTranslate()-h.minTranslate()),i=(e-h.minTranslate())*r+a.minTranslate(),h.params.controlInverse&&(i=a.maxTranslate()-i),a.updateProgress(i),a.setWrapperTranslate(i,!1,h),a.updateActiveIndex()}var r,i,n=h.params.control;if(h.isArray(n))for(var o=0;o<n.length;o++)n[o]!==t&&n[o]instanceof a&&s(n[o]);else n instanceof a&&t!==n&&s(n)},setTransition:function(e,t){function s(a){a.setWrapperTransition(e,h),0!==e&&(a.onTransitionStart(),a.wrapper.transitionEnd(function(){i&&a.onTransitionEnd()}))}var r,i=h.params.control;if(h.isArray(i))for(r=0;r<i.length;r++)i[r]!==t&&i[r]instanceof a&&s(i[r]);else i instanceof a&&t!==i&&s(i)}},h.hashnav={init:function(){if(h.params.hashnav){h.hashnav.initialized=!0;var e=document.location.hash.replace("#","");if(e)for(var a=0,t=0,s=h.slides.length;s>t;t++){var r=h.slides.eq(t),i=r.attr("data-hash");if(i===e&&!r.hasClass(h.params.slideDuplicateClass)){var n=r.index();h.slideTo(n,a,h.params.runCallbacksOnInit,!0)}}}},setHash:function(){h.hashnav.initialized&&h.params.hashnav&&(document.location.hash=h.slides.eq(h.activeIndex).attr("data-hash")||"")}},h.disableKeyboardControl=function(){v(document).off("keydown",o)},h.enableKeyboardControl=function(){v(document).on("keydown",o)},h.mousewheel={event:!1,lastScrollTime:(new window.Date).getTime()},h.params.mousewheelControl){if(void 0!==document.onmousewheel&&(h.mousewheel.event="mousewheel"),!h.mousewheel.event)try{new window.WheelEvent("wheel"),h.mousewheel.event="wheel"}catch(G){}h.mousewheel.event||(h.mousewheel.event="DOMMouseScroll")}h.disableMousewheelControl=function(){return h.mousewheel.event?(h.container.off(h.mousewheel.event,l),!0):!1},h.enableMousewheelControl=function(){return h.mousewheel.event?(h.container.on(h.mousewheel.event,l),!0):!1},h.parallax={setTranslate:function(){h.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){d(this,h.progress)}),h.slides.each(function(){var e=v(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=Math.min(Math.max(e[0].progress,-1),1);d(this,a)})})},setTransition:function(e){"undefined"==typeof e&&(e=h.params.speed),h.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=v(this),t=parseInt(a.attr("data-swiper-parallax-duration"),10)||e;0===e&&(t=0),a.transition(t)})}},h._plugins=[];for(var L in h.plugins){var B=h.plugins[L](h,h.params[L]);B&&h._plugins.push(B)}return h.callPlugins=function(e){for(var a=0;a<h._plugins.length;a++)e in h._plugins[a]&&h._plugins[a][e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},h.emitterEventListeners={},h.emit=function(e){h.params[e]&&h.params[e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);var a;if(h.emitterEventListeners[e])for(a=0;a<h.emitterEventListeners[e].length;a++)h.emitterEventListeners[e][a](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);h.callPlugins&&h.callPlugins(e,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},h.on=function(e,a){return e=p(e),h.emitterEventListeners[e]||(h.emitterEventListeners[e]=[]),h.emitterEventListeners[e].push(a),h},h.off=function(e,a){var t;if(e=p(e),"undefined"==typeof a)return h.emitterEventListeners[e]=[],h;if(h.emitterEventListeners[e]&&0!==h.emitterEventListeners[e].length){for(t=0;t<h.emitterEventListeners[e].length;t++)h.emitterEventListeners[e][t]===a&&h.emitterEventListeners[e].splice(t,1);return h}},h.once=function(e,a){e=p(e);var t=function(){a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]),h.off(e,t)};return h.on(e,t),h},h.a11y={makeFocusable:function(e){return e[0].tabIndex="0",e},addRole:function(e,a){return e.attr("role",a),e},addLabel:function(e,a){return e.attr("aria-label",a),e},disable:function(e){return e.attr("aria-disabled",!0),e},enable:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){13===e.keyCode&&(v(e.target).is(h.params.nextButton)?(h.onClickNext(e),h.a11y.notify(h.isEnd?h.params.lastSlideMsg:h.params.nextSlideMsg)):v(e.target).is(h.params.prevButton)&&(h.onClickPrev(e),h.a11y.notify(h.isBeginning?h.params.firstSlideMsg:h.params.prevSlideMsg)))},liveRegion:v('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function(e){var a=h.a11y.liveRegion;0!==a.length&&(a.html(""),a.html(e))},init:function(){if(h.params.nextButton){var e=v(h.params.nextButton);h.a11y.makeFocusable(e),h.a11y.addRole(e,"button"),h.a11y.addLabel(e,h.params.nextSlideMsg)}if(h.params.prevButton){var a=v(h.params.prevButton);h.a11y.makeFocusable(a),h.a11y.addRole(a,"button"),h.a11y.addLabel(a,h.params.prevSlideMsg)}v(h.container).append(h.a11y.liveRegion)},destroy:function(){h.a11y.liveRegion&&h.a11y.liveRegion.length>0&&h.a11y.liveRegion.remove()}},h.init=function(){h.params.loop&&h.createLoop(),h.updateContainerSize(),h.updateSlidesSize(),h.updatePagination(),h.params.scrollbar&&h.scrollbar&&h.scrollbar.set(),"slide"!==h.params.effect&&h.effects[h.params.effect]&&(h.params.loop||h.updateProgress(),h.effects[h.params.effect].setTranslate()),h.params.loop?h.slideTo(h.params.initialSlide+h.loopedSlides,0,h.params.runCallbacksOnInit):(h.slideTo(h.params.initialSlide,0,h.params.runCallbacksOnInit),0===h.params.initialSlide&&(h.parallax&&h.params.parallax&&h.parallax.setTranslate(),h.lazy&&h.params.lazyLoading&&(h.lazy.load(),h.lazy.initialImageLoaded=!0))),h.attachEvents(),h.params.observer&&h.support.observer&&h.initObservers(),h.params.preloadImages&&!h.params.lazyLoading&&h.preloadImages(),h.params.autoplay&&h.startAutoplay(),h.params.keyboardControl&&h.enableKeyboardControl&&h.enableKeyboardControl(),h.params.mousewheelControl&&h.enableMousewheelControl&&h.enableMousewheelControl(),h.params.hashnav&&h.hashnav&&h.hashnav.init(),h.params.a11y&&h.a11y&&h.a11y.init(),h.emit("onInit",h)},h.cleanupStyles=function(){h.container.removeClass(h.classNames.join(" ")).removeAttr("style"),h.wrapper.removeAttr("style"),h.slides&&h.slides.length&&h.slides.removeClass([h.params.slideVisibleClass,h.params.slideActiveClass,h.params.slideNextClass,h.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),h.paginationContainer&&h.paginationContainer.length&&h.paginationContainer.removeClass(h.params.paginationHiddenClass),h.bullets&&h.bullets.length&&h.bullets.removeClass(h.params.bulletActiveClass),h.params.prevButton&&v(h.params.prevButton).removeClass(h.params.buttonDisabledClass),h.params.nextButton&&v(h.params.nextButton).removeClass(h.params.buttonDisabledClass),h.params.scrollbar&&h.scrollbar&&(h.scrollbar.track&&h.scrollbar.track.length&&h.scrollbar.track.removeAttr("style"),h.scrollbar.drag&&h.scrollbar.drag.length&&h.scrollbar.drag.removeAttr("style"))},h.destroy=function(e,a){h.detachEvents(),h.stopAutoplay(),h.params.loop&&h.destroyLoop(),a&&h.cleanupStyles(),h.disconnectObservers(),h.params.keyboardControl&&h.disableKeyboardControl&&h.disableKeyboardControl(),h.params.mousewheelControl&&h.disableMousewheelControl&&h.disableMousewheelControl(),h.params.a11y&&h.a11y&&h.a11y.destroy(),h.emit("onDestroy"),e!==!1&&(h=null)},h.init(),h}};a.prototype={isSafari:function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function(e){return"[object Array]"===Object.prototype.toString.apply(e)},browser:{ie:window.navigator.pointerEnabled||window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>1||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>1},device:function(){var e=navigator.userAgent,a=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),s=(e.match(/(iPod)(.*OS\s([\d_]+))?/),!t&&e.match(/(iPhone\sOS)\s([\d_]+)/));return{ios:t||s||t,android:a}}(),support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){var e=document.createElement("div").style;return"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e}(),flexbox:function(){for(var e=document.createElement("div").style,a="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),t=0;t<a.length;t++)if(a[t]in e)return!0}(),observer:function(){return"MutationObserver"in window||"WebkitMutationObserver"in window}()},plugins:{}};for(var t=["jQuery","Zepto","Dom7"],s=0;s<t.length;s++)window[t[s]]&&e(window[t[s]]);var r;r="undefined"==typeof Dom7?window.Dom7||window.Zepto||window.jQuery:Dom7,r&&("transitionEnd"in r.fn||(r.fn.transitionEnd=function(e){function a(i){if(i.target===this)for(e.call(this,i),t=0;t<s.length;t++)r.off(s[t],a)}var t,s=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],r=this;if(e)for(t=0;t<s.length;t++)r.on(s[t],a);return this}),"transform"in r.fn||(r.fn.transform=function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this}),"transition"in r.fn||(r.fn.transition=function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this})),window.Swiper=a}(),"undefined"!=typeof module?module.exports=window.Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return window.Swiper});
//# sourceMappingURL=maps/swiper.jquery.min.js.map
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