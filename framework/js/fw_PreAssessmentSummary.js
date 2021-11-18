/*----------------------------------------
	Name: fw_KnowledgeCheckSummary.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_PreAssessmentSummary(_xml) {
	var pageXml = _xml;
	var prePath1 = "";
	var altText1 = "";
	this.updatePageLayOut = updatePageLayOut;
	var isPreScore = navigationData.preAssessmentScore;
	var anyModPassPreAss = navigationData.anyModPassPreAss;
	var str = '';	
	var preloadImagesArray=new Array();
	var feedbackObj;
	var tbCnt = 5;
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
	if (isPreScore == 100) {
		$('.KC_Info').html(pageXml.feedbackPass[0].text[0].Text);
		setStyle(".KC_Info",pageXml.feedbackPass[0].text[0]);
		if(pageXml.feedbackPass[0].text){
			$('.KC_Info2').html(pageXml.feedbackPass[0].text[1].Text);
			setStyle(".KC_Info2",pageXml.feedbackPass[0].text[1]);
		}else{
			$('.KC_Info2').remove();
		}
	} else if (anyModPassPreAss) {
		$('.KC_Info').html(pageXml.feedbackPartial[0].text[0].Text);
		setStyle(".KC_Info",pageXml.feedbackPartial[0].text[0]);
		if(pageXml.feedbackPartial[0].text){
			$('.KC_Info2').html(pageXml.feedbackPartial[0].text[1].Text);
			setStyle(".KC_Info2",pageXml.feedbackPartial[0].text[1]);
		}else{
			$('.KC_Info2').remove();
		}
	} else {
		$('.KC_Info').html(pageXml.feedbackFail[0].text[0].Text);
		setStyle(".KC_Info",pageXml.feedbackFail[0].text[0]);
		if(pageXml.feedbackFail[0].text[1] != undefined){
			$('.KC_Info2').html(pageXml.feedbackFail[0].text[1].Text);
			setStyle(".KC_Info2",pageXml.feedbackFail[0].text[1]);
		}else{
			$('.KC_Info2').remove();
		}
	}
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	updatePageLayOut();
	
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			
			preloadImagesArray.push(iPadImgPath);		
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}
	
	$.imgpreload(preloadImagesArray,
		{
			each: function()
			{	
			},
			all: function()
			{
				try{
					 templateMediator.templateLoadComplete();
					 pageTitle.updateTitleByText(pageXml.contentTitle[0].text[0].Text);
					 $("div[tabindex=1]").focus();
		 			 templateMediator.pageVisited();
					if (navigationData.isPass) {
						 /*****************/
						/* navigationData.iCertify=true;
						if(isNull(navigationData.passDate)){
							navigationData.passDate= globalSettings.getTodayDate();
						}	 */				
						/******************/
					}
					 navigationEvent.updateGlobleFocus();
				}catch(err){}
			}
	});



	function updatePageLayOut() {
	
	}
	function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var bgColor =(_xml.bgColor==null?'#333740':_xml.bgColor);
		var padding =(_xml.padding==null?'':_xml.padding);
		var fts =(_xml.fontSize==null?'16px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
		var txtB=(_xml.textAlign==null?'right':_xml.textAlign);
		var wd  =(_xml.width==null?'auto':_xml.width);
		var ht  =(_xml.height==null?'auto':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var rit =(_xml.right==null?'':_xml.right);
		var tp  =(_xml.top==null?'':_xml.top);
	    var pos =(_xml.position==null?'absolute':_xml.position);
	    var fontFamily =(_xml.fontFamily==null?'':_xml.fontFamily);
		if(globalPath.languageDir == 'ltr'){
		$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos,'font-family':fontFamily});
		} else{
		$(obj).css({right:rit,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos,'font-family':fontFamily});
			}
	}

	function updateTabIndex() {
		navigationEvent.updateGlobleFocus(tbCnt);
	}
}