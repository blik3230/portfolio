(function($){
	// plaseholder of all input
    $('input[type=text], textarea').each(function(){
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
	
	var $greyBg = $('.grey-bg'),
		$modal = $greyBg.find('.modal'),
		$modalHead = $greyBg.find('.m-head'),
		$modalBody = $greyBg.find('.m-body'),
		$modalForm = $('.modal-form').detach();
		$btnClose = $greyBg.find('.btn-close'),
		$btnInfo = $('.infoblock .btn-modal'),
		$btnOrder = $('.range .btn-order'),
		$btnStock = $('.stock .btn-order');

	var showModal = function(){		
		$modal.css({
			display: 'block',
			visibility: 'hidden'
		});
		$greyBg.fadeIn(400, function() {
			$modal.css({
				top: ($(window).height()-$modal.height())/2,
				display: 'none',
				visibility: 'visible'
			});
			$modal.slideDown(400);
		});
	};
	var hideModal = function(){
		$modal.slideUp(400, function(){
			$greyBg.fadeOut(400, function(){
				$modal.attr('style','').removeClass('small');
			});
		});
		return false;
	};

	var createForm = function($cloneEl){		
		$cloneEl.find('.additional-images, .btn-order').remove();
		$cloneEl.find('.price').appendTo($cloneEl);
		$modalHead.html($cloneEl.html());
		$modalBody.empty().append($modalForm);
		$modal.addClass('small');
		$modalForm.find('input[name=product]').val($modalHead.find('h3').text());
		$modalForm.find('input[name=price]').val($modalHead.find('.price').text());
	};

	$btnInfo.on('click',function(){
		var $el = $(this),
			href = $el.attr('href'),
			title = $el.html().replace(/<br[/]?>/g,' ');
		$modalHead.html(title);
		$modalBody.html($(href).html());
		showModal();
		return false;
	});

	$btnOrder.on('click',function(){
		var $cloneEl = $(this).closest('.item').clone();
		createForm($cloneEl);		
		showModal();
		return false;
	});

	$btnStock.on('click',function(){
		var $el=$(this);
		var href = $(this).attr('href');
		
		if($(href).hasClass('item')){
			createForm($(href).clone());		
			showModal();
		}		
		return false;
	});

	$btnClose.add($greyBg).on('click',hideModal);
	$modal.on('click',function(){return false;});

	$modal.on('click','button',function(){
		var form = $(this).closest('form');
		$.ajax({
            type: "POST",
            url: "report.php",
            data: form.serialize()+'&send=1',           
            success: function(html) {            
                form.find('.msg').html(html);
            }
        });		
		return false;
	});

	$('footer form').submit(function() {
		var form = $(this);
		$.ajax({
            type: "POST",
            url: "report.php",
            data: form.serialize()+'&send=2',
            success: function(html) {
                form.find('.msg').html(html);
            }
        });		
		return false;
	});

	$('.additional-images a').on('click',function(){
		var el = $(this),
			item = el.closest('.item'),
			mainImg = item.find('.main-img');

		mainImg.attr('src',el.find('img').attr('src'));
		return false;
	});

	$(window).ready(function(){
		$('header ul').scrollToElement();
		$('.item a').fancybox();
	});


})(jQuery);