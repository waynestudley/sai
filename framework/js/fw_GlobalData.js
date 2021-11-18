/*----------------------------------------
	Name: fw_GlobalData.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_GlobalData(){
	/**Variables*/
	this.playerSettingXML;
	this.navigationXML;
	this.navigationTextXML;	
	this.assessmentXML;
	this.glossaryXML;
	this.certificateXML;
	
	this.getInitalTime=getInitalTime;
	this.loadUserProfileData=loadUserProfileData;
	loadPlayerSetting();
	var initalTime;
	/** Functions */
	function getInitalTime(){
		return initalTime;
	}
	function loadPlayerSetting(){
		initalTime = new Date();
		$.ajax({		
			type: "GET",
			url: 'framework/xml/playersetting.xml',
			dataType: "xml",
			success: function(xml){				
				globalData.playerSettingXML = $.xmlToJSON(xml);				
				loadNavigationXML()
			},
			error: function(err){
			var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
				if(is_chrome){
					$('.CB').css('display','block');
					$('.preLoaderParent').css('display','none');}
				else{
					if(!isAlertShow){
						alert("playersetting.xml Not found");
					}
				}
			}
		});
		
	}
	function loadNavigationXML(){
		 $.ajax({		
			type: "GET",
			url: 'content/xml/navigation.xml',
			dataType: "xml",
			success: function(xml){
				globalData.navigationXML = $.xmlToJSON(xml);
				loadNavigationTextInitXML();
				//$(globalData).trigger(courseEvent.GLOBALDATA_LOAD_COMPLETE);
			},
			error: function(err){	
				if(!isAlertShow){
					alert("navigation.xml Not found");
				}
			}
		});
	}
	
	function loadUserProfileData(){
		loadNavigationTextXML();			
	}
	function loadNavigationTextInitXML(){
		 $.ajax({		
			type: "GET",
			url: 'content/'+globalPath.userLanguage+'/menu.xml',
			dataType: "xml",
			success: function(xml){
				globalData.navigationTextXML = $.xmlToJSON(xml);
				$(globalData).trigger(courseEvent.GLOBALDATA_LOAD_COMPLETE);
			},
			error: function(err){
				if(!isAlertShow){
					alert("menu.xml Not found");
				}
			}
		});
	}
	function loadNavigationTextXML(){
		 $.ajax({		
			type: "GET",
			url: 'content/'+globalPath.userLanguage+'/menu.xml',
			dataType: "xml",
			success: function(xml){
				globalData.navigationTextXML = $.xmlToJSON(xml);
				certificateXML();
			},
			error: function(err){
				if(!isAlertShow){
					alert("menu.xml Not found");
				}
			}
		});
	}
	function certificateXML(){	 
		$.ajax({
			type: "GET",
			url: 'content/'+globalPath.userLanguage+'/certificate.xml',
			dataType: "xml",
			success: function(xml){
			   globalData.certificateXML = $.xmlToJSON(xml);			   
			   loadAssessmentXML();  
			},
			error: function(err){
				if(!isAlertShow){
					alert("certificate.xml Not found");
				}
			}
		});
		
	}
	/* 	
	function loadGlossaryXML(){	 
		$.ajax({
			type: "GET",
			url: 'content/'+globalPath.userLanguage+'/glossary.xml',
			dataType: "xml",
			success: function(xml){
			   globalData.glossaryXML = $.xmlToJSON(xml);			   
			   loadAssessmentXML();   
			},
			error: function(err){	
				if(!isAlertShow){
					alert("glossary.xml Not found");
				}
			}
		});
	} */
	
	function loadAssessmentXML(){	 
		$.ajax({
			type: "GET",
			url: 'content/'+globalPath.userLanguage+'/assessment.xml',
			dataType: "xml",
			success: function(xml){
			   globalData.assessmentXML = $.xmlToJSON(xml);
			   $(globalData).trigger(courseEvent.USERDATA_LOAD_COMPLETE);
			},
			error: function(err){
				if(!isAlertShow){
					alert("assessment.xml Not found");
				}
			}
		});		
	} 
		
}