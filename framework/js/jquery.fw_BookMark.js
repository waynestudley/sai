/*------------------
Name: jquery.fw_BookMark.js
Developed by: Suyog Shaha
---------------------*/
(function( $ ){
	var methods = {
	init : function( options ) {			
			var defaults = {text: "Would you like to Continue to the<br/>last visited page?",yes: "Continue?",no: "Restart"};
			options = $.extend(defaults, options);			
	 		$(".pageContainer").prepend(getBookMarkHTML());
			$('.fw_BookMarkText').html(defaults.text);
			$('.fw_BookMarkText').attr('title',"");
			$('.fw_BookMarkYes').html(defaults.yes);
			$('.fw_BookMarkYes').attr('title',"");
			$('.fw_BookMarkNo').html(defaults.no);
			$('.fw_BookMarkNo').attr('title',"");
			
			$('.fw_BookMarkYes').bind("click", function(){
				$('.fw_BookMarkPopWindow').trigger(courseEvent.BOOKMARK_YES);
			});
			$('.fw_BookMarkNo').bind("click", function(){
				$('.fw_BookMarkPopWindow').trigger(courseEvent.BOOKMARK_NO);
			});
			
			$('.fw_BookMarkNo').focusout(function(){
				 $("a[tabindex=1]").focus();
			});
			
			$('.fw_BookMarkYes').focusout(function(){
				 $("a[tabindex=2]").focus();
			});
			
			$(window).resize(function(){		
				if ($(".fw_BookMarkPopWindow").length > 0){
					updatePageLayOut();
				}		
			});
			 $("div[tabindex=1]").focus();
			updatePageLayOut();			
	},
	show : function() {
	  
	},
	hide : function() { 
	  $('.fw_BookMarkparent').remove(); 
	}
	};
	function updatePageLayOut(){
		var top = ($(".pageContainer").height() - $('.fw_BookMarkPopWindow').outerHeight()) / 2;
		if (globalSettings.isDesktop()) {
			top = top + 40;
		}
		var left = ($(".pageContainer").width() - $('.fw_BookMarkPopWindow').outerWidth()) / 2;
		$('.fw_BookMarkPopWindow').css({position:'absolute', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
	}

	$.fn.fw_BookMark = function( method ) {		
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    
	
	};
	$.extend({fw_BookMark: $.fn.fw_BookMark});
		/* Create a function that builds the fw_BookMark markup. Then, prepend the fw_BookMark to the body*/
	getBookMarkHTML = function() {
		var BM ="<div class='fw_BookMarkparent'><div class='fw_BookMarkPopWindow' ><div class='fw_BookMarkText' ></div><div class='fw_ButtonDiv' ><a class='fw_BookMarkYes' href='javascript:void(0)' tabindex='1' >Yes</a><div class='fw_ButtonGap' ></div><a class='fw_BookMarkNo' href='javascript:void(0)' tabindex='2' >No</a></div></div></div>";
		if ($(".fw_BookMarkPopWindow").length > 0){
		  return "";
		}else{
		 return BM;  
		}
	}

})( jQuery );