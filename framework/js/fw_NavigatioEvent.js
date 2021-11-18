/*----------------------------------------
	Name: fw_NavigatioEvent.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_NavigatioEvent(){
	/**Variables*/
	this.updateNavigationButtons=updateNavigationButtons;
	this.enableNavigation=enableNavigation;
	this.disableNavigation=disableNavigation;	
	this.enableNextButton=enableNextButton;
	this.disableNextButton=disableNextButton;
	this.addTranscriptOffClass=addTranscriptOffClass;
	this.addTranscriptOnClass=addTranscriptOnClass;
	this.updateGlobleFocus=updateGlobleFocus;
	this.hideIconForMenu=hideIconForMenu;
	this.checkTranscriptState=checkTranscriptState;
	this.initToolTip=initToolTip;
	this.updateToolTip=updateToolTip;
	this.updateNextPagePopupText=updateNextPagePopupText;
	this.isInternalQuestionCompleted=false;
	this.isTWindowOpen=false;
	this.isPageAudioOn=true;
	this.isVideoPlaying=false;
	var toolTipInit=false;
	var tWindowOpen=false;
	var isAudioOn=true;
	var hetimer;	
	var keys = [];
	this.pagetabIndex=0;
	var isBtnPress=false;
	var isNextEnable=false;
	var btnNextClasses="";
	/** Functions */	
	init();	
	function init(){
		$('.footer>a, .hederIcon>a').bind("click", function(){
			if ($(this).hasClass("showNextLockPopup")){
				showNextLockPopup();
				return false;
			}
			if ($(this).hasClass("disabledNavBtn")){
				return false;
			}
			
			
			var clsNm=$(this).attr('class');
			switch(clsNm){
				case buttonClass.NEXT_BUTTON_CLASS:
					navigation.loadNextPage();
				break;
				case buttonClass.NEXT_BUTTON_CLASS+' '+buttonClass.NEXT_BUTTON_BLINK:					
					navigation.loadNextPage();
				break;
				case buttonClass.NEXT_BUTTON_CLASS+' '+buttonClass.MENU_BUTTON_BLINK:										
					navigation.showMenu();
				break;
				case buttonClass.BACK_BUTTON_CLASS:
					navigation.loadPreviousPage();
				break;				
				case buttonClass.REPLAY_CLASS:					
					navigation.replayPage();
				updateToolTip();
				break;
				case buttonClass.TRANSCRIPT_ON_CLASS:					
					if (globalPath.userLanguage == 'eng') {navigation.audioON();}
					navigation.hideTranscript();
				break;
				case buttonClass.TRANSCRIPT_OFF_CLASS:
					navigation.showTranscript();					
				break;
				case buttonClass.AUDIO_ON_CLASS:
					navigation.audioOFF();
					if(navigationData.getTemplateName()!="interactiveVideo"){
							addTranscriptOnClass();	
				    }else{
						$(navigation).trigger('page_external_audioOn');
					}					
				break;
				case buttonClass.AUDIO_OFF_CLASS:
					navigation.audioON();
					if(navigationData.getTemplateName()=="interactiveVideo"){
						$(navigation).trigger('page_external_audioOff');
					}
				break;
				case buttonClass.MENU_BUTTON_CLASS:
					navigation.showMenu(); 
				break;
				case buttonClass.GLOSSARY_BUTTON_CLASS:
					navigation.showGlossary(); 					
				break;
			}	
       
		});
		$('.exit').bind("click", function(){
			if ($(this).hasClass("disabledNavBtn")){
				return false;
			}
			
			navigation.closeCourse();	
			
		});
		$('.btn_PlayBlink').bind("click", function(){
			$('.playBlinkParent').hide();
			navigation.playPage();		
		});
		
		$('.printbtn').live("click", function(){
			loadCertificateWin();
		});	
		$('.'+buttonClass.MENU_BUTTON_CLASS).focusout(function() {			
			$("div[tabindex=1]").focus();			
		});
		$('.btn_Exit').bind("click", function(){
			if ($(this).hasClass("disabledNavBtn")){
				return false;
			}
			navigation.closeCourse();				
		});
		//register key handeling:
		//---for safari only
		var temp=false;
		/*window.onbeforeunload = function() {
		var str=navigationData.getNetFailAlertMsg();	
			if(isBtnPress && !temp && !isAlertShow){				
				alert(str.text[1].Text);
				temp=true;
				window.top.close();
				if(window.opener!=null){
				window.opener.close();
			}
			}			
		};*/
		/*This is Custom code added to show next lock popup on next click*/
		function showNextLockPopup(){	
			$('.nextLock_alert_msg').html(globalData.navigationTextXML.nextLockAlertPopupText[0].text[0].Text);
			
			/*if((navigationData.getTemplateName()=="preAssessment" || navigationData.getTemplateName()=="assessment" || navigationData.getTemplateName()=="formativeTAWA" || navigationData.getTemplateName()=="formativeMCQ" || navigationData.getTemplateName()=="formativeMCQChallenge" || navigationData.getTemplateName()=="formativeMCQ" || navigationData.getTemplateName()=="reflectiveTrueFalseImpact" || navigationData.getTemplateName()=="reflectiveTrueFalseNonLabel" || navigationData.getTemplateName()=="dragNDrop" || navigationData.getTemplateName()=="slider") && !navigationEvent.isInternalQuestionCompleted){*/
			if((navigationData.getTemplateName()=="dragNDrop" || navigationData.getTemplateName()=="slider") && !navigationEvent.isInternalQuestionCompleted){
				$('.nextLock_alert_msg').html(globalData.navigationTextXML.nextLockAlertPopupText[0].text[1].Text);
			}
			if(navigationData.getTemplateName()=="videoPlayer"){
				$('.nextLock_alert_msg').html(globalData.navigationTextXML.nextLockAlertPopupText[0].text[2].Text);
			}
			/* if(navigationData.getTemplateName()=="accordion"){
				$('.nextLock_alert_msg').html(globalData.navigationTextXML.nextLockAlertPopupText[0].text[3].Text);
			} */
			$('.nextLock_alert_yes_btn').html(globalData.navigationTextXML.nextLockAlertPopupText[0].buttonText[0].text[0].Text);
			$('.nextLock_alert_container').show();
		}
		
		$('.nextLock_alert_yes_btn').click(function(){	
			$('.nextLock_alert_container').hide();
		});
		//----
		$(document).keydown(function(e){
            keys[e.keyCode] = true;
			onkeyDown(e);
			//--for f5 button and ctr+R to show msg when try to refresh page
			isBtnPress=false;
			var keycode=e.which;
					
			if ($.browser.msie) {
				if (keycode == 116 || (window.event.ctrlKey && keycode == 82)) {
					window.event.returnValue = false;
					window.event.keyCode = 0;
					window.status = "Refresh is disabled";
					showAlertPop(0);
				}
			}else{
				if (keycode == 116 ||(e.ctrlKey && keycode == 82)) {
					if (e.preventDefault)
					{						
						e.preventDefault();
						e.stopPropagation();
						
						if(keycode == 116 && $.browser.safari){
							isBtnPress=true;	
						}else{
							showAlertPop(0);
							isBtnPress=true;
						}
					}					
				}				
			}
			//-------
        });
        $(document).keyup(function(e){
            keys[e.keyCode] = false;
        });	
		
		var pdScroll="vertical";
		if(globalSettings.isIpad){
			pdScroll='none';
		}
		$(".wrapper").swipe( {		
		  swipe:function(event, direction, distance, duration, fingerCount) {			
			if(globalSettings.isDesktop() || menuData.moduleIndex<=0 || $('.fw_BookMarkparent').length>0 || direction=='up' || direction=='down'){
				return false;
			}			
			switch (fingerCount) {						
				case 1:
					templateMediator.pageSwiped(direction);
					
				break;
				case 2:					
					if(direction=="left"){
						 if(!checkNext()){
						 	if (globalSettings.isIpad) {
								$('.pageContainer').effect('bounce', {distance:8, times:4,direction:"left" }, 200);
							}else {
								$('.pageContainer div:first-child').effect('bounce', {distance:8, times:4,direction:"left" }, 200);
							}						 							
						 		
						 }
					}else if(direction=="right"){
						if(!checkBack()){							
						 	if (globalSettings.isIpad) {
								$('.pageContainer').effect('bounce', {distance:8, times:4,direction:"right" }, 200);
							}else {
								$('.pageContainer div:first-child').effect('bounce', {distance:8, times:4,direction:"right" }, 200);
							}
						 }
					}
				break;
			}			
		  },
		  threshold:0,
		  fingers:'all',allowPageScroll:pdScroll
		});	
		
		
		$(pageContainer).bind(courseEvent.PAGE_LOAD_START, function(e){
				disableNavigation();
				pageInstruction.hideInstruction();
				globalSettings.updateLayOut();
				/*if(playerSetting.coursetype != playerSetting.STANDALONE){
					dataStore.updateUserData();
				}*/
				if(playerSetting.coursetype==playerSetting.TIN_CAN){
					dataStore.sendPageStatement();
				}
			});
		$(pageContainer).bind(courseEvent.PAGE_LOAD_COMPLETE, function(e){

			btnNextClasses ="";
			
			enableNavigation();
			
			navigationData.updateBookMark();
			navigationData.updateProgressData(1);
			//-for sumtotal lms
			if(playerSetting.coursetype != playerSetting.STANDALONE){
				dataStore.updateUserData();	
			}			
			//--
		});
		
		$(mediaPlayer).bind(courseEvent.ENDED_MEDIA, function(e){
		    addReplayClass();
            pageContainer.isPlay=false;
            templateMediator.checkPageCompleteOnAudio();
          });
		$(mediaPlayer).bind(courseEvent.PAUSED_MEDIA, function(e){addPlayClass(); pageContainer.isPlay=false;});
		$(mediaPlayer).bind(courseEvent.PLAYED_MEDIA, function(e){addPauseClass(); pageContainer.isPlay=true;});
		$(mediaPlayer).bind(courseEvent.CLEAR_MEDIA, function(e){addReplayClass(); pageContainer.isPlay=false;});
		
		$(mediaPlayer).bind(courseEvent.AUDIO_ON, function(e){addAudioOnClass();});
		$(mediaPlayer).bind(courseEvent.AUDIO_OFF, function(e){addAudioOffClass();});
		
		$(navigation).bind(courseEvent.TRANSCRIPT_ON, function(e){addTranscriptOffClass();});
		$(navigation).bind(courseEvent.TRANSCRIPT_OFF, function(e){addTranscriptOnClass();});
		$('.fw_Transcript').bind(courseEvent.TRANSCRIPT_OFF, function(e){addTranscriptOffClass();});
		$('.fw_CloseCoursePopWindow').bind(courseEvent.CLOSECOURSE_NO, function(e){
			navigation.playPageExternal();
		});
		$('.fw_CloseCoursePopWindow').bind(courseEvent.CLOSECOURSE_YES, function(e){
				window.top.close();
		});

		
		$(navigation).bind(courseEvent.PAGE_PAUSE_EXTERNAL, function(e){
			
			disableNavigation();
		});
		$(navigation).bind(courseEvent.PAGE_PLAY_EXTERNAL, function(e){
			
			enableNavigation();
		});
		
	}	
	
	function updateNextPagePopupText(){
		navigationEvent.isInternalQuestionCompleted=true;
	}
	function checkTranscriptState(){
		if (tWindowOpen) {
			addTranscriptOnClass();			
		}else {
			addTranscriptOffClass();			
		}
	
	}
	 function onkeyDown(e){
	 	if(keys[73] && !islogPop){
			keys[16]=false;
			keys[73]=false;
			loadCommunicationWin();
			return false;	
		}
		if (menuData.moduleIndex <= 0 || $(".hederIcon").is(':visible') || $('.menupage').length > 0 || !(keys[16])) {
			
		}else {
			if(keys[190]){
				checkNext();
			}else if(keys[188]){
				checkBack();
			}else if(keys[65]){
				if ($('#btn_AudioOnOff').hasClass("disabledNavBtn")) {
					return false;
				}else {
					if (isAudioOn) {
						navigation.audioOFF();
						addTranscriptOnClass();
					}else {
						navigation.audioON();
					}
				}
			}else if(keys[71]){
				if ($('.' + buttonClass.GLOSSARY_BUTTON_CLASS).hasClass("disabledNavBtn") && $(".fw_Glossary_parent").is(':visible')) {
					navigation.hideGlossary();
					return false;
				}else if($('.' + buttonClass.GLOSSARY_BUTTON_CLASS).hasClass("disabledNavBtn")){							
					return false;
				}else {
					if ($(".fw_Glossary_parent").is(':visible')) {
						navigation.hideGlossary();
					}else {
						navigation.showGlossary();
					}
				}	
			}else if(keys[77]){
				if ($('.' + buttonClass.MENU_BUTTON_CLASS).hasClass("disabledNavBtn")) {
					return false;
				}else {
					navigation.showMenu();
				}
			
			}else if(keys[82]){
				if ($('.' + buttonClass.REPLAY_CLASS).hasClass("disabledNavBtn")) {
					return false;
				}else {
					navigation.replayPage();
				}
			
			}else if(keys[84]){
				if ($('#btn_TranscriptOnOff').hasClass("disabledNavBtn")) {
					return false;
				}else {
					if (tWindowOpen) {
						addTranscriptOffClass();
						if (globalPath.userLanguage == 'eng') {navigation.audioON();}
					}else {
						addTranscriptOnClass();
					}
				}
			
			}else if(keys[73] && !islogPop){
				keys[16]=false;
				keys[73]=false;
				loadCommunicationWin();		
			}
		}
					
     }
	 
		
	function checkBack(){
		if ($('.' + buttonClass.BACK_BUTTON_CLASS).hasClass("disabledNavBtn")) {
			return false;
		}else {
			navigation.loadPreviousPage();
			return true;
		}
			
	}
	function checkNext(){
		if ($('.' + buttonClass.NEXT_BUTTON_CLASS).hasClass("disabledNavBtn")) {			
			return false;
		}else {
			if ($('.' + buttonClass.NEXT_BUTTON_CLASS).hasClass(buttonClass.MENU_BUTTON_BLINK)) {
				navigation.showMenu();
			}else {
				navigation.loadNextPage();
			}
			return true;
		}		
	}
	function addPlayClass(){
		//$('#btn_PlayPauseReplay').attr("class",buttonClass.PLAY_CLASS);
		addReplayClass();
		updateToolTip();
	}
	function addPauseClass(){		
		//$('#btn_PlayPauseReplay').attr("class",buttonClass.PAUSE_CLASS);
		addReplayClass();
		updateToolTip();
	}
	function addReplayClass(){
		if ($('#btn_PlayPauseReplay').hasClass("disabledNavBtn")) {
			return false;
		}
		$('#btn_PlayPauseReplay').attr("class",buttonClass.REPLAY_CLASS);
		updateToolTip();
	}
	function addTranscriptOnClass(){
		$('#btn_TranscriptOnOff').attr("class", buttonClass.TRANSCRIPT_ON_CLASS);
		$.fw_Transcript('show');
		tWindowOpen=true;
		navigationEvent.isTWindowOpen=true;
		updateToolTip();
	}
	function addTranscriptOffClass(){
		$.fw_Transcript('hide');
		tWindowOpen=false;
		navigationEvent.isTWindowOpen=false;
		$('#btn_TranscriptOnOff').attr("class", buttonClass.TRANSCRIPT_OFF_CLASS);
		updateToolTip();
	}
	function addAudioOffClass(){
		isAudioOn=false;	
		navigationEvent.isPageAudioOn=false;	
		$('#btn_AudioOnOff').attr("class", buttonClass.AUDIO_OFF_CLASS);
		updateToolTip();
	}
	function addAudioOnClass(){	
		isAudioOn=true;
		navigationEvent.isPageAudioOn=true;
		$('#btn_AudioOnOff').attr("class", buttonClass.AUDIO_ON_CLASS);
		updateToolTip();
	}
	function hideIconForMenu(){
		checkTranscriptState();
		$('.footer>a').removeClass('disabledNavBtn');
		$('.hederIcon>a').removeClass('disabledNavBtn');
		if(navigation.isSubModuleLoad){
			$('.btn_Back, .btn_Next').addClass("disabledNavBtn visibilityHidden");
			$('.btn_Menu').removeClass('disabledNavBtn');
			$('#btn_PlayPauseReplay, #btn_AudioOnOff, #btn_TranscriptOnOff').addClass('disabledNavBtn');
			$('.btn_Menu,.navSeprator.left').css('visibility', 'visible');
			$('.btn_Menu').next('.navSeprator').css('visibility', 'visible');
		}else{
			
			$('.btn_Menu').addClass("disabledNavBtn");
			$('.btn_Back, .btn_Next').addClass("disabledNavBtn visibilityHidden");
			//$('.btn_Menu').next('.navSeprator').css('visibility', 'hidden');
		}		
		$('.backbtnseprator').css('visibility', 'visible');
		$('.pageCounter').html('');
		
		return true;
	}
	function updateNavigationButtons(){
			
		if(navigationData.getSubModuleId()>0){			
			if(playerSetting.addJumpingInSubModule){
					$('.btn_Back').addClass("disabledNavBtn");
				$('.btn_Back').css('visibility', 'hidden');
				$('.pageCounter').addClass("hidepageCounter");
				$('.replayPage').addClass("disabledNavBtn");
			}			
			disableNextButton();
		
			if(btnNextClasses != "")
			$('.btn_Next').attr('class',btnNextClasses);
			
			if(!playerSetting.addJumpingInSubModule){
				$('.btn_Back').css('visibility', 'visible');
			}
						
			$('.btn_Next').css('visibility', 'visible');			
			$('.backbtnseprator').css('visibility', 'visible');			
		}else{
			$('.pageCounter').show();
			$('.pageCounter').removeClass("hidepageCounter");
			if(navigationData.isFirstPage()){
				$("."+buttonClass.BACK_BUTTON_CLASS).addClass('disabledNavBtn');
			}
			var pgcmpt=navigationData.isCurrentPageComplete();
			if(pgcmpt){
				enableNextButton();
			}else if((playerSetting.linearNavigation && !pgcmpt) || (navigationData.isPageMandatory() && !pgcmpt)){
				 disableNextButton();
			}else{
				enableNextButton();
			}
			if(navigationData.isLastPage()){
			   // disableNextButton();
			}
			if (navigationData.isAssessmentPage()) {			
				//addTranscriptOffClass();
				disableNavigation();
				$('.btn_Menu').removeClass('disabledNavBtn');
				$('.btn_Menu').next('.navSeprator').css('visibility', 'visible');
				$('.btn_Menu').next('.navSeprator').removeClass('disabledSep');
			}		
			if (navigationData.isLastPageInModule() && !navigationData.isPreAssessmentPage()) {
				$("."+buttonClass.NEXT_BUTTON_CLASS).addClass(buttonClass.MENU_BUTTON_BLINK);
			}else{
				$("."+buttonClass.NEXT_BUTTON_CLASS).removeClass(buttonClass.MENU_BUTTON_BLINK);
			}
			if(menuData.moduleIndex<=0 && menuData.pageIndex<=2){
				navigation.hideFooter();			
			}else{
				navigation.showFooter();
			}
			$('.backbtnseprator').css('visibility', 'visible');
			if(menuData.moduleIndex<=0){
				
				$('.btn_Menu,.btn_Back, .btn_Next').addClass("disabledNavBtn");
				$('.btn_Back, .btn_Next').css('visibility', 'hidden');
				//$('.backbtnseprator').css('visibility', 'hidden');
				$('.pageCounter').html('');
				//$('.btn_Menu').next('.navSeprator').css('visibility', 'hidden');
				//$('.footer .navSeprator').addClass('disabledSep');
			}else{
				$('.btn_Menu,.btn_Back, .btn_Next').css('visibility', 'visible');
				$('.btn_Menu').next('.navSeprator').css('visibility', 'visible');
				//$('.footer .navSeprator').addClass('disabledSep');
				$('.btn_Menu').next('.navSeprator').removeClass('disabledSep');
			}	
			if(menuData.moduleIndex<=0 && menuData.pageIndex>4){
				$('.btn_Next').css('visibility', 'visible');
				//if(btnNextClasses != "")
				//$('.btn_Next').attr('class',btnNextClasses);
			}
			if(btnNextClasses != "")
			$('.btn_Next').attr('class',btnNextClasses);
					
		}
		if(navigation.isMenuOpen){		
			hideIconForMenu();
		}
		
		if(navigationData.isTranscriptBlank()){
			if(navigationData.getTemplateName()=="interactiveVideo"){
				$('#btn_TranscriptOnOff').addClass("disabledNavBtn");
			}else{
				$('#btn_AudioOnOff,#btn_TranscriptOnOff').addClass("disabledNavBtn");
			}
			$.fw_Transcript('hide');
		}else{
			if(tWindowOpen){
				$.fw_Transcript('show');
			}else{
				$.fw_Transcript('hide');
			}
		}
		
		if(menuData.moduleIndex>0 ){
			$('.courseTitle').show();
		}else{
			$('.courseTitle').hide();
		}
		updateToolTip();
		updateGlobleFocus(navigationEvent.pagetabIndex);
	}
	function enableNavigation(){
		$('.footer>a').removeClass('disabledNavBtn');
		$('.hederIcon>a').removeClass('disabledNavBtn');	
		$('.footer .navSeprator').removeClass('disabledSep');		
		updateNavigationButtons();
	}
	
	function enableNextButton(){
		$("."+buttonClass.NEXT_BUTTON_CLASS).removeClass('disabledNavBtn');		
		$("."+buttonClass.NEXT_BUTTON_CLASS).removeClass('showNextLockPopup');		
		
		updateToolTip();
	}
	function disableNextButton(){
		$("."+buttonClass.NEXT_BUTTON_CLASS).addClass('disabledNavBtn');
		$("."+buttonClass.NEXT_BUTTON_CLASS).addClass('showNextLockPopup');
		if (navigationData.isLastPageInModule() && !navigationData.isPreAssessmentPage()) {
			$("."+buttonClass.NEXT_BUTTON_CLASS).addClass(buttonClass.MENU_BUTTON_BLINK);
		}else{
			$("."+buttonClass.NEXT_BUTTON_CLASS).removeClass(buttonClass.MENU_BUTTON_BLINK);
		}
	}
	function disableNavigation(){
		updateToolTip();
		btnNextClasses = $('.btn_Next').attr('class');
		$('.btn_Menu,.btn_Back, .btn_Next').removeClass("disabledNavBtn visibilityHidden");
		$('.footer>a').addClass('disabledNavBtn');
		$('.hederIcon>a').addClass('disabledNavBtn');
		$('.footer .navSeprator').addClass('disabledSep');
		$('.btn_Next').attr('style','');
		if(navigation.isMenuOpen){		
			hideIconForMenu();
		}
	}
	function initToolTip(){
		
		//if(toolTipInit)return false;
		if (globalSettings.isDesktop()) {		
			var navTextXML = globalData.navigationTextXML;			
			if(navTextXML==null)return false;
			toolTipInit=true;
			for (var i = 0; i < navTextXML.tootTip[0].element.length; i++) {
				var tText = navTextXML.tootTip[0].element[i].Text;
				var btn = navTextXML.tootTip[0].element[i].button;
				var loc = navTextXML.tootTip[0].element[i].location;
				var wd = parseInt(navTextXML.tootTip[0].element[i].width);
				var gp = parseInt(navTextXML.tootTip[0].element[i].gap);
				var lgpObj=navTextXML.tootTip[0].element[i].leftGap;
				var lgp=0;
				if(lgpObj!=null && lgpObj!=""){
					lgp = parseInt(lgpObj);
				}
				
				$(btn).attr('toolTiptext', tText);
				$(btn).fw_ToolTip({location: loc,width: wd,gap: gp, leftGap:lgp});				
			}
		}
	}

	function updateToolTip(){
		if (globalSettings.isDesktop()) {		
			var navTextXML = globalData.navigationTextXML;
			if(navTextXML==null)return false;
			for (var i = 0; i < navTextXML.tootTip[0].element.length; i++) {
				var tText = navTextXML.tootTip[0].element[i].Text;
				var btn = navTextXML.tootTip[0].element[i].button;
				var loc = navTextXML.tootTip[0].element[i].location;
				var wd = navTextXML.tootTip[0].element[i].width;
				if(wd!=null && wd!="" && wd!="auto"){
				 wd = parseInt(navTextXML.tootTip[0].element[i].width);
				}
				var gp = parseInt(navTextXML.tootTip[0].element[i].gap);
				var lgpObj=navTextXML.tootTip[0].element[i].leftGap;
				var lgp=0;
				if(lgpObj!=null && lgpObj!=""){
					lgp = parseInt(lgpObj);
				}	
				
				$(btn).attr('toolTiptext', tText);
				$(btn).fw_ToolTip({location: loc,width: wd,gap: gp, leftGap:lgp});
				$(btn).fw_ToolTip('hide');
			}
		}
	}
	
	function updateGlobleFocus(_val){
		if(_val==null){
			return false;
		}
		navigationEvent.pagetabIndex= _val;
		var navTextXML = globalData.playerSettingXML;
		for (var i = 0; i < navTextXML.tabIndexFlow[0].element.length; i++) {
			var btn = navTextXML.tabIndexFlow[0].element[i].button;			
			if($(btn).hasClass("disabledNavBtn")){				
				$(btn).removeAttr("tabindex");
			}else{
				_val++;
				$(btn).attr('tabindex',_val);				
			}
		}
	}
	
}