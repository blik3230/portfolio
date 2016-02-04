(function($){

// Slider pages
	var pagesSliderInit = function(){
		var $wrapPages = $("#wrap-pages");
		var $wrapNav = $(".nav-main");
		var $arrPages = $wrapPages.find(".page");
		var currentPage = 0;
		var fAnim = false;

		//show first page
		$arrPages.eq(0).addClass("current").end().eq(1).addClass("next");
		$wrapNav.find(".item").eq(0).addClass('current');

		//handler navigation
		$wrapNav.find(".item").on("click",function(){
			var $then = $(this);
			var index = $then.index();

			if($then.hasClass('current')||fAnim) return false;

			fAnim = true;
			$wrapNav.find(".item").removeClass('current');
			$then.addClass('current');
			if(index>currentPage){
				nextPage(index);
			}else{
				prevPage(index);
			}			
		});

		var nextPage = function(index){
			$wrapPages.find(".next").removeClass("next");
			
			$arrPages.eq(index).addClass('next')
				.find(".wrap-scroll").jScrollPane();


			setTimeout(function(){
				$wrapPages.find(".next , .prev , .current").addClass("to-left");
				setTimeout(function(){
					$wrapPages.find(".prev").removeClass("prev to-left");
					$wrapPages.find(".current").removeClass("current to-left").addClass("prev");
					$wrapPages.find(".next").removeClass("next to-left").addClass("current");						
					if(index<$arrPages.length){
						$arrPages.eq(index+1).addClass('next');
					}
					fAnim = false;
				},800);
			},10);
			currentPage=index;			
		};
		var prevPage = function(index){

			$wrapPages.find(".prev").removeClass("prev");
			
			$arrPages.eq(index).addClass('prev')
				.find(".wrap-scroll").jScrollPane();


			setTimeout(function(){
				$wrapPages.find(".next , .prev , .current").addClass("to-right");
				setTimeout(function(){
					$wrapPages.find(".next").removeClass("next to-right");
					$wrapPages.find(".current").removeClass("current to-right").addClass("next");
					$wrapPages.find(".prev").removeClass("prev to-right").addClass("current");
					if(index>0){
						$arrPages.eq(index-1).addClass('prev');
					}
					fAnim = false;
				},800);
			},10);
			currentPage=index;	
		};
	};

	// Positioning boxes by units  (for portfolio)
	var calcSizesBlocksForPortfolio = function(){
		var unitWidth,
			unitHeight,
			spaceBetween = 10,// from css .item{ margin left 10px;}
			unitsInRow = 4,
			unitRatio = 2.62,
			arrTestPos;
		
		var calcUnitSize = function(){
			var parentPadding = 100;
			if($(window).width()<1540){
				unitsInRow=2;
			}  
			var parentWidth = Math.round($(".page").innerWidth())-parentPadding-20; // 20 - right scrollbar
			
			unitWidth = parseInt((parentWidth-spaceBetween*unitsInRow)/unitsInRow);
			unitHeight = parseInt(unitWidth/unitRatio); 
		};

		//устанавливает блокам (.item) размеры относительно их классов 
		var setBlocksSizes = function(){
			calcUnitSize();
			$(".list-several-blocks .item").each(function(){
				var width,
					height,
					$this = $(this),
					$wrapText = $this.find(".wrap-text"),
					$wrapImg = $this.find(".wrap-img");

				if($this.hasClass('featured')||$this.hasClass('long')){

					width = unitWidth*2+spaceBetween;
					if($this.hasClass('featured')){
						height = unitHeight*2+spaceBetween;
						$wrapText.width(width-height-10);
						$wrapImg.width(height-22);// 22- inner padding
					}else{
						height = unitHeight;					
						$wrapImg.width(height-22+unitWidth+spaceBetween);// 22- inner padding
						$wrapText.width(unitWidth-unitHeight-10);
					}

				}else{
					width = unitWidth;
					height = unitHeight;
					$wrapText.width(width-height-10);
					$wrapImg.width(height-22);// 22- inner padding
				}

				$this.css({
					width: width+"px",
					height: height+"px"
				});
			});
			
		};

		setBlocksSizes();

	}; // End calcSizesBlocksForPortfolio

	var calcSizesImgForAbout = function(){
		var $imgWrapList = $("#about .wrap-img");
		var parentWidth = Math.round($(".page").innerWidth())-100-20; // 20 - right scrollbar
		var imgListW = Math.round(parentWidth*0.57-20);
		var imgW = Math.round((imgListW-60)/3);
		$imgWrapList.css({
			width: imgW,
			height: imgW
		});
	};

	$(document).ready(function(){
		pagesSliderInit();
		calcSizesBlocksForPortfolio();
		calcSizesImgForAbout();
	});

	$(window).resize(function(){
		calcSizesBlocksForPortfolio(); 
		calcSizesImgForAbout();
		$(".wrap-scroll").jScrollPane();
		
	});

})(jQuery);