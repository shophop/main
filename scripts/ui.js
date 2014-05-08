//----------------------------------//
//----------DOCUMENT READY----------//
//----------------------------------//
$(document).ready(function(){
     	
     	//Page Setup
		setCanvas();
		optionsTopMargin();
		lockCategory();
		$(window).resize(function(){
			setCanvas();
			optionsTopMargin();
		});
		
		//Fix iOS 'minimal-ui' landscape scroll bug
		$(window).bind('orientationchange', function () {
        	var windowWidth = $( window ).width();
        	var windowHeight = $( window ).height();
        	var scrollPos = $('#main-page-content').scrollTop();
        	var contentHeight = $('#main-page-content').height();
        	
        	if(windowWidth>windowHeight){
        		window.scrollTo(0, 1);

        		if(scrollPos>0){
		        	$('#main-page-content').scrollTop(contentHeight);
	        	}
	        	else{console.log("scrollPos <= 0");}
        	
        	}
        	else if(scrollPos>0){
		        	$('#main-page-content').scrollTop(contentHeight);
	        	}
        	
        });
		
		//Fix rubber-banding effect on main view but allow scrollable divs
		var selScrollable = '.scrollable';
		// Uses document because document will be topmost level in bubbling
		$(document).on('touchmove',function(e){
		  e.preventDefault();
		});
		// Uses body because jQuery on events are called off of the element they are
		// added to, so bubbling would not work if we used document instead.
		$('body').on('touchstart', selScrollable, function(e) {
		  if (e.currentTarget.scrollTop === 0) {
		    e.currentTarget.scrollTop = 1;
		  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
		    e.currentTarget.scrollTop -= 1;
		  }
		});
		// Stops preventDefault from being called on document if it sees a scrollable div
		$('body').on('touchmove', selScrollable, function(e) {
		    // Only block default if internal div contents are large enough to scroll
		    // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
		    if($(this)[0].scrollHeight > $(this).innerHeight()) {
		        e.stopPropagation();
		    }
		});
		
		//----------------------------------//
		//---------Category Chooser---------//
		//----------------------------------//
		  $("#category-chooser").on('touchend',function(){
				lockCategory();
			});
		
		

        
		//----------------------------------//
		//-----HOMEPAGE CLICK HANDLERS------//
		//----------------------------------//
		
		$(this).bind('touchstart', function(){
			$(this).css('-webkit-transform', 'scale(.5)');
		});
		
		//More Options Click Action
		
		$(".options-button").bind('mousedown', function(){
			optionsScroll();
		});
		
		//Header Click Action
		$(".header").bind('mousedown', function(){
			backToTop();
		});
		
		//Expand options into forms
		$(".menu-option").bind('mousedown', function(){
			var menuHeight = $(this).height();
			var pageHeight = $('#main-page-content').height();
			var menuOptionPos = $(this).offset().top;
			
			if(menuHeight == 80){
				$('#main-page-content').css('overflow', 'hidden');
				$(this).children('.close-menu-option').css('visibility', 'visible');
				$(this).children('.menu-option-content').css( 'height', '100%');
				$(this).children('.option-description').css('height', '0px');
				$('#main-page-content').css('-webkit-mask-image', '-webkit-gradient(linear, left 5%, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)))');
				$(this).css('height', pageHeight+"px");
				$('#main-page-content').delay(500).animate(
					{scrollTop: pageHeight+menuOptionPos-75},
					{
					duration: 500,
					easing: 'easeOutExpo' 	
					});
				setTimeout(1000);
				$('.header').css('border-bottom-color', 'rgba(255,255,255,0)');
			}
		});
		
		//Clear and close form
		$(".close-menu-option").bind('mousedown', function(){
				var pageHeight = $('#main-page-content').height();
				$('#main-page-content').animate(
					{scrollTop: pageHeight},
					{
					duration: 500,
					easing: 'easeOutExpo' 	
					});
				setTimeout(500);
				$(this).css('visibility', 'hidden');
				$(this).siblings('.menu-option-content').css( 'height', '0px');
				$('#main-page-content').css('overflow', 'scroll');
				$(this).siblings('.option-description').css('height', '40px');
				$('#main-page-content').css('-webkit-mask-image', '-webkit-gradient(linear, left 5%, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))');
				$(this).parents('.menu-option').css('height', "80px");
				$('.header').css('border-bottom-color', 'rgba(255,255,255,1)');
		});
     
});

//---------------------------------------------------------------------//
//----------------------------FUNCTIONS--------------------------------//
//---------------------------------------------------------------------//

//More Options line with arrow canvas
function setCanvas(){
	var canvas = document.getElementById('pointer-line');
	var context = canvas.getContext('2d');
	var windowWidth = $( window ).width();
	var line = windowWidth-40;
	
	//Set Width of Canvas
	$('#pointer-line').attr('width',line*2);
	$('#pointer-line').css('width',line);
	
	//Set Scale based on pixel ratio (ex: 1x, 1.5x, 2x, etc.)
	context.scale(2,2);
	//Offset all point so they sit between grid lines and don't create half pixels
	context.translate(0.5,0.5);
	
	//Path Instructions
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(line/2-10, 0);
	context.lineTo(line/2, 9);
	context.lineTo(line/2+10, 0);
	context.lineTo(line, 0);
	
	context.strokeStyle = "white";
	context.stroke();

}
//Set margins between various options
function optionsTopMargin(){
	var height = $("#main-page-options").height();
	var optionHeight = $(".menu-option").height();
	var difference = Math.ceil(height-(optionHeight*4));
	
	if(difference <= 0){
		$(".menu-option").css('margin-top', '10px');
		console.log("margin-top=10px");
	}
	else{
		
		var difference = Math.ceil(difference/5);
		$(".menu-option").css('margin-top', difference);
	}
	

}
//Scroll Hompage to more options
function optionsScroll() {
	var content = $('#main-page-content');
	var scrollPos = $('#main-page-content').scrollTop();
	var contentHeight = $('#main-page-content').height();
	
	if(scrollPos < 20){
		$(content).animate(
		{scrollTop: contentHeight},
			{
			duration: 1000,
			easing: 'easeOutExpo',
			complete: function() {
				scrollPos = $('#main-page-content').scrollTop();	
		    }
		});	
	}
}
//Scroll Homepage Main Content back to top
function backToTop() {
	$('#main-page-content').animate(
		{scrollTop: 0},
			{
			duration: 1000,
			easing: 'easeOutExpo',
		});
}
function lockCategory(){
	var categoryWidth = 0;
	$("#category-chooser li").each( function(){ categoryWidth += $(this).width(); });
	console.log(categoryWidth);
	$("#category-chooser").animate({scrollLeft: 230}, 500,'easeOutExpo');
}