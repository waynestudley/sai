/*----------------------------------------
	Name: fw_SimplePresentation.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_SimplePresentation(_xml){    
	var pageXml=_xml;
	var prePath1="";
	this.updatePageLayOut=updatePageLayOut;
	var className=pageXml.className;
	$('.simplePresentation').addClass(className)
	var cntLen=pageXml.panelText[0].text.length;	
	var tIndex=5;
	globalSettings.addTitle('#pan1',pageXml.panelText[0].text[0].Text);
	var isPreload=false;
	var preloadImagesArray=new Array();
	
	/************************/
	
	if(pageXml.pageTitle!=null){
		var pageTitleStyle= pageXml.pageTitle[0].style||''; 
		$('.pageTitle').attr('style',pageTitleStyle)
	}
	if(pageXml.instructionText[0].style!=null){
		var instStyle= pageXml.instructionText[0].style||''; 
		$('.pageInstruction').attr('style',instStyle)
	}
	if(pageXml.transcript[0].style!=null){
		$('.fw_TranscriptContainer').attr('style',pageXml.transcript[0].style)
	}
	if(pageXml.contentBg != undefined){
		if(pageXml.contentBg[0].style!=null){
			$('.content-bg').attr('style',pageXml.contentBg[0].style)
		}
	}
	/************************/
	
	
	
	
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + imageUrl + ')');
			//$('.panelBg').attr('src',iPadImgPath);			
		//	$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);	
			isPreload=true;
			preloadImagesArray.push(iPadImgPath);		
		}else if(pageXml.contentBackground[0].img[0].path!=""){
				$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
				//$('.panelBg').attr("src", pageXml.contentBackground[0].img[0].path);
				//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
				isPreload=true;
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
			var imgCName= pageXml.contentBackground[0].img[0].className || '';
			$('.panelBg').addClass(imgCName);						
		}else{
				$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
			isPreload=true;
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
			var imgCName= pageXml.contentBackground[0].img[0].className || '';
			$('.panelBg').addClass(imgCName);			
		}else{
			$('.panelBg').remove();
		}
	}
	
	/*---------------*/
	
	updatePageLayOut();	
    	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	
	$('.panelContainer .pageText').append('<div id="pan1" class="posAB" tabindex="'+tIndex+'">'+pageXml.panelText[0].text[0].Text+'</div>');
	setStyle("#pan1",pageXml.panelText[0].text[0]);
	
	
	if(cntLen>1){
		for(var c=1;c<cntLen;c++){
			tIndex++;
			var cln="etext"+c;		
			var str='<div id="'+cln+'" class="posAB" tabindex="'+tIndex+'">'+pageXml.panelText[0].text[c].Text+'</div>'
			$('.panelContainer .pageText').append(str);
			setStyle("#"+cln,pageXml.panelText[0].text[c]);
		}	
	}	
	
	if (navigationData.isPass && className == 'certificate') {
		var pritBtnName = pageXml.buttonText[0].text[0].Text;
		$('.panelContainer .pageText').append('<div id="printb" class="posAB" tabindex="'+tIndex+'"><a tabindex="1" class="a-button printbtn" href="javascript:void(0);"><span class="btntext">' + pritBtnName + '</span></a><div>');	
		setStyle("#printb",pageXml.buttonText[0].text[0]);
	} 
	if(pageXml.panelText[0].text.length>1){		
		//globalSettings.addTitle('#pan2',pageXml.panelText[0].text[1].Text);			
		$('.qoutText').css('width',pageXml.panelText[0].text[1].qoutTxtWidth);
	}
	
	$('.pageInstruction').attr('tabindex',(tIndex));
	navigationEvent.updateGlobleFocus(tIndex);
	if(isPreload){
		$.imgpreload(preloadImagesArray,
			{
				each: function()
				{	
				},
				all: function()
				{
					try{						 
						 pageLoadComplete()
						 
					}catch(err){}
				}
		});
	}else{
		pageLoadComplete()
	}

	function pageLoadComplete(){
	 	templateMediator.templateLoadComplete();
		 $("div[tabindex=1]").focus();	
		 templateMediator.pageVisited();
		 if(pageXml.title!=null){
			pageTitle.updateTitleByText(pageXml.title[0].Text);
		}
		//--swift code to KC summary...
		 /*if(className == 'certificate'){
			navigationData.iCertify=true;
			if(isNull(navigationData.passDate)){
				navigationData.passDate= globalSettings.getTodayDate();
			}
			dataStore.updateUserData();
		 }*/
			
		/* if(navigationData.getSubModuleId() > 0 && menuData.pageIndex == 15){
			navigationData.updateSubModuleProgress();
		 } */
	}
	function updatePageLayOut(){
	 	
	}
	function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var bgColor =(_xml.bgColor==null?'':_xml.bgColor);
		var padding =(_xml.padding==null?'':_xml.padding);
		var fts =(_xml.fontSize==null?'16px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
		var txtB=(_xml.textAlign==null?'right':_xml.textAlign);
		var wd  =(_xml.width==null?'auto':_xml.width);
		var ht  =(_xml.height==null?'auto':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var rgt =(_xml.right==null?'':_xml.right);
		var tp  =(_xml.top==null?'':_xml.top);
	    var pos =(_xml.position==null?'absolute':_xml.position);
	   	var lineHeight  =(_xml.lineHeight==null?'':_xml.lineHeight);
		
		if(_xml.cName!=null){
			$(obj).addClass(_xml.cName);
		}
		
		if(globalPath.languageDir == 'ltr'){
			if(_xml.right!=null){
				$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos,'line-height':lineHeight});
			}else{
				$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos,'line-height':lineHeight});
			}
		} else{
			if(_xml.left!=null){
				$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos,'line-height':lineHeight});
			}else{
				$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos,'line-height':lineHeight});
			}
			}
	}
	
		
	
}
