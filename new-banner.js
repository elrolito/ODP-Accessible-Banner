var bannerImages = ['first-nations.jpg', 'metis.jpg', 'inuit.jpg'];
var bannerTitles = ['First Nations', 'Métis', 'Inuit'];

var bannerTimer = null;

$(document).ready(function() {
	
	$('#maa-banner').removeClass('no-javascript');
	
	// Add additional banner images
	initBannerImages();
	
	// bind click events for dynamically created controls
	$('.banner-controls a').live('click', function() {
		
		// stop current banner timer
		clearInterval(bannerTimer);
		
		// get the selected banner
		var selectedBanner = $('.banner-backgrounds .bg').eq($(this).attr('rel'));
		
		// fade in the selected banner and fadeout rest
		$(selectedBanner).fadeIn(800, function() {
			
			$('.banner-backgrounds .bg').not(this).fadeOut(800);
			
			// start up the banner timer
			bannerTimer = setInterval('changeBanner()', 2000);
		});
	});
});

// Function to dynamically add banner image html
initBannerImages = function() {
	
	// add each banner from the array
	$(bannerImages).each(function(index, image) {
		
		var banner = new Image();
		banner.src = 'images/' + image;
		
		// once image is loaded add it to the DOM tree
		$(banner).load(function() {
			$('.banner-backgrounds').append($(banner).addClass('bg'));
		});
	});
	
	// Start the banner timer
	bannerTimer = setInterval('changeBanner()', 2000);
}

// Function to fade in the next banner
changeBanner = function() {
	
	var currentBanner = $('.banner-backgrounds .bg:visible');
	
	$(currentBanner).next().fadeIn(800, function() {
		
		$('.banner-backgrounds .bg:last-child').after($('.banner-backgrounds .bg:first-child').css('display', 'none'));
		
		updateBannerControls();
	});
	
}

updateBannerControls = function() {
	
	$('.banner-controls a').attr('rel', function(index, attr) {
		
		if (attr == 0) {
			attr = bannerImages.length;
		} else {
			attr--;
		}
		
		$(this).attr('rel', attr);
	});
}