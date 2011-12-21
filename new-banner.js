/* 
 * MAA website banner javascript code
 * @author Rolando Henry, New Media Specialist
 *
 */
var bannerImages = ['first-nations.jpg', 'metis.jpg', 'inuit.jpg', 'imoe.jpg'];
var bannerLinks = ['default', 'default', 'default', 'default', 'imoe']; // additional default for base banner in html
var bannerTitles = new Array();

bannerTitles['english'] = ['First Nations', 'Métis', 'Inuit', 'Aboriginal Affairs'];
bannerTitles['francais'] = ['Premières nations', 'Métis', 'Inuit', 'Affaires autochtones'];

var bannerTimer = null;

$(document).ready(function() {
	
	$('#maa-banner').removeClass('no-javascript');
	
	// Add additional banner images
	initBannerImages();
	
	$('#banner-pause').click(function() {
		$(this).toggleClass('paused');
		pausePlayBanner();
		return false;
	});
	
	// bind click events for dynamically created controls
	$('.banner-controls ul a').live('click', function() {
		// stop current banner timer
		clearInterval(bannerTimer);
		
		var bannerIndex = $('.banner-controls ul a').index(this);
		
		changeBanner(bannerIndex);
				
		return false;
	});
	
	$('#maa-banner .banner-expand').click(function() {
		$(this).toggleClass('open');
		
		var closeText = $('#maa-banner').hasClass('french') ? 'Fermer' : 'Close';
		var openText = $('#maa-banner').hasClass('french') ? 'Agrandir' : 'Expand';
		
		if ($('#maa-banner .banner-expand').hasClass('open')) {
			$('#maa-banner .banner-expand').text(closeText);
		} else {
			$('#maa-banner .banner-expand').text(openText);
		}
		$('#maa-banner').animate({
			'height': $('#maa-banner .banner-expand').hasClass('open') ? 385 : 185
		},600)
		return false;
	});
});

// Function to dynamically add banner image html
initBannerImages = function() {
	
	var bannerLanguage = $('#maa-banner').attr('lang');
	
	$('.banner-controls ul a').eq(0).addClass('active');
	
	// add each banner from the array
	$(bannerImages).each(function(index, image) {
		
		var banner = new Image();
		banner.src = 'images/' + image;
		
		$('.banner-backgrounds').append($(banner).addClass('bg').attr('title', bannerTitles[bannerLanguage][index]));
		
		// add controls
		$('.banner-controls ul').append('<li><a href="#">' + (index + 2) + '</a></li>');
	});
	
	// Add class to first banner image
	$('.banner-backgrounds .bg:first-child').addClass('showing');
	
	// Start the banner timer
	bannerTimer = setInterval('bannerTimerHandler()', 5000);
}

bannerTimerHandler = function() {
	
	clearInterval(bannerTimer);
	
	var bannerIndex = $('.banner-backgrounds .bg').index($('.banner-backgrounds .showing'));
	
	if (bannerIndex == bannerImages.length) {
		// increase counter to go to next banner
		bannerIndex = 0;
	} else {
		// reset to begining
		bannerIndex++;
	}
	
	changeBanner(bannerIndex);
}

// Function to fade in the next banner
changeBanner = function(bannerIndex) {
	
	var currentBanner = $('.banner-backgrounds .showing');
	var nextBanner = $('.banner-backgrounds .bg').eq(bannerIndex);
	
	$(currentBanner).removeClass('showing');
	
	updateBannerText(nextBanner);
	
	$(nextBanner).stop(true).fadeIn(800, function() {
		$(this).addClass('showing');	
		bannerTimer = setInterval('bannerTimerHandler()', 5000);
	});
	
	$('.banner-backgrounds .bg').not(nextBanner).fadeOut(600);
	
	$('.banner-controls ul a').removeClass('active');
	$('.banner-controls ul a').eq(bannerIndex).toggleClass('active');
	
	var bannerLinkType = bannerLinks[bannerIndex];
	if (bannerLinkType != $('.banner-links:visible').attr('rel')) {
		$('.banner-links').fadeOut(800);
		$('.banner-bottom [rel=' + bannerLinkType + ']').fadeIn(800);
	}
}

updateBannerText = function(banner) {

	$('.banner-overlay .text').fadeOut(500, function() {
		$(this).text($(banner).attr('title')).fadeIn(500);
	});
	if ($('#banner-pause').text() == 'play') {
		$('#banner-pause').text('pause')
	}

}

pausePlayBanner = function() {
	var pButton = $('#banner-pause');
	if ($(pButton).text() == 'play') {
		// start banner timer again
		bannerTimer = setInterval('bannerTimerHandler()', 5000);
		$(pButton).text('pause');
	} else {
		// stop timer
		clearInterval(bannerTimer);
		$(pButton).text('play');
	}
}