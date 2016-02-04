;(function($){
	$(document).ready(function () {
		$('#js-btn-call').on('click', function() {

			var curPos = window.pageYOffset || document.documentElement.scrollTop,
				height = $('#b-form').offset().top,
				scrollTime = Math.abs(height-curPos) / 1.73;

			$("body,html").stop().animate({"scrollTop":height},scrollTime);
		});

		$('#js-form').libriform({
			singleError: false
		});

		$('.modal-callback form').libriform({
			singleError: false,
			success: function(){
				$('.modal-callback .modal__close').click();
			}
		});

		$('#js-form .btn').click(function(event) {
			setTimeout(function(){
				document.getElementById('js-form').classList.remove('error');
			}, 500);
		});
	});
})(jQuery);