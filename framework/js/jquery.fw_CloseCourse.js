/*------------------
Copyright (c) 2012. Upside Learning Solution Pvt. Ltd.
All rights reserved.	
Name: jquery.fw_CloseCourse
Developed by: 

---------------------*/
(function( $ ){
  var methods = {
    init : function( options ) {			
			var defaults = {text: ""};
			options = $.extend(defaults, options);
			$("body").prepend(getCloseCourseHTML());
			$('.fw_CloseCourseYes').bind("click", function(){
				$('.fw_CloseCoursePopWindow').trigger(courseEvent.CLOSECOURSE_YES);
			});
			$('.fw_CloseCourseNo').bind("click", function(){
				$('.fw_CloseCoursePopWindow').trigger(courseEvent.CLOSECOURSE_NO);
				$('.closeParent').hide();
			});
		
			 $('.closeParent').hide();
    },
    show : function() {	   
       $('.closeParent').show(); 
    },
    hide : function() { 
      $('.closeParent').hide();
    },
	 updateText : function() { 
		var navTextXML=globalData.navigationTextXML;
		$('.fw_CloseCourseText').html(navTextXML.closeCourse[0].text[0].Text);			
		$('.fw_CloseCourseYes').html(navTextXML.closeCourse[0].buttonText[0].text[0].Text);
		$('.fw_CloseCourseNo').html(navTextXML.closeCourse[0].buttonText[0].text[1].Text);
    }
  };

  $.fn.fw_CloseCourse = function( method ) {    
    /*Method calling logic*/
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };
  $.extend({fw_CloseCourse: $.fn.fw_CloseCourse});
  /* Create a function that builds the fw_CloseCourse markup. Then, prepend the fw_CloseCourse to the body*/
  getCloseCourseHTML = function() {  
	var CC =
	"<div class='closeParent'><div class='closeSemiBlack'></div><div class='fw_CloseCoursePopWindow'><div class='fw_CloseCourseText'></div><div class='fw_CloseCourseYes'>Yes</div><div class='fw_CloseCourseNo'>No</div></div></div>";
	if ($(".fw_CloseCoursePopWindow").length > 0){
	  return "";
	}else{
	 return CC;  
	}
   }

})( jQuery );