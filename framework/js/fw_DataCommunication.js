/*----------------------------------------
	Name: fw_DataCommunication.js
	Developed by: Suyog Shaha	
	Updated by: Sunil Patil
	Change In: updateUserData function
	Purposed : if 100% passed Pre Assessment, completion depend on sub module 
	Dated By: 23/01/15
----------------------------------------*/
function fw_DataCommunication(){
	/**Variables*/
	this.VAR_BOOKMARK = "cmi.core.lesson_location";
	this.VAR_LESSONSTATUS = "cmi.core.lesson_status";
	this.VAR_SUSPENDDATA = "cmi.suspend_data";
	this.VAR_ENTRYSTATE = "cmi.core.entry";
	this.VAR_LESSON_MODE = "cmi.core.lesson_mode";
	this.VAR_SESSIONTIME = "cmi.core.session_time";
	this.VAR_SCORE = "cmi.core.score.raw";
	this.USER_RESPONCE=".student_response";
	this.STUDENT_NAME="cmi.core.student_name";
	/*cmi.success_status is for scorm2004 "passed", "failed", "unknown"*/
	this.VAR_SUCCESS_STATUS="cmi.success_status";
	//---updated for scorm 2004 score
	this.VAR_SCORE_MAX="cmi.core.score.max";
	this.VAR_SCORE_MIN="cmi.core.score.min";
	this.VAR_SCORE_SCALED="cmi.score.scaled";
	//---
	var lmsConnected=false;
	var dataStoreAPI;
	var bookmark="";
	var suspendData="";
	var lessonStatus="incomplete";
	var scoreRaw="";
	this.init=init;	
	this.getLessonStatus=getLessonStatus;
	this.updateUserData=updateUserData;
	this.closeCourse=closeCourse;
	this.sendPageStatement=sendPageStatement;
	this.updateInteraction=updateInteraction;
	var isAssesmentLaunch=false;
	var successStatus="unknown";
	var lmsScore="";
	var courseType=0;
	var entryState="";
	var lessonMode="";
	/** Functions */
	function init(){		
		preLoade.showPreLoader("Fetching User Data....");
		if(playerSetting.coursetype == playerSetting.SCORM_2004 || playerSetting.coursetype==playerSetting.TIN_CAN){
			courseType=1;			
		}
		if(playerSetting.isScorm()){
			dataStoreAPI = pipwerks.SCORM;
		}else if(playerSetting.coursetype == playerSetting.TIN_CAN){
			dataStoreAPI = fw_TINCAN;
		}else if(playerSetting.isCookies()){
			dataStoreAPI = fw_Cookies;
		}else if(playerSetting.coursetype==playerSetting.AICC){
			dataStoreAPI = fw_AICC;
		}
		if (playerSetting.coursetype == playerSetting.STANDALONE) {
			lmsConnected = false;
		}else {
			lmsConnected = dataStoreAPI.init();
		}
		if(playerSetting.coursetype==playerSetting.SCORM_2004){
			dataStore.VAR_BOOKMARK = "cmi.location";
			dataStore.VAR_ENTRYSTATE = "cmi.entry";
			dataStore.VAR_LESSON_MODE = "cmi.mode";
			dataStore.VAR_LESSONSTATUS = "cmi.completion_status";
			dataStore.VAR_SUSPENDDATA = "cmi.suspend_data";
			dataStore.VAR_SESSIONTIME = "cmi.session_time";
			dataStore.USER_RESPONCE=".learner_response";
			dataStore.VAR_SCORE="cmi.score.raw";
			dataStore.STUDENT_NAME="cmi.learner_name";
			dataStore.VAR_SCORE_MAX="cmi.score.max";
			dataStore.VAR_SCORE_MIN="cmi.score.min";	
		}	
		if(playerSetting.coursetype==playerSetting.AICC && lmsConnected){
			doLMSGetData(function(){
				getLMSData();
			});
		}else if(lmsConnected){
			getLMSData();			
		}else{
			//suspendData="~##~true~##~eng~##~a_1,a_2,a_3,a_4,a_5,a_6~##~2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0~##~,,1^1^1^1,1^1^1^1,1^1,1^1^1,1^1^1^1,,,1^1^1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~##~false~##~2"
			navigationData.createProgressArray(suspendData);
			navigationData.createBookmarkArray(bookmark);
			updatePlayer();					
		}
		
	}
	
	function getLMSData(){
		entryState = dataStoreAPI.get(dataStore.VAR_ENTRYSTATE);
		lessonMode = dataStoreAPI.get(dataStore.VAR_LESSON_MODE);
		suspendData = dataStoreAPI.get(dataStore.VAR_SUSPENDDATA);
		//suspendData="~##~true~##~eng~##~a_1,a_2,a_3,a_4,a_5,a_6~##~2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0~##~,,1^1^1^1,1^1^1^1,1^1,1^1^1,1^1^1^1,,,1^1^1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~##~false~##~2"	
		bookmark = dataStoreAPI.get(dataStore.VAR_BOOKMARK);		
		navigationData.createProgressArray(suspendData);
		navigationData.createBookmarkArray(bookmark);
		lessonStatus=dataStoreAPI.get(dataStore.VAR_LESSONSTATUS);
		scoreRaw = dataStoreAPI.get(dataStore.VAR_SCORE);
		navigationData.student_name=dataStoreAPI.get(dataStore.STUDENT_NAME);
		//-- for show first name and then last name
		var stdName=navigationData.student_name;
		if(String(stdName)!="undefined"){
			if(stdName.indexOf(",") != -1)
			{
				var student_name_arr = stdName.split(",");
				navigationData.student_name = student_name_arr[1] + " " + student_name_arr[0];
			}	
		}
		//--
		if(isNull(navigationData.student_name)){
			navigationData.student_name="Student Name"
		}
		lmsScore=scoreRaw;
		if (playerSetting.coursetype == playerSetting.SCORM_2004 || playerSetting.coursetype==playerSetting.TIN_CAN) {
			successStatus=	dataStoreAPI.get(dataStore.VAR_SUCCESS_STATUS);
		}
		if(lessonStatus==null){
			lessonStatus="incomplete";
		}		
		if(lessonStatus=="completed" || lessonStatus=="passed" || lessonStatus=="failed" ){
			lessonStatus=lessonStatus;
		}else{
			lessonStatus="incomplete";
		}		
		navigationData.userScore=scoreRaw;
		if (IsNumeric(scoreRaw)) {
			isAssesmentLaunch=true;
		}else{
			isAssesmentLaunch=false;
		}
		if(playerSetting.coursetype==playerSetting.TIN_CAN){
			dataStoreAPI.sendStatusStatement("attempted", true);
		}
		//---
			dataStoreAPI.set(dataStore.VAR_SCORE_MAX, 100);
			dataStoreAPI.set(dataStore.VAR_SCORE_MIN, 0);
		//--
		updatePlayer();
	}	
	function sendPageStatement(){
		preLoade.showPreLoader("Sending User Data...");
		dataStoreAPI.sendStatement(COURSE_ID+"/"+navigationData.getCurrentPageURL(),navigationData.getPageTitle(),navigationData.getPageTitle(), navigationData.getTinCanVerb());
		preLoade.hidePreLoader();
	}
			
	function setLMSData(){		 	
		testConnection(myCallBack);
		if(lmsConnected && dataStoreAPI!=null ){
			preLoade.showPreLoader("Sending User Data...");
			dataStoreAPI.set(dataStore.VAR_BOOKMARK, navigationData.getBookMarkData());
			dataStoreAPI.set(dataStore.VAR_SUSPENDDATA, navigationData.getSuspendData());
			dataStoreAPI.set(dataStore.VAR_LESSONSTATUS, lessonStatus);
			if (IsNumeric(scoreRaw)) {
				if (courseType == 1) {
					var perScore=scoreRaw/100;
					dataStoreAPI.set(dataStore.VAR_SCORE, scoreRaw);
					dataStoreAPI.set(dataStore.VAR_SCORE_SCALED, perScore);
				}else{
					dataStoreAPI.set(dataStore.VAR_SCORE, scoreRaw);
				}
			}
			if (courseType == 1) {
				dataStoreAPI.set(dataStore.VAR_SUCCESS_STATUS, successStatus);
				
			}
			dataStoreAPI.save();		
			preLoade.hidePreLoader();			
		}
	}	
	
	function getLessonStatus(){
		return lessonStatus;
	}
	function IsNumeric(n){
    	var n2 = n;
        n = parseFloat(n);
        return (n!='NaN' && n2==n);
	}
	
	function updateUserData(){
		checkLMSAlive();
		if(IsNumeric(navigationData.userScore)){			
			if(scoreRaw<navigationData.userScore || !IsNumeric(scoreRaw)){
				scoreRaw=navigationData.userScore;
			}
		}	
		lessonStatus = "incomplete";		
		
		switch (courseType) {
			case 0 :
				//if(navigationData.iCertify){
				if(navigationData.checkAllCompModCompleted()){
					navigationData.iCertify=true;
					if(isNull(navigationData.passDate)){
						navigationData.passDate= globalSettings.getTodayDate();
					}
					lessonStatus = "passed";
					
				}else{
					lessonStatus = "incomplete";
				}					
			break;
			case 1 :
			//--for pre-assessment score 100%
					if(navigationData.isPass && navigationData.checkAllCompModCompleted()){
						navigationData.iCertify=true;
						if(isNull(navigationData.passDate)){
							navigationData.passDate= globalSettings.getTodayDate();
						}						
					}else{
						
					}
				//--
					if(navigationData.iCertify){
						lessonStatus = "completed";
					}else{
						lessonStatus = "incomplete";
					}
					if (IsNumeric(scoreRaw)) {						
						if (scoreRaw>=playerSetting.passingScore) {
							successStatus = "passed";
							navigationData.isPass=true;
						}else{
							successStatus = "failed";
						}
					}else{
						successStatus='unknown';
					}	
			break;
		}
		setLMSData();
	}
	function closeCourse(){
		//--edit for sumtotal lms
		if (!course_closed && lmsConnected && dataStoreAPI!=null)
		{
			course_closed = true;
			updateUserData();
			insertDelay(500);
			var timeSpent = getSessionTime();
			dataStoreAPI.set(dataStore.VAR_SESSIONTIME, timeSpent);			
			dataStoreAPI.save();
			insertDelay(500);
			dataStoreAPI.quit();
			
		}
		
	}
	
	function getSessionTime() {
		var dtm = new Date();
		var initalTime=globalData.getInitalTime();
		var n = dtm.getTime() - initalTime.getTime();
		if(playerSetting.coursetype==playerSetting.SCORM_2004){
			return ConvertMilliSecondsIntoSCORM2004Time(n);
		}else{
			return MillisecondsToCMIDuration(n);
		}
	}
	/*SCORM 1.2 time format:Convert duration from milliseconds to 0000:00:00.00 format*/
	function MillisecondsToCMIDuration(LessonDuration) {
		var hr ="000" + Math.floor(LessonDuration/(60*60*1000));
		var temp = (LessonDuration-(hr*60*60*1000));
		var min = "0" + Math.floor(temp/(60*1000));
		var sec = temp-(min*60*1000);
		temp = temp - (sec*1000);
		var ms = "0" + Math.floor(temp/1000);
		sec = "0" + Math.floor(sec/1000);
		var LessonDurationFormat = hr.substr(hr.length-4)+":"+min.substr(min.length-2)+":"+sec.substr(sec.length-2)+"."+ms.substr(ms.length-2);
		return LessonDurationFormat;
	}
	/*SCORM 2004 time format (Ref. form ADL) */
	function ConvertMilliSecondsIntoSCORM2004Time(intTotalMilliseconds){	
		var ScormTime = "";
		var HundredthsOfASecond;
		var Seconds;
		var Minutes;
		var Hours;
		var Days;
		var Months;
		var Years;	
		var HUNDREDTHS_PER_SECOND = 100;
		var HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
		var HUNDREDTHS_PER_HOUR   = HUNDREDTHS_PER_MINUTE * 60;
		var HUNDREDTHS_PER_DAY    = HUNDREDTHS_PER_HOUR * 24;
		var HUNDREDTHS_PER_MONTH  = HUNDREDTHS_PER_DAY * (((365 * 4) + 1) / 48);
		var HUNDREDTHS_PER_YEAR   = HUNDREDTHS_PER_MONTH * 12;    	
		HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);    	
		Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
		HundredthsOfASecond -= (Years * HUNDREDTHS_PER_YEAR);    	
		Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
		HundredthsOfASecond -= (Months * HUNDREDTHS_PER_MONTH);    	
		Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
		HundredthsOfASecond -= (Days * HUNDREDTHS_PER_DAY);
		Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
		HundredthsOfASecond -= (Hours * HUNDREDTHS_PER_HOUR);
		Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
		HundredthsOfASecond -= (Minutes * HUNDREDTHS_PER_MINUTE);
		Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
		HundredthsOfASecond -= (Seconds * HUNDREDTHS_PER_SECOND);
		if (Years > 0) {
			ScormTime += Years + "Y";
		}
		if (Months > 0){
			ScormTime += Months + "M";
		}
		if (Days > 0){
			ScormTime += Days + "D";
		}
		if ((HundredthsOfASecond + Seconds + Minutes + Hours) > 0 ){
			ScormTime += "T";
			if (Hours > 0){
				ScormTime += Hours + "H";
			}    		
			if (Minutes > 0){
				ScormTime += Minutes + "M";
			}    		
			if ((HundredthsOfASecond + Seconds) > 0){
				ScormTime += Seconds;
				
				if (HundredthsOfASecond > 0){
					ScormTime += "." + HundredthsOfASecond;
				}    			
				ScormTime += "S";
			}    		
		}    	
		if (ScormTime == ""){
			ScormTime = "0S";
		}    	
		ScormTime = "P" + ScormTime;
		return ScormTime;
	}
	
	function updateInteraction(questionId, objectiveId, questionText, learnerResponse, correctAnswer, wasCorrect){	
	
		if(playerSetting.isOCCAMVer==true){return false;}
		
		var nextIndex = dataStoreAPI.get("cmi.interactions._count", true);
		
		dataStoreAPI.set("cmi.interactions." + nextIndex + ".id", questionId);
		//--support in scorm2004 only
		if (playerSetting.coursetype == playerSetting.SCORM_2004) {			
			var newStr=questionText.toString();			
			if(newStr.length>250){
				var res = newStr.substring(0, 245);
				newStr=res+"...";
			}			
			dataStoreAPI.set("cmi.interactions." + nextIndex + ".description", newStr);
		}
		//--
		dataStoreAPI.set("cmi.interactions." + nextIndex + ".objectives.0.id", objectiveId);
		
		dataStoreAPI.set("cmi.interactions." + nextIndex + ".type", "choice");
		//--		
		var _crrAns=correctAnswer;
		var _usrRes=learnerResponse;
		if (playerSetting.coursetype == playerSetting.SCORM_2004) {		
			_crrAns=correctAnswer.split(",").join("_");
			_usrRes=learnerResponse.split(",").join("_");
		}
		//--
		dataStoreAPI.set("cmi.interactions." + nextIndex + ".correct_responses.0.pattern",_crrAns);
		dataStoreAPI.set("cmi.interactions." + nextIndex + dataStore.USER_RESPONCE,_usrRes);
		var result="correct";                       
		if(wasCorrect){
			result="correct";
		}else{
			result="wrong";
			if (playerSetting.coursetype == playerSetting.SCORM_2004) {
				result="incorrect";
			}
		}
		dataStoreAPI.set("cmi.interactions." + nextIndex + ".result",result);
		dataStoreAPI.save();
	}	
}

