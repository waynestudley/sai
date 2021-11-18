/*----------------------------------------
	Name: fw_KnowledgeCheckIntro.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_PreAssessmentIntro(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var removeModulesId= navigationData.getRemoveModulesIdArray();
	var isRandomize = playerSetting.preAssessmentRandomize;
	var assXML = globalData.assessmentXML;	
	var totalmodule=assXML.module.length;
	var totalQuestion=0;
	this.updatePageLayOut=updatePageLayOut;
	var count = 0;
	var preloadImagesArray=new Array();
		
	startIntroPreAssessment();
	/************************/
	if(pageXml.pageTitle!=null){
		var pageTitleStyle= pageXml.pageTitle[0].style||''; 
		$('.pageTitle').attr('style',pageTitleStyle)
	}
	/* if(pageXml.instructionText[0].style!=null){
		var instStyle= pageXml.instructionText[0].style||''; 
		$('.pageInstruction').attr('style',instStyle)
	} */
	if(pageXml.transcript[0].style!=null){
		$('.fw_TranscriptContainer').attr('style',pageXml.transcript[0].style)
	}
	if(pageXml.contentBg[0].style!=null){
		$('.content-bg').attr('style',pageXml.contentBg[0].style)
	}	
	/************************/
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			
			preloadImagesArray.push(iPadImgPath);		
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/	
	
	function startIntroPreAssessment(){
		filterXML();
		totalmodule=assXML.module.length;			
		createQuestionList();
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
	function createQuestionList(){		
		if(isRandomize){
			var count=0;
			for(var i=0;i<totalmodule;i++){
				var sL=assXML.module[i].question.length;
				var pul=parseInt(assXML.module[i].pick);
				for(var j=0;j<pul;j++){
					count++;
				}
				
			}
			totalQuestion=count;
		}else{
			var count=0;
			for(var i=0;i<totalmodule;i++){
				var sL=assXML.module[i].question.length;
				for(var j=0;j<sL;j++){
					count++;
				}
			}
			totalQuestion=count;
		}		
		
	}
	var txtStr=pageXml.contentText[0].text[0].Text;
	var tempStr = txtStr.replace("###", navigationData.student_name);
	
	$('.KC_Info').html(tempStr);
	setStyle(".KC_Info",pageXml.contentText[0].text[0]);
	$('.KC_Info2').html(pageXml.contentText[0].text[1].Text);
	setStyle(".KC_Info2",pageXml.contentText[0].text[1]);
	$('.KC_Info3').html(pageXml.contentText[0].text[2].Text);
	setStyle(".KC_Info3",pageXml.contentText[0].text[2]);
	if (globalPath.userLanguage=="chs" || globalPath.userLanguage=="cht"){
	$('.KC_totQue').html(pageXml.contentText[0].text[3].Text+""+totalQuestion);	}
	else if (globalPath.userLanguage=="he"){
	$('.KC_totQue').html(pageXml.contentText[0].text[3].Text+" "+totalQuestion);	} 
	else {
	$('.KC_totQue').html(pageXml.contentText[0].text[3].Text+" "+totalQuestion);
	}
	setStyle(".KC_totQue",pageXml.contentText[0].text[3]);
	
//	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);	 
	updatePageLayOut();	
   
    
	$.imgpreload(preloadImagesArray,
		{
			each: function()
			{	
			},
			all: function()
			{
				try{
					 templateMediator.templateLoadComplete();
					 pageTitle.updateTitleByText(pageXml.contentTitle[0].text[0].Text);
					 $("div[tabindex=1]").focus();
		 			 templateMediator.pageVisited();
					navigationEvent.updateGlobleFocus();
				}catch(err){}
			}
	});
	function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var bgColor =(_xml.bgColor==null?'#333740':_xml.bgColor);
		var padding =(_xml.padding==null?'':_xml.padding);
		var fts =(_xml.fontSize==null?'16px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
		var txtB=(_xml.textAlign==null?'right':_xml.textAlign);
		var wd  =(_xml.width==null?'auto':_xml.width);
		var ht  =(_xml.height==null?'auto':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var rit =(_xml.right==null?'':_xml.right);
		var tp  =(_xml.top==null?'':_xml.top);
	    var pos =(_xml.position==null?'absolute':_xml.position);
	    var fontFamily =(_xml.fontFamily==null?'':_xml.fontFamily);
		if(globalPath.languageDir == 'ltr'){
		$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos,'font-family':fontFamily});
		} else{
		$(obj).css({right:rit,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos,'font-family':fontFamily});
			}
	}
	function updatePageLayOut(){
		
	}
}
