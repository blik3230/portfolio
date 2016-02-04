(function ($) {
	var current,fPlay,$player,$listAudio,$listBtnSong,$fixedbar,interval,
		$fixedbarBtnPlay,$fixedbarName,names=[],
		init = function(){
			current = 0;
			fPlay = false;
			$player = $('.player');
			$songs = $player.find('.song');
			$listAudio = $player.find('audio');
			$listBtnSong = $player.find('.btn-play');
			$fixedbar = $('.fixedbar');
			$fixedbarBtnPlay = $fixedbar.find('.btn-play');	
			$fixedbarName = $fixedbar.find('.name');


			$songs.each(function(index){
				$then = $(this);
				names.push($then.find('.name').text());
				console.log('+');
				$then.find('audio').get(0).onloadedmetadata =function(){					
					initSongTime(index,parseInt(this.duration));
					console.log(this.preload);
				};
				//$then.find('.time').text(getAllTime(index));

				$listBtnSong.eq(index).on('click',function(){
					if(fPlay && current==index){
						pause();
					}else if(fPlay){
						pause();
						play(index);
					}else{
						play(index);
					}
				});
			});


			$fixedbarName.text(names[current]);
			$fixedbarBtnPlay.on('click',function(){
				if(fPlay){
					pause();
				}else{
					play(current);
				}
			});
			$fixedbar.find('.btn-prev').on('click',prev);
			$fixedbar.find('.btn-next').on('click',next);
		},
		play = function(index){
			$listAudio.get(index).play();
			fPlay = true;
			current = index;
			$listBtnSong.eq(current).add($fixedbarBtnPlay).addClass('pause');
			$fixedbarName.text(names[current]);

			setSongTime(index);
			setFixedbarTime(index);

			interval = setInterval(function(){
				setSongTime(index);
				setFixedbarTime(index);

			},1000);
		},
		pause = function(){			
			$listAudio.get(current).pause();
			$listBtnSong.eq(current).add($fixedbarBtnPlay).removeClass('pause');
			fPlay = false;
			clearInterval(interval);
		},
		prev = function(){
			pause();
			if(current==0){
				play($listAudio.length-1);
			}else{
				play(current-1);
			}
		},
		next = function(){
			pause();
			if(current==$listAudio.length-1){
				play(0);
			}else{
				play(current+1);
			}
		},
		initSongTime = function(index,duration){
			var time = secToMin(Math.round($listAudio.get(index).currentTime));

			$songs.eq(index).find('.time').text(time);
			$songs.eq(index).find('.alltime').text(secToMin(duration)).closest('.wrap-time').css({display: 'block'});
			if(index==0){
				$fixedbar.find('.time').text(time);
				$fixedbar.find('.alltime').text(secToMin(duration)).closest('.wrap-time').css({display: 'block'});
			}
			//return $listAudio.get(index).duraction;
		},
		secToMin = function(sec){
			var dInt = parseInt(sec/60),
				dFloat = sec%60;
				if(dFloat.toString().length==1) dFloat = '0'+dFloat;
			console.log(dFloat.toString().length);
			return dInt+'.'+dFloat;
		},
		setSongTime = function(index){
			var audio = $listAudio.get(index);
			if( audio.currentTime == audio.duration){
				audio.currentTime=0;
				pause();
			}
			$songs.eq(index).find('.time').text(secToMin(Math.round(audio.currentTime)));
			$songs.eq(index).find('.playbar').width((audio.currentTime/(audio.duration/100))+'%');
		},
		setFixedbarTime = function(index){
			var audio = $listAudio.get(index);
			$fixedbar.find('.time').text(secToMin(Math.round($listAudio.get(index).currentTime)));
			$fixedbar.find('.playbar').width((audio.currentTime/(audio.duration/100))+'%');
		};

	$(document).ready(function(){
		init();		
	});
})(jQuery);