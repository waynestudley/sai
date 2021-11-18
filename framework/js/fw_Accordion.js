/*----------------------------------------
	Name: fw_Accordion.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_Accordion(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var accordionButton=".accordionButton";
	var selectedClass = "accordionSelect";
	var accordionHoverClass ="accordionHover";
	this.updatePageLayOut=updatePageLayOut;	
	var totalAccordion=pageXml.accordionContent[0].accordion.length;
	var str='';
	var currentOpen=null;
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
	var preloadImagesArray=new Array();
		
	var parentClass='.accordion';
	var pageTxtStr="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		pageTxtStr+='<div class="accText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
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
		for (var i = 0; i < totalAccordion; i++) {
			dataArray.push(0);
		}
	}
	var className=pageXml.className;
   	$('.accordion').addClass(className);
	for(var i=0;i<totalAccordion;i++){
		var txt=pageXml.accordionContent[0].accordion[i].buttonText[0].Text;
		var id="acc_"+i;				
		var accStyle= pageXml.accordionContent[0].accordion[i].style || '';
		var acctxtStyle= pageXml.accordionContent[0].accordion[i].buttonText[0].style || '';
		
		str += '<div class="tab-holder"><a href="javascript:void(0)" id="'+id+'" class="accordionButton" style="'+accStyle+'"  ><span class="text" style="'+acctxtStyle+'">'+txt+'</span><div class="icon-holder"><div class="icon-holder-table"><div class="icon-holder-cell"><span class="iconfont icon"></span></div></div></div></a>';						
		var sss = pageXml.accordionContent[0].accordion[i].popText[0];
		var popStyle= sss.style || '';
		
		str += '<div class="accordion-popup" style="'+popStyle+'">';
		for(var j=0;j<sss.text.length;j++){
			var poptxtStyle= sss.text[j].style || '';				
			str += '<p style="'+poptxtStyle+'">'+sss.text[j].Text+'</p>';
		}
		str += '</div></div>';		
		buttonArray.push('#'+id);
		tempArray.push(0);	
	}	
	$('.accordionContainer').html(str);	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	
	 $(".tab-holder").each(function(index){
     	var ht = pageXml.accordionContent[0].accordion[index].iconparDefHt;
		$(this).find('.icon-holder').css('height',ht+'px')
    });
		
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			var className= pageXml.contentBackground[0].img[0].classNameIpad || '';
			var imgStyle= pageXml.contentBackground[0].img[0].styleIpad || '';
			$('.panelBg').addClass(className);
			$('.panelBg').attr('style',imgStyle);
			preloadImagesArray.push(iPadImgPath);		
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			var className= pageXml.contentBackground[0].img[0].className || '';
			var imgStyle= pageXml.contentBackground[0].img[0].style || '';
			$('.panelBg').addClass(className);
			$('.panelBg').attr('style',imgStyle);
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{	
		if(pageXml.contentBackground[0].img[0].path!=""){
				var className= pageXml.contentBackground[0].img[0].className || '';
				var imgStyle= pageXml.contentBackground[0].img[0].style || '';
				$('.panelBg').addClass(className);
				$('.panelBg').attr('style',imgStyle);
				
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
				
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}
	if(preloadImagesArray.length > 0){
		$.imgpreload(preloadImagesArray,{
			each: function(){},
			all: function(){
				try{
					templateMediator.templateLoadComplete();
					$("div[tabindex=1]").focus();
				}catch(err){}
			}
		});
	}else{
		templateMediator.templateLoadComplete();		
	}
	
	/*---------------*/	
	
	
	$(accordionButton).hover( function(){
		if(!globalSettings.isDesktop()){
			return false;
		}
		$(this).addClass(accordionHoverClass);		
	},
	  function () {
		$(this).removeClass(accordionHoverClass);
		
		
	});
	
	updateTabIndex();
	
	$(accordionButton).click(function(){
		var cThis =$(this);		
		$(accordionButton).removeClass(accordionHoverClass);
		
		if(cThis.hasClass(selectedClass)){
			currentOpen.slideUp(600,function(){});	
			cThis.removeClass(selectedClass);
			currentOpen = null;
			var ht = pageXml.accordionContent[0].accordion[currentSPId].iconparDefHt;
			cThis.find('.icon-holder').animate({'height':ht+'px'},600);
		}else{			
			if(currentOpen!=null){
				$(currentOpen).slideUp(600,function(){});
				$(accordionButton).removeClass(selectedClass);
				var ht1 = pageXml.accordionContent[0].accordion[currentSPId].iconparDefHt;
				$(currentOpen).parent().find('.icon-holder').animate({'height':ht1+'px'},600);
			}
			
			
			var id= parseInt($(cThis).attr('id').split('acc_')[1]);
			currentSPId=id;
			var ht1 = Number(pageXml.accordionContent[0].accordion[currentSPId].iconparDefHt);
			var ht = Number(pageXml.accordionContent[0].accordion[currentSPId].iconparHeight);
			
			cThis.addClass(selectedClass);
			
			currentOpen = cThis.parent().find('.accordion-popup');
			$(currentOpen).css('height',(ht-ht1-10)+'px');	
			$(currentOpen).slideDown(600,function(){
				
			});	 
			//var ht = pageXml.accordionContent[0].accordion[currentSPId].iconparHeight;
			cThis.find('.icon-holder').animate({'height':ht+'px'},600);	
			
			var preVal=parseInt(dataArray[id]);
			dataArray[currentSPId]=1;
			tempArray[currentSPId]=1;		
			if(preVal==0){
				updateLMSData();
			}
			if(tempArray.toString().indexOf("0")<0 && !send){
				send=true;
				pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
				templateMediator.pageVisited();
			}
		}			
	});	  
   
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
			
		for (var i = 0; i <= totalAccordion; i++) {
			$('#btnImg_'+i).attr('tabindex',tbCnt);
			tbCnt++;
			$('#hot_'+i).find('.accordionButton').attr('tabindex',tbCnt);
			tbCnt++;
			if($('.popUpContainer').is(':visible') && i==currentSPId){
				$('#btnImg_'+i).attr('tabindex',tbCnt);
				tbCnt++;
				$('#hot_'+i ).find('.accordionButton').attr('tabindex',tbCnt);				
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
