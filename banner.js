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
*/
var banners = [
	{
		image: 'images/imoe.jpg',
		link: 'youth/youth.asp',
		expandedContent: 'imoe',
		title: {
			english: 'Aboriginal Youth',
			francais: 'les jeunes autochtones',
		}
	},
	{
		image: 'images/ocad-artists.jpg',
		link: 'arthistory/artists/artists.asp',
		expandedContent: 'ocad',
		title: {
			english: 'Featured Artists',
			francais: 'Artistes en vedette',
		}
	},
	{
		image: 'images/naaf-banner.jpg',
		link: 'youth/youth.asp',
		expandedContent: 'naaf',
		title: {
			english: 'Aboriginal Achievement',
			francais: 'réalisations autochtones',
		}
	},
];

var bannerIndex = 0;

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
		close: 'Close',
	},
	francais: {
		play: 'Jouer',
		pause: 'Pause',
		expand: 'Agrandir',
		close: 'Fermer',
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
		
		$('#banner-backgrounds').append($(bannerImage).addClass('bg-image').attr('title', banner.title[bannerLang]));
		
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
	
	// bind click events for dynamically created controls
	$('#banner-controls').find('a').live('click', function() {
		
		if ($(this).hasClass('paused')) {
			
			toggleBannerSlideshow('play');
			
			return false;
			
		}
		
		// stop current banner timer
		toggleBannerSlideshow('pause');
		
		if ($(this) != $('#banner-pause')) {
		
			bannerIndex = $('#banner-controls').find('ul').find('a').index(this);
		
			changeBanner(bannerIndex);
		
		}
				
		return false;
		
	});
	
	// toggle the bottom bar
	$('#home-banner .banner-expand').click(function() {
		
		$(this).toggleClass('expanded');
		
		var expandButton = $('#home-banner .banner-expand');
		
		if ($(expandButton).hasClass('expanded')) {
			
			$('#home-banner #banner-bottom').css('display', 'block');
			
			$(expandButton).text(controlText[bannerLang].close);
			
		} else {
		
			$(expandButton).text(controlText[bannerLang].expand);
			
		}
		
		$('#home-banner').animate({
		
			'height': $(expandButton).hasClass('expanded') ? 385 : 185
			
		}, 600, 'swing', function() {
			
			if ($(expandButton).hasClass('expanded')) {
				
				$(expandButton).attr("aria-expanded","true"); // add aria: this tells the browser / screen reader this area is expanded
			} else {
				$(expandButton).attr("aria-expanded","false"); // aria closed
				$('#home-banner #banner-bottom').css('display', 'none'); // hide bottom area do that it can't be tabbed to when closed (for browsers who snap-shot the page the banner is shown at first)
			}
			
		});
		
		return false;
		
	});
	
	// when banner is clicked, go to associated link
	$('.banner-overlay').click(function() {
		
		bannerIndex = getCurrentBanner();
		
		if (bannerIndex > 0) {
			
			var url = '/' + bannerLang + '/' + banners[bannerIndex - 1].link;
			alert(url);
			window.expanded(url);
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
	
}

// bannerTimer interval handler
bannerTimerHandler = function() {
	
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
	
	$(nextBanner).stop(true).fadeIn(800, function() {
	
		$(this).addClass('showing');
		
		if ( ! $('#banner-pause').hasClass('paused')) {	
		
			startBannerTimer();
		
		}
		
	});
	
	$('#banner-backgrounds').find('.bg-image').not(nextBanner).fadeOut(600);
	
	$('#banner-controls').find('ul').find('a')
		.removeClass('active')
		.eq(bannerIndex).toggleClass('active');
	
	// change the bottom links for related banner
	if (bannerIndex == 0) {
		// fallback banner from html
		expandedContent = 'default';
		
	} else {
		// adjusted to not include the fallback banner
		expandedContent = banners[bannerIndex - 1]['expandedContent'];
	}
	
	// toggle banners associated bottom bar content
	if (expandedContent != $('.banner-content:visible').attr('rel')) {
	
		$('.banner-content').fadeOut(600);
		
		$('#banner-bottom [rel=' + expandedContent + ']').fadeIn(600);
		
	}
	
}

// update banner title from title attribute
updateBannerText = function(banner) {

	$('.banner-overlay .banner-text').fadeOut(500, function() {
	
		$(this).text($(banner).attr('title')).fadeIn(500);
		
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
		
		$(pButton).addClass('paused').text(controlText[bannerLang].play);
		
	}
	
}