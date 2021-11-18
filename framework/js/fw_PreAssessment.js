/*----------------------------------------	
 Name: fw_PreAssessment.js
 Developed by: Suyog Shaha	
 Purposed : Randomize with pick questions of all module 
 Dated By: 27/01/15
 ----------------------------------------*/
function fw_PreAssessment(_xml){
	var assXML=_xml;
	var removeModulesId= navigationData.getRemoveModulesIdArray();
	var correctQueArray=new Array();
	var userAnswerArray=new Array();
	var moduleQueAnsArray=new Array();
	var _currentModuleId=0;
	var _currentQuestionId=0;
	var questionArray=new Array();
	var pullArray=new Array();
	var totalmodule=0;
	var totalQuestion=0;
	var isRandomize=playerSetting.preAssessmentRandomize;
	var _questionObj=null;
	var qIcon=assXML.qIcon[0].Text;
	var qNumber=assXML.qNumber[0].Text.split("#");
	var preAssessmentPassingscore=playerSetting.preAssessmentPassingscore;
	this.clearAllEvent=clearAllEvent;
	this.loadNextQuestion=loadNextQuestion;
	this.updatePageLayOut=updatePageLayOut;
	var InteractionIndex=0;
	var totalCorrect=0;
	var qSetIndex=0;
	var isTOpen=false;	
	
	navigationData.preAssessmentScoreArr=new Array();
	var moduleArray =  new Array();
	/*start*/
	startPreAssessment();

	function startPreAssessment(){
		filterXML();
		totalmodule=assXML.module.length;		
		$.fw_Transcript('hide');
		totalCorrect=0;
		$(pageContainer).trigger(courseEvent.PAGE_LOAD_START);
		navigation.clearAudio();
		navigationEvent.disableNavigation();
		imagePreLoad();
		navigationEvent.disableNavigation();
		$.fw_Transcript('hide');
	}

	function filterXML(){
		var found=false;
		for (i = 0; i < assXML.module.length; i++) {
			found=false;
			var mcnt = i;
			var id =assXML.module[i].id;
			if(id.compareSingleChar(removeModulesId.toString())){
				found = true;
				assXML.module.splice(mcnt,1);
				break;
			}			
		}
		if(found){
			filterXML();
		}
		
		
	}
	
	function imagePreLoad(){
		var preloadImagesArray=new Array();
		if(globalSettings.isIpad){
			var iPadImgPath=assXML.contentBackground[0].img[0].ipadPath;
			if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
				preloadImagesArray.push(iPadImgPath);		
			}else if(assXML.contentBackground[0].img[0].path!=""){
				preloadImagesArray.push(assXML.contentBackground[0].img[0].path);			
			}
		}else{
			if(assXML.contentBackground[0].img[0].path!=""){
				preloadImagesArray.push(assXML.contentBackground[0].img[0].path);			
			}
		}
		if(preloadImagesArray.length > 0){
			$.imgpreload(preloadImagesArray,
				{
					each: function()
					{	
					},
					all: function()
					{
						try{
							templateMediator.templateLoadComplete();
							$('.replayPage').addClass("disabledNavBtn");
							createQuestionList();								
						}catch(err){}
					}
			});
		}else{
			templateMediator.templateLoadComplete();
			$('.replayPage').addClass("disabledNavBtn");
			createQuestionList();
		
		}
	}
	function imageLoad(){		
		if(globalSettings.isIpad){
			var iPadImgPath=assXML.contentBackground[0].img[0].ipadPath;
			if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
				$('.panelBg').css('background-image','url(' + imageUrl + ')');
			}else if(assXML.contentBackground[0].img[0].path!=""){
				$('.panelBg').css('background-image','url(' + assXML.contentBackground[0].img[0].path + ')');
			}else{
				$('.panelBg').css('background-image','none');
			}
		}else{
			if(assXML.contentBackground[0].img[0].path!=""){
				$('.panelBg').css('background-image','url(' + assXML.contentBackground[0].img[0].path + ')');
			}else{
				$('.panelBg').css('background-image','none');
			}
		}
		
	}
	function createQuestionList(){
		totalCorrect=0;
		if(isRandomize){
			var count=0;
			var rpObjPul=new fw_GetRandomNum(totalmodule-1);
			for(var i=0;i<totalmodule;i++){
				var ranNumberPul=rpObjPul.getNum();	
				var sL=assXML.module[ranNumberPul].question.length;
				
				var pul=parseInt(assXML.module[ranNumberPul].pick);
				pullArray.push(pul);
				var firstQData=new Array();
				var rpObj=new fw_GetRandomNum(sL-1);
				var ansArray = new Array();
				for(var j=0;j<pul;j++){
					var ranNumber=rpObj.getNum();
					questionArray.push(ranNumber);
					moduleArray.push(ranNumberPul);
					count++;
					ansArray.push(0);
				}
				
				//alert(assXML.module[ranNumberPul].id)
				//alert(ansArray)
				
				moduleQueAnsArray.push({'id':assXML.module[ranNumberPul].id,
				'array':ansArray,
				'totCorrect':0,
				'score':''
				});
				
			}
			totalQuestion=count;
			var mod = new Array();
			var mod2 = new Array();		
			var sL1=questionArray.length;
			var rpObj1=new fw_GetRandomNum(sL1-1);
			
			for(var i=0;i<questionArray.length;i++){
				var ranNumber1=rpObj1.getNum();
				mod.push(questionArray[ranNumber1]);
				mod2.push(moduleArray[ranNumber1]);
			}
			
			moduleArray = mod2;
			questionArray = mod;
			
			//moduleQueAnsArray.push({'id':assXML.module[ranNumberPul].id,'array':ansArray});
		}else{
			var count=0;
			for(var i=0;i<totalmodule;i++){
				var sL=assXML.module[i].question.length;
				pullArray.push(sL);
				var ansArray = new Array();
				for(var j=0;j<sL;j++){
					questionArray[count]=j;
					moduleArray.push(i);
					count++;
					ansArray.push(0);
				}
				moduleQueAnsArray.push({'id':assXML.module[i].id,
										'array':ansArray,
										'totCorrect':0,
										'score':''
										});
			}
			totalQuestion=count;
		}		
				
		
		_currentModuleId = moduleArray[0];
		showQuestion(moduleArray[_currentQuestionId],questionArray[_currentQuestionId]);
		
	}

	function showQuestion(setId,queId){
		navigation.removeBlinker();
		$('body').scrollTop(0);
		navigationEvent.disableNextButton();
		var qType=getQuestionType(setId,queId);
		var qCountStr=qNumber[0]+(_currentQuestionId+1)+qNumber[1]+totalQuestion + qNumber[2];
		var str=getQuestionHTML(qType);
		$(".pageContainer").html(str);
		var correctAns=getAnswer(setId,queId);
		correctQueArray[_currentQuestionId]=correctAns;
		if(assXML.isAnsShow=="true"){
			if(globalPath.languageDir == 'ltr'){
				$(".pageContainer").append("<div class='corrAnsText' style='position:absolute; top:40px; left:300px; display:block; z-index: 1;'></div>");
			} else{
				$(".pageContainer").append("<div class='corrAnsText' style='position:absolute; top:40px; right:300px; display:block; z-index: 1;'></div>");
			}
			
			$(".corrAnsText").html("correct Ans: "+correctAns+" m no: "+assXML.module[setId].id);
		}
		
		if(qType.toLowerCase()=='mcq'){
			_questionObj=new fw_SummativeMCQ(assXML.module[setId].question[queId],playerSetting.isPreAssessmentFeedBack,function(ans,tInd){
				updateQuestionAnswer(ans,tInd);
			});
		}else if(qType.toLowerCase()=='mrq'){
			_questionObj=new fw_SummativeTAWA(assXML.module[setId].question[queId],playerSetting.isPreAssessmentFeedBack,function(ans,tInd){
				updateQuestionAnswer(ans,tInd);
			});
		}
		$('.qCount').html(qIcon);
		//$('.pageTitle p').html(qCountStr);
		$('.btntext').html(assXML.buttonText[0].text[0].Text);
		//$('.ok').attr('title',assXML.buttonText[0].text[0].Text);
		//alert(qCountStr)
		$("div[tabindex=1]").focus();
		imageLoad();
		//alert('ss')
		pageTitle.updateTitleByText(qCountStr);
	}
	function updatePageLayOut(){

	}

	function loadNextQuestion(){
		_currentQuestionId++;		
		var sm=0;
		/* _currentModuleId=0;		
		for(var i=0;i<pullArray.length-1;i++){
			sm+=parseInt(pullArray[i]);
			if((_currentQuestionId+1)>sm){
				_currentModuleId++;							
			}else{
				break;
			}
		} */
		_currentModuleId = moduleArray[_currentQuestionId];
		if(_currentQuestionId<totalQuestion){
			showQuestion(_currentModuleId,questionArray[_currentQuestionId]);
		}else{
			_currentModuleId=0;
			_currentQuestionId=0;
			showResult();
		}
	}
	
	function updateQuestionAnswer(ans,tInd){
		pageInstruction.updateText(assXML.instructionText[0].text[0].Text);
		userAnswerArray[_currentQuestionId]=ans;		
		navigationEvent.enableNextButton();
		var isCorrect=(userAnswerArray[_currentQuestionId].toString()==correctQueArray[_currentQuestionId].toString());
	//	alert(moduleArray[_currentQuestionId]+"dd"+_currentModuleId);
		if(moduleQueAnsArray[_currentModuleId].array.length==qSetIndex){
			//qSetIndex=0;
		}
		
		if(isCorrect){

			totalCorrect++;
			
			
			
			for (var i = 0; i < moduleQueAnsArray.length; i++) {
				if(assXML.module[moduleArray[_currentQuestionId]].id == moduleQueAnsArray[i].id){
					for (var j = 0; j < moduleQueAnsArray[i].array.length; j++) {
						if(moduleQueAnsArray[i].array[j] == 0){
							moduleQueAnsArray[i].array[j]=1;
							moduleQueAnsArray[i].totCorrect+=1;
							break;
						}
					}
					
				}
				//alert(moduleQueAnsArray[i].array)
			}		
		}
		
		//qSetIndex++;	
		//--- Quetion intraction only need to send for scorm version. updated / modified by sunil vetal
		if(playerSetting.coursetype!=playerSetting.AICC &&  playerSetting.coursetype != playerSetting.STANDALONE) {
			createIntractionData(ans,isCorrect, correctQueArray[_currentQuestionId].toString());
		}
		//----		
		navigation.addBlinker();
		navigationEvent.updateGlobleFocus(tInd);
	}
	function createIntractionData(ans,wasCorrect,correctAns){
		var qId = COURSE_ID+"/preQuestion_"+(_currentQuestionId+1);
		qId = qId.split("/").join(".");
		var qTxt = getQuestionText(_currentModuleId, questionArray[_currentQuestionId]);
	
		//---
		var objectiveId="Pre-Assessment";
		var _currMod=getQuestionId(_currentModuleId);
		var _currQ=parseInt(questionArray[_currentQuestionId])+1;
		var currQId="Pre-Assessment_M"+_currMod+"_Q"+_currQ;
				
		//---
		var qType = getQuestionType(_currentModuleId, questionArray[_currentQuestionId]);
		var optionsStr = getAllOptions(_currentModuleId, questionArray[_currentQuestionId]);
		
		var correctAnswerString = correctQueArray[_currentQuestionId].toString();
		
		var learnerResponse = userAnswerArray[_currentQuestionId].toString();
		
			if(playerSetting.coursetype == playerSetting.TIN_CAN){
				fw_TINCAN.updateAssessmentQuestion(qId, qTxt, optionsStr, qType, learnerResponse, correctAnswerString, wasCorrect);
			}else{			
				dataStore.updateInteraction(currQId, objectiveId, qTxt, learnerResponse, correctAnswerString, wasCorrect);			
			}
			
		}

	function showResult(){
		totalCorrect=0;		
		for(var i=0;i<userAnswerArray.length;i++){
			if(userAnswerArray[i].toString()==correctQueArray[i].toString()){
				totalCorrect++;
			}
		}
		var per=Math.round((totalCorrect/totalQuestion)*100);
		navigationData.preAssessmentScore=per;
		var mIdArray = new Array();
		if(navigationData.preAssessmentScore == 100){
			navigationData.isPass = true;
			navigationData.userScore = navigationData.preAssessmentScore;
			navigationData.updateAssessmentScore(per);	
			
		}
		
		var idArr=new Array();
		var scoreArr=new Array();
		var finalArr=new Array();
		for (var i = 0; i < moduleQueAnsArray.length; i++) {			
			var totCorr=moduleQueAnsArray[i].totCorrect;
			var totQue=moduleQueAnsArray[i].array.length;
			var modPer=Math.round((totCorr/totQue)*100);
			
			moduleQueAnsArray[i].score=modPer;
			idArr[i]=parseInt(moduleQueAnsArray[i].id);
			scoreArr[i]=modPer;
			if(modPer>=preAssessmentPassingscore){
				navigationData.anyModPassPreAss = true;
				var optModId = moduleQueAnsArray[i].id;				
				mIdArray.push(optModId);
				
			}
		}	
		var sortArr = idArr;
		sortArr.sort(function(a, b){return a-b});
		
		var count=0;
		for (var i = 0; i < sortArr.length; i++) {	
			for (var j = 0; j < moduleQueAnsArray.length; j++) {			
				if(sortArr[i]==moduleQueAnsArray[j].id){
					//finalArr[count]="m_"+moduleQueAnsArray[j].id+"-"+moduleQueAnsArray[j].score;
					finalArr[count]=moduleQueAnsArray[j].score;
					count++;
					break;
				}				
			}
		}
		//console.log("mIdArray: "+mIdArray);
		navigationData.preAssessmentScoreArr=finalArr;
		navigationData.updatePreAssessmentAns(mIdArray);		
		return false;
	}

	function getQuestionHTML(_type){
		var str="";
		if(_type.toLowerCase()=='mcq'){
			str='<div class="aessmentMCQ summativeMCQ" ><div class="panelBg" ></div><div class="content-panel" > <div class="content-bg white-background-bg"><div class="pageTitle" tabindex="2" ><p></p></div><div class="topContent">  <div class="pageText pageMargin" ><p></p></div> </div><div class="pageInstruction assessment" style="display: block;"><p class="instructionText">TEXT</p></div> <div class="queContainer clearfix " ><div class="optionContainer mcq " ></div><div class="userFeedbackHeader" ></div></div> </div><div class="userFeedback content-bg" ><div class="userFeedbackText" ></div>  </div> </div></div> ';

		}else if(_type.toLowerCase()=='mrq'){
			str='<div class="aessmentMCQ summativeTAWA" ><div class="panelBg" ></div><div class="content-panel" ><div class="content-bg white-background-bg" > <div class="pageTitle" tabindex="2" ><p></p></div><div class="topContent"><div class="pageText pageMargin" ><p></p></div></div><div class="pageInstruction assessment" style="display: block;"><p class="instructionText">TEXT</p></div><div class="queContainer clearfix" ><div class="optionContainer mrq " ></div><div class="userFeedbackHeader" ></div></div></div><div class="userFeedback content-bg" ><div class="userFeedbackText" ></div></div></div></div>';
		}
		return str;
	}
	function getQuestionId(setId){
		return assXML.module[setId].id;
	}
	function getQuestionType(setId,queId){
		return assXML.module[setId].question[queId].type;
	}
	function getAnswer(setId,queId){
		return assXML.module[setId].question[queId].options[0].answer;
	}
	function getOptionsLength(setId,queId){
		return assXML.module[setId].question[queId].options[0].option.length;
	}
	function getOptionText(setId,queId,opId){
		return assXML.module[setId].question[queId].options[0].option[opId].Text;
	}
	function getQuestionText(setId,queId){
		var qText="";
		for(var i=0;i<assXML.module[setId].question[queId].questionText[0].text.length;i++){			
			qText+=assXML.module[setId].question[queId].questionText[0].text[i].Text;	
			qText+=" "
		}	
		return qText;
	}
	function getInstuctionText(setId,queId){
		return assXML.module[setId].question[queId].instructionText[0].Text;
	}
	function getCorrectFeedback(setId,queId){
		return assXML.module[setId].question[queId].feedback[0].correct[0].Text;
	}
	function getInCorrectFeedback(setId,queId){
		return assXML.module[setId].question[queId].feedback[0].incorrect[0].Text;
	}

	function getAllOptions(setId,queId){
		var arr=new Array();
		for(i=0;i<getOptionsLength(setId,queId);i++){
			arr.push(getOptionText(setId,queId,i));
		}
		return arr.join("~#~");
	}
	function getCorrectAnswers(correctAns,setId,queId){
		var ans=correctAns.split(",");
		var arr=new Array();
		for(i=0;i<getOptionsLength(setId,queId);i++){
			if(parseInt(ans[i])==1){
				arr.push(getOptionText(setId,queId,i));
			}
		}
		return arr.join("~#~");
	}
	function resetAssesment(){
		correctQueArray=new Array();
		userAnswerArray=new Array();
		questionArray=new Array();
		pullArray=new Array();
		_currentModuleId=0;
		_currentQuestionId=0;
		_questionObj=null;
	}
	function clearAllEvent(){

	}

}