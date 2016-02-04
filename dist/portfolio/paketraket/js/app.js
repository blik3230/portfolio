(function($){
    // размер блока fl-scrn = размеру экрана
    var sizeBlock = function(){
        var $window = $(window),
            wWidth = $window.width(),
            wHeight =  $window.height();

        $('.fl-scrn').css({
            width: wWidth,
            height: wHeight
        });
    }; 

	$(document).ready(function(){
	   //placeholder
        var $inputs = $('form input[type=text]');
        if($inputs[0]){
            $inputs.each(function(){
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
        }               

        //for navigation
        $(".top-nav").scrollToElement({
            //topBlock: $(".top-line")
        });

        // for form
        $(".contacts form").formMaster();

        // toBottom
        $(".btn-bottom").on('click', function(){
            console.log("asd");
            $('.top-nav li').eq(0).find('a').click();
        });

        //for reviews
        $(".reviews li").each(function(){
            var $then = $(this);
            if($then.find('.wrap-reviews').height()>$then.height()){
                $then.addClass('more');
            }
        });

        // scroll to about
        $(".btn-btn-play").click(function(){
            $(".audio").get(0).play();
        });

        // sizing
        sizeBlock();
	});

    $(window).resize(function(){
        // sizing
        sizeBlock();
    });

	$(window).load(function(){
        $('.slider').libriSlider({
            slide: "[class^='slide-']",
            arrow: true
        });
	});

})(jQuery);


