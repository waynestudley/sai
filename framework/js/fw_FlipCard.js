/*----------------------------------------
	Name: fw_FlipCard.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_FlipCard(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var flipCardButton=".flipCardButton";
	var selectedClass = "flipCardSelect";
	var flipCardHoverClass ="flipCardHover";
	this.updatePageLayOut=updatePageLayOut;	
	var totalAccordion=pageXml.flipCardContent[0].flipCard.length;
	var str='';
	var currentOpen=null;
	var lmsData=navigationData.getCurrentPageData();
	var dataArray= new Array();
	var tempArray= new Array();
	var buttonArray= new Array();		
	var updateDone=false;
	var currentTabId=6;
	var currentSPId=0;
	var send=false;
	var tbCnt;
	var hType=pageXml.type.toLowerCase();
	var preloadImagesArray=new Array();
		
	var parentClass='.flipCard';
	/* 	$('.pageText p').html(pageXml.contentText[0].text[0].Text);
		if(globalPath.languageDir == 'ltr'){
		$('.pageText p').css({'margin-left':marL,'margin-top':marT });
		}else{
		$('.pageText p').css({'margin-right':marR,'margin-top':marT });
		} */
	
	var pageTxtStr="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		pageTxtStr+='<div class="insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
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
		$('.content-bg').attr('style',pageXml.contentBg[0].style)
	}
	/************************/
	

	if (lmsData != "") {		
		dataArray = lmsData.split('^');
	}else{
		for (var i = 0; i < totalAccordion; i++) {
			dataArray.push(0);
		}
	}
	var btntxt=pageXml.buttonText[0].text[0].Text;
	var className=pageXml.className;
   	$('.flipCard').addClass(className);
	str += '<div class="flip-container-table">';
	var bro = "";
		var is_ie = navigator.userAgent.toLowerCase().indexOf('trident');
	for(var i=0;i<totalAccordion;i++){
		var txt=pageXml.flipCardContent[0].flipCard[i].buttonText[0].Text;
		var id="flip_"+i;				
		var id2="flippar_"+i;				
		var buttonImg = pageXml.flipCardContent[0].flipCard[i].buttonImg[0].path;
		var buttonImgText = pageXml.flipCardContent[0].flipCard[i].buttonImg[0].Text;
		var acctxtStyle= pageXml.flipCardContent[0].flipCard[i].buttonText[0].style || '';
		var textCardStyle= pageXml.flipCardContent[0].flipCard[i].popText[0].style || '';
		
		if (is_ie != "-1"){
			bro = "msie";
			if(parseInt($.browser.version) > 9){
				bro = "msie11";
			}
		}else{
			bro = "nonmsie";
		}
		var flipConCellStyle = pageXml.flipCardContent[0].flipCard[i].style || '';
		str += '<div class="flip-container-cell horizontal '+bro+'" id="'+id2+'" style="'+flipConCellStyle+'"><div class="card"><div class="cover front"><div class="info-img"><img src="'+buttonImg+'" alt="'+buttonImgText+'" /></div></div>';
		
		str += '<div class="cover back" style="'+textCardStyle+'"><div class="info-text scrollContent"><div class="textDiv">';
		var sss = pageXml.flipCardContent[0].flipCard[i].popText[0];
		var popStyle= sss.style || '';
		for(var j=0;j<sss.text.length;j++){
			var poptxtStyle= sss.text[j].style || '';				
			str += '<div class="insertTab" style="'+poptxtStyle+'">'+sss.text[j].Text+'</div>';
		}
		str += '</div></div></div></div>';
		
		str += '<div class="button-holder" style="'+acctxtStyle+'"><span class="text" >'+txt+'</span><a href="javascript:void(0)" id="'+id+'" class="flipCardButton">'+btntxt+'<span class="icon"></span></a></div></div>';
		
		
		
		if(i < totalAccordion-1){
			str += '<div class="flip-container-cell-gap"></div>';
		}
		
		//var sss = pageXml.flipCardContent[0].flipCard[i].popText[0];
		//var popStyle= sss.style || '';
		buttonArray.push('#'+id);
		tempArray.push(0);	
	}	
	str += '</div>';
	$('.flipCardContainer').html(str);		
	
	if (is_ie != "-1"){
		//$('.back').hide();	
	}
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	for (var i = 0; i < totalAccordion; i++) {
		$('#flippar_'+i+' .scrollContent').css('height','auto');	
		$('#flippar_'+i+' .scrollContent').css('height',($('#flippar_'+i+' .scrollContent').parent().height()-5))		
		$('#flippar_'+i+' .scrollContent .textDiv').css('height','auto');
		
		if($('#flippar_'+i+' .textDiv').parent().height() < $('#flippar_'+i+' .textDiv').height()){
			$('#flippar_'+i+' .scrollContent').fw_Scroll({color:"#0057a6",width:10});
		}
	}
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
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
	
	
	$(flipCardButton).hover( function(){
		if(!globalSettings.isDesktop()){
			return false;
		}
		$(this).addClass(flipCardHoverClass);		
	},
	  function () {
		$(this).removeClass(flipCardHoverClass);
		
		
	});
	
	updateTabIndex();
	
	$(flipCardButton).click(function(){
			var cThis =$(this);		
			var id= parseInt($(cThis).attr('id').split('flip_')[1]);
			currentSPId=id;
			
			$(flipCardButton).removeClass(flipCardHoverClass);	
			if ($('#flippar_'+currentSPId).find('.card').hasClass('flipped')) {
				if (is_ie != "-1"){
					if(parseInt($.browser.version) <= 9){
						$('#flippar_'+currentSPId+' .back').fadeOut();
						$('#flippar_'+currentSPId+' .front').fadeIn();
					}
				}
				$('#flippar_'+currentSPId).find('.card').removeClass('flipped');
				$(this).removeClass(selectedClass);
					$('#flippar_'+currentSPId).removeClass('selected');
						$('#flippar_'+currentSPId+' .back').addClass('flipped');
			} else {
				$('#flippar_'+currentSPId).find('.card').addClass('flipped');
				if (is_ie != "-1"){
					if(parseInt($.browser.version) <= 9){
						$('#flippar_'+currentSPId+' .back').fadeIn();
						$('#flippar_'+currentSPId+' .front').fadeOut();
					}
				}
				$(this).addClass(selectedClass);
				$('#flippar_'+currentSPId).addClass('selected');
				$('#flippar_'+currentSPId+' .back').removeClass('flipped');
				
			}
			$('#flippar_'+currentSPId+' .scrollContent').css('height','auto');	
			$('#flippar_'+currentSPId+' .scrollContent').css('height',($('#flippar_'+currentSPId+' .scrollContent').parent().height()-3))		
			$('#flippar_'+currentSPId+' .scrollContent .textDiv').css('top','0');
			$('#flippar_'+currentSPId+' .scrollContent .textDiv').css('height','auto');
			
			if($('#flippar_'+currentSPId+' .textDiv').parent().height() < $('#flippar_'+currentSPId+' .textDiv').height()){
				$('#flippar_'+currentSPId+' .scrollContent').fw_Scroll({color:"#ffffff",width:10});
				$('#flippar_'+currentSPId+' .scrollContent .fw_ScrollbarBg').show();
			}
			
			var preVal=parseInt(dataArray[id]);
			dataArray[currentSPId]=1;
			tempArray[currentSPId]=1;		
			if(preVal==0){
				updateLMSData();
			}
			if(tempArray.toString().indexOf("0")<0 && !send){
				send=true;
				pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
				templateMediator.pageVisited();
			}	
	});	  
	
   
	function updateLMSData(){
		var tempData=dataArray.join("^");
		navigationData.updateCurrentPageData(tempData);
	}
	
	 function updatePageLayOut(){
	 	
	 } 
	 function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var fts =(_xml.fontSize==null?'14px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
		var txtB=(_xml.textAlign==null?'right':_xml.textAlign);
		var wd  =(_xml.width==null?'auto':_xml.width);
		var ht  =(_xml.height==null?'auto':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var rit =(_xml.right==null?'':_xml.right);
		var tp  =(_xml.top==null?'':_xml.top);
	    var pos =(_xml.position==null?'absolute':_xml.position);
		if(_xml.position!=null){
			$(obj).removeClass('posAB');
		}
		if(globalPath.languageDir == 'ltr'){
		$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtA,position:pos});
		}else{
		$(obj).css({right:rit,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtB,position:pos});
		}
	}
	  function updateTabIndex(){
	  	$('.popUpImg, .popUpText, .closePopUp, .popUpImg').removeAttr("tabindex");		
		tbCnt=7;
		$('.insertTab').removeAttr('tabindex');
			
		for (var i = 0; i <= totalAccordion; i++) {
			$('#btnImg_'+i).attr('tabindex',tbCnt);
			tbCnt++;
			$('#hot_'+i).find('.flipCardButton').attr('tabindex',tbCnt);
			tbCnt++;
			if($('.popUpContainer').is(':visible') && i==currentSPId){
				$('#btnImg_'+i).attr('tabindex',tbCnt);
				tbCnt++;
				$('#hot_'+i ).find('.flipCardButton').attr('tabindex',tbCnt);				
				tbCnt++;
				$('.popUpContainer .popUpImg').attr('tabindex',tbCnt);
				tbCnt++;
				$('.popUpContainer .popUpText').find('.insertTab').each(function(){
					$(this).attr('tabindex',tbCnt);
					tbCnt++	
				})			
				$('.popUpContainer .closePopUp').attr('tabindex',tbCnt);	
				tbCnt++;
			}	
		}				
		navigationEvent.updateGlobleFocus(tbCnt);
	 }
	
}
