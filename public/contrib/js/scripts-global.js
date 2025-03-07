/**
 * Theme frontend scripts
 *
 * @package    Auberge
 * @copyright  WebMan Design, Oliver Juhas
 *
 * @since    1.0
 * @version  2.2.0
 *
 * Contents:
 *
 *  10) Basics
 *  20) Site header
 *  30) Banner
 *  40) Posts
 *  50) Site footer
 * 100) Others
 */


var $scriptsInline = {
	"text_menu_group_nav": "\u2191 Menu sections"
};


(function ($) {





	/**
	 * 10) Basics
	 */

	/**
	 * RTL check
	 */

	var $wmIsRtl = ('rtl' === $('html').attr('dir'));



	/**
	 * Tell CSS that JS is enabled...
	 */

	$('.no-js')
		.removeClass('no-js');



	/**
	 * Fixing Recent Comments widget multiple appearances
	 */

	$('.widget_recent_comments ul')
		.attr('id', '');



	/**
	 * Back to top buttons
	 */

	if (1280 < window.innerWidth) {

		$('.back-to-top')
			.on('click', function (e) {

				// Processing

				e.preventDefault();

				$('html, body')
					.animate({
						scrollTop: 0
					}, 600);

			});

	}



	/**
	 * Clear floats after columns
	 */

	$('.column.last')
		.after('<div class="clear" />');





	/**
	 * 20) Site header
	 */

	/**
	 * Sticky header
	 */

	$(window)
		.on('scroll', function () {

			// Helper variables

			var $documentScrollTop = $(document).scrollTop(),
				$headerHeight = $('#masthead').outerHeight();


			// Processing

			if ($documentScrollTop >= (3 * $headerHeight)) {

				$('body')
					.removeClass('hide-sticky-header')
					.addClass('sticky-header');

			} else if ($documentScrollTop < (3 * $headerHeight) && $documentScrollTop > (1 * $headerHeight)) {

				$('body.sticky-header')
					.removeClass('sticky-header')
					.addClass('hide-sticky-header');

			} else {

				$('body')
					.removeClass('sticky-header hide-sticky-header');

			}

		});



	/**
	 * Header search form
	 */

	$('#search-toggle')
		.on('click', function (e) {

			// Processing

			e.preventDefault();

			$(this)
				.parent()
				.toggleClass('active')
				.find('.search-field')
				.focus();

		});





	/**
	 * 30) Banner
	 */

	/**
	 * Banner slider
	 */

	if ($().slick) {

		$('#site-banner.enable-slider .site-banner-inner')
			.on('init', function (event, slick) {

				// Processing

				$('.slider-nav-next')
					.before($('.slider-nav-prev'));

			})
			.slick({
				'adaptiveHeight': true,
				'autoplay': true,
				'autoplaySpeed': (!$('#site-banner').data('speed')) ? (5400) : ($('#site-banner').data('speed')),
				'cssEase': 'ease-in-out',
				'dots': true,
				'draggable': false,
				'easing': 'easeInOutBack',
				'fade': true,
				'pauseOnHover': true,
				'slide': 'article',
				'speed': 600,
				'swipeToSlide': true,
				'prevArrow': '<div class="slider-nav slider-nav-prev"><button type="button" class="slick-prev"><span class="genericon"></span></button></div>',
				'nextArrow': '<div class="slider-nav slider-nav-next"><button type="button" class="slick-next"><span class="genericon"></span></button></div>',
				'rtl': $wmIsRtl
			});

	} // /slick





	/**
	 * 40) Posts
	 */

	/**
	 * Masonry layout
	 */

	if ($().masonry) {



		/**
		 * Posts list
		 */

		var $postsContainers = $('.posts');

		$postsContainers
			.imagesLoaded(function () {

				// Processing

				$postsContainers
					.masonry({
						itemSelector: '.entry',
						percentPosition: true,
						isOriginLeft: !$wmIsRtl
					});

			});



		/**
		 * [gallery] shortcode Masonry layout
		 */

		var $galleryContainers = $('.gallery');

		$galleryContainers
			.imagesLoaded(function () {

				// Processing

				$galleryContainers
					.masonry({
						itemSelector: '.gallery-item',
						percentPosition: true,
						isOriginLeft: !$wmIsRtl
					});

			});



	} // /masonry





	/**
	 * 50) Site footer
	 */

	/**
	 * Masonry footer widgets
	 */

	if (
		$().masonry
		&& 3 < $('#footer-widgets .widget').length
	) {



		var $footerWidgets = $('#footer-widgets-container');

		$footerWidgets
			.imagesLoaded(function () {

				// Processing

				$footerWidgets
					.masonry({
						itemSelector: '.widget',
						percentPosition: true,
						isOriginLeft: !$wmIsRtl
					});

			});



	} // /masonry





	/**
	 * 100) Others
	 */

	/**
	 * Sidebar mobile toggle
	 */

	// Disable sidebar toggle on wider screens

	$(window)
		.on('resize orientationchange', function (e) {

			// Processing

			if (880 < window.innerWidth) {

				$('#toggle-mobile-sidebar')
					.attr('aria-expanded', 'true')
					.siblings('.widget')
					.show();

			}

		});

	// Clicking the toggle sidebar widgets button

	$('#toggle-mobile-sidebar')
		.on('click', function (e) {

			// Processing

			e.preventDefault();

			var $this = $(this),
				mobileSidebarExpanded = $this.attr('aria-expanded');

			if ('false' == mobileSidebarExpanded) {
				mobileSidebarExpanded = 'true';
			} else {
				mobileSidebarExpanded = 'false';
			}

			$this
				.attr('aria-expanded', mobileSidebarExpanded)
				.siblings('.widget')
				.slideToggle();

		});



	/**
	 * Food menu groups navigation
	 */

	var $aubergeFoodMenuGroupHeaders = $('.items-list .menu-group-header').length;

	if (1 < $aubergeFoodMenuGroupHeaders) {

		var $menuGroups = [];

		// Set class on items list

		$('.items-list')
			.addClass('menu-group-count-' + $aubergeFoodMenuGroupHeaders);

		// Set menu groups IDS

		$('.menu-group-header')
			.each(function (index, val) {

				// Helper variables

				var $this = $(this),
					$thisTitle = $this.find('> .menu-group-title').text(),
					$thisID = $this.attr('id');


				// Processing

				$menuGroups[$thisID] = $thisTitle;

				$this
					.append('<a href="#menu-group-nav" class="menu-group-nav-link">' + $scriptsInline.text_menu_group_nav + '</a>')
					.parent()
					.addClass($thisID);

			});

		// Create a navigation

		$('<div class="menu-group-nav-container"><ul id="menu-group-nav" class="menu-group-nav"></ul></div>')
			.prependTo('.items-list');

		for (var $menuGroupID in $menuGroups) {
			// @link  http://stackoverflow.com/questions/921789/how-to-loop-through-javascript-object-literal-with-objects-as-members

			if ($menuGroups.hasOwnProperty($menuGroupID)) {

				$('<li class="goto-' + $menuGroupID.replace(/(\r\n|\n|\r)/gm, '') + '"><a href="#' + $menuGroupID.replace(/(\r\n|\n|\r)/gm, '') + '">' + $menuGroups[$menuGroupID].replace(/(\r\n|\n|\r)/gm, '') + '</a></li>')
					.appendTo('#menu-group-nav');

			}

		}

		// Make navigation sticky once scrolled to it

		$('#page')
			.imagesLoaded(function () {

				// Helper variables

				var $menuGroupNav = $('#menu-group-nav'),
					$menuGroupNavTop = $menuGroupNav.offset().top;


				// Processing

				$menuGroupNav
					.parent()
					.css({ 'height': $menuGroupNav.outerHeight() });

				$(window)
					.scroll(function () {

						// Processing

						if ($(document).scrollTop() > ($menuGroupNavTop - $('#masthead').outerHeight())) {

							$('body')
								.addClass('sticky-menu-group-nav');

						} else {

							$('body')
								.removeClass('sticky-menu-group-nav');

						}

					});

			});

	}



	/**
	 * Jetpack Infinite Scroll posts loading
	 *
	 * @link  http://wptheming.com/2013/04/jetpack-infinite-scroll-masonry/
	 */

	$(document.body)
		.on('post-load', function () {

			// Processing

			/**
			 * Masonry posts and footer widgets
			 */

			if ($().masonry) {

				var $postsContainers = $('.posts');

				$postsContainers
					.imagesLoaded(function () {

						$postsContainers
							.masonry('reload');

						setTimeout(function () {

							$('#footer-widgets-container')
								.masonry('reload');

						}, 600);

					});

			} // /masonry

		});





})(jQuery);
