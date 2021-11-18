/*----------------------------------------
	Name: fw_NavigationData.js
	Developed by: Suyog Shaha
	Updated by: Sunil Patil
	Added Function : isAllSubModuleCompleted
	Purposed : check AllSubModule are completed, because completion is also depend on All SubModule Completed 	
	Dated By: 23/01/15
----------------------------------------*/
function fw_NavigationData(){
	/**Variables*/
	var progressArray;
	var pageDataArray;
	var bookMarkArray;
	var removeModulesIdArray = new Array();
	var inCorrectPreAssessmentModIds = "";
	var totalPages=0;
	var navXml=globalData.navigationXML;
	var navTextXml=null;   
	this.updateNextPageURL=updateNextPageURL;
	this.updatePreviousPageURL=updatePreviousPageURL;
	this.getCurrentPageLocation=getCurrentPageLocation;
	this.isFirstPage=isFirstPage;
	this.isLastPage=isLastPage;
	this.getPageType=getPageType;
	this.getNextPageId=getNextPageId;
	this.getModuleTitle=getModuleTitle;
	this.getNetFailAlertMsg=getNetFailAlertMsg;
	this.getPageTitle=getPageTitle;
	this.getCourseTitle=getCourseTitle;
	this.getTotalPages=getTotalPages;
	this.getTotalPagesInModule=getTotalPagesInModule;
	this.getCurrentPageNumber=getCurrentPageNumber;
	this.createProgressArray=createProgressArray;
	this.checkAllVisited=checkAllVisited;
	this.checkAllCompModCompleted=checkAllCompModCompleted;
	this.getCurrentPageURL=getCurrentPageURL;	
	this.getPageAudioURL=getPageAudioURL;
	this.getPageVideoURL=getPageVideoURL;
	this.getCurrentPageXMLURL=getCurrentPageXMLURL;
	this.getSuspendData=getSuspendData;
	this.updateProgressData=updateProgressData;
	this.updateAssessmentScore=updateAssessmentScore;	
	this.lofadTranscript=loadTranscript;	
	this.loadGlossary=loadGlossary;
	this.searchGlossary=searchGlossary;
	this.getTinCanVerb=getTinCanVerb;
	this.isAssessmentPage=isAssessmentPage;
	this.isPreAssessmentPage=isPreAssessmentPage;
	this.isCurrentPageComplete=isCurrentPageComplete;
	this.isPageMandatory=isPageMandatory;
	this.getTemplateName=getTemplateName;
	this.updateProfileLocations=updateProfileLocations;
	this.updateProfileQuestions=updateProfileQuestions;
	this.profileQueArray= new Array();
	this.profileLocArray= new Array();
	this.userProfileArray = new Array();
	this.userProfileLocVal = "";
	this.updateUserNavigation=updateUserNavigation;
	this.updateUserNavigation1=updateUserNavigation1;
	this.updateUserNavigation2 =updateUserNavigation2;
	this.isLastPageInModule=isLastPageInModule;
	this.isModuleComplete=isModuleComplete;
	this.updateCurrentPageData=updateCurrentPageData;
	this.getCurrentPageData=getCurrentPageData;
	this.isModuleCompulsory=isModuleCompulsory;	
	this.isModuleMandatory=isModuleMandatory;	
	this.updateBookMark=updateBookMark;
	this.createBookmarkArray=createBookmarkArray;
	this.getBookMark=getBookMark;
	this.getBookMarkData=getBookMarkData;
	this.getSubModuleId=getSubModuleId;
	this.updateNextPageProgress=updateNextPageProgress;
	this.resetCurrentPageProgress=resetCurrentPageProgress;
	this.updatePreAssessmentAns=updatePreAssessmentAns;
	this.filterPreAssessmentData = filterPreAssessmentData;
	this.updateSubModuleProgress = updateSubModuleProgress;
	this.updateNextPageIndex = updateNextPageIndex;
	this.setSubModuleCompletion = setSubModuleCompletion;
	this.isSetCompletion = isSetCompletion;
	this.isTranscriptBlank = isTranscriptBlank;
	this.firstTime=false;
	this.isPass=false;
	
	this.isPreAssessmentComplete=false;
	
	this.anyModPassPreAss=false;
	this.passDate="";
	this.student_name="";
	this.isUserSelectoption=0;
	this.preAssessmentScore=0;
	var userScoreArray = new Array();
	var jumpVal=0;
	this.userScore="";
	var jumpPageIndex=0;
	this.preAssessmentScoreArr=new Array();
	
	this.profileEnvironment="";
	this.profilearray;
	this.profilelocval;
	this.profileisUserChangeSelection;
	this.profileisLocUserChangeSelection;
	this.profileprArray;
	this.iCertify=false;
	this.videoObj = new VideoPlayer();
	this.updateProgressBarStatus=updateProgressBarStatus;
	this.gb_compalsaryModArr=[];
	/** Functions */
	function loadTranscript(){
		//if(playerSetting.isTranscript){			
			$.fw_Transcript({parent:'.wrapper'});
		//}
	}
	function loadGlossary(){
		if(playerSetting.isGlossary){
			$.fw_Glossary({glossaryXML:globalData.glossaryXML});
		}
	}
	function searchGlossary(str){
		if(playerSetting.isGlossary){
			$.fw_Glossary("search",str);
			navigation.showGlossary();
		}
	}
	function updateNextPageURL(){
		if (menuData == null) return null;
		if (menuData.moduleIndex >= moduleCount() - 1 && menuData.pageIndex >= pageCount(menuData.moduleIndex)-1) {
			return null;
		}else {
			if(playerSetting.addJumpingInSubModule){
				storePageIndex();
				if(isJumpAvailable()){
					updatePageIndex('page');
				}else if(isChallengeQuestion()){
					updatePageIndex('challenge');
				}else if(isStorePageIndex()){
					updatePageIndex('storePageIndex');
				}else{ 
					menuData.pageIndex++;
				}
			}else{
				menuData.pageIndex++;
			}
			if (menuData.pageIndex >= pageCount(menuData.moduleIndex)) {
				menuData.pageIndex = 0;
				menuData.moduleIndex++;
			}				
		}
			return  getPageURL();
	}
	
	
	/*This is custom code for jumping in Challenges*/ 
	function isJumpAvailable() { 
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].nextJump!=null?true:false;
	}
	function isStorePageIndex() { 
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].jumpStoredPageIndex!=null?true:false;
	}
	function isChallengeQuestion() { 
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].challengeQue!=null?true:false;
	}
	
	function updatePageIndex(val) {
		switch(val){
			case 'page': menuData.pageIndex= menuData.pageIndex + parseInt(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].nextJump);
				break;
			case 'challenge': menuData.pageIndex= menuData.pageIndex + jumpVal;
				break;
			case 'storePageIndex': menuData.pageIndex = menuData.pageIndex + jumpPageIndex;
				break;	
			}
	}
	
	function updateNextPageIndex(val){	
		jumpVal=0;
		switch(val){
			case 0:
				if(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].incorrectJump!=null){
					jumpVal=parseInt(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].incorrectJump);
				}
				break;
			case 1:
				if(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].partialJump!=null){
					jumpVal=parseInt(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].partialJump);
				}
				break;
			case 2:
				if(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].correctJump!=null){
					jumpVal= parseInt(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].correctJump);
				}
				break;	
		}		
	}
	
	function storePageIndex(){
		if(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].storePageIndex!=null){
			jumpPageIndex = parseInt(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].storePageIndex); 
		}		
	}
	/*-------------------------------------------*/
	/*This is custom code for sub module completion*/
	function setSubModuleCompletion(currentModule) {
		var count = 0;		
		for (var i = 1; i < moduleCount(); i++) {
			for (var j = 0; j < pageCount(i); j++) {					
				if(i===currentModule){
					progressArray[count] = 2;				
				}	
				count++;			
			}
		}	
	}
	function isSetCompletion() { 
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].setCompletion!=null?true:false;
	}
	/*------------------------------*/
	function updatePreviousPageURL() {
		if (menuData == null) return null;
		
		if (menuData.moduleIndex == 0 && menuData.pageIndex == 0) {
			return null;
		}else{
			menuData.pageIndex--;
			if (menuData.pageIndex < 0) {
				menuData.moduleIndex--;
				menuData.pageIndex = pageCount(menuData.moduleIndex) - 1;
			}
		}

		return  getPageURL();
	}
	function moduleCount() {
		return navXml.module.length;
	}
	function getPageURLByData(value) {
		if (menuData == null) return null;
		menuData = value;
		return  getPageURL();
	}
	function getCurrentPageURL() {
		return getPageURL();
	}
    function getPageURL(){
         var pgType=getPageType();
         var pagepath="";
         var playerSettingXML=globalData.playerSettingXML;
		 for (var i = 0; i < playerSettingXML.templates[0].template.length; i++) {
			 var nm=playerSettingXML.templates[0].template[i].name;
             if(pgType==nm){
               pagepath=playerSettingXML.templates[0].template[i].templatePath;
               break;
             }

		 }
         // need to write a code for unavailable tempate.
        return pagepath;
    }
    function getCurrentPageXMLURL() {
		var XMLPath=navXml.module[menuData.moduleIndex].page[menuData.pageIndex].xmlPath;
		if(XMLPath.indexOf('content/xml')>=0 || XMLPath.indexOf('framework/xml')>=0){
			return XMLPath;			
		}else{
			XMLPath= 'content/'+globalPath.userLanguage+"/"+XMLPath;
			//-- for testing in ipad
			//XMLPath= 'content/'+globalPath.userLanguage+"/"+XMLPath+"?"+Math.random();
			//--
			return XMLPath;
		}		
    }	
	
	function pageCount(moduleIndex) {
		if(moduleIndex>=navXml.module.length){
			return null;
		}
		return navXml.module[moduleIndex].page.length;
	}
	function getCurrentPageLocation(){
			return menuData;
	}
	function isFirstPage(){
		if (menuData.pageIndex <= 0) {
			return true;
		}else{
			return false;
		}
	}
	function isLastPage(){
        if(menuData.moduleIndex==(moduleCount()-1)  && menuData.pageIndex == (pageCount(menuData.moduleIndex)-1)){
           return true;
		}else{
			return false;
		}
	}
	function isLastPageInModule(){
        if(menuData.pageIndex == (pageCount(menuData.moduleIndex)-1)){
           return true;
		}else{
			return false;
		}
	}
	
	function getPageType() {
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].pageType;
	}
	function getNextPageId() {
		if(navXml.module[menuData.moduleIndex].page[menuData.pageIndex].nextPage){
			return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].nextPage;		
		}else{
			return "";
		}
	}
	
    function isPageMandatory() {
	   if (navXml.module[menuData.moduleIndex].page[menuData.pageIndex].mandatory == "true") {
			return true;
		}else{
			return false;
		}
	} 
	function isTranscriptBlank() {
		var str = navXml.module[menuData.moduleIndex].page[menuData.pageIndex].isTranscriptBlank;
		if (str!=null && str== "true") {
			return true;
		}else{
			return false;
		}
	}
    function getTemplateName() {
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].pageType;
	}
	function isAssessmentPage() {
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].pageType=="assessment"?true:false;
	}
	function isPreAssessmentPage() {
		return navXml.module[menuData.moduleIndex].page[menuData.pageIndex].pageType=="preAssessment"?true:false;
	}
	function getPageAudioURL() {
		if(currentPageXML!=null){
			if(currentPageXML.transcript!=undefined){
				if(currentPageXML.transcript[0].text[0].path==null || currentPageXML.transcript[0].text[0].path==""){return "none";}
				return url='content/'+globalPath.userLanguage+"/"+currentPageXML.transcript[0].text[0].path;
			}
		}   
    }
	function getPageVideoURL() {
	     return url='content/'+globalPath.userLanguage+"/"+navXml.module[menuData.moduleIndex].page[menuData.pageIndex].mediaPath;
    }
	function getModuleTitle(){
		if(menuData.moduleIndex<=0 || navTextXml==null){
			var myIndex = 0;
			

			for(i=0;i<navXml.module[0].title.length;i++)
			{

				if(navXml.module[0].title[i].lang==globalPath.userLanguage){
					myIndex =i;
				}
			}
			return navXml.module[menuData.moduleIndex].title[myIndex].Text;
			//return navXml.module[menuData.moduleIndex].title[0].Text;
		}else if(navigationData.getSubModuleId()>0){
			for(i=0;i<navXml.module.length;i++){
				if(navXml.module[i].subModule == 'true'){
					var reg=new RegExp("\<[^>]+\>","g");
					return navTextXml.module[i-1].title[0].Text.replace(reg,"");
				}
			}
		}else{
			var reg=new RegExp("\<[^>]+\>","g");
			return navTextXml.module[menuData.moduleIndex-1].title[0].Text.replace(reg,"");
		}
	}
	function getCourseTitle(){		
		var myIndex = 0;
			for(i=0;i<navXml.module[0].title.length;i++)
			{
				if(navXml.module[0].title[i].lang==globalPath.userLanguage){
					myIndex =i;
				}
			}
		return navXml.module[0].title[myIndex].Text;		
	}
	//--- for get network and API fail alert text. updated / modified by sunil vetal
	function getNetFailAlertMsg(){

		var myIndex = 0;
		var totLang=navXml.inst.length;
	

		for(i=0;i<totLang;i++)
		{
			var temp=navXml.inst[i].lang;				
			if(temp==globalPath.userLanguage)
				myIndex =i;
		}
		return navXml.inst[myIndex];
	}
	//---	
	
	function getPageTitle(){
		if(menuData.moduleIndex<=0 || navTextXml==null)return false;		
		return navTextXml.module[menuData.moduleIndex-1].page[menuData.pageIndex].title[0].Text;
	}
	
	function getSubModuleId(){
		if(navXml.module[menuData.moduleIndex].subMod!=null){
			return parseInt(navXml.module[menuData.moduleIndex].subMod);
		}else{
			return 0;
		}
	}
	
	function getTinCanVerb(){
		var tincanverb="";
		try{
		tincanverb=navXml.module[menuData.moduleIndex].page[menuData.pageIndex].tincanverb;
		}catch(err){}
		if(tincanverb== null || tincanverb==""){
			tincanverb="experienced";
		}
		return tincanverb;
	}
	function getTotalPages(){
		if(totalPages==0){
			for (var i= 1; i < moduleCount(); i++) {				
				for (var j= 0; j < pageCount(i); j++) {
					totalPages++;
				}				
			}
		}
		return totalPages;
	}
	function getTotalPagesInModule(){		
		return pageCount(menuData.moduleIndex);
	}

	function getCurrentPageNumber(){
		var count= 0;
		var found = false;
		for (var i= 1; i < moduleCount(); i++) {
			for (var j= 0; j < pageCount(i); j++) {				
				count++;
				if (i == menuData.moduleIndex &&  j == menuData.pageIndex) {
					found = true;
					break;
				}				
				if (found) {
					break;
				}
			}
			if (found) {
				break;
			}
		}
		if (!found) {
			count=0;			
			}
		return count;
	}
	function getPageNumberByData(mod,page){
		var count= 0;
		var found = false;
		for (var i= 1; i < moduleCount(); i++) {
			for (var j= 0; j < pageCount(i); j++) {				
				count++;
				if (i == mod &&  j == page) {
					found = true;
					break;
				}				
				if (found) {
					break;
				}
			}
			if (found) {
				break;
			}
		}
		if (!found) {
			count=0;			
		}
		return count;
	}
	
	function createProgressArray(progressString) {
		var count = 0;
		progressArray = new Array();
		pageDataArray = new Array();
		navigationData.firstTime=true;		
		if(isNull(progressString)){
			for (var i = 1; i < moduleCount(); i++) {
				for (var j = 0; j < pageCount(i); j++) {					
					progressArray[count] = 0;
					pageDataArray[count] = "";
					count++;			
				}
			}
			
			inCorrectPreAssessmentModIds="";
			navigationData.isPreAssessmentComplete=false;
			navigationData.preAssessmentScore=0;
			navigationData.profileEnvironment="";
		}else {
			navigationData.firstTime=false;
			var temp=progressString.split("~##~");			
			navigationData.passDate=temp[0];
			playerSetting.isAudio= temp[1]=="true"?true:false;
			globalPath.userLanguage=temp[2];
			//globalPath.userRegion=temp[3];
			navigationData.userProfileLocVal=temp[3];
			navigationData.userProfileArray = temp[4].split(",");
			progressArray = temp[5].split(",");
			pageDataArray = temp[6].split(",");			
			navigationData.isPass= temp[7]=="true"?true:false;
			navigationData.isUserSelectoption = isNaN(temp[8])?0:Number(temp[8]);
			navigationData.isPreAssessmentComplete = temp[9]=="true"?true:false;
			inCorrectPreAssessmentModIds = temp[10];
			
			if(temp[10] != "" && temp[11] != null ){
			userScoreArray =  temp[11].split(",");
			}
			navigationData.preAssessmentScore = temp[12];
			navigationData.profileEnvironment=temp[13];
			navigationData.iCertify=temp[14]=="true"?true:false;
			navigationData.anyModPassPreAss=temp[15]=="true"?true:false;
		}		
	}
	function createBookmarkArray(bookMarkString) {		
		bookMarkArray = new Array();		
		if(isNull(bookMarkString)){
			for (var i = 0; i < moduleCount(); i++) {									
					bookMarkArray[i] = -1;				
			}
		}else {			
			bookMarkArray = bookMarkString.split(",");			
		}
		
	}
	
	function updateBookMark(){
		bookMarkArray[menuData.moduleIndex] = menuData.pageIndex;		
	}
	
	function getBookMark(){
		return bookMarkArray[menuData.moduleIndex];		
	}
	
	function getBookMarkData(){
		return bookMarkArray.toString();	
	}
		
	function checkAllVisited() {
		var allVisited = true;
		for (var i = 0; i < progressArray.length-1; i++) {
			if (parseInt(progressArray[i])<=1) {
				allVisited = false;
				break;
			}
		}
		return allVisited;
	}
	
	function checkAllCompModCompleted() {
		if(navigationData.gb_compalsaryModArr.length <=0 || navigationData.gb_compalsaryModArr==""){
			return false;
		}
		var completedMod=0;
		for (var i = 0; i < navigationData.gb_compalsaryModArr.length; i++) {
			var _id=parseInt(navigationData.gb_compalsaryModArr[i]);
			if(navigationData.isModuleComplete(_id)==2){
				completedMod++;
			}		
		}
		if(completedMod>=navigationData.gb_compalsaryModArr.length){
			return true;
		}else{
			return false;
		}		
	}

    function isCurrentPageComplete() {
		return parseInt(progressArray[getCurrentPageNumber() - 1])==2;
	}
	
	function updateProgressBarStatus(){
		var per = getProgressPercentage();
		$('.progress-bar-bg .progress-bar').css('width',per+'%');
	}
	function getProgressPercentage() {
		var cnt=0;
		for (var i = 0; i < progressArray.length; i++) {
			if (parseInt(progressArray[i])==2) {
				cnt++;
			}
		}
		var per=Math.round((cnt/progressArray.length)*100);
		return per;
	}

	function getSuspendData(){
		//alert("userProfileLocVal"+navigationData.userProfileLocVal)
		return navigationData.passDate+"~##~"+playerSetting.isAudio+"~##~"+globalPath.userLanguage+"~##~"+navigationData.userProfileLocVal+"~##~"+navigationData.userProfileArray.toString()+"~##~"+progressArray.toString()+"~##~"+pageDataArray.toString()+"~##~"+navigationData.isPass+"~##~"+navigationData.isUserSelectoption+"~##~"+navigationData.isPreAssessmentComplete+"~##~"+inCorrectPreAssessmentModIds+"~##~"+userScoreArray.toString()+"~##~"+navigationData.preAssessmentScore+"~##~"+navigationData.profileEnvironment+"~##~"+navigationData.iCertify+"~##~"+navigationData.anyModPassPreAss;
	}
	
	function updateProgressData(val){
		var pgNo=getCurrentPageNumber() - 1;
		if (parseInt(progressArray[pgNo]) != 2) {		
			progressArray[pgNo] = val;			
		}		
	}
	function updateCurrentPageData(val){		
		pageDataArray[getCurrentPageNumber() - 1] = val;	
	}
	
	function updateSubModuleProgress(val){
		var count= 0;
		for (var i= 1; i < moduleCount(); i++) {			
			for (var j= 0; j < pageCount(i); j++) {	
				if (i == menuData.moduleIndex) {
					progressArray[count] = 2;
				}
				count++;
			}			
		}	
			
	}
	
	function updateNextPageProgress(val){
		var pgId=getCurrentPageNumber() - 1;
		progressArray[val+pgId] = 2;		
	}
	
	function resetCurrentPageProgress(){
		var pgId=getCurrentPageNumber() - 1;
		progressArray[pgId] = 0;		
	}
	
	function getCurrentPageData(val){				
		return pageDataArray[getCurrentPageNumber() - 1];
	}
	
	function updateAssessmentScore(val){
		navigationData.userScore=val;
		if(userScoreArray.length>9){
			userScoreArray.splice(1,1);			
		}
		userScoreArray.push(val);
		if(playerSetting.coursetype != playerSetting.STANDALONE){
			dataStore.updateUserData();
		}
	}
	function getModuleIdByAttrId(modId){
		var id=1;
		for (var i= 0; i <navXml.module.length; i++) {				
			if(navXml.module[i].id==modId){
				id=i;
				break;
			}					
		}
		return id;
	}
	function isModuleCompulsory(modId){
		var flag=false;
		for (var i= 1; i <navXml.module.length; i++) {				
			if(navXml.module[i].id==modId){				
				if(navXml.module[i].profilerQueId.toLowerCase()=="all" || navXml.module[i].profilerLocId.toLowerCase()=="all"){
					flag=true;
				}
				break;
			}					
		}
		return flag;
	}
	
	
	function isModuleMandatory(modId){
		var flag=false;
		for (var i= 1; i <navXml.module.length; i++) {				
			if(navXml.module[i].id==modId){				
				if(navXml.module[i].profilerQueId.toLowerCase()=="all" || navXml.module[i].profilerLocId.toLowerCase()=="all" ||  navXml.module[i].modType.toLowerCase()=="assessment"){
					flag=true;
				}
				break;
			}					
		}
		return flag;
	}
	
	function isModuleComplete(_modId){
		var modId=getModuleIdByAttrId(_modId);		
		var pg=getPageNumberByData(modId,0)-1;		
		var cnt=0;
		var len=(pageCount(modId)+pg);		
		var cnt2=0;
		for (var j = pg; j <len; j++) {					
			cnt+=parseInt(progressArray[j]);
			cnt2++;
		}
		var cmp=2*(cnt2);		
		if(cnt==0){
			return 0;
		}else if(cnt==cmp){
			return 2;
		}else{
			return 1;
		}
	}
	/* function:updateProfileLocations 
	 * This function create the profilerLocId array according to navigation XML.
	 
	 */		
	function updateProfileLocations(){
		navigationData.profileLocArray= new Array();
		for (var i = 0; i < moduleCount(); i++) {
			var str=navXml.module[i].profilerLocId;			
			if(str==null || str=="none" || str=="undefined" || str=="" || str.toLowerCase()=='all'){
				//don't add
			}else {
				addProfilerLoc(str);
			}			
		}
		updateProfileQuestions();
	}
	/* function:addProfilerLoc 
	 * This function convert profilerLocId string in to profilerLocId Number andd add in profileLocArray.
	 
	 */		
	function addProfilerLoc(str){
		
		var temp=str.split(',');
		
		for(var i=0;i<temp.length;i++){
			var nm=temp[i].split("R")[1];
			//nm=nm.split("R")[1];			
			navigationData.profileLocArray[parseInt(nm-1)]=1;
		}		
	}
	/* function:updateProfileQuestions 
	 * This function create the profilerQueId array according to navigation XML.
	 
	 */		
	function updateProfileQuestions(){
		navigationData.profileQueArray= new Array();
		for (var i = 0; i < moduleCount(); i++) {
			var str=navXml.module[i].profilerQueId;			
			if(str==null || str=="none" || str=="undefined" || str=="" || str.toLowerCase()=='all'){
				//don't add
			}else {
				addProfilerQue(str);
			}			
		}
		
	}
	
	/* function:addProfilerQue 
	 * This function convert profilerQueId string in to profilerQueId Number andd add in profileQueArray.
	 
	 */		
	function addProfilerQue(str){
		
		var temp=str.split(',');
		
		for(var i=0;i<temp.length;i++){
			var nm=temp[i].split("Y")[0];
			nm=nm.split("N")[0];			
			navigationData.profileQueArray[parseInt(nm-1)]=1;
		}		
	}
	this.isAllSubModuleCompleted = function (){
		var flag =false;
		var totMcnt=0;
		var totCmp=0;
		for (var i= 0; i <globalData.navigationXML.module.length; i++) {				
			if(globalData.navigationXML.module[i].subMod!=null){
				totMcnt++;
				var modId=parseInt(globalData.navigationXML.module[i].id);
				totCmp+= isModuleComplete(modId);
			}
		}			
		if(totCmp==(totMcnt*2)){
			return true;
		}else{
			return false;
		}
	};
	/* function:updateUserNavigation 
	 * This function create the profilerQueId array of userslected module.
	 *  
	 *
	 */
	function updateUserNavigation(_str, _isChange){
		
		//1Y,2N,3N,4Y,5Y,6A			
		for (var i = 1; i < moduleCount(); i++) {
			for (var j = 0; j < playerSetting.alternativeChallenges.length; j++) {
				if(navXml.module[i].showAlternativeChallenge!=null){
					if(playerSetting.alternativeChallenges[j]==navXml.module[i].challenge){
						navXml.module[i].showAlternativeChallenge=true;					
					}
				}
			}
		 
		 }
		 
		 if(navigationData.profileisLocUserChangeSelection ||navigationData.profileisUserChangeSelection || _isChange){		
			navigationData.userProfileArray=navigationData.profileprArray;
			navigationData.userProfileLocVal=navigationData.profilelocval;
			createProgressArray("");
			createBookmarkArray("");
			//navigationData.isPass=false;
			//navigationData.passDate="";
		}
		checkModule(navigationData.profilearray,navigationData.profilelocval);	
		navTextXml=globalData.navigationTextXML;
		navXml=globalData.navigationXML;
		
			

		navigationData.profileEnvironment=_str;		
		totalPages=0;
		if(inCorrectPreAssessmentModIds.length>0){
			var temp = inCorrectPreAssessmentModIds.split(',');
			for (i = 0; i < temp.length; i++) {
				removeModulesIdArray.push(temp[i]);
				//--for mandatory module 
				/*var test=globalData.navigationXML.module[temp[i]].profilerQueId.toLowerCase();
				if(test!="all"){					
					removeModulesIdArray.push(temp[i]);
				}*/	
				//--
			}
		}
		getTotalPages();
		//alert('ss'+navigationData.userProfileLocVal)
		removeAssessmentQue();
		
		checkSubModule(navigationData.profileEnvironment);
		
		navigation.loadNextPage();
	}
	
	function updateUserNavigation1(_array,_isUserChangeSelection,_prArray){
		
		navigationData.profilearray=_array;
		navigationData.profileisUserChangeSelection = _isUserChangeSelection;
		navigationData.profileprArray=_prArray;
		navigation.loadNextPage();
	}
	
	function updateUserNavigation2(_val,_isUserChangeSelection){
		
		navigationData.profilelocval=_val;
		navigationData.profileisLocUserChangeSelection=_isUserChangeSelection;		
		navigation.loadNextPage();
	}
	function removeAssessmentQue(){		
		var found=false;
		
		for (i = 0; i < globalData.assessmentXML.module.length; i++) {
			found=false;
			var mcnt = i;
			var id =globalData.assessmentXML.module[i].id;
			if(id.compareSingleChar(removeModulesIdArray.toString()+'')){
				found = true;
				globalData.assessmentXML.module.splice(mcnt,1);
				break;
			}			
		}
		if(found){
			removeAssessmentQue();
		}
		//console.log("removeAssessmentQue"+globalData.assessmentXML.module.length)
		for (var i= 0; i <globalData.assessmentXML.module.length; i++) {				
			//console.log("modid"+globalData.assessmentXML.module[i].id)
		}
	}
	

	/* function:checkModule 
	 * This is recursive function. 
	 * This function mach the user selected module id with profilerQueId and remove the matchless modules.
	 *  
	 *
	 */
	function checkModule(_array,_val){
		console.log("checkModule: "_array,_val);
		var findStr=_array.toString();
		var findLocStr=_val.toString();
		var found=false;
		var kcRemove=false;
		for (i = 1; i < globalData.navigationXML.module.length; i++) {		
			var mcnt = i;
			var str=globalData.navigationXML.module[mcnt].profilerQueId;
			var strloc=globalData.navigationXML.module[mcnt].profilerLocId;
			
			found=false;
			kcRemove=false;
		
			if (findStr.compareSingleChar(str) || str.toLowerCase() == 'all' || findLocStr.compareSingleChar(strloc) || strloc.toLowerCase() == 'all') {				
				found=true;	
					
			}
			/* if(globalData.navigationXML.module[mcnt].showAlternativeChallenge!=null){
				var str=globalData.navigationXML.module[mcnt].profilerQueIdAlternative;
				if(findStr.compareSingleChar(str)){
					found=false;
				}			
			}
			 */
			if(globalData.navigationXML.module[mcnt].modType == "assessment" && parseInt(navigationData.preAssessmentScore) == 100){
				
				found=false;
				kcRemove=true;
			}
			
			if(!found){
				removeModulesIdArray.push(globalData.navigationXML.module[mcnt].id);
				//---this is for client want to be module optional not to remove
				//removeModuleFromGroup(mcnt);				
				//globalData.navigationXML.module.splice(mcnt,1);			
				//globalData.navigationTextXML.module.splice((mcnt-1),1);
				if(kcRemove){
					
					removeModuleFromGroup(mcnt);
					globalData.navigationXML.module.splice(mcnt,1);			
					globalData.navigationTextXML.module.splice((mcnt-1),1);
				}
				//---navigationTextXML
			}			
		}
		
	
	}
	
	function checkSubModule(_str){
		
		var findStr=_str.toString();
		
		var allSubModArr=new Array();
		var inactiveSubModArr=new Array();
		for (i = 1; i < globalData.navigationXML.module.length; i++) {		
			var mcnt = i;
			var str=globalData.navigationXML.module[mcnt].subProfilerQueId;

			if(str!=null && str!=""){
				_mId=globalData.navigationXML.module[mcnt].id;
				allSubModArr.push(_mId);
				if(str!=findStr){
					_mId=globalData.navigationXML.module[mcnt].id;
					inactiveSubModArr.push(_mId);
				}
			}
		}
		
		
		for (i = 0; i < allSubModArr.length; i++) {
			var removeItem = allSubModArr[i].toString();
			removeModulesIdArray = $.grep(removeModulesIdArray, function(value) {
			  return value != removeItem;
			});			
		}
		for (i = 0; i < inactiveSubModArr.length; i++) {
			var val=inactiveSubModArr[i];
			removeModulesIdArray.push(val)
		}
		
		
	}
	function removeModuleFromGroup(mId){
		var menuGroup=globalData.navigationXML.menuGroup[0];
		var modId=globalData.navigationXML.module[mId].id;
		for(var i=0;i<menuGroup.group.length;i++){
			var grpId=menuGroup.group[i].id;
			var temp=menuGroup.group[i].moduleId.split(',');			
			for (var j= 0; j < temp.length; j++) {
				if(modId==temp[j]){					
					temp.splice((j),1);					
					break;
				}
			}
			menuGroup.group[i].moduleId=temp.toString();
		}
	}
	
	this.getRemoveModulesIdArray = function(){
		console.log("removeModulesIdArray: " + removeModulesIdArray);
		return removeModulesIdArray;
	};
	
	function filterPreAssessmentData(){
		
		if(inCorrectPreAssessmentModIds.length>0){
			var temp = inCorrectPreAssessmentModIds.split(',');
			removeModuleById(temp);
		}		
		navTextXml=globalData.navigationTextXML;
		navXml=globalData.navigationXML;				
		totalPages=0;
		getTotalPages();
		if(!navigationData.isPreAssessmentComplete){
			navigationData.isPreAssessmentComplete = true;
			navigationData.updateNextPageURL();
			navigation.loadCurrentPage();
		}else{
			//navigation.showMenu();
			navigation.showIntroLastPage();
		}	
	}
	function updatePreAssessmentAns(_array){	
		
		inCorrectPreAssessmentModIds = "";
		if(_array.length>0){
			inCorrectPreAssessmentModIds = _array.toString();
		}
		for (i = 0; i < _array.length; i++) {
			removeModulesIdArray.push(_array[i]);
			
			//--for mandatory module 
			/*var temp=globalData.navigationXML.module[_array[i]].profilerQueId.toLowerCase();
			if(temp!="all"){					
				removeModulesIdArray.push(_array[i]);
			}*/	
			//--
		}
		
		removeAssessmentQue();
		filterPreAssessmentData();
	}
	
	function removeModuleById(_array){
		
		var findStr=_array.toString();		
		var found=false;
		var kcRemove=false
		for (i = 1; i < globalData.navigationXML.module.length; i++) {		
			var mcnt = i;
			var str=globalData.navigationXML.module[mcnt].id;
			
			found=false;
			kcRemove=false;

			if (findStr.compareSingleChar(str) ) {				
				found=true;				
			}
			
			if(globalData.navigationXML.module[mcnt].modType == "assessment" && parseInt(navigationData.preAssessmentScore) == 100){
				found=true;	
				kcRemove=true;
			}
			
			if(found){	
				//---this is for client want to be module optional not to remove								
				//globalData.navigationXML.module.splice(mcnt,1);			
				//globalData.navigationTextXML.module.splice((mcnt-1),1);
				
				if(kcRemove){
							
					removeModulesIdArray.push(globalData.navigationXML.module[mcnt].id);			
					removeModuleFromGroup(mcnt);
					globalData.navigationXML.module.splice(mcnt,1);			
					globalData.navigationTextXML.module.splice((mcnt-1),1);
				}
				//---
				
			}			
		}
		
	}
}