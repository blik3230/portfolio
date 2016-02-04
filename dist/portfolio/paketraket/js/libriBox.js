(function($){

	jQuery.fn.libriBox = function(options){

		var wFlagBox=[],
			hFlagBox=[],
			$boxWrap = $(this),
			$box = $('.libribox__box'),
			$boxBg = $('.libribox__overlay'),
			$boxBind = $('.libri-boxBind');

		$box.each(function(boxId){
			$box = $(this);
			wFlagBox[boxId]=true;
			hFlagBox[boxId]=true;
			boxCenter(boxId);
			$boxWrap.css({
				width: '100%',
				height: '100%',	
				position: 'fixed',
				zIndex: 999,
				left: 0,
				top: 0,
				opacity: 0,
				visibility: 'hidden'
			});
			$boxBg.css({
				width: '100%',
				height: '100%',	
				position: 'absolute',
				left: 0,
				top: 0,
			});
			$box.css({
				position: 'absolute',
				top: '50%',
				left: '50%',
				marginTop: - ( $box.height()/2 ),
				marginLeft: - ( $box.width()/2 )
			});
			ordinalNumber = $box.index($box)+1;
			$box.attr('data-number', ordinalNumber);
		});
		
		$boxBind.click(function() {
			$boxWrap.eq($(this).attr('data-number')).css({'visibility': 'visible'}).fadeTo(500, 1);
			$boxWrap.eq($(this).attr('data-number')).fadeIn();
		});

		$('.libribox__close').click(function() {
			$boxWrap.fadeOut();
		});

		function boxCenter(boxId){
			if($(window).width()<$box.eq(boxId).width()){
				if(wFlagBox[boxId]){
					$box.eq(boxId).css({
						position: 'absolute',
						left: 0,
						marginLeft: 0
					});
					wFlagBox[boxId]=false;
				}
			} else{
				if(!wFlagBox[boxId]){
					$box.eq(boxId).css({
						position: 'fixed',
						left: '50%',
						marginLeft: - ( $box.width()/2 )
					});
					wFlagBox[boxId]=true;
				}
			}
			if($(window).height()<$box.eq(boxId).height()){
				if(hFlagBox[boxId]){
					$box.eq(boxId).css({
						position: 'absolute',
						top: 0,
						marginTop: 0
					});
					hFlagBox[boxId]=false;
				}
			} else{
				if(!hFlagBox[boxId]){
					$box.eq(boxId).css({
						position: 'fixed',
						top: '50%',
						marginTop: - ( $box.height()/2 )
					});
					hFlagBox[boxId]=true;
				}
			}
		}

		$(window).resize(function() {
			$box.each(function(boxId){
				boxCenter(boxId);
				
				if( !( $(window).width()<$box.eq(boxId).width() ) ){

					$box.eq(boxId).css({
						marginLeft: - ( $box.width()/2 )
					});

				};

				if($(window).height()<$box.eq(boxId).height()){

					$box.eq(boxId).css({
						marginTop: - ( $box.height()/2 )
					});

				}
			});
		});

	};

	$(document).ready(function() {
		$('.libribox').libriBox();
	});
	
})(jQuery);