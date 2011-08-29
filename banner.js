var bannerTitles = ['First Nations', 'Métis', 'Inuit', 'Aboriginal Affairs']
var bannerTitlesFr = ['Premières nations', 'Métis', 'Inuit', 'Affaires autochtones']
var bannerTextTimer

$(document).ready(function() {
	/*projekktor('#cn-tower', {
		autoplay: true,
		controls: false,
		loop: true,
		width: 980,
		height: 385
	})*/
	
	$('#maa-banner').removeClass('no-javascript')
	
	$('#maa-banner .banner-overlay').fadeIn(500, function() {
		$('#maa-banner .banner-expand').delay(100).fadeIn(600)
		$('#maa-banner .text').delay(500).fadeIn(600)
		bannerTextTimer = setInterval('changeBannerText()', 3000)
		$('#maa-banner .bg').delay(600).each(function(index, elem) {
			$(elem).delay(index * 3000).fadeIn('slow', function() {
				$(this).prev().remove()
			})
		})
	})
	
	$('#maa-banner .banner-expand').click(function() {
		$(this).toggleClass('open')
		
		var closeText = $('#maa-banner').hasClass('french') ? 'Fermer' : 'Close'
		var openText = $('#maa-banner').hasClass('french') ? 'Agrandir' : 'Expand'
		
		if ($('#maa-banner .banner-expand').hasClass('open')) {
			$('#maa-banner .banner-expand').text(closeText)
		} else {
			$('#maa-banner .banner-expand').text(openText)
		}
		$('#maa-banner').animate({
			'height': $('#maa-banner .banner-expand').hasClass('open') ? 385 : 185
		},600)
		return false
	})
})

var counter = 0;

changeBannerText = function() {
	counter++
	
	if (counter <= 3) {
		var title = $('#maa-banner').hasClass('french') ? bannerTitlesFr[counter] : bannerTitles[counter]
		$('#maa-banner .text').fadeOut(300, function() {
			$(this).text(title).delay(300).fadeIn(500)
		})
	} else {
		clearInterval(bannerTextTimer)
	}
	
}