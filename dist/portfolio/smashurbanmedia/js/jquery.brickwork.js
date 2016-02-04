(function($){
	$.fn.brickwork = function(options){
		var settings = $.extend( {
			spaceBetween : 0,
			unitRatio : 16/9,
			callAfterCulculation : null,
			responsSize : [
			{
				maxScreenWidth : 9999,
				minScreenWidth : 1441,
				unitInRow : 4
			},
			{   
				maxScreenWidth : 1440,
				minScreenWidth : 961,
				unitInRow : 3
			},
			{  
				maxScreenWidth : 960,
				minScreenWidth : 0,
				unitInRow : 2
			}]
		}, options);
		
		return this.each(function() {
			var $this = $(this),
				$items = $this.find(".item:visible"),
				parrentWidth,
				unitWidth,
				unitHeight,
				curNumUnitsInRow,
				gridBuffer=[],
				gridView = [],
				curPos = 0,
				arrBlocks = [];
			
			var initSizeGrid = function(){
				parrentWidth = $this.width();
				for(var i=0; i<settings.responsSize.length ; i++){
					if(parrentWidth >= settings.responsSize[i].minScreenWidth && parrentWidth <= settings.responsSize[i].maxScreenWidth){
						curNumUnitsInRow = settings.responsSize[i].unitInRow;
					}
				}
			
				unitWidth = parseInt((parrentWidth-(settings.spaceBetween*(curNumUnitsInRow-1)))/curNumUnitsInRow);
				unitHeight = Math.round(unitWidth/settings.unitRatio);					
			};
			
			var Block = function($block,index){
				this.index = index;
				
				if($block.hasClass("big")){
					this.type = "big";
				}else if($block.hasClass("long")){
					this.type = "long";
				}else{
					this.type = "item";
				}        
				
			}
			
			var blocksInit = function(){
				$items.each(function(i){
					arrBlocks.push(new Block($(this),i));
				});
			};
			
			var checkPos = function(pos,type){
				if(gridView[pos]){return false;}
				switch(type){
					case "long":
					case "big":
						if(pos%curNumUnitsInRow==curNumUnitsInRow-1)return false;
						if(gridView[pos+1])return false;
					case "item":
						return true;
				}
				if(type=="item")return true;
				return true;
			};
			
			var setBlockInGridView = function(pos,type,index){
				gridView[pos]=index; //pos x y
		  		switch(type){
					case "big":            
						gridView[pos+curNumUnitsInRow]=index; // pos x y+1 
						gridView[pos+curNumUnitsInRow+1]=index; // pos x+1 y+1 
					case "long":
						gridView[pos+1]=index;// pos x+1 y
						break;
				}
			};
			
			var setCurPos = function(){
				do{
					curPos++;
				}while(gridView[curPos]!==undefined)
			};
			
			var placementOfBlocks = function(){
				for(var i=0;i<arrBlocks.length; i++){
					// Если буфер не пустой
					if(gridBuffer.length){
						for(var j=0; j<gridBuffer.length ;j++){
							if(checkPos(curPos,arrBlocks[gridBuffer[j]].type)){
								arrBlocks[gridBuffer[j]].pos = curPos;
								setBlockInGridView(curPos, arrBlocks[gridBuffer[j]].type, arrBlocks[gridBuffer[j]].index);
								setCurPos();
								gridBuffer.splice(j--,1); 
							}							
						}
					}   
					
					if(checkPos(curPos,arrBlocks[i].type)){
						arrBlocks[i].pos = curPos;
						setBlockInGridView(curPos, arrBlocks[i].type, arrBlocks[i].index);
						setCurPos();
					}else{
				 		var prevBlockId = gridView[curPos-1];
					 	if(curPos%curNumUnitsInRow && arrBlocks[prevBlockId].type=="item"){
					 		gridBuffer.unshift(arrBlocks[prevBlockId].index);
					 		arrBlocks[i].pos = curPos-1;
					 		setBlockInGridView(curPos-1, arrBlocks[i].type, arrBlocks[i].index);
					 		setCurPos();
					 	}else{
							gridBuffer.push(arrBlocks[i].index);
					 	}
					}
					
					 
					if(i+1==arrBlocks.length&&gridBuffer.length){
						for(var j=0; j<gridBuffer.length ;j++){
							while(!checkPos(curPos,arrBlocks[gridBuffer[j]].type)){									
								setCurPos();
							}
							arrBlocks[gridBuffer[j]].pos = curPos;
							setBlockInGridView(curPos, arrBlocks[gridBuffer[j]].type, arrBlocks[gridBuffer[j]].index);
							setCurPos();
							gridBuffer.splice(j--,1); //length уменьшился поэтому отнял от j 1 !!!!!!!!							
						}
					}
					
				}

			};
			
			var unitToPx = function(){
				$items.each(function(i){
					var $thisItem = $(this);
					var width,
						height,
						left,
						top;
					switch(arrBlocks[i].type){
						case "big":
							width = unitWidth*2+settings.spaceBetween;
							height = unitHeight*2+settings.spaceBetween;
							break;
						case "long":
							width = unitWidth*2+settings.spaceBetween;
							height = unitHeight;
							break;
						case "item":
							width = unitWidth;
							height = unitHeight;
							break;
					}
					
					top = ((parseInt(arrBlocks[i].pos/curNumUnitsInRow)) * unitHeight)+(settings.spaceBetween*parseInt(arrBlocks[i].pos/curNumUnitsInRow));
					left = ((arrBlocks[i].pos%curNumUnitsInRow) * unitWidth)+(settings.spaceBetween*(arrBlocks[i].pos%curNumUnitsInRow));

					$thisItem.css({
						width: width,
						height: height,
						top: top,
						left: left
					});
					
					if(settings.callAfterCulculation){
						settings.callAfterCulculation($thisItem,height);						
					}
				});//end each

				var numUnitHeight = parseInt(((gridView.length-1)/curNumUnitsInRow+1));
				var parentHeight =numUnitHeight*unitHeight+((numUnitHeight-1)*settings.spaceBetween);
				$this.height(parentHeight);
			}; 
			
			initSizeGrid();
			blocksInit();
			placementOfBlocks();
			unitToPx();
		});
	}; // $.fn.brickwork	

	
	
})(jQuery);