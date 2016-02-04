// для обязательных полей добавить присвоить mandatory
// блоку который высвечивается после отправки присвоить класс send-block
// для включении проверки формы data-type = email
// для включении проверки номера и просто чисел data-type = number

(function($){

    jQuery.fn.formMaster = function(options){

    // BEGIN plagin options
        options = $.extend({
            phoneCheck: true,
            mailCheck: true,
            parentClass: true,
        }, options);
    // END plagin options

            var form = $(this),

                inputs = form.find('input.mandatory'),
                inputsVal = [],

                regexMail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,

                regexNumber = /^(\+?\d+)?\s*(\(\d+\))?[\s-]*([\d-]*)$/;

                error = false;

            inputs.each(function(index) {
                inputsVal.push($(this).val());
            });

            var parentClass = options.parentClass;

            function errorActive(inputError) {
                inputError.addClass('error');

                if(parentClass) {
                    inputError.parent().addClass('error');
                }

                error = true;// определяем индекс ошибки  
            }

        form.submit(function(){

            form.find('.error').removeClass('error');

            if(parentClass) {
                form.find('.error').parent().removeClass('error');
            }

            error = false;

            inputs.each(function(index) {

                var $this = $(this);
                var thisFirstVal = inputsVal[index];


                if ($this.val() == thisFirstVal) {
                    errorActive($this);
                }

                if ($this.data('type') == 'email') {

                    if ($this.val() == thisFirstVal || !regexMail.test($this.val())) {
                        errorActive($this);
                    }

                }
                if ($this.attr('data-type') == 'number') {

                    if ($this.val() == thisFirstVal || !regexNumber.test($this.val())) {
                        errorActive($(this));
                    }

                }

            });

            if(!error){ // если ошибок нет то отправляем данные
                var str = form.serialize();

                $.ajax({
                    type: "POST",
                    url: "report.php",
                    data: str,
                    // Выводим то что вернул PHP
                    success: function(html) {
                    //предварительно очищаем нужный элемент страницы
                        form.trigger("reset");
                        form.fadeOut(100, function(){
                            form.next('.send-block').fadeIn(100);
                        });
                    }
                });
            }
            return false;
        });
// END проверка формы

        $('.send-block button').click(function(){
                $(this).closest('.send-block').fadeOut(100, function(){
                    $(this).prev('form').fadeIn(100);
                });
        });

    }

})(jQuery);