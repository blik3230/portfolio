;
var BeatconMultiVideoPlayer = function(){
	var b = this,
		img = new Image();

	var options = {
		unit: {
			top: 5,
			left: 1,
			width: 10,
			height: 10
		}
	};

	b.init = function () {
		img.src = './media/img/pg-home/b-progress-bar/statusbar.png';
		img.onload = function() {
			multiVideoPlayer.init() // start 
		};
		window.addEventListener('resize', this.handlerResize);
	};

	b.handlerResize = function () {
		statusBar.resize();		
	};

	b.destruct = function () {
		statusBar.destruct();
		multiVideoPlayer.destruct();
		window.removeEventListener('resize', this.handlerResize);
	};

	var	statusBar = {

		init: function(infoVideos){
			this.infoVideos = infoVideos;
			this.activeUnit = 0;
			this.fHover = false;
			this.canvas = {};
			this.grid = {};
			this.initElem();
			this.initCanvas(this.canvas);
			this.initStatusBarGrid(this.canvas, this.grid);
			this.setLabelPos(this.grid.units);
			this.initHandlers();
		},

		initElem: function() {
			this.canvas.elem = document.getElementById('statusbar');
			this.canvas.ctx = this.canvas.elem.getContext('2d');

			this.labels = document.getElementById('labels-group').getElementsByClassName('e-label');
		},

		resize: function() {
			this.initCanvas(this.canvas);
			this.initStatusBarGrid(this.canvas, this.grid);
			this.setLabelPos(this.grid.units);
		},

		initCanvas: function(canvas){
			canvas.width = canvas.elem.clientWidth;
			canvas.height = canvas.elem.clientHeight;

			// set canvas viewport
			canvas.elem.width = canvas.width;
			canvas.elem.height = canvas.height;
		},

		initStatusBarGrid: function(canvas, grid){
			grid.countUnits = parseInt(canvas.width / (options.unit.width + options.unit.left));
			grid.top = options.unit.top;
			grid.left = 0;
			grid.units = this.getUnits();

			this.drawStausBar(grid, this.activeUnit);

		},

		setLabelPos: function (units) {
			for(var i=0; i<units.length; i++){
				if(!units[i].indexUnitOfVideo){
					this.labels[units[i].indexVideo].style.left = units[i].x+'px';
					this.labels[units[i].indexVideo].classList.add('on');
				}
			}
		},

		initHandlers: function(){

			var canvas = this.canvas;
			var $this = this;

			this.handlerMousemove = function (event) {
				var posX = event.clientX - getOffsetLeft(this);
				var hoverElem = $this.getHoverElem(posX);
				$this.drawStausBar($this.grid, hoverElem-1);  
				$this.fHover = true;
			};

			this.handlerMouseout = function () {
				$this.drawStausBar($this.grid, $this.activeUnit);
				$this.fHover = false;
			};

			this.handlerClick = function (event) {
				var posX = event.clientX - getOffsetLeft(this);
				$this.activeUnit = $this.getHoverElem(posX); 
				$this.drawStausBar($this.grid, this.activeUnit); 
				var unit = $this.grid.units[$this.activeUnit-1]; 
				multiVideoPlayer.playVideo(unit.indexVideo, unit.startTimeVideo);
			};

			this.handlerLabelClick = function () {
				console.log('click to label - ', $(this).index());
			}

			canvas.elem.addEventListener('mousemove', this.handlerMousemove);
			canvas.elem.addEventListener('mouseout', this.handlerMouseout);
			canvas.elem.addEventListener('click', this.handlerClick);

			for (var i = 0; i < this.labels.length; i++) {
				this.labels[i].addEventListener('click', this.handlerLabelClick);
			}
		},
		destruct: function(){
			var canvas = this.canvas;
			canvas.elem.removeEventListener('mousemove', this.handlerMousemove);
			canvas.elem.removeEventListener('mouseout', this.handlerMouseout);
			canvas.elem.removeEventListener('click', this.handlerClick);
		},

		getHoverElem: function(x){
			return Math.ceil( x / (options.unit.width + options.unit.left) );
		},

		createUnit: function(numUnit){
			var grid = this.grid;
			var indexVideo = this.getIndexVideo(numUnit); // индекс видео этого юнита
			var indexUnitOfVideo = numUnit;  // индекс юнита по отношению к его видео

			for (var i = indexVideo; i > 0; i--) {
				indexUnitOfVideo -= this.infoVideos.arrCountUnits[i-1];
			}

			var unit = {
				i: numUnit,
				x: numUnit*(options.unit.width + options.unit.left)+ options.unit.left,
				y: grid.top, // unit.top
				w: options.unit.width,
				h: options.unit.height,
				indexVideo: indexVideo,
				indexUnitOfVideo: indexUnitOfVideo,
				startTimeVideo: this.getStartTimeVideoInUnit(indexVideo, indexUnitOfVideo)
			};

			return unit;
		},

		getUnits: function(){
			var arr = [];
			this.infoVideos = this.setNumberOfUnitsForEachVideo(this.infoVideos, this.grid.countUnits);

			for (var i = 0; i < this.grid.countUnits; i++) {
				arr[i] = this.createUnit(i);
			}
			return arr;
		},

		// высчитываю сколько юнитов занимает каждое видео исходя из его времени,
		// значение приблизительное т.к. проценты округляются и последнее видео занимает
		// отсавщееся количество юнитов.
		setNumberOfUnitsForEachVideo: function(infoVideos, totalCountUnit) {
			var onePercentUnits = totalCountUnit/100;

			for (var i = 0; i < infoVideos.procentesLength.length; i++) {
				if( i!=infoVideos.procentesLength.length-1 ){
					infoVideos.arrCountUnits[i] = Math.round(onePercentUnits * infoVideos.procentesLength[i]);
					totalCountUnit -= infoVideos.arrCountUnits[i];
				} else {
					// last iteration;
					infoVideos.arrCountUnits[i] = totalCountUnit;
				}
			}
			return infoVideos;
		},

		setVideoState: function(indexVideo, timeVideo) {
			var curUnit = this.getCurUnitByTime(indexVideo, timeVideo);
			this.activeUnit = curUnit; ///
			if(!this.fHover){
				this.drawStausBar(this.grid, curUnit); ///
			}
		},

		getCurUnitByTime: function(indexVideo, timeVideo) {
			var infoVideos = this.infoVideos;
			var videoDuration = infoVideos.times[indexVideo];
			var countUnit = infoVideos.arrCountUnits[indexVideo];
			var interval = Math.ceil(videoDuration/countUnit);
			var previousUnits = 0;

			for (var i = 0; i < infoVideos.arrCountUnits.length; i++) {
				if(i < indexVideo){
					previousUnits += infoVideos.arrCountUnits[i];
				}
			}

			return Math.ceil((timeVideo*1000)/interval)+previousUnits-1; /////
		},

		getIndexVideo: function(numUnit) {
			var arrUnitsInVideo = this.infoVideos.arrCountUnits;
			var count = 0;
			for (var i = 0; i < arrUnitsInVideo.length; i++) {
				count += arrUnitsInVideo[i];
				if(numUnit < count){
					return i;
				}
			}
			return i;
		},

		getStartTimeVideoInUnit: function(indexVideo, indexUnitOfVideo) {

			var infoVideos = this.infoVideos;
			var time = infoVideos.times[indexVideo];
			var countUnit = infoVideos.arrCountUnits[indexVideo];
			var interval = Math.ceil(time/countUnit);
			return interval*indexUnitOfVideo;
		},

		drawStausBar: function(grid, indexLastHoverElem){
			var color,
				fHover;

			this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			for (var i = 0; i < grid.units.length; i++) {
				//this.drawUnit(grid.units[i]);
				if(indexLastHoverElem >= i){
					color = '#fff';
					fHover = true;
				} else {
					color = 'rgba(255,255,255,.5)';
					fHover = false;
				}

				if(!grid.units[i].startTimeVideo){
					//this.drawCircle(grid.units[i], color);
					this.drawImgCircle(grid.units[i], fHover);
				} else {
					//this.drawBrace(grid.units[i], color);
					this.drawImgBrace(grid.units[i], fHover);
				}
			}
		},

		drawUnit: function(u){
			var ctx = this.canvas.ctx;
			ctx.strokeRect(u.x, u.y, u.w, u.h);
		},

		drawImgCircle: function(u,fHover){
			var ctx = this.canvas.ctx;
			if(fHover){
				ctx.drawImage(img, 0, 0, 9, 9, u.x, u.y, 9, 9);
			} else {
				ctx.drawImage(img, 9, 0, 9, 9, u.x, u.y, 9, 9);
			}
		},

		drawImgBrace: function(u,fHover){
			var ctx = this.canvas.ctx;
			if(fHover){
				ctx.drawImage(img, 0, 9, 4, 10, u.x+3, u.y, 4, 10);
			} else {
				ctx.drawImage(img, 4, 9, 4, 10, u.x+3, u.y, 4, 10);
			}
		},

		drawCircle: function(u, color){
			var ctx = this.canvas.ctx;

			var centerX = u.x+(u.w/2),
				centerY = u.y+(u.h/2);

			ctx.beginPath();
			ctx.arc(centerX, centerY, u.w/2, 0, Math.PI*2, true);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		},

		drawBrace: function(u, color){
			var p1 = {
				x: u.x + Math.round(u.w / 4),
				y: u.y + 1
			};
			var p2 = {
				x: (u.x + u.w) - Math.round(u.w / 4),
				y: Math.round( u.y + u.h / 2 )
			};
			var p3 = {
				x: p1.x,
				y: u.y + u.h -1
			};

			var ctx = this.canvas.ctx;

			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.lineTo(p3.x, p3.y);
			ctx.strokeStyle = color;
			ctx.strokeWidth = 3;
			ctx.stroke();
			ctx.closePath();
		}

	};	

	var multiVideoPlayer = {

		init: function(){
			this.parentElem = {};
			this.arrVideos = [];
			this.indexCurrentVideo = 0;

			this.initElem();
			this.initHandlers();
			this.checkVideo();
		},
		initElem: function(){
			this.parentElem = document.getElementById('multi-video');
			this.arrVideos = this.parentElem.getElementsByTagName('video');
		},
		checkVideo: function() {			
			var $this = this,
				checkLoadVideo = 0,
				arrVideos = $this.arrVideos;

			for (var i = 0; i < arrVideos.length; i++) {
				$this.arrVideos[i].oncanplay = function(event){
					if(++checkLoadVideo == arrVideos.length){
						statusBar.init($this.getVideosInfo());	
						$this.arrVideos[0].play();				
						$this.arrVideos[0].classList.add('active');		
						statusBar.labels[0].classList.add('active');	
					}
				};
			}
		},
		getVideosInfo: function() {
			var arrVideos = this.arrVideos;
			return {
				count: arrVideos.length,
				times: getArrTimeVideo(arrVideos),
				procentesLength: getArrPercent(arrVideos),
				arrCountUnits: []
			};
		},
		playVideo: function(indexVideo, startTime) {
			var indexCurrentVideo = this.indexCurrentVideo;
			this.arrVideos[indexCurrentVideo].pause();
			this.arrVideos[indexVideo].currentTime = (startTime+1) / 1000;
			this.arrVideos[indexVideo].play();

			
			for(var i = 0; i<statusBar.labels.length; i++){
				statusBar.labels[i].classList.remove('active');
			}			

			this.arrVideos[this.indexCurrentVideo].classList.remove('active');
			this.arrVideos[indexVideo].classList.add('active');
			statusBar.labels[indexVideo].classList.add('active');
			this.indexCurrentVideo = indexVideo;
		},
		initHandlers: function() {
			var $this = this;
			var arrVideos = this.arrVideos;

			this.handlerTimeupdate = function () {
				statusBar.setVideoState($this.indexCurrentVideo, arrVideos[$this.indexCurrentVideo].currentTime);
			};

			this.handlerEnded = function () {
				var nextVideo = ($this.indexCurrentVideo +1 < arrVideos.length)? $this.indexCurrentVideo+1 : 0;
				statusBar.setVideoState(nextVideo, 0);
				$this.playVideo(nextVideo, 0);
			}

			for (var i = 0; i < this.arrVideos.length; i++) {
				this.arrVideos[i].addEventListener('timeupdate', this.handlerTimeupdate);
				arrVideos[i].addEventListener('ended', this.handlerEnded);
			}
		},
		destruct: function(){
			var arrVideos = this.arrVideos;

			for (var i = 0; i < this.arrVideos.length; i++) {
				this.arrVideos[i].removeEventListener('timeupdate', this.handlerTimeupdate);
				arrVideos[i].removeEventListener('ended', this.handlerEnded);
			}
		}
	};


	// получить массив продолжительности каждого виде в миллисекундах
	function getArrTimeVideo(arrVideos) {
		var arr = [];
		for (var i = 0; i < arrVideos.length; i++) {
			arr[i] = arrVideos[i].duration*1000;
		}
		return arr;
	}

	// получить массив продолжительности каждого виде в процентах 
	function getArrPercent(arrVideos) {
		var arr = [],
			total = 0;
		for (var i = 0; i < arrVideos.length; i++) {
			total += arrVideos[i].duration*1000;
		}

		var onePercent = total/100;

		for (var i = 0; i < arrVideos.length; i++) {
			arr[i] = arrVideos[i].duration*1000/onePercent;
		}
		return arr;
	}

	function getOffsetLeft (el) {
		var rect = el.getBoundingClientRect();		
		return rect.left + document.body.scrollLeft;
	}

	return b;
};
