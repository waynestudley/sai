/*----------------------------------------
	Name: fw_KnowledgeCheckIntro.js
	Developed by: Suyog Shaha
	Updated by: Sunil Patil
	Purposed : Removed to Print Certificate Button(commented)
	Dated By: 23/01/15
----------------------------------------*/
function fw_KnowledgeCheckIntro(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var isRandomize = playerSetting.assessmentRandomize;
	var assXML = globalData.assessmentXML;	
	var totalmodule=assXML.module.length;
	var totalQuestion=0;
	this.updatePageLayOut=updatePageLayOut;
	var count = 0;
	 var preloadImagesArray=new Array();
	var isPass=navigationData.userScore>=playerSetting.passingScore?true:false;
	if(isRandomize){		
		for (var i = 0; i < totalmodule; i++){			
			count+=parseInt(assXML.module[i].pick);
		}
		totalQuestion=count;		
	}else{			
		for (var i = 0; i < totalmodule; i++){
			count+=assXML.module[i].question.length;
		}
		totalQuestion=count;
	}
	
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
	
	
	//$('.panelText p').html(pageXml.contentText[0].text[0].Text);	
	//$('.KC_Bg').attr('src',pageXml.contentBackground[0].img[0].path);

	//$('.KC_Img').attr('alt',pageXml.contentImage[0].img[0].Text);
	$('.KC_Info3').html(pageXml.contentText[0].text[3].Text);
	setStyle(".KC_Info3",pageXml.contentText[0].text[3]);
	$('.KC_Info').html(pageXml.contentText[0].text[0].Text);
	if (globalPath.userLanguage=="de" || globalPath.userLanguage=="fr" || globalPath.userLanguage=="ru" || globalPath.userLanguage=="es"|| globalPath.userLanguage=="cz"){
	$('.KC_totQue').html(pageXml.contentText[0].text[1].Text+" "+totalQuestion);
	$('.KC_passingPer').html(pageXml.contentText[0].text[2].Text+" "+playerSetting.passingScore+" %");}
	else if (globalPath.userLanguage=="chs" || globalPath.userLanguage=="cht"){
	$('.KC_totQue').html(pageXml.contentText[0].text[1].Text+totalQuestion);
	$('.KC_passingPer').html(pageXml.contentText[0].text[2].Text+playerSetting.passingScore+"%");	}
	else if (globalPath.userLanguage=="tr"){
	$('.KC_totQue').html(pageXml.contentText[0].text[1].Text+" "+totalQuestion);
	$('.KC_passingPer').html(pageXml.contentText[0].text[2].Text+" %"+playerSetting.passingScore); }
	else if (globalPath.userLanguage=="ur"){
	$('.KC_totQue').html(pageXml.contentText[0].text[1].Text+" "+totalQuestion);
	$('.KC_passingPer').html(pageXml.contentText[0].text[2].Text+" "+playerSetting.passingScore+"٪");}
	else {
	$('.KC_totQue').html(pageXml.contentText[0].text[1].Text+" "+totalQuestion);
	$('.KC_passingPer').html(pageXml.contentText[0].text[2].Text+" "+playerSetting.passingScore+"%");}
	if(navigationData.isPass){		
		//var pritBtnName=pageXml.buttonText[0].text[0].Text;
		//$('.KC_Text').append('<a class="a-button printbtn" href="javascript:void(0);"><span class="btntext">'+pritBtnName+'</span></a>')
	}
	//pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);	 
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
					  $("div[tabindex=1]").focus();
		 			 templateMediator.pageVisited();
					 if (navigationData.isPass) {
							navigationEvent.updateGlobleFocus();
					 }else{
					 	navigationEvent.updateGlobleFocus();
					 }
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
		/* var wW=$(window).width();
		var wH=$(window).height();		
		var path="";		
		for(var i=0;i<pageXml.contentImage[0].img.length;i++){
			var imgWd=parseInt(pageXml.contentImage[0].img[i].minwidth);
			var imgHt=parseInt(pageXml.contentImage[0].img[i].minheight);			
			if(wW>imgWd && wH> imgHt){
				path=pageXml.contentImage[0].img[i].path;				
			}
		}
		if((prePath1!=path)){
			$('.KC_Img').attr('src',path);			
			
			prePath1=path;
		} */
	}
}
