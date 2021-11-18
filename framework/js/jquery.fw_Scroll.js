/*----------------------------------------
 Name: jquery.fw_Scroll.js
 Developed by : Maneesh nanu
 ----------------------------------------*/

(function($){
	var fw_This;
	var fw_Scrollable;
	var fw_Scrollbar;
	var scrollParH;
	var scrollAreaH;
	var scrollScrH;
	var fw_ScrollableOnMove;
	var fw_ScrollableOnMove;
	var scrollElementCnt=0;
	var defaults = {};
	var methods = {
		init : function(options) {
			defaults = {
				color:"#ffffff",
				width:15
			}
			var options = $.extend(defaults, options);
			fw_This = $(this);
			fw_This.children("div:first-child").addClass('scrollable');				
			$(fw_This).append(getScrollbarHtml());
			fw_Scrollable = $(fw_This.find('.scrollable'));
			fw_Scrollbar = $(fw_This.find('.fw_Scrollbar'));			
			var sW=defaults.width;
			var marg=30-sW;
			fw_This.css({"overflow" : "hidden","position" : "relative"})
			if(globalPath.languageDir == 'ltr' || isLangPage){
			fw_Scrollbar.css({'cursor':'pointer','width':'30px','position':'absolute',top:'0px',right:'2px',height:'50px',padding:'1px 0','z-index':'2'});
			fw_Scrollable.css({'margin-right':(sW+5)+'px',position:"absolute",'margin-bottom':'2px'});
			fw_Scrollbar.children("div:first-child").css({'background': 'none repeat scroll 0 0 '+defaults.color,'height': '100%','margin-left': (marg+1)+'px','width': (sW-2)+'px'})
			
			}else{
						if(fw_Scrollbar.parent(this).attr('class')=="dropContent")
						{
							fw_Scrollbar.css({'cursor':'pointer','width':'30px','position':'absolute',top:'0px',right:'2px',height:'50px',padding:'1px 0','z-index':'2'});
						}else{
						
							fw_Scrollbar.css({'cursor':'pointer','width':'30px','position':'absolute',top:'0px',left:'2px',height:'50px',padding:'1px 0','z-index':'2'});
							fw_Scrollable.css({'margin-left':(sW+5)+'px',position:"absolute"});
						}
						
						fw_Scrollbar.children("div:first-child").css({'background': 'none repeat scroll 0 0 '+defaults.color,'height': '100%','margin-right': (marg+1)+'px','width': (sW-2)+'px'})
			}			
			
			scrollParH 	= $(fw_This).height();		
			scrollAreaH	= $(fw_Scrollable).outerHeight(true);	
			scrollScrH = scrollParH / (scrollAreaH/scrollParH);
			fw_Scrollbar.height(scrollScrH);
			if (scrollParH < scrollAreaH) {
				$("." + fw_This.attr('class') + " .fw_Scrollbar").show();
				$("." + fw_This.attr('class') +' .fw_ScrollbarBg').show();
			}else{
				$("." + fw_This.attr('class') + " .fw_Scrollbar").hide();
				$("." + fw_This.attr('class') +' .fw_ScrollbarBg').hide();
			}
			
			$(" .fw_Scrollbar").draggable({
					axis: 'y',
					containment: 'parent',
					drag: function(event, ui) {		
						fw_Scrollable =  $(this).siblings(".scrollable");						
						H_dragging(this,fw_Scrollable);
					}
			});
			scrollElementCnt= $('.pageContainer').find('.scrollable').length;
			if(scrollElementCnt > 1){
				$('.scrollable').parent().on('mouseenter', function (e){ 
						fw_This = $(this);
						fw_Scrollable = $(fw_This.find('.scrollable'));
						fw_Scrollbar = $(fw_This.find('.fw_Scrollbar'));	
				});
				$(" .fw_Scrollbar").draggable({
					axis: 'y',
					containment: 'parent',
					drag: function(event, ui) {		
						fw_Scrollable =  $(this).siblings(".scrollable");						
						H_dragging(this,fw_Scrollable);
					}
				});
			}
			
			$(".scrollBtn").click(function(){
				var scrollBar=$(this).parent().parent().find('.fw_Scrollbar');
				var scrollable=$(this).parent().parent().find('.scrollable');
				onScrollBtnClick(this,scrollBar,scrollable);
			})
			
			//adding the event listerner for Mozilla
			if(window.addEventListener)
				document.addEventListener('DOMMouseScroll', moveObject, false);
			//for IE/OPERA etc
			document.onmousewheel = moveObject;
		},
		update : function(content) {
			fw_This = $(this);
			fw_Scrollable = $(fw_This.find('.scrollable'));
			//fw_Scrollable.html(content.text);
			fw_Scrollable.css('top','0px');
			var sW = parseInt($("."+fw_This.attr('class')+" .fw_Scrollbar div").css('width'));
			var marg = 30-sW;	
			var wid = parseInt(fw_This.css('width'))- sW;
			fw_Scrollable.css('width',wid);	
			scrollParH 	= $(fw_This).height();		
			scrollAreaH	= $(fw_Scrollable).outerHeight(true);	
			if(scrollParH<scrollAreaH){
				$("."+fw_This.attr('class')+" .fw_Scrollbar").show();
				scrollScrH = scrollParH / (scrollAreaH/scrollParH);
				$("."+fw_This.attr('class')+" .fw_Scrollbar").css({'top':'0px','height':scrollScrH});
				$("." + fw_This.attr('class') +' .fw_ScrollbarBg').show();
			}
			else
			{
				$("."+fw_This.attr('class')+" .fw_Scrollbar").hide();
				$("." + fw_This.attr('class') +' .fw_ScrollbarBg').hide();
			}
		}
	};

	$.fn.fw_Scroll = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if( typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.fw_Scroll');
		}
	};
	$.extend({
		fw_Scroll : $.fn.fw_Scroll
	});
	
	function H_dragging(dragthis,Scrollable){	
		scrollParH 	= $(dragthis).parent().height();		
		scrollAreaH	= $(Scrollable).outerHeight(true);		
		scrollScrH = scrollParH / (scrollAreaH/scrollParH);
		var fw_scrPos = $(dragthis).position().top;
		
		$(Scrollable).css({top: -(fw_scrPos*(scrollAreaH/scrollParH)-1)});	
	}
	function getScrollbarHtml() {
		if(fw_This.find('.fw_Scrollbar').length>0){
			return false;
		}
		var str = "";
		str += "<div class='fw_Scrollbar'><div></div></div><div class='fw_ScrollbarBg'><a href='javascript:void(0);' class='scrollBtn scrollUpBtn'></a><a href='javascript:void(0);' class='scrollBtn scrollDownBtn'></a></div>";
		str += "";
		return str;
	};
	
	function moveObject(event){
		if(fw_This.find('.fw_Scrollbar').length<=0){
		return false;
		}
		var delta = 0;
		if (!event) event = window.event;		
		if (event.wheelDelta) {			
			delta = event.wheelDelta / 60;

		}else if (event.detail) {			
			delta = -event.detail / 2;
		}
		var tp=0;
		var ob=fw_This.find('.fw_Scrollbar');
		var tp= $(ob).position().top;
		var oh	= $(fw_This).outerHeight(true)-$(ob).outerHeight(true);
		if(delta<0){		
			tp+=10;
		}else{
			tp-=10;
		}
		if(tp<0){
			tp=0;
		}		
		if(tp>oh){
			tp=oh;
		}
		$(ob).css('top',tp)
		H_dragging(ob,fw_Scrollable);
	}
	function onScrollBtnClick(btn,scrollBar,Scrollable){
		var tp= $(scrollBar).position().top;
		var oh	=  $(scrollBar).parent().outerHeight(true)-$(scrollBar).outerHeight(true);
		//console.log(tp+" :: "+oh)
		if($(btn).hasClass('scrollUpBtn')){
			if(tp>10){
				tp-=20;
			}else{
				tp=0;
			}
		}else{
			if(tp<=0){
				tp+=20;
			} else{
				tp=tp+20;
			}
			if(tp>oh){
				tp=oh;
			}
		}
		$(scrollBar).animate({top: tp},200);
		var scrollParH 	= $(scrollBar).parent().height();		
		var scrollAreaH	= $(Scrollable).outerHeight(true);		
		var scrollScrH = scrollParH / (scrollAreaH/scrollParH);
		$(Scrollable).animate({top: -(tp*(scrollAreaH/scrollParH)-1)},200);	
	}
})(jQuery);