/*----------------------------------------
	Name: fw_PlayerSettings.js
	Developed by: Suyog Shaha
	Copyright:
----------------------------------------*/
function fw_PlayerSettings(){
	var settingXml=globalData.playerSettingXML;	
	//this.isScrom=settingXml.config[0].scrom[0].Text=="true"?true:false;

    var cTp=parseInt(settingXml.config[0].coursetype[0].Text);
    this.coursetype= cTp;
    try{ pipwerks.SCORM.version= cTp==2?"1.2":"2004"}catch(err){}
	this.revisionNumber=settingXml.config[0].revisionNumber[0].Text;
	//--- this var use for OCCAM LMS to not send cmi.interaction 
		
	if(settingXml.config[0].isOCCAMVer==null){
		this.isOCCAMVer=false;
	}else{
		this.isOCCAMVer=settingXml.config[0].isOCCAMVer[0].Text=="true"?true:false;
	}
	
	//---
	this.isBookmark=settingXml.config[0].bookmark[0].Text=="true"?true:false;
    this.assessmentRandomize=settingXml.config[0].assessmentRandomize[0].Text=="true"?true:false;	
    this.preAssessmentRandomize=settingXml.config[0].preAssessmentRandomize[0].Text=="true"?true:false;	
	this.preAssessmentPassingscore=parseInt(settingXml.config[0].preAssessmentPassingscore[0].Text);	
	this.passingScore=parseInt(settingXml.config[0].passingscore[0].Text);
	//this.isTranscript=settingXml.config[0].transcript[0].Text=="true"?true:false;
	this.isAssessmentFeedBack=settingXml.config[0].showAssessmentFeedBack[0].Text=="true"?true:false;
	this.isPreAssessmentFeedBack=settingXml.config[0].showPreAssessmentFeedBack[0].Text=="true"?true:false;
	
	this.isGlossary=settingXml.config[0].glossary[0].Text=="true"?true:false;
	this.disablerightclick=settingXml.config[0].disablerightclick[0].Text=="true"?true:false;
    this.linearNavigation=settingXml.config[0].linearnavigation[0].Text=="true"?true:false;	
    this.addJumpingInSubModule=settingXml.config[0].addJumpingInSubModule[0].Text=="true"?true:false;	
	this.playerLeft=playerLeft;
	this.playerRight=playerRight;
	this.playerBottom=playerBottom;
	this.playerTop=playerTop;
	this.containerBottom=containerBottom;
	this.containerTop=containerTop;
	this.init=init;	
	this.isScorm = isScorm;
	this.isCookies = isCookies;
	this.isAudio=true;
	/**
	CourseType: 
		1: StandAlone 
		2: SCORM 1.2	
		3: SCORM 2004	
		4: AICC	
		5: TIN_CAN
		6: COOKIES
	*/
	this.AICC = 4;
	this.SCORM_12 = 2;
	this.SCORM_2004 = 3;
	this.TIN_CAN = 5;
	this.STANDALONE = 1;
	this.COOKIES = 6;
	this.alternativeChallenges= new Array();
	
	/** Functions */
	function init(){
		if(playerSetting.disablerightclick){
			$(document).bind("contextmenu",function(e){
			  e.preventDefault()
			});
		}
		for(var i=0; i<settingXml.config[0].root[0].option.length;i++){
			playerSetting.alternativeChallenges.push(settingXml.config[0].root[0].option[i].challenge);
		
		}	
	}
	function playerLeft(){
		return 0;
	}
	function playerRight(){		
		return $(".footer").width();
	}
	function containerBottom(){		
		return $('.footer').height();
	}
	function containerTop(){		
		return $('.header').height();
	}
	function playerBottom(){
		
	}
	function playerTop(){		
		return 0;
	}	
	function isScorm(){
		return (playerSetting.coursetype == playerSetting.SCORM_12 || playerSetting.coursetype == playerSetting.SCORM_2004);
	}
	function isCookies(){
		return (playerSetting.coursetype == playerSetting.COOKIES);
	}
}