/*----------------------------------------
	Name: fw_GlobalSettings.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_GlobalSettings(){		
	this.isIpad = navigator.userAgent.match(/iPad/i)!=null?true:false;
	this.Android = navigator.userAgent.match(/Android/i)!=null?true:false;	
	this.BlackBerry = navigator.userAgent.match(/BlackBerry/i)!=null?true:false;	
	this.iPhone = navigator.userAgent.match(/iPhone|iPod/i)!=null?true:false;
	this.isPortrait=isPortrait;
	this.updateLayOut=updateLayOut;
	this.isDesktop=isDesktop;
	this.isMobile=isMobile;
	this.addTitle=addTitle;
	this.closestNumber=closestNumber;
	this.addAlt=addAlt;
	this.getTodayDate= getTodayDate;	
	this.showFormatedDate= showFormatedDate;	

	if(this.iPhone || this.Android || this.BlackBerry || this.isIpad){		
		$('#hoverCss').remove();
		//$('#btn_AudioOnOff').remove();
	}else{
		
	}
	function getTodayDate(){
		var now = new Date();
		//The getMonth() method returns the month (from 0 to 11) for the specified date, according to local time.
		//Note: January is 0, February is 1, and so on.



		var month=parseInt(now.getMonth())+1;
		var dt= now.getDate() + "_" + month + "_" + now.getFullYear();
		return dt;		
	}
	function showFormatedDate(_str){
		if(!isNull(_str)){
			var temp=_str.split("_");
			var month=parseInt(temp[1])-1;
			var langWiseMonth=globalData.navigationTextXML.monthArr[0].text[month].Text;
			if(globalPath.userLanguage=="cz" || globalPath.userLanguage=="de") {var date=temp[0]+". "+langWiseMonth+" "+temp[2];}
			else if(globalPath.userLanguage=="chs" || globalPath.userLanguage=="cht") {var date=temp[2]+" 年 "+langWiseMonth+" "+temp[0]+" 日";}
			else if(globalPath.userLanguage=="ko") {var date=temp[2]+"년 "+langWiseMonth+" "+temp[0]+"일";}
			else if(globalPath.userLanguage=="ru") {var date=temp[0]+" "+langWiseMonth+" "+temp[2] + " г.";}
			else {var date=temp[0]+" "+langWiseMonth+" "+temp[2];}
			return date;
		}else{
			return "";
		}

	}
	function isPortrait() {
		 if( $(window).width()<$(window).height()){
			return true;
		}else{
			return false;
		}
	}
	window.onorientationchange = function(){
		updateLayOut();	
		$('body').scrollTop(0);
	}
	$(window).resize(function(){
		updateLayOut();
	});

	function getAbsolutePath(){
		var loc = window.location;
		var last = loc.href.lastIndexOf('/');
		return loc.href.substring(0, loc.href.lastIndexOf('/') + 1);
	}
	function isDesktop(){
		if(globalSettings.isIpad || globalSettings.iPhone || globalSettings.Android || globalSettings.BlackBerry){
			return false;
		}else{
			return true;
		}
	}
	function isMobile(){		
		if( globalSettings.iPhone || globalSettings.Android || globalSettings.BlackBerry){
			return true;
		}else{
			return false;
		}
	}
	
	function updateLayOut(){
				
		var myNav = navigator.userAgent.toLowerCase();

		if(myNav.indexOf('trident') != -1){
			$('.wrapper').addClass("ie11");
		}
		if(myNav.indexOf('msie') != -1){		
			$('.wrapper').removeClass("ie11");
			if(parseInt($.browser.version) < 9){
			  $('.wrapper').addClass("ie08");
			}else {
			  $('.wrapper').addClass("ie09");
			}
		}
		//---not fully testing doing for proto need to check on ipad
			var wh=$(window).outerHeight();
			var hh=$('.header').outerHeight();
			var fh=$('.footer').outerHeight();
			var nH=wh-(hh+fh);
			$('.pageContainer').css('height',nH+"px");			
		//---
		/*
		$('.wrapper').css('width',"1010px");
		$('.wrapper').css('height',"650px");
		$('.pageContainer').css('height',"544px");
		if(menuData.moduleIndex<=0 && menuData.pageIndex<=2){
			$('.pageContainer').css('height',"594px");
		}		*/
		if(globalSettings.isIpad){
			$('.wrapper').addClass('isIpad');
		}else{
			$('.wrapper').removeClass('isIpad');
		}
		$('#landscapeView').hide();
		if(!isPortrait()){			
			$('#landscapeView').hide();
		}else{
			
			$('#landscapeView').show();	
		}		
		//scaleWindow()	
		return true;
	}
	
	function scaleWindow(){
		if(!globalSettings.isIpad ){return false;}
		if(globalSettings.isPortrait()){
			var originalWidth  = 1010;			
			var scale = $(window).width()/originalWidth;			
			var transform = "scale("+scale+")";
			$(".wrapper").css("MozTransform", transform).css("transform", transform).css("WebkitTransform", transform);
		}else{
			var transform = "scale(1)";
			$(".wrapper").css("MozTransform", transform).css("transform", transform).css("WebkitTransform", transform);
		}
		$(".wrapper").css('transform-origin','0 0')
		$(".wrapper").css('ms-transform-origin','0 0')
		$(".wrapper").css('-webkit-transform-origin','0 0')
		return true;
	}
	
	
	function addTitle(obj,text){
		return true;
		var txt=text.replace(/(<([^>]+)>)/ig,"");
		$(obj).attr('title',txt);
	}
	function addAlt(obj,text){
		return true;
		var txt=text.replace(/(<([^>]+)>)/ig,"");
		$(obj).attr('alt',txt);
	}
	
	var is_chrome = /chrome/i.test( navigator.userAgent );
	if (is_chrome) {
		try{
			this.window.resizeBy(1, 1);
			this.window.resizeBy(-1, -1);
		}catch(e){
		}
	}
	
	function closestNumber(array,num){
	    var i=0;
	    var minDiff=1000;
	    var ans;
	    for(i in array){
	         var m=Math.abs(num-array[i]);
	         if(m<minDiff){ 
	                minDiff=m; 
	                ans=array[i]; 
	            }
	      }
	    return ans;
	}
	
}