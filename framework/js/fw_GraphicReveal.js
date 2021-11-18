/*----------------------------------------
	Name: fw_GraphicReveal.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_GraphicReveal(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var revealButton=".revealButton";
	var revealButton2=".revealButton2";
	var selectedClass="revealButtonSelect";
	this.updatePageLayOut=updatePageLayOut;	
	//$('.pageText p').html(pageXml.contentText[0].text[0].Text);
	var className=pageXml.className;
	var str='';
	var lmsData=navigationData.getCurrentPageData();
	var dataArray= new Array();
	var tempArray= new Array();
	var buttonArray= new Array();		
	var updateDone=false;
	var cntLen=pageXml.contentText[0].text.length;	
	var hType=pageXml.type.toLowerCase();
	var graphicRevealType=0;
	var tabIdx=8;
	var iPadBackground;
	var nextPageId = navigationData.getNextPageId();
	var parentClass='.graphicReveal1';
	var graphicRevealTypeArray= new Array("graphicReveal1","graphicReveal2","graphicReveal3");
	for(var i=0;i<graphicRevealTypeArray.length;i++){
		if(hType==graphicRevealTypeArray[i].toLowerCase()){
			graphicRevealType=i;
			break;
		}	
	}
	parentClass ='.'+graphicRevealTypeArray[graphicRevealType];
	$('.graphicReveal1').attr('class',graphicRevealTypeArray[graphicRevealType]);
	
	$(parentClass).addClass(className);
	
	var pageTxtStr="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		pageTxtStr+='<div class="accText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
	}
	$('.pageText').html(pageTxtStr);
	
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
	if(pageXml.contentBg[0].style!=null){
		$('.content-bg').attr('style',pageXml.contentBg[0].style);
		$('.content-bg .white-background-bg').attr('style',pageXml.contentBg[0].wtbgStyle);
	}
	/************************/
	
	
	if (lmsData != "") {
		dataArray = lmsData.split('^');
	}else{
		dataArray.push(0);		
	}
	
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	 var preloadImagesArray=new Array();
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			var className= pageXml.contentBackground[0].img[0].classNameIpad || '';
			var imgStyle= pageXml.contentBackground[0].img[0].styleIpad || '';
			$('.panelBg').addClass(className);
			$('.panelBg').attr('style',imgStyle);
			preloadImagesArray.push(iPadImgPath);		
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			var className= pageXml.contentBackground[0].img[0].className || '';
			var imgStyle= pageXml.contentBackground[0].img[0].style || '';
			$('.panelBg').addClass(className);
			$('.panelBg').attr('style',imgStyle);
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{	
		if(pageXml.contentBackground[0].img[0].path!=""){
				var className= pageXml.contentBackground[0].img[0].className || '';
				var imgStyle= pageXml.contentBackground[0].img[0].style || '';
				$('.panelBg').addClass(className);
				$('.panelBg').attr('style',imgStyle);
				$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
				$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);			
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
		}else{
			$('.panelBg').remove();
			
		}
	}
	if(pageXml.contentBackground[0].img[1] != undefined){
		
		preloadImagesArray.push(pageXml.contentBackground[0].img[1].path);
	}
	if(pageXml.revelCollOut[0].img[0].path != ""){
		preloadImagesArray.push(pageXml.revelCollOut[0].img[0].path);
	}else{	
		$('.popUpImg').remove();
	}
	
	
	if(preloadImagesArray.length > 0){
		$.imgpreload(preloadImagesArray,{
			each: function(){},
			all: function(){
				try{
					templateMediator.templateLoadComplete();
					$("div[tabindex=1]").focus();
				}catch(err){}
			}
		});
	}else{
		templateMediator.templateLoadComplete();		
	}
	
	/*---------------*/	
	
	if(pageXml.revelCollOut[0].img!=null){
		$('.popUpImg').attr("src",pageXml.revelCollOut[0].img[0].path);
		$('.popUpImg').attr("alt",pageXml.revelCollOut[0].img[0].Text);
	}else{
		$('.popUpImg').remove();
	}

	if(graphicRevealType == 0){
		
		var btnImg = pageXml.RevealButton[0].buttonImg[0].path;
		var altText = pageXml.RevealButton[0].buttonImg[0].Text;
		var btnStyle = pageXml.RevealButton[0].buttonText[0].style;
		var btntxtStyle = pageXml.RevealButton[0].buttonText[0].txtStyle;
		var imgStyle = pageXml.RevealButton[0].buttonImg[0].style;
		var containerStyle = pageXml.RevealButton[0].style;
		
		var btnclassName = pageXml.RevealButton[0].buttonText[0].className;
		
		if(pageXml.contentBackground[0].img[1] != undefined){
			var cBgImg = pageXml.contentBackground[0].img[1].path;
			var imgStyle2 = pageXml.RevealButton[0].buttonImg[0].style;
			$('.revealButton-container').append('<img class="rCallOutImg" src="'+cBgImg+'" alt="'+altText+'" title="" style='+imgStyle2+' />');
		}		
		$('.revealButton-container').attr('style',containerStyle);
		
		if(pageXml.RevealButton[0].buttonImg[0].path != ""){		
			$(revealButton).html('<img class="btnbg" src="'+pageXml.RevealButton[0].buttonImg[0].path+'" alt="'+altText+'" title="" style='+imgStyle+' /><div class="rCallOutText" style="'+btntxtStyle+'">'+pageXml.RevealButton[0].buttonText[0].Text+'</div>');
			$(revealButton).addClass(btnclassName);
		}else{
		$(revealButton).html('<div class="rCallOutText" >'+pageXml.RevealButton[0].buttonText[0].Text+'</div>');
		}
		$(revealButton).attr('style',btnStyle);
		if(pageXml.RevealButton[1] != undefined){
			if (lmsData == "") {
				dataArray.push(0);
			}	
			if(pageXml.revelCollOut[1].img!=null){
				$('.popUpImg2').attr("src",pageXml.revelCollOut[1].img[0].path);
				$('.popUpImg2').attr("alt",pageXml.revelCollOut[1].img[0].Text);
			}else{
				$('.popUpImg2').remove();
			}
			var btnImg = pageXml.RevealButton[1].buttonImg[0].path;
			var altText = pageXml.RevealButton[1].buttonImg[0].Text;
			var btnStyle = pageXml.RevealButton[1].buttonText[0].style;
			var btntxtStyle = pageXml.RevealButton[1].buttonText[0].txtStyle;
			var imgStyle = pageXml.RevealButton[1].buttonImg[0].style;
			var containerStyle = pageXml.RevealButton[1].style;
			
			$('.revealButton-container2').attr('style',containerStyle);
			
			if(pageXml.RevealButton[1].buttonImg[0].path != ""){		
				$(revealButton2).html('<img class="btnbg" src="'+pageXml.RevealButton[1].buttonImg[0].path+'" alt="'+altText+'" title="" /><div class="rCallOutText" style="'+btntxtStyle+'">'+pageXml.RevealButton[1].buttonText[0].Text+'</div>');
				$(revealButton2).addClass(btnclassName);
			}else{
				$(revealButton2).html('<div class="rCallOutText" >'+pageXml.RevealButton[1].buttonText[0].Text+'</div>');
			
			}			
			$(revealButton2).attr('style',btnStyle);
			
		}else{
			$('.revealButton-container2').remove();
			$('.popUpContainer2').remove();
		}

	}else{
		if(pageXml.RevealButton[0].buttonImg!=null){
			var cBgImg = pageXml.RevealButton[0].buttonImg[0].path;
			var altText = pageXml.RevealButton[0].buttonImg[0].Text;
			var textStyle = pageXml.RevealButton[0].buttonText[0].style;
			$(revealButton).html('<img class="rCallOutImg" src="'+cBgImg+'" alt="'+altText+'" title="" /><div class="rCallOutText" style='+textStyle+'>'+pageXml.RevealButton[0].buttonText[0].Text+'</div>');
		}else{
			var textStyle = pageXml.RevealButton[0].buttonText[0].style;
			$(revealButton).html('<div class="rCallOutText" style='+textStyle+'>'+pageXml.RevealButton[0].buttonText[0].Text+'</div>');
		}
	}
	setPosition($(parentClass).find('.tickCross'),pageXml.tickCross[0]);
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);	
	
	updateTabIndex();	
	$(revealButton).click(function(){
		if($(this).hasClass(selectedClass)){
			  $("div[tabindex=1]").focus();
			return false;
		}
		if($(this).find('span').hasClass('replaceStyle')){
			$(revealButton).html(pageXml.RevealButton[0].buttonText[1].Text);
		}
		$(this).addClass(selectedClass);
		updateTabIndex();
		//$(this).css('border-color','transparent');
		var oW=pageXml.revelCollOut[0].width;
		var oL=pageXml.revelCollOut[0].left;
		var oR=pageXml.revelCollOut[0].right;
		var oT=pageXml.revelCollOut[0].top;
		var oH=pageXml.revelCollOut[0].height;		
		if(graphicRevealType == 0){
			var str = '';
			for(var i=0;i<pageXml.revelCollOut[0].text.length;i++){
				var style = pageXml.revelCollOut[0].text[i].style || '';
				
				str+="<div class='insertTab' style='"+style+"'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>";
			}
			$('.popUpText').html(str);
			var popUpStyle = pageXml.revelCollOut[0].style;
			$('.popUpContainer').attr('style',popUpStyle);		
			$('.popUpContainer').show();			
			
		}else{
			if(pageXml.revelCollOut[0].animate.toLowerCase()=="true"){
					var lf=$(this).css('left');
					var rt=$(this).css('right');
					var offset = $(this).offset();
					var tp=(offset.top-65+($(this).height()/2))+'px';
					if(globalPath.languageDir == 'ltr'){
					$('.popUpContainer').css({width:'40px', height:'40px',left:lf,top:tp});	
					} else{
					$('.popUpContainer').css({width:'40px', height:'40px',right:rt,top:tp});
						}
					$('.popUpContainer').addClass('chanllagesgrp1');			
					$('.popUpContainer').show();
					if(globalPath.languageDir == 'ltr'){			
					$('.popUpContainer').animate({width:oW, height:oH,left:oL,top:oT},200, function() {
						var str = '';
						for(var i=0;i<pageXml.revelCollOut[0].text.length;i++){
							if(i == pageXml.revelCollOut[0].text.length){
								str+="<div class='insertTab' style='margin-bottom:10px;'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>"
							}else{
								str+="<div class='insertTab'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>";
							}
						}
						$('.popUpText').html(str);
					
						$('.popUpText').find('.tabSum').each(function(){					
							$(this).attr('summary',$(this).text());			
						});
					});			
			} else{
				$('.popUpContainer').animate({width:oW, height:oH,right:oR,top:oT},200, function() {
					var str = '';
					for(var i=0;i<pageXml.revelCollOut[0].text.length;i++){
						if(i == pageXml.revelCollOut[0].text.length){
							str+="<div class='insertTab' style='margin-bottom:10px;'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>"
						}else{
							str+="<div class='insertTab'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>";
						}
					}
					$('.popUpText').html(str);
				
					$('.popUpText').find('.tabSum').each(function(){					
						$(this).attr('summary',$(this).text());			
					});
				});
					}
			}else{
				$('.popUpContainer').show();
				if(globalPath.languageDir == 'ltr'){
				$('.popUpContainer').css({width:oW, height:oH,left:oL,top:oT});
				} else{
				$('.popUpContainer').css({width:oW, height:oH,right:oR,top:oT});
					}
				var cL="stripRight"
				if(pageXml.revelCollOut[0].align.toLowerCase()=='left'){
					cL='stripLeft';
				}
				if(pageXml.revelCollOut[0].align.toLowerCase()=='top'){
					cL='stripTop';
				}
				var str='<div class="popUpArrow" ></div><div class="popUpCallOut '+cL+' clearfix"><div class="popUpCallOutText" >';
				for(var i=0;i<pageXml.revelCollOut[0].text.length;i++){
					if(i == pageXml.revelCollOut[0].text.length){
						str+="<div class='insertTab' style='margin-bottom:10px;'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>"
					}else{
						str+="<div class='insertTab'><p>"+pageXml.revelCollOut[0].text[i].Text+"</p></div>"
					}
					
				}
				str+='</div></div>';		
				updateTabIndex();
				$('.popUpContainer').html(str);
				$('.popUpContainer').find('.tabSum').each(function(){					
						$(this).attr('summary',$(this).text());			
						$(this).attr('tabindex',tabIdx);			
				});
				var ttw=getNumber(oW)-36;
				$('.popUpCallOutText').css('width',ttw+'px');
				if(globalPath.languageDir == 'ltr'){
				$('.popUpCallOutText').css('left','0px');
				var obj2 =pageXml.revelCollOut[0].xGap;
				var xgap=obj2==null?(getNumber(oW))+'px':obj2;
				$('.popUpArrow').css({'left':xgap,top:pageXml.revelCollOut[0].yGap});
				
				} else{
				$('.popUpCallOutText').css('right','0px');
				$('.popUpArrow').css({'right':(getNumber(oW))+'px',top:pageXml.revelCollOut[0].yGap});
					}
				
			}
		}
		dataArray[0]=1;
		checkstatus();
		
	});
	
	$(revealButton2).click(function(){
		if($(this).hasClass(selectedClass)){
			  $("div[tabindex=1]").focus();
			return false;
		}
		$(this).addClass(selectedClass);
		updateTabIndex();
		if(graphicRevealType == 0){
			var str = '';
			for(var i=0;i<pageXml.revelCollOut[1].text.length;i++){
				var style = pageXml.revelCollOut[1].text[i].style;
				
				str+="<div class='insertTab' style='"+style+"'><p>"+pageXml.revelCollOut[1].text[i].Text+"</p></div>"
			}
			$('.popUpText2').html(str);
			var popUpStyle = pageXml.revelCollOut[1].style;
			$('.popUpContainer2').attr('style',popUpStyle);		
			$('.popUpContainer2').show();			
			
		}else{
			
		}
		
		dataArray[1]=1;
		checkstatus();
		
	});
	$('.closePopUp').click(function(){
		$('.popUpContainer').hide();
		 $(revealButton).removeClass(selectedClass);
	});
	
	  
   
	if(pageXml.contentBackground != undefined){
		if(iPadBackground != undefined){
			if(globalSettings.isDesktop()){
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
			}else{
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].ipadPath);
			}
		}else{
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
		}
	}
	
	if(preloadImagesArray.length > 0){
		$.imgpreload(preloadImagesArray,{
			each: function(){},
			all: function(){
				try{
					templateMediator.templateLoadComplete();	
					 $("div[tabindex=1]").focus();	 			
				}catch(err){}
			}
		});
	}else{
		templateMediator.templateLoadComplete();	
		 $("div[tabindex=1]").focus();	 
	}
		
	function updateLMSData(){
		var tempData=dataArray.join("^");
		navigationData.updateCurrentPageData(tempData);
	}
	
	 function checkstatus(){	 
		updateLMSData();		
		if(dataArray.toString().indexOf('0')<0 ){
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			templateMediator.pageVisited();
			if(nextPageId != ""){
				menuData.pageIndex = nextPageId;		
			}
		}
	 }
	 function updatePageLayOut(){
	 	
	 } 
	 
	  function updateTabIndex(){			
		navigationEvent.updateGlobleFocus(12);
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
		if(globalPath.languageDir == 'ltr'){
			if(_xml.right!=null){
				$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos});
			}else{
				$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos});
			}
		} else{
			if(_xml.left!=null){
				$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos});
			}else{
				$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos});
			}
			}
	}
	
}
