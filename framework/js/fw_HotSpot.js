/*----------------------------------------
	Name: fw_HotSpot.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_HotSpot(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var hotSpotButton=".hotSpotButton";
	var selectedClass = "hotSpotSelect";
	var hotSpotHoverClass ="hotSpotHover";
	this.updatePageLayOut=updatePageLayOut;	

	var totalHotSpot=pageXml.hotSpotContent[0].hotSpot.length;
	var str='';
	var lmsData=navigationData.getCurrentPageData();
	var dataArray= new Array();
	var tempArray= new Array();
	var buttonArray= new Array();		
	var updateDone=false;
	var currentTabId=7;
	var currentSPId=0;
	var send=false;
	var tbCnt;
	var hType=pageXml.type.toLowerCase();
	var hotSpotType=0;
	var parentClass='.hotSpot1';
	var iPadBackground=pageXml.contentBackground[0].img[0].ipadPath;
	var hotSpotTypeArray= new Array("hotSpot1","hotSpot2","hotSpot3","hotSpot4");	
	for(var i=0;i<hotSpotTypeArray.length;i++){
		if(hType==hotSpotTypeArray[i].toLowerCase()){
			hotSpotType=i;
			break;
		}	
	}
	if(pageXml.bgType!=null){
		$('.hotspotBg').addClass(pageXml.bgType)
	}else{
		$('.hotspotBg').addClass('normalHotspotBg');
	}
	str="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		str+='<div class="pText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>'
	}
	$('.pageText').html(str);
	str="";
	
	parentClass ='.'+hotSpotTypeArray[hotSpotType];
	$('.hotSpot1').attr('class',hotSpotTypeArray[hotSpotType]);
	
	if (lmsData != "") {		
		dataArray = lmsData.split('^');
	}else{
		for (var i = 0; i < totalHotSpot; i++) {
			dataArray.push(0);
		}
	}
	var className=pageXml.className;
   	$(parentClass).addClass(className);
	if (hotSpotType == 0) {
		var hSContainerBG=pageXml.contentBackground[0].img[1].path;
		var hsBgAltText=pageXml.contentBackground[0].img[1].Text;
			str +='<img class="hSContainer"  src="'+hSContainerBG+'" alt="'+hsBgAltText+'" tabindex="' + currentTabId + '" />'
	  }
			
	for(var i=0;i<totalHotSpot;i++){
		var txt=pageXml.hotSpotContent[0].hotSpot[i].buttonText[0].Text;
		var id="hot_"+i;
		if (hotSpotType == 0) {
			var btnImg=pageXml.hotSpotContent[0].hotSpot[i].img[0].path;
			var btnImgL=pageXml.hotSpotContent[0].hotSpot[i].img[0].left;
			var btnImgR=pageXml.hotSpotContent[0].hotSpot[i].img[0].right;
			var btnImgT=pageXml.hotSpotContent[0].hotSpot[i].img[0].top;
			var altText=pageXml.hotSpotContent[0].hotSpot[i].img[0].Text;
			if(globalPath.languageDir == 'ltr'){
			str += '<img src="'+btnImg+'" alt="'+altText+'" title="" class="btnImg posAB" style="left:'+btnImgL+';top:'+btnImgT+';"  /><div class="hotSpotContaint" id="' + id + '"  ><span class="tickCross"></span><a class="hotSpotButton"  href="javascript:void(0);" tabindex="' + currentTabId + '"><table class="tabText" ><tr><td>' + txt + '</td></tr></table></a></div>';
			}else{
			str += '<img src="'+btnImg+'" alt="'+altText+'" title="" class="btnImg posAB" style="right:'+btnImgR+';top:'+btnImgT+';"  /><div class="hotSpotContaint" id="' + id + '"  ><span class="tickCross"></span><a class="hotSpotButton"  href="javascript:void(0);" tabindex="' + currentTabId + '"><table class="tabText" ><tr><td>' + txt + '</td></tr></table></a></div>';
			}
		}
		else 
			if (hotSpotType == 1) {
				var bgImg = pageXml.contentBackground[0].img[i].path;
				var hsbgImg = pageXml.conTextBackground[0].img[0].path;
				var altText = pageXml.contentBackground[0].img[i].Text;
				str += '<div class="hotSpotContaint" id="' + id + '" ><span id="tick_' + i + '" class="tickCross"></span><a tabindex="' + currentTabId + '" class="hotSpotButton"  href="javascript:void(0);"><img src="' + bgImg + '" alt="' + altText + '" class="pImg" title="" /><img src="' + hsbgImg + '" class="hsTextImg" title="" /><span class="hotSpotText">' + txt + '</span></a></div>';
			}else if (hotSpotType == 3) {
						str += '<div class="hotSpotContaint" id="' + id + '" ><span id="tick_' + i + '" class="tickCross"></span><a tabindex="' + currentTabId + '" class="hotSpotButton transparentBg"  href="javascript:void(0);"><span class="hotSpotText">' + txt + '</span></a></div>';
			}else {
				if(pageXml.hotSpotContent[0].hotSpot[i].buttonImg!=null){
						var buttonImg= pageXml.hotSpotContent[0].hotSpot[i].buttonImg[0].path;
						var buttonImgAltTxt= pageXml.hotSpotContent[0].hotSpot[i].buttonImg[0].Text;
						var tickStyle= pageXml.hotSpotContent[0].hotSpot[i].tick[0].style;
						str += '<div class="hotSpotContaint" id="' + id + '" ><span class="tickCross" style="'+tickStyle+'"></span><a tabindex="' + currentTabId + '" class="hotSpotButton transparentBg"  href="javascript:void(0);"><table><tr><td class="htBtnImg" ><img src="'+buttonImg+'" alt="'+buttonImgAltTxt+'" /></td><td class="tabText">' + txt + '</td></tr></table></a></div>';
					}else{
						str += '<div class="hotSpotContaint" id="' + id + '" ><span class="tickCross"></span><a tabindex="' + currentTabId + '" class="hotSpotButton transparentBg"  href="javascript:void(0);"><table><tr><td class="tabText">' + txt + '</td></tr></table></a></div>';
				}
			}
		buttonArray.push('#'+id);
		tempArray.push(0);
		currentTabId++;
	}

	
	
	if(hotSpotType==0){
		$('.popUpImg').attr("src",pageXml.popBackground[0].img[0].path);
	}else{
		$('.popUpImg').remove();
	}
	$('.hotSpotContainer').html(str);
	
	for(var i=0;i<totalHotSpot;i++){
		setPosition(buttonArray[i],pageXml.hotSpotContent[0].hotSpot[i]);
		if(hotSpotType==0){
			var ob=$(buttonArray[i]).find('a');
			$(ob).css({paddingTop:pageXml.hotSpotContent[0].hotSpot[i].buttonText[0].paddingTop,height:pageXml.hotSpotContent[0].hotSpot[i].buttonText[0].height});
		}
		
	}
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
		if(iPadBackground != undefined){
			if(globalSettings.isDesktop()){
				$('.hotspotBg').attr("src", pageXml.contentBackground[0].img[0].path);
			}else{
				$('.hotspotBg').attr('src',pageXml.contentBackground[0].img[0].ipadPath);
			}
		}else{
			$('.hotspotBg').attr("src", pageXml.contentBackground[0].img[0].path);
		}
		$('.hotspotBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
		$('.hotspotBg').attr("title", "");
		
	$(hotSpotButton).hover( function(){
		if($(this).hasClass(selectedClass)  || (!globalSettings.isDesktop())){
			return false;
		}
		if (hotSpotType == 1) {
			$(this).find('.hsTextImg').attr('src',pageXml.conTextBackground[0].img[1].path);
		}
		$(this).addClass(hotSpotHoverClass);		
	},
	  function () {
	  	if (hotSpotType == 1 && !$(this).hasClass(selectedClass)) {
			$(this).find('.hsTextImg').attr('src',pageXml.conTextBackground[0].img[0].path);
		}
		$(this).removeClass(hotSpotHoverClass);
		
		
	});
	
	updateTabIndex();
	
	$(hotSpotButton).click(function(){
		if($(this).hasClass(selectedClass)){
			return false;
		}
		$(hotSpotButton).removeClass(selectedClass)
		$(hotSpotButton).removeClass(hotSpotHoverClass)
		$(this).addClass(selectedClass);
		
		if (hotSpotType == 1) {
			$('.pImg').attr('style','');
			$(hotSpotButton).find('.hsTextImg').attr('src',pageXml.conTextBackground[0].img[0].path);
			$(this).find('.hsTextImg').attr('src',pageXml.conTextBackground[0].img[2].path);
			/*var obj=$(this).parent().find('.pImg');
			var w=$(obj).width();
			var h=$(obj).height();			
			$(this).parent().find('.pImg').animate({left:'-5px',top:'-5px',width:(w+10)+'px',height:(h+10)+'px'},400)
			$('.hotSpotContaint').css('z-index','10');
			$(this).parent().css('z-index','1000');*/
		}
		var id= parseInt($(this).parent().attr('id').split('hot_')[1]);
		currentSPId=id;
		$('.popUpContainer').hide();
		if(hotSpotType==0){
			var lf=$(this).parent().css('left');
			var rt=$(this).parent().css('right');
			var tp=(getNumber($(this).parent().css('top'))+20)+'px';
			if(globalPath.languageDir == 'ltr'){
			$('.popUpContainer').css({width:'40px', height:'40px',left:lf,top:tp});
			$('.popUpText, .closePopUp').hide();
			$('.popUpContainer').show();
			$('.popUpContainer').animate({width:'509px', height:'385px',left:'477px',top:'45px'},500, function() {
				updateTabIndex();
				$('.popUpText').html(pageXml.hotSpotContent[0].hotSpot[id].popText[0].Text);
				$('.popUpText,.closePopUp').show();
			});
			}else{
			$('.popUpContainer').css({width:'40px', height:'40px',right:rt,top:tp});
			$('.popUpText, .closePopUp').hide();
			$('.popUpContainer').show();
			$('.popUpContainer').animate({width:'509px', height:'385px',right:'477px',top:'45px'},500, function() {
				updateTabIndex();
				$('.popUpText').html(pageXml.hotSpotContent[0].hotSpot[id].popText[0].Text);
				$('.popUpText,.closePopUp').show();
			});
			}
		}else{
			var str="";
			for(var i=0;i<pageXml.hotSpotContent[0].hotSpot[id].popText[0].text.length;i++){
				str+="<div class='insertTab'><p>"+pageXml.hotSpotContent[0].hotSpot[id].popText[0].text[i].Text+"</p></div>"
			}
			$('.popUpText').html('<div class="scrollContent"><div class="textDiv">'+str+'</div></div>');
			$('.popUpText,.closePopUp').show();
			$('.popUpContainer').attr('style',pageXml.hotSpotContent[0].hotSpot[id].popText[0].style);
			$('.popUpContainer').show();
			if(pageXml.hotSpotContent[0].hotSpot[id].arrow!=null){
				$('.popArrow').remove();
				$('.popUpContainer').append('<div class="popArrow" style="'+pageXml.hotSpotContent[0].hotSpot[id].arrow[0].style+'"></div>');
			}
			var popH=$('.popUpContainer').outerHeight();
			var PopTextMargin=20;
			var _ht=popH-PopTextMargin+"px"
			$('.popUpText').css('height',_ht);				
			$('.scrollContent').css('height','auto');			
			$('.popUpText').css('margin','0px');
			$('.scrollContent').css('margin','10px');
			$('.scrollContent').css('height',($('.scrollContent').parent().height()-5))		
			$('.scrollContent .textDiv').css('height','auto');			
			if($('.textDiv').parent().height() < $('.textDiv').height()){
				$('.scrollContent').fw_Scroll({color:"#0057a6",width:10});
			}
			
		}
		
		
		var preVal=parseInt(dataArray[id]);
		dataArray[currentSPId]=1;
		tempArray[currentSPId]=1;		
		if(preVal==0){
			updateLMSData();
		}
		if(pageXml.hotSpotContent[0].hotSpot[id].btnTick!=null){
			var styleStr = pageXml.hotSpotContent[0].hotSpot[id].btnTick[0].style;
			$(this).parent().find('.tickCross').attr('style',styleStr);
		}
		
		$(this).parent().find('.tickCross').addClass('tick');
		//updateTabIndex();
		if(tempArray.toString().indexOf("0")<0 && !send){
			send=true;
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			templateMediator.pageVisited();
		}
		
	});
	
	$('.closePopUp').click(function(){
		$('.popUpContainer').hide();
		if (hotSpotType == 1) {
			$(hotSpotButton).find('.hsTextImg').attr('src', pageXml.conTextBackground[0].img[0].path);
		}
		 $(hotSpotButton).removeClass(selectedClass);
		 updateTabIndex();		
		 return true;
	});
	$('.closePopUp').focusout(function() {			
		var fid= Number($("#hot_"+currentSPId).find('.hotSpotButton').attr('tabindex'));
		if(currentSPId==(totalHotSpot-1)){
			var str="a[tabindex="+(tbCnt+1)+"]";
			$(str).focus();
		}else{
			//var str="a[tabindex="+(fid+1)+"]";
			//$(str).focus();
			$("#hot_"+(currentSPId+1)+" a").focus();
		}
		
	});
	  
    var preloadImagesArray=new Array();
	for (var i = 0; i < pageXml.contentBackground[0].img.length; i++) {
		
		if(iPadBackground != undefined){
			if(globalSettings.isDesktop()){
				preloadImagesArray.push(pageXml.contentBackground[0].img[i].path);
			}else{
				preloadImagesArray.push(pageXml.contentBackground[0].img[i].ipadPath);
			}
		}else{
			preloadImagesArray.push(pageXml.contentBackground[0].img[i].path);
		}
		//preloadImagesArray.push(pageXml.contentBackground[0].img[i].path);
	}
	if(hotSpotType==0){
		preloadImagesArray.push(pageXml.popBackground[0].img[0].path);
	}		
	$.imgpreload(preloadImagesArray,{
		each: function(){},
		all: function(){
			try{
				templateMediator.templateLoadComplete();
				$("div[tabindex=1]").focus();					
			}catch(err){}
		}
	});
	
	//templateMediator.templateLoadComplete();
	function updateLMSData(){
		var tempData=dataArray.join("^");
		navigationData.updateCurrentPageData(tempData);
	}
	
	 function updatePageLayOut(){
	 	
	 } 
	 
	  function updateTabIndex(){
	  	$('.popUpImg, .popUpText, .closePopUp, .hotSpot2PopHeader').removeAttr("tabindex");		
		 tbCnt=7;
		$('.insertTab').removeAttr('tabindex');
			
		for (var i = 0; i <= totalHotSpot; i++) {
			$('#hot_'+i).find('.hotSpotButton').attr('tabindex',tbCnt);
			tbCnt++;
			if($('.popUpContainer').is(':visible') && i==currentSPId){
			
				$('#hot_'+i ).find('.hotSpotButton').attr('tabindex',tbCnt);				
				tbCnt++;
				$('.popUpContainer .hotSpot2PopHeader').attr('tabindex',tbCnt);
				tbCnt++;
				$('.popUpContainer .popUpText').find('.insertTab').each(function(){
					$(this).attr('tabindex',tbCnt);
					tbCnt++	
				})			
				$('.popUpContainer .closePopUp').attr('tabindex',tbCnt);	
				tbCnt++;
			}	
		}				
		navigationEvent.updateGlobleFocus(tbCnt);
	 }
	
}
