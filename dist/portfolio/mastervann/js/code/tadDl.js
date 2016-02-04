function tabDl(element) {

	var $this = element;
		$dt = $this.querySelectorAll('dt');
		$dd = $this.querySelectorAll('dd');
		
	$dt[0].classList.add('active');
	$dt[0].nextElementSibling.classList.add('active');

	for (var z = 0; z < $dt.length; z++) {

		$dt[z].addEventListener('click', function(event) {

			for (var z = 0; z < $dt.length; z++) {
				$dt[z].classList.remove('active');
			}

			for (var z = 0; z < $dd.length; z++) {
				$dd[z].classList.remove('active');
			}

			this.classList.add('active');
			this.nextElementSibling.classList.add('active');
		}, false);
	};
}

tabDl(document.getElementById('js-tab-dl'));