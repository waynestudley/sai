/*----------------------------------------
	Name: fw_Navigation.js
	Developed by: Suyog Shaha
	Updated by: Sunil Patil
	Added Event :  Exit button
	Purposed : opened to exit window 
	Dated By: 23/01/15
----------------------------------------*/
function Navigation(){
	/**Variables*/
	
	/** Functions */
	this.loadNextPage = loadNextPage;
	this.loadPreviousPage = loadPreviousPage;	
	this.replayPage = replayPage;
	this.showTranscript = showTranscript;
	this.hideTranscript = hideTranscript;
	this.audioON = audioON;
	this.audioOFF = audioOFF;
	this.showMenu = showMenu;
	this.hideMenu = hideMenu;
	this.loadCurrentPage=loadCurrentPage;
	this.closeCourse=closeCourse;	
	this.addBlinker=addBlinker;	
	this.pausePageExternal=pausePageExternal;	
	this.playPageExternal=playPageExternal;
	this.playAudioByURL=playAudioByURL;
	this.clearAudio=clearAudio;
	this.loadFirstPage=loadFirstPage;
	this.showGlossary=showGlossary;
	this.hideGlossary=hideGlossary;	
	this.showFooter=showFooter;
	this.hideFooter=hideFooter;
	this.removeBlinker=removeBlinker;
	this.showIntroLastPage = showIntroLastPage;
	this.isMenuOpen=false;
	this.isSubModuleLoad=false;	
	this.allowNext=false;	
	this.showVideo=showVideo;
	this.clearCustomVideoObj=clearCustomVideoObj;
	var pagePlaying=false;	
	var animIntervel=null;
	var widthCnt=0;
	var totImgCnt=0;
	
	
	function addBlinker(){		
		navigationData.updateProgressData(2);
		navigationData.updateProgressBarStatus();
		clearInterval(animIntervel);
		removeBlinker();
		if(!navigationData.isLastPageInModule()){
			$("."+buttonClass.NEXT_BUTTON_CLASS).addClass(buttonClass.NEXT_BUTTON_BLINK);
			navigationEvent.enableNextButton();			
			animateBlinker();			
		}else if(navigationData.isLastPageInModule()){
			$("."+buttonClass.NEXT_BUTTON_CLASS).addClass(buttonClass.MENU_BUTTON_BLINK);
			navigationEvent.enableNextButton();
			animateBlinker();			
		}
		navigationEvent.updateGlobleFocus(navigationEvent.pagetabIndex);
    	return true;
	}
	function loadFirstPage(){
		menuData.moduleIndex=0;
		menuData.pageIndex=0;
		loadCurrentPage();
	}
	function removeBlinker(){
		clearInterval(animIntervel);
		$('.btn_Next').attr('style','');
		$("."+buttonClass.NEXT_BUTTON_CLASS).removeClass(buttonClass.NEXT_BUTTON_BLINK);
		$("."+buttonClass.NEXT_BUTTON_CLASS).removeClass(buttonClass.MENU_BUTTON_BLINK);
	}
	function loadPreviousPage(){
	  navigationData.updatePreviousPageURL();
      loadCurrentPage();
	}
    function loadNextPage(){
		testConnection(myCallBack);	
		if(navigationData.isLastPageInModule()){
			navigation.showMenu();
			return true;
		}
		if(navigationData.getTemplateName()=='profileSelection1' && navigationData.isPreAssessmentComplete){			
			navigationData.filterPreAssessmentData();
			return false;
		}
		if(navigationData.isPreAssessmentPage()){
			templateMediator.loadAssessmentQuestion();
		}else if(navigationData.isAssessmentPage()){
			templateMediator.loadPreAssessmentQuestion();
		}else{		
        	navigationData.updateNextPageURL();
			loadCurrentPage();
		}
	}
	
	function loadCurrentPage(){	
	$('.pageTitle').attr('style','');
		testConnection(myCallBack);
		navigation.isMenuOpen=false;
		clearVideoObj();
		if(navigationData.isAssessmentPage()){
			templateMediator.intAssessment();
		}else{
			pageContainer.loadPage(navigationData.getCurrentPageURL(),navigationData.getCurrentPageXMLURL());
		}
	}
	
	function clearVideoObj(){
		try{
			if(!!document.createElement('video').canPlayType){
			var myPlayer = document.getElementById('h5Video');
				if(String(myPlayer) != "null"){
				$(".playerPos").remove();
				}
			}else{
				var myPlayer = document.getElementById('objVideo');
				if(String(myPlayer) != "null"){
				myPlayer.Stop();			
				$('#objVideo').attr("width","0").css("display","none");
				}
			}
			
			
		}catch(e){
		//console.log(e)
		}
	}
	function replayPage(){
		navigation.clearCustomVideoObj();
		if(navigation.isMenuOpen){
			$.fw_Menu('replayAudio');
		}else{
			loadCurrentPage();
		}
	}
	function clearCustomVideoObj(){
		navigationData.videoObj.clearVideo();
		$('.videoContainer').html('');
		navigationEvent.isVideoPlaying=false;
	}
	function showTranscript(){
		$(navigation).trigger(courseEvent.TRANSCRIPT_OFF);
	}
	
	function hideTranscript(){
		$(navigation).trigger(courseEvent.TRANSCRIPT_ON);		
	}
	
	function audioON(){		
		mediaPlayer.audioON();
	}
	function audioOFF(){			
		mediaPlayer.audioOFF();
	}
	function showIntroLastPage(){
		menuData.moduleIndex=0;
		menuData.pageIndex=8;
		loadCurrentPage();
		
	}
	function showMenu(){
		if(navigation.isSubModuleLoad && navigation.isMenuOpen){
			navigation.isSubModuleLoad=false;
			$.fw_Menu('init');
			return true;
		}
		if(playerSetting.coursetype != playerSetting.STANDALONE){
			dataStore.updateUserData();
		}
		if(playerSetting.coursetype==playerSetting.TIN_CAN){
    		dataStore.sendPageStatement();
    	}
		navigation.isMenuOpen=true;
		hideGlossary();		
		clearVideoObj();
		$.fw_Menu('init');
		return true;
	}
	
	function hideMenu(){
		$.fw_Menu("hide");
	}
	
	function showGlossary(){
		$.fw_Glossary("show");
	}	
	function hideGlossary(){
		$.fw_Glossary("hide");
	}
	
	
	function showFooter(){
		$('body,.wrapper').removeClass('hideFooter');
		$('body, .wrapper').addClass('showFooter');
		
	}	
	function hideFooter(){
		$('body, .wrapper').addClass('hideFooter');
		$('body, .wrapper').removeClass('showFooter');
	}
	
	function closeCourse(){
		dataStore.updateUserData();
		pausePageExternal();
		$.fw_CloseCourse('show');
	}
	function pausePageExternal(){
		pagePlaying=pageContainer.isPlay;		
		pageContainer.pause();
		$(navigation).trigger(courseEvent.PAGE_PAUSE_EXTERNAL);
	}
	function playPageExternal(){
		if(pagePlaying){
			pageContainer.play();			
		}
		$(navigation).trigger(courseEvent.PAGE_PLAY_EXTERNAL);
	}
	
	function playAudioByURL(url){				
		if(url=="" || url==null || url.toLowerCase()=="none"){return false;}			
		var aURL='content/'+globalPath.userLanguage+"/"+url;
		if (playerSetting.isAudio || (globalSettings.isDesktop())) {
			mediaPlayer.loadAudio(aURL);
		}		
	}
	
	function clearAudio(){		
		mediaPlayer.clearAudio();		
	}
	$(pageContainer).bind(courseEvent.PAGE_LOAD_START, function(e){removeBlinker();});
	
	function animateBlinker(){
		var counter=0;		
		animIntervel = setInterval(function(){
			var btn;
			var totImgCnt=19;
			var widthCnt=33;			
			btn=$('.footer .btn_Next');
		   var posX=-(counter*widthCnt);			
		   btn.css('backgroundPosition', posX+'px 0px');
		    counter+=1;
			if(counter>totImgCnt){
				counter=0;
			}
		}, 60);
	}
	function showVideo(){
		if(!!document.createElement('video').canPlayType)
		{
			$("#h5Video").show();
		}else{
			$("#objVideo").show();
		}
	
	}
}
