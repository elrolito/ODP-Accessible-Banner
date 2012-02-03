/*
 * HTML5 (non-Flash) ODP Banner Script
 * @author Rolando Henry (MAA)
 *
*/

/* Banner Config
 * array of banner objects:
 *     { image: path, link: path, expandedContent: name, title: { english: string, francais: string } }
 * 
 * note: does not include fallback banner, which is contained in the html
 * DO NOT include trailing commas or IE will throw a fit... typical.
*/
var banners = [
	{
		image: 'images/imoe.jpg',
		link: 'youth/youth.asp',
		expandedContent: 'imoe',
		title: {
			english: 'Aboriginal Youth',
			francais: 'les jeunes autochtones'
		}
	},
	{
		image: 'images/ocad-artists.jpg',
		link: 'arthistory/artists/artists.asp',
		expandedContent: 'ocad',
		title: {
			english: 'Featured Artists',
			francais: 'Artistes en vedette'
		}
	},
	{
		image: 'images/nrf-banner.jpg',
		link: 'policy/nrf/nrf.asp',
		expandedContent: 'nrf',
		title: {
			english: 'New Relationship Fund',
			francais: 'Fonds pour les nouvelles relations'
		}
	}
];

var bannerIndex = 0;

// banner pause status
var bannerIsPaused = true;

// init banner timer
var bannerTimer = null;

// default time in ms to show banner
var bannerTimeDelay = 6000;

// default banner language
var bannerLang = 'english';

// default play/pause text
var controlText = {
	english: {
		play: 'Play',
		pause: 'Pause',
		expand: 'Expand',
		close: 'Close'
	},
	francais: {
		play: 'Jouer',
		pause: 'Pause',
		expand: 'Agrandir',
		close: 'Fermer'
	}
}

// initialize the banner
$(document).ready(function() {

	// check current banner language
	bannerLang = $('#home-banner').first().attr('lang');
	
	// initialize additional banner images
	initBannerImages();	
	
});

// Function to dynamically add banner image html
initBannerImages = function() {
	
	// add each banner from the array
	$(banners).each(function(index, banner) {
		
		var bannerImage = new Image();
		bannerImage.src = banner.image;
		
		$(bannerImage).attr('title', banner.title[bannerLang])
			.addClass('bg-image')
			.appendTo('#banner-backgrounds');
		
		// add controls
		$('#banner-controls').find('ul').append('<li><a href="#"><span class="accessible">go to slide</span>' + (index + 2) + '</a></li>');
		
	});
	
	// Add class to first banner image
	$('#banner-backgrounds').find('.bg-image').first().addClass('showing');
	
	// initialize banner events
	initBannerEvents();
	
}

// all the banner events
initBannerEvents = function() {
	
	var bannerControls = $('#banner-controls').find('ul').find('a');
	
	// bind click events for dynamically created controls
	$(bannerControls).live('click', function() {
		
		// don't do anything if already active
		if ( ! $(this).hasClass('active')) {
			
			// stop current banner timer
			toggleBannerSlideshow('pause');
			
			bannerIndex = $(bannerControls).index(this);
			
			changeBanner(bannerIndex);
		
		}
				
		return false;
		
	});
	
	$('#banner-pause').click(function() {
	
		if ($(this).hasClass('paused')) {
			
			toggleBannerSlideshow('play');
			
		} else {
			
			toggleBannerSlideshow('pause');
			
		}
		
		return false;
		
	});
	
	// toggle the bottom bar
	$('#home-banner .banner-expand').click(function() {
		
		$(this).toggleClass('expanded');
		
		var expandButton = $('#home-banner .banner-expand');
		
		if ($(expandButton).hasClass('expanded')) {
		
			// stop current banner timer
			toggleBannerSlideshow('pause');
			
			$('#banner-bottom').find('.showing').fadeIn(300);
			
			$(expandButton).text(controlText[bannerLang].close);
			
		} else {
		
			$(expandButton).text(controlText[bannerLang].expand);
			
			toggleBannerSlideshow('play');
			
		}
		
		$('#home-banner').animate({
		
			'height': $(expandButton).hasClass('expanded') ? 385 : 185
			
		}, 600, 'swing', function() {
			
			if ($(expandButton).hasClass('expanded')) {
				// add aria: this tells the browser / screen reader this area is expanded
				$(expandButton).attr("aria-expanded","true");
				
			} else {
				// aria closed
				$(expandButton).attr("aria-expanded","false");
				
				// hide bottom area do that it can't be tabbed to when closed 
				//(for browsers who snap-shot the page the banner is shown at first)
				$('#banner-bottom').find('.banner-content').css('display', 'none');
				
			}
			
		});
		
		return false;
		
	});
	
	// when banner is clicked, go to associated link
	$('.banner-overlay').click(function() {
		
		bannerIndex = getCurrentBanner();
		
		if (bannerIndex > 0) {
			
			var url = '/' + bannerLang + '/' + banners[bannerIndex - 1].link;
			
			window.open(url);
		}
		
	});
	
	// Start the banner timer
	startBannerTimer();
	
	// show banner controls
	$('#banner-controls').fadeIn(600)
		.find('ul').find('a').first().addClass('active');
	
}

startBannerTimer = function() {
	
	// set banner timer interval
	bannerTimer = setInterval('bannerTimerHandler()', bannerTimeDelay);
	
	bannerIsPaused = false;
	
}

// bannerTimer interval handler
bannerTimerHandler = function() {
	
	// only do this if the banner is actually playing
	if ( ! bannerIsPaused) {
		
		clearInterval(bannerTimer);
		
		bannerIndex = getCurrentBanner();
		
		if (bannerIndex == banners.length) {
			// reset to beginning
			bannerIndex = 0;
		} else {
			// increase counter to go to next banner
			bannerIndex++;
		}
		
		changeBanner(bannerIndex);
	
	}
	
}

// return currently showing banner index
getCurrentBanner = function() {
	
	return $('#banner-backgrounds').find('.bg-image').index($('#banner-backgrounds .showing'));
	
}

// Function to fade in the next banner
changeBanner = function(bannerIndex) {
	
	var currentBanner = $('#banner-backgrounds').find('.showing');
	var nextBanner = $('#banner-backgrounds').find('.bg-image').eq(bannerIndex);
	
	$(currentBanner).removeClass('showing');
	
	updateBannerText(nextBanner);
	
	$(nextBanner).stop(true).fadeIn(600, function() {
	
		$(this).addClass('showing');
		
		if ( ! $('#banner-pause').hasClass('paused')) {	
		
			startBannerTimer();
		
		}
		
	});
	
	// fade out the remaining banners
	$('#banner-backgrounds').find('.bg-image').not(nextBanner).fadeOut(600);
	
	// toggle banner controls to active banner
	$('#banner-controls').find('ul').find('a')
		.removeClass('active')
		.eq(bannerIndex).toggleClass('active');
	
	// change the bottom links for related banner
	if (bannerIndex == 0) {
		// fallback banner from html
		expandedContentRel = 'default';
		
	} else {
		// adjusted to not include the fallback banner
		expandedContentRel = banners[bannerIndex - 1]['expandedContent'];
		
	}
	
	// toggle banners associated bottom bar content
	$('#banner-bottom').find('.banner-content').removeClass('showing').fadeOut(300);
	$('#banner-bottom').find('[rel=' + expandedContentRel + ']').addClass('showing').fadeIn(300);
		
}

// update banner title from title attribute
updateBannerText = function(banner) {

	$('.banner-text').fadeOut(500, function() {
		//get title from banner
		$(this).text($(banner).attr('title'));
		
		// adjust the vertical positioning of taller titles
		var dY = (185 - $(this).height())/2;
		
		$(this).css('top', dY);
		
		$(this).fadeIn(500);
		
	});

}

// toggle bannerTimer
toggleBannerSlideshow = function(status) {
	
	var pButton = $('#banner-pause');
	
	if (status == 'play') {
		// start banner timer again
		startBannerTimer();
		
		$(pButton).removeClass('paused').text(controlText[bannerLang].pause);
		
	} else if (status == 'pause') {
		// stop timer
		clearInterval(bannerTimer);
		
		bannerIsPaused = true;
		
		$(pButton).addClass('paused').text(controlText[bannerLang].play);
		
	}
	
}