/*------------------
Name: jquery.fw_ToolTip.js
Developed by: Suyog Shaha
---------------------*/
(function( $ ){
  var currentClass="";
  var methods = {
    init : function( options ) {
			/*Setup the options for the tooltip that can be accessed from outside the plugin*/
			var defaults = {location: "top",width:100,gap:5,leftGap:0,time:10,animation:false};
			options = $.extend(defaults, options);
			if(!globalSettings.isDesktop()){
				return false;
			}
     		$("body").prepend(getTip());
			$('.fw_ToolTip').css('display','none');
			var titletext="";
			var className="";
			this.hover( function(){
				if ($(this).hasClass("disabledNavBtn")){
					return false;
				}
				var tTxt =$(this).attr("toolTiptext");
				className=$(this).attr("class");
				currentClass=className;
				//$(this).attr("title","")
				titletext=tTxt;
				$('.fw_ToolTipText').html(tTxt);			
				$('.fw_ToolTip').css('width',defaults.width);
				
				$('.fw_ToolTip').removeClass('toolTip_left toolTip_top toolTip_right toolTip_bottom');
				$('.fw_ToolTip').addClass('toolTip_'+defaults.location);
				var offset = $(this).offset();  
				var bLeft = offset.left;  
				var bTop = offset.top;  
				var bWidth = $(this).width();  
				var bHeight = $(this).height();
				var tWidth = $('.fw_ToolTip').width();  
				var tHeight = $('.fw_ToolTip').height();				
				//var gap=10;
				
				var nL=bLeft-tWidth+(defaults.leftGap);
				var nT=bTop-tHeight-defaults.gap;
				var animTip;
				$('.fw_ToolTip').stop();
							
				switch(defaults.location){
					case "left":					
						nL=bLeft+(bWidth+defaults.gap);
						nT=bTop-((tHeight/2)-(bHeight/2));					
					break;					
					case "top":
						nL=bLeft-((tWidth/2)-(bWidth/2) + (defaults.leftGap));
						nT=bTop-(tHeight+defaults.gap);										
					break;					
					case "right":
						nL=bLeft-(tWidth+defaults.gap+defaults.gap);
						nT=bTop-((tHeight/2)-(bHeight/2));					
					break;					
					case "bottom":
						nL=bLeft-((tWidth/2)-(bWidth/2));
						nT=bTop+bHeight+defaults.gap;					
					break;					
				}	
						
				if(defaults.animation){
					$('.fw_ToolTip').css('opacity', 0);
					$('.fw_ToolTip').css({left:nL+"px", top:nT+"px"});
					$('.fw_ToolTip').show();
					switch(defaults.location){
						case "left":						
							$('.fw_ToolTip').css('left',(nL+20)+"px");
						break;						
						case "top":
							$('.fw_ToolTip').css('top',(nT-20)+"px");										
						break;						
						case "right":
							$('.fw_ToolTip').css('left',(nL-20)+"px");		
						break;						
						case "bottom":
							$('.fw_ToolTip').css('top',(nT+20)+"px");				
						break;				
					}
					$('.fw_ToolTip').animate({opacity: 1,left:nL+"px", top:nT+"px"},defaults.time);				
				}else{
					
					$('.fw_ToolTip').css({left:nL+"px", top:nT+"px"});		
					$('.fw_ToolTip').fadeIn(defaults.time);
					$('.fw_ToolTip').animate({opacity: 1});
				}
			},
			  function () {
				 $('.fw_ToolTip').css('display','none');
				 if(className==$(this).attr("class")){
					//$(this).attr("title",titletext);	
				 }
			  }
			);
		 return this;
    },
    show : function() {
      
    },
    hide : function() { 
       $('.fw_ToolTip').css('display','none');
    },
    update : function(content) {		
		$('.fw_ToolTipText').html(content);
    }
  };

  $.fn.fw_ToolTip = function( method ) {   
   
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };
  /* Create a function that builds the tooltip markup. Then, prepend the tooltip to the body*/
  getTip = function() {  
	var tTip =
	"<div class='fw_ToolTip'><div class='fw_ToolTipText'></div></div>";
	if ($(".fw_ToolTip").length > 0){
	  return "";
	}else{
	 return tTip;  
	}
   }

})( jQuery );