/*----------------------------------------
	Name: fw_Base.js
	Developed by: Suyog Shaha
----------------------------------------*/
/* global variable*/
var preLoade;
var globalPath;
var menuData;
var globalSettings;
var playerSetting;
var navigation;
var globalData;
var navigationData;
var progressArray;
var pageContainer;
var navigationEvent;
var mediaPlayer;
var pageTitle;
var pageInstruction;
var pageCounter;
var courseEvent;
var buttonClass;
var templateMediator;
var dataStore;
var timeIntvl=null;
var islogPop=false;
var communicationWin=null;
var infoText="";
var bounceCount=5;
var bounceInterval=0;
var oLeft=0;
var auPlayer;
var mediaEvent= new mediaEvent();
var currentPageXML=null;
var COURSE_ID="";
var isAudioBase=false;
//--
var finished=false;
var isAlertShow=false;
var isLangPage=false;
var isStandalone=false;

var lmsAliveTimeout;
//--lms timeout is 40 minutes we take 38 minutes so 38*60000= 2280000 ms
var lmsTimeoutInMilliSec=2280000;
//--

var beforeUnload_Fired = false;
var course_closed = false; 

$(document).ready(function(){
	
	if (typeof console === "undefined") {
		console = {
			log: function (val) {				
				return;
			} 
	   };
	}	
	preLoade= new fw_PreLoader();
	auPlayer=$.audioPlayer.create();
	menuData= new fw_MenuData();
	globalPath= new fw_GlobalPath();
	courseEvent= new fw_Event();
	globalSettings = new fw_GlobalSettings();	
	globalData = new fw_GlobalData();
	if(globalSettings.isDesktop()){
		$('body').disableSelection();
	}
	var preloadImg=new Array("content/images/ltr/menuBg.png","content/images/ltr/languageSelectionBg.jpg","content/images/ltr/Location_Selection.jpg","content/images/ltr/audioSelection.jpg","content/images/ltr/profileSelection.jpg","content/images/ltr/welcomeScreen.jpg","framework/images/ltr/nextBlink.png");
	$.imgpreload(preloadImg,{each: function(){},all: function(){try{}catch(err){}}});
	$(globalData).bind(courseEvent.GLOBALDATA_LOAD_COMPLETE, function(e){onGlobalDataLoadComplete();});
	$(globalData).bind(courseEvent.USERDATA_LOAD_COMPLETE, function(e){onUserDataLoadComplete();});	
});

function onGlobalDataLoadComplete(){
	$.fw_CloseCourse({text:""});		
	playerSetting= new fw_PlayerSettings();	
	playerSetting.init();	
	navigationData= new fw_NavigationData();
	navigationData.updateProfileLocations();	
	pageInstruction= new fw_PageInstruction();	
    templateMediator = new fw_TemplateMediator();
	globalSettings.updateLayOut();
	dataStore = new fw_DataCommunication();
	dataStore.init();
	
}

function mediaEvent(){

}
function openlink(obj,url){

	window.open(obj.href,obj.target,'width=400,height=400,resizable=yes,scrollbars=yes');
          
}

function updatePlayer(){
   preLoade.hidePreLoader();	
   buttonClass = new fw_ButtonClass();
   pageContainer = new fw_PageContainer();  
   pageTitle= new fw_PageTitle();
   pageCounter= new fw_PageCounter();
   navigation= new Navigation();
   mediaPlayer= new fw_MediaPlayer();
   navigationEvent = new fw_NavigatioEvent();   
   navigation.loadCurrentPage();
 }
 
 function onUserDataLoadComplete(){	
	//navigationData.loadGlossary();
	navigationData.loadTranscript();	
	navigation.loadNextPage();
}

function loadCommunicationWin(){
	islogPop=true;
	var winwidth = 800;
	var winheight = 300;               
	var xOffset =10;//  screen.width/2 - winwidth/2;
	var yOffset =10;// screen.height/2 - winheight/2;       								
	communicationWin = window.open('communication_log.html', 'logWin', 'width=' + winwidth + ',height=' + winheight + ',scrollbars=0,screenX=0,screenY=0,resizable=yes,status=no,top=' + yOffset + ',left=' + xOffset + '');
	communicationWin.onbeforeunload  = function(){ 
	    islogPop=false;
		communicationWin=null;		
	};
	return false;
}

function loadCertificateWin(){	
	var winwidth = 602;
	var winheight = 557;               
	var xOffset =10;//  screen.width/2 - winwidth/2;
	var yOffset =10;// screen.height/2 - winheight/2;       								
	if(globalPath.languageDir == 'ltr'){
	var crWin = window.open('certificate.html', 'cerWin', 'width=' + winwidth + ',height=' + winheight + ',scrollbars=0,screenX=0,screenY=0,resizable=yes,status=no,top=' + yOffset + ',left=' + xOffset + '');
	} else{
	var crWin = window.open('certificate_rtl.html', 'cerWin', 'width=' + winwidth + ',height=' + winheight + ',scrollbars=0,screenX=0,screenY=0,resizable=yes,status=no,top=' + yOffset + ',left=' + xOffset + '');}
	return false;
}
function getStudentName(){	
	return navigationData.student_name;
}
function getPassDate(){	
	return globalSettings.showFormatedDate(navigationData.passDate);
}
 function setTrackData(mtd,pmt,pmtVal,resultText,result){
 	//_data
	if(infoText==""){
		infoText="<p><span class='valLable' >Revision Number:</span>"+playerSetting.revisionNumber+"</p><p class='botBorder'></p>";		
	}
	var d= new Date();
	var str="<p><span class='valLable' >Time:</span>"+d+"</p>";
	str+="<p><span class='valLable' >Function: </span>"+mtd+"</p>";
	
	if(pmt!=null && pmt!=""){
		str+="<p><span class='valLable' >Parameter: </span>"+pmt+"</p>";
	}
	if(pmtVal!=null && pmtVal!=""){
		str+="<p><span class='valLable' >Parameter Value: </span>"+pmtVal+"</p>";
	}
	str+="<p><span class='valLable' >Return: </span>"+resultText+"</p>";
	if(result){
		str+="<p><span class='valLable' >Result: </span><span class='passResult' >Success</span></p>";
	}else{
		str+="<p><span class='valLable' >Result: </span><span class='failResult' >Fail</span></p>";
	}
	str+="<p class='botBorder'></p>";	
	infoText+=str;
	if (communicationWin != null && islogPop) {
		communicationWin.addText(infoText);
	}
 }

 
 function bouncePage(_obj,dir){
 	bounceCount=5;
	try {
		clearInterval(bounceInterval);
	}catch(err){}
	if(dir=='left'){
			bounceCount=6;
	}
	oLeft=getNumber($(_obj).css('left'));	
 	bounceInterval=setInterval(function(){
		bounceCount-=1;
		if(bounceCount==0){
			clearInterval(bounceInterval);
		}else{
			var ll=(oLeft+bounceCount);			
			var tt=ll%2==0?-ll:ll;			
			$(_obj).animate({'left':tt+"px"},60);
		}
	},100);
 }
 function closeCourse(){
	
 }
  function closeInfoWin(){
	 islogPop=false;
	communicationWin=null;
 }
//--edit for sumtotal lms
window.onbeforeunload  = function(){ 
	if(playerSetting.isScorm() || (playerSetting.coursetype==playerSetting.AICC)){
		beforeUnload_Fired = true;
		dataStore.closeCourse();			
	}
}
//--
window.onunload = function(){
	if(playerSetting.isScorm() || (playerSetting.coursetype==playerSetting.AICC)){
		if (!beforeUnload_Fired) {
			dataStore.closeCourse();
		}
		if (globalSettings.isIpad) {
			var temp=false;
			var str=navigationData.getNetFailAlertMsg();			
			if(!temp && !isAlertShow){				
				alert(str.text[0].Text);
				temp=true;
				window.top.close();
				
			}
		}
	}
	if(window.opener!=null){
		window.opener.top.close();
	}
 }
function fw_PageInstruction(){
	/**Variables*/
	this.updateText=updateText;	
	this.showInstruction=showInstruction;
	this.hideInstruction=hideInstruction;
	
	/** Functions */
	function updateText(_text){		
		$('.pageInstruction .instructionText').html(_text);
		$('.pageInstruction').show();		
	}
	function showInstruction(){		
		$('.pageInstruction').show();
	}
	function hideInstruction(){		
		$('.pageInstruction').hide();
	}
}

function fw_getLanDirection(_lan){
    var lan = _lan;
    var rtlLan = globalPath.rtlLanguages;
    var ltrLan = globalPath.ltrLanguages;
    
    var rtl = $.inArray(lan, rtlLan);
    var ltr = $.inArray(lan, ltrLan);
    if(rtl > -1) return 'rtl';
    if(ltr > -1) return 'ltr'; //ltr and rtl
	//--default direction
    return 'ltr';
}

function fw_LanguageSelection(_xml){  
	isLangPage=true;
	//navigationEvent.initToolTip();
	$.fw_CloseCourse('updateText');
    var pageXml=_xml;
	this.updatePageLayOut=updatePageLayOut;	
	$('.LS-instruction p').html(pageXml.contentText[0].text[0].Text);	
    $('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	
	/**************/
		var className= pageXml.contentBackground[0].img[0].className || '';
		var imgStyle= pageXml.contentBackground[0].img[0].style || '';
		$('.panelBg').addClass(className);
		$('.panelBg').attr('style',imgStyle);
	/**************/
	
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			//$('.panelBg').attr('src',iPadImgPath);			
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("src", pageXml.contentBackground[0].img[0].path);
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("src", pageXml.contentBackground[0].img[0].path);
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/
	
		
	var defSelect="";
	if (navigationData.isUserSelectoption>0) {
	 	 defSelect=globalPath.userLanguage;				 
		 globalPath.languageDir = fw_getLanDirection(globalPath.userLanguage);
		 $('.languageSelection .continue').removeClass('disabled');
	}
	var tempArray= new Array();
	for(var i=0;i<pageXml.dropDownMenu[0].option.length;i++){		
		var lng=pageXml.dropDownMenu[0].option[i].Text;
		var fPath=pageXml.dropDownMenu[0].option[i].folderPath;			
		var obj={val:fPath,data:lng};
		tempArray.push(obj);
	}
	$('.continue').attr('tabindex',(4+pageXml.dropDownMenu[0].option.length));	
	$('.LSCombBg').fw_DropDown({dataArray:tempArray,defaultSelect:defSelect,tabIndex:4,callback:function(selectedLanguge){
		if(selectedLanguge!="" && selectedLanguge!=null && selectedLanguge.toLowerCase()!="none"){
			$('.languageSelection .continue').removeClass('disabled');
			 globalPath.userLanguage=selectedLanguge;
			 globalPath.languageDir = fw_getLanDirection(globalPath.userLanguage);
			 
		}else{
			$('.languageSelection .continue').addClass('disabled');
		}	
	}});
	
	$('.languageSelection .continue').on('click',function(){
		isLangPage=false;
				
				if(globalPath.languageDir != ''){
                    $('html').attr("dir", globalPath.languageDir);
                    if(globalPath.languageDir == 'rtl'){
                       var obj=document.getElementsByTagName('link'); 
                       obj[1].href="framework/css/rtl/fw_Base.css";
                       obj[2].href="framework/css/rtl/jquery.fw_ToolTip.css";
                       obj[3].href="framework/css/rtl/jquery.fw_Transcript.css";
                       obj[4].href="framework/css/rtl/jquery.fw_Glossary.css";
                       obj[5].href="framework/css/rtl/jquery.fw_Menu.css";
                       obj[6].href="framework/css/rtl/jquery.fw_BookMark.css";
                       obj[7].href="framework/template/css/rtl/template.css";
					   obj[8].href="framework/css/rtl/jquery.fw_CloseCourse.css";
                       if(!globalSettings.isIpad){
                       obj[9].href="framework/css/rtl/hoverCss.css";
                       }
                    }
                }
		   //Code Begin  
			 var myBodyTag = document.getElementsByTagName("body")[0];
			  switch(globalPath.userLanguage)
			   {
			     case "chs": 
			     myBodyTag.style.fontFamily = "Arial, Helvetica, Simsun, sans-serif";
			     break;
			     
			     case "cht":
			     myBodyTag.style.fontFamily = "Arial, Helvetica, PMingLiU, sans-serif";
			     break;
			     
			     case "ko":
			     myBodyTag.style.fontFamily = "Arial, Helvetica, Gulim, sans-serif";
			     break;
				 
				 case "ara":
			     myBodyTag.style.fontFamily = "Arial, Helvetica, sans-serif";
			     break;
				 
				 case "heb":
			     myBodyTag.style.fontFamily = "Arial, Helvetica, sans-serif";
			     break;

			     default: 
			      myBodyTag.style.fontFamily = "SEGOEUIRegular, sans-serif";
			   } 
		    $('body').addClass(globalPath.userLanguage); //add target class
		    $('body').addClass(globalPath.languageDir); //add target class
	   //Code End 
		if($(this).hasClass('disabled'))return false;
		mediaPlayer.loadAudio("content/eng/audio/blank.mp3");
		$(this).addClass('disabled');
		if (navigationData.isUserSelectoption<=0) {
			navigationData.isUserSelectoption=1;
		}
		globalData.loadUserProfileData();
	});
		
	 try{
         templateMediator.templateLoadComplete();
				
     }catch(err){}	
	$('.languageSelection .continue').focus(function() {	
		if($(this).hasClass('disabled')){
			$("div[tabindex=1]").focus();
			return false;
		}				
	});
	
	$("div[tabindex=1]").focus();	
	
	$('.languageSelection .continue').focusout(function() {
		$("div[tabindex=1]").focus();		
	});
	
	 function updatePageLayOut(){
	 	
		
	 }
}

function fw_WelcomeScreen(_xml){   
	isLangPage=false;
	$.fw_CloseCourse('updateText');
	navigationEvent.initToolTip();
    var pageXml=_xml;
	this.updatePageLayOut=updatePageLayOut;	
	
	var wTxt = pageXml.contentText[0].text[0].Text;
	var tempStr = wTxt.replace("###", navigationData.student_name);
	
	$('.welComText p').html(tempStr);	
	$('.courseName p').html(pageXml.contentText[0].text[1].Text);	
		
    $('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	/**************/
		var className= pageXml.contentBackground[0].img[0].className || '';
		var imgStyle= pageXml.contentBackground[0].img[0].style || '';
		$('.panelBg').addClass(className);
		$('.panelBg').attr('style',imgStyle);
	/**************/
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');	
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/
	$('.welcomeScreen .continue').on('click',function(){
		if($(this).hasClass('disabled'))return false;
		$(this).addClass('disabled');
		navigation.loadNextPage();
		/* if (globalPath.userLanguage != 'eng')
		{
			navigationData.isUserSelectoption=2;
			navigation.loadNextPage();
			navigationEvent.addTranscriptOnClass();
			navigation.audioOFF();
			$('#btn_AudioOnOff').next('.navSeprator').remove();
			$('#btn_AudioOnOff').remove();

		} */
	});
		
	 try{
         templateMediator.templateLoadComplete();
				
     }catch(err){}	
	
	$("Div[tabindex=1]").focus();	
	$('.welcomeScreen .continue').focusout(function() {
		$("div[tabindex=1]").focus();		
	});
	
	function updatePageLayOut(){
	}
}

function fw_AudioSelection(_xml){

   	var pageXml=_xml;
	var optionButton=".audioSelection .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionSelect=0;
	this.updatePageLayOut=updatePageLayOut;
	$('.courseName').html(pageXml.contentText[0].text[0].Text);	
	$('.AS-instruction').html(pageXml.contentText[0].text[1].Text);	
    $('.btntext').html(pageXml.buttonText[0].text[0].Text);
	/**************/
		var className= pageXml.contentBackground[0].img[0].className || '';
		var imgStyle= pageXml.contentBackground[0].img[0].style || '';
		$('.panelBg').addClass(className);
		$('.panelBg').attr('style',imgStyle);
	/**************/
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/
	var tempArray= new Array();
	for(var i=0;i<pageXml.dropDownMenu[0].option.length;i++){		
		var txt=pageXml.dropDownMenu[0].option[i].Text;
		var val=pageXml.dropDownMenu[0].option[i].id;		
		var obj={val:val,data:txt};
		tempArray.push(obj);
	}
	var defSelect="";
	if (navigationData.isUserSelectoption>1) {
		if(playerSetting.isAudio){
			defSelect='A1';
		}else{
			defSelect='A2';
		}
		$('.audioSelection .continue').removeClass('disabled');
	}
	$('.ASCombBg').fw_DropDown({dataArray:tempArray,defaultSelect:defSelect,tabIndex:5,callback:function(audioSel){
		if(audioSel=="A1" ||audioSel=="A2"){
			playerSetting.isAudio=audioSel=='A1'?true:false;
			$('.audioSelection .continue').removeClass('disabled');
		}else{
			$('.audioSelection .continue').addClass('disabled');
		}
	}});
	
	$('.audioSelection .continue').on('click',function(){
		if($(this).hasClass('disabled'))return false;
		$(this).addClass('disabled');
		
		navigationData.isUserSelectoption=2; 
		navigation.loadNextPage();
	});	
	$('.audioSelection .continue').focusout(function() {
		$("div[tabindex=1]").focus();	
	});
		
	try{
	 templateMediator.templateLoadComplete();
	}catch(err){}
	
	$('.audioSelection .continue').focus(function() {	
		if($(this).hasClass('disabled')){
			$("div[tabindex=1]").focus();
			return false;
		}				
	});
	//$("a[tabindex=1]").focus();	
	function updatePageLayOut(){
		
	
	}	
}

function getNumber(_px) {
	if(_px==null)return 0;
    var px = parseInt(_px.split('px')[0]);
    return px;
}

function isNull(_val) {
	if(_val=="" || _val==null){
		return true;
	}else{
		return false;
	}    
}

function getVal(val1){		
	if(isNull(val1)){
		val1=0+"px";
	}
	return val1;
}
	
function setPosition(ob,pos1){	
        var lf; 
        var rt;
        if(globalPath.languageDir == "ltr"){
            lf =getVal(pos1.left);
        }else{
            rt =getVal(pos1.right);
        }	
	if(globalPath.languageDir == "ltr"){
		if(pos1.left!=null){
			$(ob).css('left',lf);
		}}else{
		if(pos1.right!=null){
			$(ob).css('right',rt);
		}}
	var tp =getVal(pos1.top);
	if(pos1.top!=null){
		$(ob).css('top',tp);
	}else{
		var bt =getVal(pos1.bottom);
		if(pos1.bottom!=null){
			$(ob).css('bottom',bt);
		}
	}
	var wd =getVal(pos1.width);
	if(pos1.width!=null){
		$(ob).css('width',wd);
	}
	var ht =getVal(pos1.height);
	if(pos1.height!=null){
		$(ob).css('height',ht);
	}
	var lp =getVal(pos1.letter_spacing);
	if(pos1.letter_spacing!=null){
		$(ob).css('letter-spacing',lp);
	}
	return true;
}
//------ for network connection loss

function myCallBack(result)
{
	 if(result == false){ 
		 showAlertPop(0);
	}
}
function testConnection(callBack)
{
    document.getElementById('netConn').innerHTML +=
        '<img id="testImage" style="display: none;" ' +
        'src="framework/images/ltr/netConnCheck.png?' + Math.random() + '" ' +
        'onerror="testConnectionCallback(false);" ' +
        'onload="testConnectionCallback(true);">';

    testConnectionCallback = function(result){
        callBack(result);
		//alert("called")
        var element = document.getElementById('testImage');
		if(element!=null){
        element.parentNode.removeChild(element);
		}
    };
}
//-- here parameter _id = 0 for network error msg ant _id=1 for API error msg
function showAlertPop(_id){
	if(isStandalone){return false;}
	if(isAlertShow==false){
		isAlertShow=true;
		var str=navigationData.getNetFailAlertMsg();
		
		$('.SemiBlack').show();
		$('.SemiBlack').css('display','block');
		
		$('.alert_msg').html(str.text[_id].Text);
		$('.alert_yes_btn').html(str.text[2].Text);
		$('.alert_container').show();
		$('.alert_yes_btn').on('click', function(){		
			window.top.close();	
			if(window.opener!=null){
				 window.opener.close();
			}				
			$('.alert_container').hide();
		});		
	}
}
 function isHttpLocation(){
	var isHttp = false;	
	isHttp = String(window.location).indexOf("http") >= 0 || String(window.location).indexOf("https") >= 0;
	return isHttp;
}
function createRandomizeArr(_maxNum, _minNum) {		
		if(_minNum===undefined){
			_minNum=0;
		}
		var isPresent;
		var random_array = new Array();		
		random_number = Math.floor(Math.random() * (_maxNum - _minNum)) + _minNum;
		
		var arrLen=_maxNum-_minNum;
		random_array.push(random_number);
		while (random_array.length < arrLen) {
			random_number = Math.floor(Math.random() * (_maxNum - _minNum)) + _minNum;
			for (var i=0; i<random_array.length; i++) {
				isPresent = false;
				if (random_array[i] == random_number) {
					isPresent = true;
					break;
				}
			}
			if (isPresent == false) {
				random_array.push(random_number);
			}
		}		
		return (random_array);		
	}
function checkLMSAlive(){	
	if(playerSetting.isScorm() && isHttpLocation()){
		clearTimeout(lmsAliveTimeout);
		lmsAliveTimeout= setTimeout(function(){ 
		showAlertPop(0);
		}, lmsTimeoutInMilliSec);	
	}
}



String.prototype.compareSingleChar = function(testArrStr) {    
    var array1=testArrStr.split(',');
	var array2 = this.split(',');
	var found = false;
	for (var i = 0; i < array1.length; i++) {		
		for (var j = 0; j < array2.length; j++) {			
			if (array1[i] == array2[j]) {
				found = true;
				break;
			}
		}
		if(found){break;}
	}
    return found;
};

//--this function use for shuffle quiz options
jQuery.fn.shuffle = function () {
	var parent = $(this);
    var divs = parent.children();
    while (divs.length) {		
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
};
//--
function insertDelay(amount)
{
	vDate = new Date() 
	while (1)
	{
		vMill=new Date() 
		vDiff = vMill-vDate;
		if( vDiff > amount ) 
			break;
	}
}
//--------	
