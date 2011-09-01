var bannerImages = ['first-nations.jpg', 'metis.jpg', 'inuit.jpg'];
var bannerTitles = new Array();

bannerTitles['english'] = ['First Nations', 'Métis', 'Inuit'];

var bannerTimer = null;

$(document).ready(function() {
	
	$('#maa-banner').removeClass('no-javascript');
	
	// Add additional banner images
	initBannerImages();
	
	// bind click events for dynamically created controls
	$('.banner-controls a').live('click', function() {
		// stop current banner timer
		clearInterval(bannerTimer);
		
		// stop current animation and clear queue
		//$('.banner-backgrounds .bg').stop(true, true);
		
		var bannerIndex = $('.banner-controls a').index(this);
		
		changeBanner(bannerIndex);
				
		return false;
	});
});

// Function to dynamically add banner image html
initBannerImages = function() {
	
	// add each banner from the array
	$(bannerImages).each(function(index, image) {
		
		var banner = new Image();
		banner.src = 'images/' + image;
		
		$('.banner-backgrounds').append($(banner).addClass('bg').attr('title', bannerTitles['english'][index]));
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
	
	$(nextBanner).fadeIn(800, function() {
		$(this).addClass('showing');	
		bannerTimer = setInterval('bannerTimerHandler()', 5000);
	});
	
	$('.banner-backgrounds .bg').not(nextBanner).fadeOut(600);
}

updateBannerText = function(banner) {

	$('.banner-overlay .text').fadeOut(500, function() {
		$(this).text($(banner).attr('title')).fadeIn(500);
	});

}