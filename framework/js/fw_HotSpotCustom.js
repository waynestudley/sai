/*----------------------------------------
	Name: fw_HotSpot.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_HotSpotCustom(_xml){    
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
	var currentTabId=6;
	var currentSPId=0;
	var send=false;
	var tbCnt;
	var hType=pageXml.type.toLowerCase();
	var parentClass='.hotSpotCustom';
	/* 	$('.pageText p').html(pageXml.contentText[0].text[0].Text);
		if(globalPath.languageDir == 'ltr'){
		$('.pageText p').css({'margin-left':marL,'margin-top':marT });
		}else{
		$('.pageText p').css({'margin-right':marR,'margin-top':marT });
		} */
	
	var pageTxtStr="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		pageTxtStr+='<div class="htcText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
	}
	$('.pageText').html(pageTxtStr);
	
	/************************/
	
	if(pageXml.pageTitle!=null){
		var pageTitleStyle= pageXml.pageTitle[0].style||''; 
		$('.pageTitle').attr('style',pageTitleStyle)
	}
	if(pageXml.instructionText[0].style!=null){
		var instStyle= pageXml.instructionText[0].style||''; 
		$('.pageInstruction').attr('style',instStyle)
	}
	if(pageXml.transcript[0].style!=null){
		$('.fw_TranscriptContainer').attr('style',pageXml.transcript[0].style)
	}
	if(pageXml.contentBg[0].style!=null){
		$('.content-bg').attr('style',pageXml.contentBg[0].style)
	}
	/************************/
	

	if (lmsData != "") {		
		dataArray = lmsData.split('^');
	}else{
		for (var i = 0; i < totalHotSpot; i++) {
			dataArray.push(0);
		}
	}
	var className=pageXml.className;
   	$('.hotSpotCustom').addClass(className);
		var hSContainerBG=pageXml.contentBackground[0].img[1].path;
		var hsBgAltText=pageXml.contentBackground[0].img[1].Text;
			str +='<img class="hSContainer"  src="'+hSContainerBG+'" alt="'+hsBgAltText+'" title="" tabindex="' + currentTabId + '" />'
			
	for(var i=0;i<totalHotSpot;i++){
		var txt=pageXml.hotSpotContent[0].hotSpot[i].buttonText[0].Text;
		var id="hot_"+i;
		var imgId="btnImg_"+i;
		
			if(pageXml.hotSpotContent[0].hotSpot[i].img!=null){
					var btnImgL=pageXml.hotSpotContent[0].hotSpot[i].img[0].left;
					var btnImgR=pageXml.hotSpotContent[0].hotSpot[i].img[0].right;
					var btnImgT=pageXml.hotSpotContent[0].hotSpot[i].img[0].top;
					var altText=pageXml.hotSpotContent[0].hotSpot[i].img[0].Text;
					var btnImg=pageXml.hotSpotContent[0].hotSpot[i].img[0].path;
					if(globalPath.languageDir == 'ltr'){
					str += '<img id="'+imgId+'" src="'+btnImg+'" alt="'+altText+'" title="" class="btnImg posAB" style="left:'+btnImgL+';top:'+btnImgT+';"  />';
					} else {
					str += '<img id="'+imgId+'" src="'+btnImg+'" alt="'+altText+'" title="" class="btnImg posAB" style="right:'+btnImgR+';top:'+btnImgT+';"  />';
					}
				}
			var tickStyle = pageXml.hotSpotContent[0].hotSpot[i].tick[0].style || '';
			if(globalPath.languageDir == 'ltr'){
			str += '<div class="hotSpotContaint" id="' + id + '"  ><span class="tickCross" style="'+tickStyle+'" ></span><a class="hotSpotButton"  href="javascript:void(0);" tabindex="' + currentTabId + '"><table class="tabText" ><tr><td>' + txt + '</td></tr></table></a></div>';
			}else{
			str += '<div class="hotSpotContaint" id="' + id + '"  ><span class="tickCross" style="'+tickStyle+'"></span><a class="hotSpotButton"  href="javascript:void(0);" tabindex="' + currentTabId + '"><table class="tabText" ><tr><td>' + txt + '</td></tr></table></a></div>';
			}
		
		buttonArray.push('#'+id);
		tempArray.push(0);
	
	}
	if(pageXml.popBackground[0].img[0].path!=""){
		$('.popUpImg').attr("src",pageXml.popBackground[0].img[0].path);
	}else{
		$('.popUpImg').remove();
	}
	
	$('.hotSpotContainer').html(str);
	
	for(var i=0;i<totalHotSpot;i++){
		setPosition(buttonArray[i],pageXml.hotSpotContent[0].hotSpot[i]);
			var ob=$(buttonArray[i]).find('a');
			$(ob).css({paddingTop:pageXml.hotSpotContent[0].hotSpot[i].buttonText[0].paddingTop,height:pageXml.hotSpotContent[0].hotSpot[i].buttonText[0].height});
	}
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	var className= pageXml.contentBackground[0].img[0].className || '';
		var imgStyle= pageXml.contentBackground[0].img[0].style || '';
		$('.hotspotBg').addClass(className);
		$('.hotspotBg').attr('style',imgStyle);
	$('.hotspotBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
	//$('.hotspotBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
	//$('.hotspotBg').attr("title","");
	$(hotSpotButton).hover( function(){
		if($(this).hasClass(selectedClass)  || (!globalSettings.isDesktop())){
			return false;
		}
		$(this).addClass(hotSpotHoverClass);		
	},
	  function () {
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
		
		var id= parseInt($(this).parent().attr('id').split('hot_')[1]);
		currentSPId=id;
		$('.popUpContainer').hide();
			var rt=pageXml.hotSpotContent[0].hotSpot[id].popText[0].animPosRight || '570px';
			var tp=pageXml.hotSpotContent[0].hotSpot[id].popText[0].animPosTop || '90px';
				$('.popUpContainer').css({width:'40px', height:'40px',right:rt,top:tp});
				$('.popUpText, .closePopUp').hide();
				$('.popUpContainer').show();
				var animWidth=pageXml.hotSpotContent[0].hotSpot[id].popText[0].width;
				var animHeight=pageXml.hotSpotContent[0].hotSpot[id].popText[0].height;
				var animTop=pageXml.hotSpotContent[0].hotSpot[id].popText[0].top;
				var animRight=pageXml.hotSpotContent[0].hotSpot[id].popText[0].right;
				$('.popUpContainer').animate({width:animWidth, height:animHeight,right:animRight,top:animTop},500, function() {
					var str="";
					for(var i=0;i<pageXml.hotSpotContent[0].hotSpot[id].popText[0].text.length;i++){
						var cln="pText"+i;
						var pTextStyle=pageXml.hotSpotContent[0].hotSpot[id].popText[0].text[i].style ||'';
						str+='<div id="'+cln+'" class="insertTab" style="'+pTextStyle+'">'+pageXml.hotSpotContent[0].hotSpot[id].popText[0].text[i].Text+'</div>'
						setStyle("#"+cln,pageXml.hotSpotContent[0].hotSpot[id].popText[0].text[i]);
					 }
					 
					$('.popUpText').html(str);
					
					//$('.popUpText').html(pageXml.hotSpotContent[0].hotSpot[id].popText[0].Text);
					updateTabIndex();
					$('.popUpText,.closePopUp').show();
				});

		
		var preVal=parseInt(dataArray[id]);
		dataArray[currentSPId]=1;
		tempArray[currentSPId]=1;		
		if(preVal==0){
			updateLMSData();
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
		//$(hotSpotButton).find('.hsTextImg').attr('src',pageXml.conTextBackground[0].img[0].path);
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
			$("#hot_"+(currentSPId+1)+" a").focus();
		}
	});
	  
    var preloadImagesArray=new Array();
	for (var i = 0; i < pageXml.contentBackground[0].img.length; i++) {
		preloadImagesArray.push(pageXml.contentBackground[0].img[i].path);
	}
		preloadImagesArray.push(pageXml.popBackground[0].img[0].path);		
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
	 function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var fts =(_xml.fontSize==null?'14px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
		var txtB=(_xml.textAlign==null?'right':_xml.textAlign);
		var wd  =(_xml.width==null?'auto':_xml.width);
		var ht  =(_xml.height==null?'auto':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var rit =(_xml.right==null?'':_xml.right);
		var tp  =(_xml.top==null?'':_xml.top);
	    var pos =(_xml.position==null?'absolute':_xml.position);
		if(_xml.position!=null){
			$(obj).removeClass('posAB');
		}
		if(globalPath.languageDir == 'ltr'){
		$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtA,position:pos});
		}else{
		$(obj).css({right:rit,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtB,position:pos});
		}
	}
	  function updateTabIndex(){
	  	$('.popUpImg, .popUpText, .closePopUp, .popUpImg').removeAttr("tabindex");		
		tbCnt=7;
		$('.insertTab').removeAttr('tabindex');
			
		for (var i = 0; i <= totalHotSpot; i++) {
			$('#btnImg_'+i).attr('tabindex',tbCnt);
			tbCnt++;
			$('#hot_'+i).find('.hotSpotButton').attr('tabindex',tbCnt);
			tbCnt++;
			if($('.popUpContainer').is(':visible') && i==currentSPId){
				$('#btnImg_'+i).attr('tabindex',tbCnt);
				tbCnt++;
				$('#hot_'+i ).find('.hotSpotButton').attr('tabindex',tbCnt);				
				tbCnt++;
				$('.popUpContainer .popUpImg').attr('tabindex',tbCnt);
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
