/*
 * HTML5 (non-Flash) ODP Banner Script
 * @author Rolando Henry (MAA)
 *
*/

/* Banner Config
 * array of banner objects:
 *     { image: path, link: path, bottomBar: name, title: { english: string, francais: string } }
 * 
 * note: does not include fallback banner, which is contained in the html
*/
var banners = [
	{
		image: 'images/imoe.jpg',
		link: 'youth/youth.asp',
		bottomBar: 'imoe',
		title: {
			english: 'Aboriginal Youth',
			francais: '',
		}
	},
	{
		image: 'images/ocad-artists.jpg',
		link: 'arthistory/artists/artists.asp',
		bottomBar: 'ocad',
		title: {
			english: 'Featured Artists',
			francais: '',
		}
	},
	{
		image: 'images/naaf-banner.jpg',
		link: 'youth/youth.asp',
		bottomBar: 'naaf',
		title: {
			english: 'Aboriginal Achievement',
			francais: '',
		}
	},
];

// init banner timer
var bannerTimer = null;

// default time in ms to show banner
var bannerTimeAmount = 5000;

// default banner language
var bannerLang = 'english';

// initialize the banner
$(document).ready(function() {

	// initialize additional banner images
	initBannerImages();
	
	// initialize banner events
	initBannerEvents();

});

// Function to dynamically add banner image html
initBannerImages = function() {
	
	// check current banner language
	bannerLang = $('#maa-banner').attr('lang');
	
	$('.banner-controls ul a').eq(0).addClass('active');
	
	// add each banner from the array
	$(banners).each(function(index, banner) {
		
		var bannerImage = new Image();
		bannerImage.src = banner.image;
		
		$('.banner-backgrounds').append($(bannerImage).addClass('bg').attr('title', banner.title[bannerLang]));
		
		// add controls
		$('.banner-controls ul').append('<li><a href="#">' + (index + 2) + '</a></li>');
	});
	
	// Add class to first banner image
	$('.banner-backgrounds .bg:first-child').addClass('showing');
	
	// Start the banner timer
	startBannerTimer();
}

// all the banner events
initBannerEvents = function() {
	
	// play/pause toggle
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
	
	// toggle the bottom bar
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
	
	// when banner is clicked, go to associated link
	$('.banner-overlay').click(function() {
		
		var bannerIndex = $('.banner-backgrounds .bg').index($('.banner-backgrounds .showing'));
		
		if (bannerIndex > 0) {
			
			var url = '/' + bannerLang + '/' + banners[bannerIndex - 1].link;
			alert(url);
			window.open(url);
		}
	});
	
	// pause timer while using the bottom bar
	$('.banner-bottom').bind('mouseenter', function() {
		// turn animation off
		clearInterval(bannerTimer);
	}).bind('mouseleave', function() {
		// turn animation back on
		clearInterval(bannerTimer);
		startBannerTimer();
	});
}

startBannerTimer = function() {
	// set banner timer interval
	bannerTimer = setInterval('bannerTimerHandler()', bannerTimeAmount);
}

// bannerTimer interval handler
bannerTimerHandler = function() {
	
	clearInterval(bannerTimer);
	
	var bannerIndex = $('.banner-backgrounds .bg').index($('.banner-backgrounds .showing'));
	
	if (bannerIndex == banners.length) {
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
		startBannerTimer();
	});
	
	$('.banner-backgrounds .bg').not(nextBanner).fadeOut(600);
	
	$('.banner-controls ul a').removeClass('active');
	$('.banner-controls ul a').eq(bannerIndex).toggleClass('active');
	
	// change the bottom links for related banner
	if (bannerIndex == 0) {
		// fallback banner from html
		bottomBar = 'default';
	} else {
		// adjusted to not include the fallback banner
		bottomBar = banners[bannerIndex - 1]['bottomBar'];
	}
	
	// toggle banners associated bottom bar content
	if (bottomBar != $('.banner-links:visible').attr('rel')) {
		$('.banner-links').fadeOut(600);
		$('.banner-bottom [rel=' + bottomBar + ']').fadeIn(600);
	}
}

// update banner title from title attribute
updateBannerText = function(banner) {

	$('.banner-overlay .text').fadeOut(500, function() {
	
		$(this).text($(banner).attr('title')).fadeIn(500);
	});
	
	// toggle text
	if ($('#banner-pause').text() == 'play') {
	
		$('#banner-pause').text('pause')
	}

}

// toggle bannerTimer
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