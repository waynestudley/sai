/*----------------------------------------
	Name: jquery.fw_Transcript.js
	Developed by: Suyog Shaha
----------------------------------------*/
(function( $ ){
  var tCntH;
  var tCntA;
  var tScrH;
  var currentHeight=120;
  var tScrollArray= new Array();
  var lnHeight=16;
  var scval=0;
  var methods = {
    init : function( options ) {
			var defaults = {parent:'body'};			
			options = $.extend(defaults, options);
			$(defaults.parent).prepend(getTranscriptHtml());
			for(var i=0;i<50;i++){
				tScrollArray.push(lnHeight*i);
			}
			/* $('.fw_Transcript').attr('style','');
			$('.fw_Transcript').css('display','none');
			if(globalPath.languageDir == 'ltr'){
			$('.fw_Transcript').css({left:"342px",top:"50px"});				
			} else{
			$('.fw_Transcript').css({right:"0px",top:"50px"});
			} */
			/***********************************************/
			 $('.fw_TranscriptContainer,.fw_TranscriptTextContainer').attr('title',globalData.navigationTextXML.transcriptGlobalText[0].text[0].Text)
			 $('.fw_TranscriptContainer').draggable({ containment: "window" });
			/***********************************************/
			
			
			$('#fw_TranscriptScrollbar').draggable({
				axis: 'y',
				containment: 'parent',    
				drag: function() {
					 scrollbarDragging();
				}
		
			});
			$('.fw_CloseTranscript').bind("click", function(){
					methods.hide.apply();
					try{
						navigationEvent.addTranscriptOffClass()	
					}catch(err){}
   	 		});
			//$( ".fw_Transcript" ).css('height','120px;');
			
    },
    show : function() {
       $( ".fw_TranscriptContainer" ).show();	   
	   updateScroll();
    },
    hide : function() {		
		$( ".fw_TranscriptContainer" ).hide();	 
    },
    updateText : function(content) {
			/********************/
				//$('.fw_TranscriptContainer').attr('style','');
				//$('.fw_TranscriptContainer').css('display','none');
				if(globalPath.languageDir == 'ltr'){
				$('.fw_TranscriptContainer').css({right:"132px",top:"3px"});				
				} else{
				$('.fw_TranscriptContainer').css({left:"132px",top:"3px"});
				}
			/********************/
			$( ".fw_TranscriptText").html('<p>'+content+'</p>');
			updateScroll();
		
		/*if(content!="" && content!=null){
			$( ".fw_TranscriptText").html('<p>'+content+'</p>');
			updateScroll();
		}else{
			$( ".fw_TranscriptText").html('<p></p>');
			methods.hide();
			try{
				navigationEvent.addTranscriptOffClass()	
			}catch(err){}
		}*/
    },
    updateScroll : function(content) {		
		updateScroll();
    }
  };

  $.fn.fw_Transcript = function( method ) {    
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
 };
  $.extend({fw_Transcript: $.fn.fw_Transcript});
  /* getTranscriptHtml is used to add the Transcript HTML in body */
  getTranscriptHtml = function() {  
	var tTip =
	"<div class='fw_Transcript-panel' ><div class='fw_TranscriptContainer'><div class='fw_Transcript' title=''><div class='fw_TranscriptTextContainer' tabindex='3'><div id='fw_TranscriptScrollbar'><div></div></div><div id='fw_tranScrollBGParent'><div id='fw_TranscriptScrollbarBg'></div></div><div class='fw_TranscriptText'></div></div><a href='javascript:void(0)' alt='Close Transcript' class='fw_CloseTranscript'></a></div><div class='fw_transcriptArrow'></div></div></div>";
	if ($(".fw_Transcript").length > 0){
	  return "";
	}else{
	 return tTip;  
	}
   };
   scrollbarDragging= function(){
	   var scrPos = $('#fw_TranscriptScrollbar').position().top;
	   var pos=scrPos*((tCntA)/(tCntH))
	   pos=Math.round(pos);	  
	   pos =  globalSettings.closestNumber(tScrollArray,pos);	   
	  if (scval != pos) {
	  	$('.fw_TranscriptText').stop();
	  	 $('.fw_TranscriptText').animate({top: -(pos)});
	  }
	  scval=pos;	   
   };
   updateScroll = function(){
   		 scval=0;	  
	   var th=$('.fw_TranscriptContainer').height();	
		$('.fw_TranscriptText,#fw_TranscriptScrollbar').css({top: "0px"});
		tCntH = $('.fw_TranscriptTextContainer').height();
		tCntA = $('.fw_TranscriptText').height();	
		tScrH = (tCntH / (tCntA/tCntH))-10;
		if(tScrH<10){
			tScrH=10;	
		}
		$('#fw_TranscriptScrollbar').height(tScrH);		
		if(($('#fw_TranscriptScrollbar').height()+10)>= ($('.fw_TranscriptTextContainer').height())){
			$('#fw_TranscriptScrollbar, #fw_TranscriptScrollbarBg,#fw_tranScrollBGParent').hide();
		}else{
			$('#fw_TranscriptScrollbar, #fw_TranscriptScrollbarBg,#fw_tranScrollBGParent').show();	
		}		
   };
   
   
})( jQuery );