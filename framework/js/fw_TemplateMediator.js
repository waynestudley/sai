/*----------------------------------------
	Name: fw_TemplateMediator.js
	Developed by: Suyog Shaha	
----------------------------------------*/
function fw_TemplateMediator(){
	/**Variables*/
    var pageObject= null;
	this.updatePageXML=updatePageXML;
	this.templateLoadComplete=templateLoadComplete;
	this.checkPageCompleteOnAudio=checkPageCompleteOnAudio;
	this.pageVisited=pageVisited;
	this.intAssessment=intAssessment;
	this.loadAssessmentQuestion = loadAssessmentQuestion;
	this.loadPreAssessmentQuestion = loadPreAssessmentQuestion;
	this.pageSwiped=pageSwiped;
	var firstSet=false;
	
	/** Functions */    
	
	$(window).resize(function(){		
		if(pageObject!=null){
			pageObject.updatePageLayOut();
		}
		$.fw_Transcript('updateScroll');		
	});
	
 	function pageSwiped(_direction){
		if(navigationData.getTemplateName()=="comicStrip" || navigationData.getTemplateName()=="comicStripWithNav"){
			try {
				pageObject.pageSwiped(_direction);
			}catch(err){
				
			}
		}
	}
   function updatePageXML(_xmlObj){
         currentPageXML= _xmlObj;
         pageObject = null;
		
         switch(navigationData.getTemplateName()){          
			case "languageSelection":
                pageObject = new fw_LanguageSelection(currentPageXML);
            break;
			case "welcomeScreen":
                pageObject = new fw_WelcomeScreen(currentPageXML);
            break;
			case "audioSelection":
                pageObject = new fw_AudioSelection(currentPageXML);
            break;
			case "accordion":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_Accordion(currentPageXML);
            break;		
			case "flipCard":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_FlipCard(currentPageXML);
            break;
			case "regionSelection":
                pageObject = new fw_RegionSelection(currentPageXML);
            break;
			case "profileSelection":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ProfileSelection(currentPageXML);
            break;	
			case "profileSelection1":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ProfileSelection1(currentPageXML);
            break;			
			case "comicStrip":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ComicStrip(currentPageXML);
            break;
			case "simplePresentation":				
					$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
					pageObject = new fw_SimplePresentation(currentPageXML);
            break;
			case "formativeMCQ":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_FormativeMCQ(currentPageXML);
            break;
			case "formativeTrueFalse":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_FormativeTrueFalse(currentPageXML);
            break;
			case "formativeTAWA":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_FormativeTAWA(currentPageXML);
            break;
			case "preAssessmentIntro":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_PreAssessmentIntro(currentPageXML);
            break;
			case "preAssessmentSummary":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_PreAssessmentSummary(currentPageXML);
            break;
			case "knowledgeCheckIntro":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_KnowledgeCheckIntro(currentPageXML);
            break;
			case "knowledgeCheckSummary":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_KnowledgeCheckSummary(currentPageXML);
            break;
			case "reveal":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_Reveal(currentPageXML);
            break;
			case "hotSpot":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_HotSpot(currentPageXML);
            break;
			case "hotSpotCustom":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_HotSpotCustom(currentPageXML);
            break;
			case "formativeAgreeDisagree":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_FormativeAgreeDisagree(currentPageXML);
            break;
			case "revealCallOut":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_RevealCallOut(currentPageXML);
            break;
			case "graphicReveal":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_GraphicReveal(currentPageXML);
            break;
			case "formativeMCQChallenge":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_FormativeMCQChallenge(currentPageXML);
            break;
			case "preAssessment":
				pageObject = new fw_PreAssessment(currentPageXML);
            break;
			case "slider":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_Slider(currentPageXML);
            break;
			case "matching":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_Matching(currentPageXML);
            break;
			case "matchingMultiAns":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_MatchingMultiAns(currentPageXML);
            break;	
			case "reflectiveTrueFalseImpact":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ReflectiveTrueFalseImpact(currentPageXML);
            break;
			case "reflectiveTrueFalse":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ReflectiveTrueFalse(currentPageXML);
            break;
			case "dragNDrop":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_DragNDrop(currentPageXML);
            break;
			case "reflectiveTrueFalseNonLabel":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ReflectiveTrueFalseNonLabel(currentPageXML);
            break;
	    	case "dragNDrop1":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_DragNDrop1(currentPageXML);
            break;
	    	case "comicStripWithNav":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_ComicStripWithNav(currentPageXML);
            break;
	    	case "videoPlayerWithText":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_videoPlayerWithText(currentPageXML);
	    break;
	    	case "interactiveVideo":
				$.fw_Transcript('updateText', currentPageXML.transcript[0].text[0].Text);
                pageObject = new fw_InteractiveVideo(currentPageXML);
	    break;
			
         }

	}
	
	function intAssessment(){
		pageObject= new fw_Assessment();		
	}
	function loadAssessmentQuestion(){
		pageObject.loadNextQuestion();
	}
	function loadPreAssessmentQuestion(){
		pageObject.loadNextQuestion();
	}
    function templateLoadComplete(){
		preLoade.hidePreLoader();
		if(!firstSet &&!playerSetting.isAudio && !globalSettings.isMobile() && menuData.pageIndex>2){
			firstSet=true;
			navigationEvent.addTranscriptOnClass();
			navigation.audioOFF();
		}
		 /* if(!isAudioBase && menuData.pageIndex>2){
			navigationEvent.addTranscriptOnClass();			
		 } */
		 navigationEvent.isInternalQuestionCompleted=false;
		$(".pageContainer>div").show();
		/* image drag diabled  */
		var templateName = navigationData.getTemplateName();		
		/*and avoid for draggble element */
		if(templateName != 'slider' && templateName != 'dragNDrop' && templateName != 'dragNDrop1'){
			$('img').on('dragstart', function(event) { event.preventDefault(); });
			$('a').on('dragstart', function(event) { event.preventDefault(); });			
		}
		/* end image drag diabled */
		$(pageContainer).trigger(courseEvent.PAGE_LOAD_COMPLETE);
		if(navigationData.isCurrentPageComplete()){
			if(navigationData.getSubModuleId()>0){
				if(navigation.allowNext){
					navigation.allowNext=false;
					pageVisited();
				}
			}else{
				pageVisited();
			}
			
		}
    }
    function checkPageCompleteOnAudio(){
       switch(navigationData.getTemplateName()){
            case "simplePresentation":
                   navigation.addBlinker();
            break;			

         }
    }	
	function pageVisited(){
		/*This is custom code for sub module completion*/
		if(navigationData.isSetCompletion()){
			navigationData.setSubModuleCompletion(menuData.moduleIndex);
		}
		/*-------------------*/
		navigation.addBlinker(); 
		return true;
    }

}