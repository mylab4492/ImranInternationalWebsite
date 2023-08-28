/*Loader Javascript 
========================*/
$(window).load(function() {
    $(".loading").fadeOut("fast");
});

(function($) {
    "use strict"; // Start of use strict
	
    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a:not(.dropdown-toggle)').on('click',function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 31
        }
    })
	
		//goto top
		$(window).on('scroll',function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
		
		 // scroll body to 0px on click
        $('#back-to-top').on('click',function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
         // Tooltip Title Show
        $('#back-to-top').tooltip('show');		
})(jQuery); 