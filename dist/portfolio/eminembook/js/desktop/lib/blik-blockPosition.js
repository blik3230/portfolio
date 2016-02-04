/**
 * Функция рассчитывает размеры и позицию передаваемого видео относительно настроек
 * и размеров родительского блока, так же регистрирует обработчик resize у родителя(или окна)
 *
 * !!! для родителя pos-r для video pos-a !!!
 *
 * @param (String) selector - CSS силектор елемента(ов) видео
 * @param (Object) options - настройки обработки
 * @param (String) options.parentRelative - Силектор "относительного 
		родительского" блока, 
		все расчеты делаются относительно его размеров.Он должен быть 
		overflow: hidden.
		Значение по умолчанию "parent" - "относительным родителем" является 
		первый родительский блок.
 * @param (Bool) options.resize - Флаг оброботки события resize у родителя 
		( или у окна, пока не решил)
 * @param (String) options.align - Горизонтальное выравнивание видео 
		относительно родительсого "относительного блока". Если есть 
		обязательная область и её ширина больше ширины "относительного
		родителя", выравнивается не видео а его обязательная область.
		Возможные значения:
		"left" - (по умолчанию) по левому краю. 
		"center" - по центру
		"right" - по правому краю.
 * @param (String) options.valign - Вертикальное выравнивание видео 
		относительно "относительного родителя". Если есть обязательная область и её высота больше высоты "относительного
		родителя", выравнивается не видео а его обязательная область.
		Возможные значения:
		"top" - (по умолчанию) по верхнему краю. 
		"center" - по центру
		"bottom" - по нижнему краю.

 * @param (Object) options.requiredArea - Настройка области каторая 
		обязательно должна вмещатся в экран.
		Поумолчанию null - все расчитывается относительно видео.
 * @param (Int) options.requiredArea.size - Размер видео относительно 
		которого делается расчет.
		// todo: По умлчанию равен нулю - берется фактический размер видео.
 * @param (Int) options.requiredArea.width - ширина обязательной области
 * @param (Int) options.requiredArea.height - высота обязательной области
 * @param (Int) options.requiredArea.top - позиция области по оси y 
		относительно верхнего края видео.
 * @param (Int) options.requiredArea.left - позиция области по оси x 
		относительно левого края видео.
 * @param (Int) options.requiredArea.minWidth - минимальная ширина 
		обязательной области при ее масштабировании, высота расчитывается пропорционально 
 * 				
 */
var bgVideo3230 = function(selector, options){
	var elsVideo;
	var settings = {
		resize: true,
		parentRelative: "parent", 
		align: "left",
		valign: "top",
		requiredArea: null
	}

	var extend = function(out) {
	  out = out || {};

	  for (var i = 1; i < arguments.length; i++) {
		if (!arguments[i])
		  continue;

		for (var key in arguments[i]) {
		  if (arguments[i].hasOwnProperty(key))
			out[key] = arguments[i][key];
		}
	  }

	  return out;
	};

	if (options) {
		settings = extend({}, settings, options);		
	}

	var checkAreaInParent = function(scalingArea, parentWidth, parentHeight){
		if(scalingArea.width > parentWidth || scalingArea.height > parentHeight){
			return false;
		}
		return true;
	}

	/*  возврашает размеры и координаты отмасштабирываной области 
	 *  если область не определена вернет false(?)
	*/
	var areaScaleFromVideo = function(scalingVideoWidth){
		
		var factor = scalingVideoWidth/settings.requiredArea.size;
		var scalingResult = { width: 0, height: 0, top: 0, left: 0};
		for (key in scalingResult) {
			scalingResult[key] = settings.requiredArea[key]*factor;
		}
		return scalingResult;
	}

	var videoScaleFromArea = function(videoWidth, videoHeight, parentWidth){
		var resultVideoScale = { width: 0, height: 0, top: 0, left: 0},
			areaWidth = parentWidth,
			areaHeight = (parentWidth/settings.requiredArea.width)*settings.requiredArea.height;

		//расчитываю размеры и позицию видео;
		resultVideoScale.width = (settings.requiredArea.size/settings.requiredArea.width)*areaWidth;
		resultVideoScale.height = (videoHeight/videoWidth)*resultVideoScale.width;

		var factor = areaWidth/settings.requiredArea.width;
		resultVideoScale.left = -settings.requiredArea.left*factor;
		resultVideoScale.top = -settings.requiredArea.top*factor;

		return resultVideoScale;
	};

	/*  возврашает расмеры видео отмасштабирываного под размер родителя */
	var videoScale = function(elVideo, elParentRelative){
		var videoWidth = elVideo.videoWidth,
			videoHeight = elVideo.videoHeight,
			parentWidth = elParentRelative.clientWidth,
			parentHeight = elParentRelative.clientHeight,
			resultVideoScale = {};

		// определяю по какой стороне масштабирывать
		resultVideoScale.width = (videoWidth/videoHeight) * parentHeight;
		resultVideoScale.height = parentHeight;

		if (resultVideoScale.width < parentWidth){ // ширина видео 100% ширины родителя
			resultVideoScale.width = parentWidth;
			resultVideoScale.height = (videoHeight/videoWidth)*parentWidth;
			resultVideoScale.left = 0;   // потому, что ширина род. равна шир. видео	
			switch (settings.valign) {
				case "bottom":
					resultVideoScale.top = parentHeight - resultVideoScale.height;
					break;
				case "center":
					resultVideoScale.top = (parentHeight - resultVideoScale.height)/2;
					break;
				default:
					// "top" and other
					resultVideoScale.top = 0;
			}

		} else {  // высота видео 100% высоты родителя расчет проводится до if

			resultVideoScale.top = 0; // потому, что высота род. равна высоте видео

			switch (settings.align) {
				case "right":
					resultVideoScale.left = parentWidth - resultVideoScale.width;
					break;
				case "center":
					resultVideoScale.left = (parentWidth - resultVideoScale.width)/2;
					break;
				default:
					// "left" and other
					resultVideoScale.left = 0;    		    	
			}
		}

		if (settings.requiredArea){
			// получаю координаты области
			var resultAreaScale = areaScaleFromVideo(resultVideoScale.width); 

			// проверяю влезает ли область в родителя с учетом выравнивания 
			// если нет возвращаю новые координаты для видео
			if ( checkAreaInParent(resultAreaScale, parentWidth, parentHeight) ){
				// высчитать новые координаты видео, чтобы область влазила 
				// в родителя и выровнялась по настройкам.
				if ( resultAreaScale.left < -resultVideoScale.left){
					resultVideoScale.left = -resultAreaScale.left; // сделать выравнивание center и right
				} else if (resultAreaScale.left + resultAreaScale.width > -resultVideoScale.left + parentWidth){
					resultVideoScale.left -= (resultAreaScale.left + resultAreaScale.width)-(- resultVideoScale.left + parentWidth);
				}

				if ( resultAreaScale.top < - resultVideoScale.top){
					resultVideoScale.top = -resultAreaScale.top;
				} else if (resultAreaScale.top + resultAreaScale.height > -resultVideoScale.top + parentWidth){
					resultVideoScale.top -= (resultAreaScale.top + resultAreaScale.height)-(- resultVideoScale.top + parentWidth);
				}

			} else {
				// облость больше размеров родителя
				resultVideoScale = videoScaleFromArea(videoWidth, videoHeight, parentWidth);
				resultVideoScale.parentHeight = true;
			}
		}

		return resultVideoScale;
	};

	var setVideo = function(elVideo, elParentRelative){

		var result = videoScale(elVideo, elParentRelative);      

		elVideo.width = result.width;
		elVideo.height = result.height;

		elVideo.style.left = result.left+"px";
		elVideo.style.top = result.top+"px";

		if (result.parentHeight) {
			elParentRelative.style.height = (result.height+result.top)+"px";
		} else {
			elParentRelative.removeAttribute("style");			
		}

		elVideo.classList.add('active');
		
	};


	var getParentBySelector = function(el, parentClass){  // todo: неправельно сверяет имя класса, если их больше 1-го у эл-та
		if (parentClass  == "parent"){
			return el.parentNode
		} else {
			if (el.parentNode.className == parentClass){
				return el.parentNode
			}
			if (el.parentNode.tagName.toLowerCase() != 'body'){
				getParentBySelector(el.parentNode, parentClass);
			} else {
				return false;
			} 			 
		}
	};

	var init = function(){
		elsVideo = document.querySelectorAll(selector);
		var i = 0, elParentRelative, video;

		do{
			elParentRelative = getParentBySelector(elsVideo[i], settings.parentRelative);
			setVideo(elsVideo[i], elParentRelative);
			i++;
		}while(i<elsVideo.length);

		if(settings.resize) {
			Event.add(window, 'resize', function () {
				var i=0;
				do {
					elParentRelative = getParentBySelector(elsVideo[i], settings.parentRelative);
					setVideo(elsVideo[i], elParentRelative);
					i++;
				} while(i<elsVideo.length);
			});
		}
	};

	Event.add(document.querySelectorAll(selector)[0], 'canplay', function () { // should add loop
		init();
	});
};


var options = {
	resize: true,
	align: "center",
	valign: "center"
};

bgVideo3230('#b-home video', options);
bgVideo3230('#b-last video', options);


// todo: может переписать плагин под jQuery ?