// для обязательных полей добавить присвоить required
// блоку который высвечивается после отправки присвоить класс send-block
// для включении проверки формы data-type = email
// для включении проверки номера data-type = phone

(function($){

	jQuery.fn.libriform = function(options){

	// BEGIN plagin options
		options = $.extend({
			parentClass: true,
			singleError: true,
			blockError: true,
			nextBlock: '.send-block',
			success: function(html){
				form.fadeOut(100, function(){
					form.next(nextBlock).addClass('active').fadeIn(100, function(){
						form.trigger("reset");
					});
				});
			}
		}, options);
	// END plagin options

			var form = $(this),

				inputs = form.find('input.required'),
				inputsVal = [],

				regexMail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,

				regexPhone = /\b[+]?[-0-9\(\) ]{7,20}\b/,

				error = false,

				submitClick = false;

			inputs.each(function(index) {
				inputsVal.push($(this).val());
				$(this).data('index', index);
			});

			var parentClass = options.parentClass,
				blockError = options.blockError,
				singleError = options.singleError,
				nextBlock = form.next(options.nextBlock);

			function errorActive(element) {
				element.addClass('error');

				if (parentClass) {
					element.parent().addClass('error');
				}

				if (blockError) {
					form.addClass('error');
				}

				error = true; // определяем индекс ошибки  
			}

		inputs.each(function() {

			this.oninput = function() {

				if (submitClick) {
					unError($(this));
					inputError(this, $(this).data('index'));
				}

			};
		});

		form.submit(function(){

			submitClick = true;

			inputs.each(function(index, element) {
				unError($(element));
				inputError(element, index);
			});

			if(!error){ // если ошибок нет то отправляем данные
				var str = form.serialize();

				error = true;

				$.ajax({
					type: "POST",
					url: "./report.php",
					data: str,
					// Выводим то что вернул PHP
					success: options.success
				});
			}
			return false;
		});
// END проверка формы

		nextBlock.find('button').click(function(){

			nextBlock.removeClass('active').fadeOut(100, function(){
				form.fadeIn(100);
			});

			error = false;
		});

		function unError(element) {

			element.removeClass('error');

			if (parentClass) {
				element.parent().removeClass('error');
			}

			if (blockError) {
				form.removeClass('error');
			}

			error = false;
		}

		function inputError(element, index) {

				var $this = $(element);
				var thisFirstVal = inputsVal[index];

				if ( !singleError || (!error && singleError) ) {

					if (!$this.attr('data-type')) {

						if ($this.val() == thisFirstVal) {
							errorActive($this);
						}
					}

					if ($this.attr('data-type') == 'email') {

						if ($this.val() == thisFirstVal || !regexMail.test($this.val())) {
							errorActive($this);
						}
					}

					if ($this.attr('data-type') == 'phone') {

						if ($this.val() == thisFirstVal || !regexPhone.test($this.val())) {
							errorActive($this);
						}
					}
				}
		}

	}

})(jQuery);