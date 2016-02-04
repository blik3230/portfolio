(function($){

	jQuery.fn.libribox = function(options){

		// BEGIN plagin options

		options = $.extend({
		    backgroundColor: 'rgba(0, 0, 0, .5)'
		}, options);

		// END plagin options

		var wFlagBox=[],
			hFlagBox=[],
		    backgroundColor = options.backgroundColor,
			$boxWrap = $(this),
			$box = $('.modal__box'),
			$boxBg = $('.modal__overlay'),
			$boxBind = $('.modal__bind'),
			$boxClose = $('.modal__close');

		$box.each(function(boxId){

			var $thisBox = $(this);

			wFlagBox[boxId]=true;
			hFlagBox[boxId]=true;
			$boxWrap.css({
				width: '100%',
				height: '100%',	
				position: 'fixed',
				zIndex: 999,
				left: '-100%',
				top: '-100%',
				opacity: 0,
				visibility: 'hidden'
			});
			$boxBg.css({
				width: '100%',
				height: '100%',	
				position: 'absolute',
				left: 0,
				top: 0,
				backgroundColor: backgroundColor
			});
			$thisBox.css({
				position: 'absolute',
				top: '50%',
				left: '50%',
				marginTop: - ( $thisBox.innerHeight()/2 ),
				marginLeft: - ( $thisBox.innerWidth()/2 )
			});
			boxCenter(boxId);
		});
		
		$boxBind.click(function() {
			console.log('btn');
			$boxWrap.eq($(this).attr('data-number') - 1).css({
				'visibility': 'visible',
				left: 0,
				top: 0
			}).fadeTo(500, 1).fadeIn();
		});

		$boxClose.click(function() {
			$boxWrap.fadeOut();
		});

		function boxCenter(boxId){

			var $thisBox = $box.eq(boxId);
			
			if($(window).width()<$thisBox.innerWidth()){
				if(wFlagBox[boxId]){
					$thisBox.css({
						position: 'absolute',
						left: 0,
						marginLeft: 0
					});
					wFlagBox[boxId]=false;
				}
			} else{
				if(!wFlagBox[boxId]){
					$thisBox.css({
						position: 'fixed',
						left: '50%'
					});
					wFlagBox[boxId]=true;
				}
				$thisBox.css({
					marginLeft: - ( $thisBox.innerWidth()/2 )
				});
			}
			if($(window).height()<$thisBox.innerHeight()){
				if(hFlagBox[boxId]){
					$thisBox.css({
						position: 'absolute',
						top: 0,
						marginTop: 0
					});
					hFlagBox[boxId]=false;
				}
			} else{
				if(!hFlagBox[boxId]){
					$thisBox.css({
						position: 'fixed',
						top: '50%'
					});
					hFlagBox[boxId]=true;
				}
				$thisBox.css({
					marginTop: - ( $thisBox.innerHeight()/2 )
				});
			}
		}

		$(window).resize(function() {
			$box.each(function(boxId){
				boxCenter(boxId);
			});
		});

	};

	$(window).load(function() {
		$('.libribox').libribox();
	});
	
})(jQuery);