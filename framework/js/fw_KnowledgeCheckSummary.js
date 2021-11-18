/*----------------------------------------
	Name: fw_KnowledgeCheckSummary.js
	Developed by: Suyog Shaha
	Updated by: Sunil Patil
	Purposed : Removed to Print Certificate Button(commented)
	Dated By: 23/01/15
----------------------------------------*/
function fw_KnowledgeCheckSummary(_xml) {
	var pageXml = _xml;
	var prePath1 = "";
	var altText1 = "";
	this.updatePageLayOut = updatePageLayOut;
	var isPass = navigationData.userScore >= playerSetting.passingScore ? true : false;
	var str = '';
	var obj1;
	var feedbackObj;
	var tbCnt = 5;
	 var preloadImagesArray=new Array();
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
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	var obj = pageXml.contentImagePass[0];
	if (!isPass) {
		obj = pageXml.contentImageFail[0];
	}
	if(globalSettings.isIpad){
		var iPadImgPath=obj.img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',obj.img[0].Text);
			
			preloadImagesArray.push(iPadImgPath);		
		}else if(obj.img[0].path!=""){
			$('.panelBg').css('background-image','url(' + obj.img[0].path + ')');
			$('.panelBg').attr('title',obj.img[0].Text);
			preloadImagesArray.push(obj.img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(obj.img[0].path!=""){
			$('.panelBg').css('background-image','url(' + obj.img[0].path + ')');
			$('.panelBg').attr('title',obj.img[0].Text);
			preloadImagesArray.push(obj.img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}
	
	
	if (isPass) {
		str += '<p class="userPass">' + pageXml.contentText[0].text[0].Text + '</p>';
		var fText = "";
		for (var i = 0; i < pageXml.feedbackPass[0].text.length; i++) {
			fText += "<div class='insertTab'><p>" + pageXml.feedbackPass[0].text[i].Text + "</p></div>";
		}
		str += '<div class="fCorrect">' + fText + '</div>';
		feedbackObj = pageXml.feedbackPass[0];
		obj1 = pageXml.contentImagePass[0];
	} else {
		var fText = "";
		for (var i = 0; i < pageXml.feedbackFail[0].text.length; i++) {
			fText += "<div class='insertTab'><p>" + pageXml.feedbackFail[0].text[i].Text + "</p></div>";
		}
		str += '<div class="fIncorrect">' + fText + '</div>';
		feedbackObj = pageXml.feedbackFail[0];
		obj1 = pageXml.contentImageFail[0];
	}
	str = str.replace("##", navigationData.userScore);
	str = str.replace("#", playerSetting.passingScore);
	$('.KC_Info').html(str);
	$('.KC_Info .fIncorrect').find('.insertTab').each(function() {
		$(this).attr('tabindex', tbCnt);
		tbCnt++;
	})
	navigationEvent.checkTranscriptState();
	if (navigationData.isPass) {
		//navigationEvent.updateGlobleFocus(1);
		//var pritBtnName = pageXml.buttonText[0].text[0].Text;
	//	$('.KC_Info').append('<a tabindex="1" class="a-button printbtn" href="javascript:void(0);"><span class="btntext">' + pritBtnName + '</span></a>');
		pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	} else {
		//navigationEvent.updateGlobleFocus(0);
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
	}
	updatePageLayOut();
	
	$.imgpreload(preloadImagesArray, {
		each: function() {},
		all: function() {
			try {
				templateMediator.templateLoadComplete();
				templateMediator.pageVisited();
				showFeedback(feedbackObj);
				//dataStore.updateUserData();
				if (navigationData.isPass) {
					/*****************/
					navigationData.iCertify=true;
					if(isNull(navigationData.passDate)){
						navigationData.passDate= globalSettings.getTodayDate();
					}	 				
					/******************/
				} else {
					//navigationEvent.updateGlobleFocus(0);
					navigationData.resetCurrentPageProgress();
				}
				dataStore.updateUserData();
			} catch (err) {}
		}
	});

	function showFeedback(obj) {
		var tId = parseInt(obj.transcriptId);
		var audioPath = pageXml.transcript[0].text[tId].path;
		navigation.playAudioByURL(audioPath);
		$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
		updateTabIndex();
	}

	function updatePageLayOut() {
		var wW = $(window).width();
		var wH = $(window).height();
		var path = "";
		var altText = "";
		var obj;
		if (isPass) {
			obj = pageXml.contentImagePass[0];
			
		} else {
			obj = pageXml.contentImageFail[0];
		}
		for (var i = 0; i < obj.img.length; i++) {
			var imgWd = parseInt(obj.img[i].minwidth);
			var imgHt = parseInt(obj.img[i].minheight);
			if (wW > imgWd && wH > imgHt) {
				if (globalSettings.isDesktop()) {
					path = obj.img[i].path;
				} else {
					path = obj.img[i].ipadPath;
				}
				altText = obj.img[i].Text;
			}
		}
		if ((prePath1 != path && altText1 != altText)) {
			$('.KC_Img').attr('src', path);
			$('.KC_Img').attr('alt', altText);
			prePath1 = path;
			altText1 = altText;
		}
	}

	function updateTabIndex() {
		navigationEvent.updateGlobleFocus(tbCnt);
	}
}