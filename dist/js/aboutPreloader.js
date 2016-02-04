'use strike'

var elAbout = document.querySelector('.about');
var elBtnAbout = document.querySelector('.btn-nav');
var elCloseAbout = document.querySelector('.btn-close');
var fOpen = true;

function hideAbout () {
	elAbout.classList.add('js-hide');
	showBtnAbout();
	fOpen = false;
}

function showAbout () {
	elAbout.classList.remove('js-hide');
	hideBtnAbout();
	fOpen = true;
}

function hideBtnAbout () {
	elBtnAbout.classList.remove('js-on');
}

function showBtnAbout () {
	elBtnAbout.classList.add('js-on');
}

window.addEventListener("load", function(){
	/*timer = setTimeout(function(){
		hideAbout();
	}, 5000);*/
});

elAbout.addEventListener("mousewheel", function(){
	
	if(fOpen) {
		hideAbout();
	}
	return false;	
});

elBtnAbout.addEventListener("click", function(){
	
	if(!fOpen) {
		showAbout();
	}	
		return false;		
});

elCloseAbout.addEventListener("click", function(){
	
	if(fOpen) {
		hideAbout();
	}	
		return false;		
});

