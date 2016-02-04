$(function(){

 //    $( window ).scroll(function() {
	// 	if($(this).scrollTop() > 0){
	// 		if($('.other_header').length > 0){
	// 			if($(this).scrollTop() < $('.other_header').next().height()){
	// 				$('.other_header').css('top',Math.abs($('.other_header').next().height() - $(this).scrollTop()));
	// 			}else{
	// 				$('.other_header').css('top', 0);
	// 			}
	// 		}
	// 		$('.top-bar').switchClass('unscrolled','scrolled');
	// 	}else{
	// 		if($('.other_header').length > 0){
	// 			$('.other_header').css('top',Math.abs($('.other_header').next().height() - $(this).scrollTop()));
	// 		}
	// 		$('.top-bar').switchClass('scrolled','unscrolled');
	// 	}
	// });
	
	// $('.your_name, .email, .phone, .message').focusout(function(){
	
	// 	if($('.your_name').val() != '' && $('.email').val() != '' && $('.phone').val() != '' && $('.message').val() != ''){
	// 		$('.contact div input.button.disabled').removeClass('disabled');
	// 	}
	
	// });
	
	$('.form_submit').submit(function(){
		
		event.preventDefault();
		
		var $form = $( this ),
		your_name = $form.find( "input[name='your_name']" ).val(),
		email = $form.find( "input[name='email']" ).val(),
		phone = $form.find( "input[name='phone']" ).val(),
		message = $form.find( "input[name='message']" ).val()
		url = $form.attr( "action" );
	 
		// Send the data using post
		var posting = $.post( url, { your_name: your_name, email: email, phone: phone, message: message } );
		 
		// Put the results in a div
		posting.done(function( data ) {
			$( "#result" ).empty().append( data );
		});
		
		return false;
	
	});

	var checkRequiredFields = function($form){
		var $requiredFields = $form.find(".js-requiredField"),
			$submit = $form.find("input[type='submit']"),
			fEmplyfield = false;

		$requiredFields.each(function(){
			var field = $(this);
			if(!field.val()){
				fEmplyfield = true; 
				return false;
			}
		});

		if(fEmplyfield){
			$submit.attr('disabled','disabled').addClass('disabled');
		}else{
			$submit.removeAttr('disabled').removeClass('disabled');			
		}
	};


	// for accordion
	var accordionInit = function(){
		var $acc =$(".accordion"),
			$accTitle = $acc.find(".acc-title");

			$accTitle.on("click",function(){
				if(!$(this).closest(".item").hasClass("active")){
					$acc.find(".active .acc-body").slideUp();
					$acc.find(".active").removeClass("active");
					$(this).closest(".item").addClass("active");
					$(this).closest(".item").find(".acc-body").slideDown();
				}

			});

	};

	// for .nav-fixed
	var $navFixed = $(".nav-fixed");
	var navFixedOffsetTop = $(".wrap-nav-fixed").offset().top;

	var checkScroll = function(){
		if($('.sum_home').length > 0){// if home page
			if($(this).scrollTop() == 0){
				if(!$navFixed.hasClass("top-nav")){
					$navFixed.addClass("top-nav");
				}
			}else{
				$navFixed.removeClass("top-nav");
			}
		}
		if($(this).scrollTop() > navFixedOffsetTop){
			if(!$navFixed.hasClass("pos-f")){
				$navFixed.addClass("pos-f");
			}
		}else{
			if($navFixed.hasClass("pos-f")){
				$navFixed.removeClass("pos-f");
			}
		}
	};

    $( window ).scroll(function() {
    	checkScroll();
	});

	$( document ).ready(function() {
		checkScroll();
		if($(".brickwork")[0]){
			$(".brickwork").brickwork(portfolioOptions);
			$(".brickwork").brickwork(portfolioOptions); // в хроме проблема со скролом поэтому  вызываю 2 раза для его перерасчета.
		}
		if($(".blog-list")[0]){
			$(".blog-list").brickwork(blogOptions);
			$(".blog-list").brickwork(blogOptions);
		}
		if($(".accordion")[0]){
			accordionInit();
		}


		var $formSubmit = $('.form_submit');
		if($formSubmit[0]){
			$formSubmit.each(function(){
				var $thisForm = $(this);
				checkRequiredFields($thisForm);
				$thisForm.find(".js-requiredField").on("keyup change", function(){
					checkRequiredFields($thisForm);
				});
			});
			
		}		
	});

	$( window ).resize(function() {
		navFixedOffsetTop = $(".wrap-nav-fixed").offset().top;
		if($(".brickwork")[0]){
			$(".brickwork").brickwork(portfolioOptions);
		}
		if($(".blog-list")[0]){
			$(".blog-list").brickwork(blogOptions);
		}
	});

	$navFixed.find(".btn-toggle").on("click",function(){
		$navFixed.toggleClass("show");
	})

	// init brickwork

	// для проверки вмещается ли текст в wrap-text на странице блог
	var AfterCulculation = function($item){
		$wrapText = $item.find(".wrap-text");
		$innerText = $item.find(".inner-text");

		var $limiter = $item.find(".limiter").removeAttr("style");
		var $readmore = $item.find(".readmore").removeAttr("style");
		
		if($innerText.height()>$wrapText.height()){
			$limiter = $item.find(".limiter");
			$readmore = $item.find(".readmore");
			var lineHeight = Math.round(parseFloat($item.find("p").css("lineHeight")));
			var limiterHeight = parseInt($limiter.height()/lineHeight)*lineHeight;
			$limiter.height(limiterHeight);
			$readmore.css("display","block");
		}else{

		}
	};

	var testimonialsTextHeight = function($item , height){
		if ($item.hasClass("testimonials")){
			var maxTextH = height-(50)-$item.find(".comment-footer").height()-15;			
			var lh = Math.round(parseFloat($item.find(".comment-body").css("line-height")));
			var commentBodyH = parseInt(maxTextH/lh)*lh;
			console.log("testimonials "+$item.find(".comment-footer").height());
			$item.find(".comment-body").height(commentBodyH);
		}
	};
	

	var blogOptions = {
		unitRatio: 8/9,
		callAfterCulculation : AfterCulculation
	};

	var portfolioOptions = {
		callAfterCulculation : testimonialsTextHeight
	};

});