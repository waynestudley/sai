/*----------------------------------------
	Name: fw_FormativeAgreeDisagree.js
	Developed by: Suchita Gurme
	Updated by: Sunil Patil
	Added Function: updatePageDataByPageNum, getPageNumByComicId 
	Purposed : different layout of this template only for this(SIPP) project
----------------------------------------*/
function fw_FormativeAgreeDisagree(_xml){    
	var pageXml=_xml;
	var optionButton=".formativeAgreeDisagree .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;
	var infoArray= new Array();
	
	//globalSettings.addTitle('.pageText',pageXml.contentText[0].text[0].Text);
	var str='';
	var totalQption=pageXml.optionContent[0].option.length;	
	var tbCnt=5;
	var selectedId="";	
	var correctAnswerArray = new Array();
	var optRow;
	var yes=pageXml.optionAnswer[0].text[0].Text;
	var yesStyleWt=pageXml.optionAnswer[0].text[0].styleWidth;
	var no=pageXml.optionAnswer[0].text[1].Text;
	var noStyleWt=pageXml.optionAnswer[0].text[1].styleWidth;
	
	var className=pageXml.className;
	var preloadImagesArray=new Array();
	var isInfo=true;
	
	var pageTxtStr="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		pageTxtStr+='<div class="htcText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
	}
	$('.pageText').html(pageTxtStr);
	if(pageXml.optionInfo==null){
		 isInfo=false;
		 $('.infoContainer').remove();
	 }
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
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			var conBGCName= pageXml.contentBackground[0].img[0].classNameIpad || '';
			var imgStyle= pageXml.contentBackground[0].img[0].styleIpad || '';
			$('.panelBg').addClass(conBGCName);
			$('.panelBg').attr('style',imgStyle);
			preloadImagesArray.push(iPadImgPath);		
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			var conBGCName= pageXml.contentBackground[0].img[0].className || '';
			var imgStyle= pageXml.contentBackground[0].img[0].style || '';
			$('.panelBg').addClass(conBGCName);
			$('.panelBg').attr('style',imgStyle);
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{	
		if(pageXml.contentBackground[0].img[0].path!=""){
				var conBGCName= pageXml.contentBackground[0].img[0].className || '';
				var imgStyle= pageXml.contentBackground[0].img[0].style || '';
				$('.panelBg').addClass(conBGCName);
				$('.panelBg').attr('style',imgStyle);
				
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
				
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}
	/************************/
	var optConStyle =pageXml.optionContent[0].style;
	
	$('.optionContainer').attr("style",optConStyle);
	
	$('.formativeAgreeDisagree').addClass(className);
	var optAnsstyleWidth = pageXml.optionAnswer[0].styleWidth || '';
	str+='<div class="optionLabelContainer" style="'+optAnsstyleWidth+'" ><div class="optionLabel" style="'+yesStyleWt+'" tabindex="'+tbCnt+'"><span >'+yes+'</span></div><div class="optionLabe2" style="'+noStyleWt+'" tabindex="'+tbCnt+'"><span >'+no+'</span></div></div>';
	for(var i=0;i<totalQption;i++){
		var tbtxt=pageXml.optionContent[0].option[i].text[0].Text;
		var optStyle =pageXml.optionContent[0].option[i].style;
		var txtStyle =pageXml.optionContent[0].option[i].text[0].style;
		
		var wd =pageXml.optionContent[0].option[i].text[0].style;
		var ht =pageXml.optionContent[0].option[i].text[0].height;
		var optImgWT =pageXml.optionContent[0].option[i].img[0].width;
		var optImgHT =pageXml.optionContent[0].option[i].img[0].height;
		
		
			str+='<div class="opt" id="opt_'+i+'" style="'+optStyle+'" ><div class="table" ><div class="table-cell" ><img class="optBg" tabindex="'+tbCnt+'" title="" /></div>';
			tbCnt++;
			str+='<div class="table-cell opttext" ><span class="optText" style="'+txtStyle+'" tabindex="'+tbCnt+'">'+tbtxt+'</span></div></div>';
			tbCnt++;
			str+='<div class="optionDiv" style="'+optAnsstyleWidth+'" ><div class="optionRow optionrow1" style="'+yesStyleWt+'" >'
			str+='<div class="table" ><div class="table-cell" ><a  id="op_0_'+i+'"  tabindex="'+tbCnt+'" href="javascript:void(0);" class="optionButton" ></a><span class="tickCross"></span></div></div></div>';
			tbCnt++;
			str+='<div class="borderDiv"></div><div class="optionRow optionrow2" style="'+noStyleWt+'" >'
			str+='<div class="table" ><div class="table-cell" ><a id="op_1_'+i+'"  tabindex="'+tbCnt+'" href="javascript:void(0);" class="optionButton" ></a><span class="tickCross"></span></div></div></div></div>';
			tbCnt++;
			if(isInfo){
			str+='<div class="uAnscontainer" ><div class="table" ><div class="table-cell" ><a href="javascript:void(0)"class="questionMark" id="qem_'+i+'"></a></div></div></div>';
			}
			str+='</div>';
		if(isInfo){
			infoArray.push(0);
		}
		userAnsArray.push(-1);
		correctAnswerArray.push(pageXml.optionContent[0].option[i].answer.split(','));
	}
	
    $(".pageInstruction").attr('tabIndex',tbCnt)
	str+='<a href="javascript:void(0);" class="a-button ok disabled" tabindex="'+(tbCnt+1)+'" style="'+pageXml.buttonText[0].text[0].style+'" ><span class="btntext"></span></a>'
	$('.optionContainer').html(str);
	//$('.formativeAgreeDisagree').css("background-image", "url("+pageXml.contentBackground[0].img[0].path+")");	
	$('#opt_'+i+" .optBg").css("")
	
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	
	for(var i=0;i<totalQption;i++){
		$('#opt_'+i+" .optBg").attr('src',pageXml.optionContent[0].option[i].img[0].path);
		$('#opt_'+i+" .optBg").attr('alt',pageXml.optionContent[0].option[i].img[0].Text);
	}
	updatePageLayOut();
	 updateTabIndex();
	 $("div[tabindex=1]").focus();
	
	$('.opt .questionMark').click(function(){
		//var opBtn=$(this).parent().find('.optionButton');
		if ($(this).hasClass("disabledclickMark")) {
			return false;
		}
		//if(isInfo && isUserAns){
			upadteOptInfo($(this).attr('id'));
			$('.opt .questionMark').removeClass("disabledclickMark");	
			$(this).addClass("disabledclickMark");	
		//}
		if ($(this).hasClass("disabled") ) {
			return false;
		}	
			
		//onOptionClick(opBtn);		
	});
	$(optionButton).hover( function(){		
		optRow=$(this);	
		if(optRow.hasClass('disabled'))return false;			
		if(optRow.hasClass(selectedClass) || optRow.hasClass('disabled') || (!globalSettings.isDesktop())){
			return false;
		}
		$(optRow).addClass(optionHoverClass);
	},
	  function () {	  	
		$(optRow).removeClass(optionHoverClass);
	});
	
	$(optionButton).click(function(){
		if ($(this).hasClass("disabled")) {
			return false;
		}
		$(optionButton).removeClass('showCoreect selectCoreect');
		var ptOp=$(this).parent().parent().parent().parent();
		
		$(ptOp).find('a').removeClass(selectedClass);		
		$(ptOp).find('a').css('cursor','pointer');
		$(this).addClass(selectedClass);
		$(this).css('cursor','default');
		var str=$(this).attr('id').split('op')[1];
		var pId=parseInt(str.split('_')[2]);
		var cId=parseInt(str.split('_')[1]);
		var ans;
		if(cId==0){
			ans=[1,0];
		}else{
			ans=[0,1];
		}
		$('.tickCross').attr('class','tickCross');
		$('.userFeedback').hide();		
		userAnsArray[pId]=ans;		
		checkOk();
	});
	
	
	function upadteOptInfo(_id){
			$('.userFeedback').hide();	
			var opid= parseInt(_id.split('qem_')[1]);
			infoArray[opid] = 1;
			var ht=30;
			for(var i=0;i<=opid;i++){
				ht+=($('.optionContainer .opt').eq(i).height())+3;
				if(i==opid){
					ht-=(($('.optionContainer .opt').eq(i).height())/2);
				}
				
			}
			ht-=(($('.infoArrow').height())/2)+30;
			$('.infoArrow').css('top',(ht)+'px');
			
			if(pageXml.optionInfo[0].option[opid].arrowTopPosition){
				$('.infoArrow').css('top',pageXml.optionInfo[0].option[opid].arrowTopPosition);			
			}
			
			var str="";
			for(var i=0;i<pageXml.optionInfo[0].option[opid].text.length;i++){
				if(i == pageXml.optionInfo[0].option[opid].text.length-1){
					var style= pageXml.optionInfo[0].option[opid].text[i].style;
					str+="<div class='insertTab' style='"+style+"'><p>"+pageXml.optionInfo[0].option[opid].text[i].Text+"</p></div>";
				}else{
					str+="<div class='insertTab'><p>"+pageXml.optionInfo[0].option[opid].text[i].Text+"</p></div>";
				}
			}
			var infoContainerstyle= pageXml.optionInfo[0].option[opid].style;
			$('.infoContainer').attr('style',infoContainerstyle);
			$('.infoContainer').show();
			$('.infoContainer .infoText').html("<div class='insertTabDiv'>"+str+"</div>");
			
			/* if(pageXml.optionInfo[0].height!=null){
				$('.infoContainer .infoText').css('height', (parseInt(pageXml.optionInfo[0].height)-20)+'px');
			}
			if(pageXml.optionInfo[0].width!=null){
				$('.infoContainer .infoText').css('width', (parseInt(pageXml.optionInfo[0].width)-10)+'px');
				$('.infoContainer .infoText .insertTabDiv').css('width', (parseInt(pageXml.optionInfo[0].width)-20)+'px');
			}			
			if($('.insertTabDiv').outerHeight() > $('.infoText').outerHeight()){			
				$('.infoContainer .infoText .insertTabDiv').css('width', (parseInt(pageXml.optionInfo[0].width)-30)+'px');
				$('.infoContainer .infoText').fw_Scroll({color: "#0057A6", width: 10 });
			}	 */
			
			if(infoArray.toString().indexOf("0")<0){
				templateMediator.pageVisited();	
				pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);	
			}			
			updateTabIndex();
	}
	function checkOk(){
		if(userAnsArray.toString().indexOf("-1")<0){
			enabledButton(okButton);
		}
	
	}
	
	$(okButton).click(function(){
		if ($(this).hasClass("disabled")) {
			$("div[tabindex=1]").focus();
			return false;
		}		
		disabledButton(okButton);
		disabledButton(optionButton);
		//$('.userFeedback').attr('tabindex',(tbCnt+1));	
		$('.questionMark').css('display','block');	
		$(okButton).hide();
		
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			showFeedback(pageXml.feedback[0].correct[0]);
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);	
			templateMediator.pageVisited();			
		}else{
			showFeedback(pageXml.feedback[0].incorrect[0]);
			if(pageXml.instructionText[0].text[2]!=null){
				pageInstruction.updateText(pageXml.instructionText[0].text[2].Text);		
			 }else{
				pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);		
			 }
		}		
		var corrCnt = 0;	
		for(var i=0;i<userAnsArray.length;i++){
			for(var j=0;j<userAnsArray[i].length;j++){
				if(userAnsArray[i][j]==correctAnswerArray[i][j] && userAnsArray[i][j]==1){
					var str='#op_'+j+'_'+i;					
					$(str).parent().find('.tickCross').addClass('tick');
					$(str).addClass('selectCoreect');
				}else if(userAnsArray[i][j]!=correctAnswerArray[i][j] && userAnsArray[i][j]==1){
					var str='#op_'+j+'_'+i;					
					$(str).parent().find('.tickCross').addClass('cross');					
				}else if(userAnsArray[i][j]!=correctAnswerArray[i][j] && correctAnswerArray[i][j]==1){
					var str='#op_'+j+'_'+i;					
					$(str).parent().find('.tickCross').addClass('tick');
					$(str).addClass('showCoreect');					
				}
				if (userAnsArray[i][j] != 0 && correctAnswerArray[i][j] != 0) {
					if (userAnsArray[i][j] == correctAnswerArray[i][j]) {
						corrCnt++;
					}
				}				
			}
		}
		$('.userFeedbackHeader').removeClass('correctFB').removeClass('inCorrectFB');
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			$('.userFeedbackHeader').addClass('correctFB');				
		}else{
			$('.userFeedbackHeader').addClass('inCorrectFB');					
		}
		
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			showFeedback(pageXml.feedback[0].correct[0]);
		}else if(corrCnt>=3){	
			if(pageXml.feedback[0].partial){
			showFeedback(pageXml.feedback[0].partial[0]);	
			}else{
			showFeedback(pageXml.feedback[0].incorrect[0]);		
			}
		}else{
			showFeedback(pageXml.feedback[0].incorrect[0]);						
		}
			$('.tick').attr('style',pageXml.optionContent[0].tickSt);	
		$('.cross').attr('style',pageXml.optionContent[0].crossSt);	
		return false;
	});
	
	/*
$(okButton).focusout(function() {
		$("div[tabindex=1]").focus();	
	});
*/
	
	function showFeedback(obj,userAns){		
		var str="";
		for(var i=0;i<obj.text.length;i++){
			if(i == 0){
			str+="<div class='insertTab fontSemiBold' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>"
			}else{
			str+="<div class='insertTab' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>"
			}
		}
		
		$('.userFeedback .userFeedbackText .textContainer').html(str);	
		$('.userFeedback').attr('style',obj.style);
		$('.userFeedback').show();
		
		if($('.userFeedbackText').parent().height() < $('.userFeedbackText').height()){
			$('.userFeedbackText').css('height','auto');	
			$('.userFeedbackText').css('height',($('.userFeedbackText').parent().height()-5))		
			$('.textContainer').css('top','0');
			$('.textContainer').css('height','auto');
			
			if($('.textContainer').parent().height() < $('.textContainer').height()){
				$('.userFeedbackText').fw_Scroll({color:"#FFF",width:10});
			} 
		}
		/* var tId= parseInt(obj.transcriptId);
		var audioUrl= pageXml.transcript[0].text[tId].path;	
		navigation.playAudioByURL(audioUrl);
		$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text); */
		if(!isInfo){
			templateMediator.pageVisited();
		}
		updateTabIndex();
	}
	
	if(pageXml.contentBackground !=null){
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
	}
	if(preloadImagesArray.length>=1){
		$.imgpreload(preloadImagesArray,{each: function(){},all: function(){onLoadAllImages();}});	
	}else{
		onLoadAllImages();	
	}			
	function onLoadAllImages(){
		try{
				 templateMediator.templateLoadComplete();
	 			// templateMediator.pageVisited();
			}catch(err){}
	}
	
	function enabledButton(_button){
		$(_button).css('visibility','visible');
		$(_button).removeClass('disabled');
		$(_button).css('cursor','pointer');
	}
	function disabledButton(_button){
		$(_button).addClass('disabled');
		$(_button).css('cursor','default');
	}	
	 function updatePageLayOut(){
	 
	 }
	  function updateTabIndex(){
		//tabCnt=tbCnt+1;
		$('.insertTab').removeAttr('tabindex');
			if($('.userFeedback').is(':visible')){
				tbCnt++	;
				$('.userFeedback .userFeedback_text').find('.insertTab').each(function(){
					$(this).attr('tabindex',tbCnt);
					tbCnt++	;
				});				
	 }
	  navigationEvent.updateGlobleFocus(tbCnt);
  }
}
