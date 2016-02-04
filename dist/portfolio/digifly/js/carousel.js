(function ($) {
	$(document).ready(function(){
	// Непрерывная карусель партнеров
		var slides=$("#carousel li").detach(),
			carUl=$("#carousel ul");

		var curSlides=slides.eq(0).clone();
		carUl.append(curSlides.eq(0));

		var tmpWidth=curSlides.eq(0).width(),
			moveSlide=curSlides.eq(0),
			visWidth=$("#carousel").width(),
			i=1;
		do{
			if(i>slides.length-1){
				i=0;
			}
			var tmpSlide=slides.eq(i).clone();
			tmpSlide.appendTo(carUl);
			//console.log(i);
			curSlides.add(tmpSlide);
			console.log(curSlides.length);
			tmpWidth+=tmpSlide.width();
			i++;
		}while(tmpWidth<visWidth+moveSlide.width());
			console.log(moveSlide);


		move=function(){//устанавливаем ширину карусели, и ширину остатка
		var moveSlide=$("#carousel li").eq(0);			
			moveSlide.css({
				marginLeft: "-=1"
			});
			if(-parseInt(moveSlide.css("marginLeft"))>=moveSlide.width()){
				tmpWidth-=moveSlide.width();
				moveSlide.remove();
				if(i>slides.length-1){
					i=0;
				}
				$("#carousel ul").append(slides.eq(i).clone())
				i++;
			}
		}
		setInterval(move,20);

	});
})(jQuery);