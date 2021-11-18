/*----------------------------------------
	Name: fw_FormativeTAWA.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_FormativeTAWA(_xml){    
	var pageXml=_xml;
	var optionButton=".formativeTAWA .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var infoArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;	
	globalSettings.addTitle('.pageText',pageXml.contentText[0].text[0].Text);
	var str='';
	var totalQption=pageXml.optionContent[0].option.length;	
	var tbCnt=6;
	var optRow;
	var correctAnswerArray=pageXml.optionContent[0].answer.split(',');
	
	var mrqType=pageXml.type;
	var isInfo=true;
	var isUserAns=false;
	$('.formativeTAWA').addClass(mrqType);
	var className=pageXml.className;
	$('.formativeTAWA').addClass(className);
	
	
	var isOptionWiseImg=false;
	var optionImgObj=pageXml.optionBackground;
	var isPreload=false;
	var preloadImagesArray= new Array();
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
		$('.content-bg').attr('style',pageXml.contentBg[0].style);
		$('.content-bg .white-background-bg').attr('style',pageXml.contentBg[0].whbgStyle);
	}
	/************************/
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

	
	
 	
	
	if(optionImgObj!=null){
		isOptionWiseImg=true;
	}
	 str+= '<table border="0">';
	 str +='<tr class="cellGap"></tr>';
	
	  if(pageXml.optionInfo==null){
		 isInfo=false;
		 $('.infoContainer').remove();
	 }else{
		setStyle($('.infoContainer'),pageXml.optionInfo[0] );
	 }
	 
	var rowheight = pageXml.optionContent[0].height;
	for(var i=0;i<totalQption;i++){		
		var qStr=pageXml.optionContent[0].option[i].Text;
		userAnsArray.push(0);
		if(isInfo){
		infoArray.push(0);
		}
		if(isOptionWiseImg){
			var mcqBg = pageXml.optionBackground[0].img[i].path;
			var mcqBgAltText = pageXml.optionBackground[0].img[i].Text;	
			preloadImagesArray.push(pageXml.optionBackground[0].img[i].path);	
			isPreload=true;			
		}
		
		if(pageXml.optionContent[0].option[i].height != null){
			rowheight = pageXml.optionContent[0].option[i].height;
		}
		
		str +='<tr class="optionRow" style="height:'+rowheight+'">';
			if(isOptionWiseImg){
				str += '<td class="imgHolder" rowspan="2" ><img src="' + mcqBg + '" tabindex="' + tbCnt + '" alt="' + mcqBgAltText + '" /></div></td>';
				tbCnt++;
			}
			str +='<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="'+tbCnt+'" id="op_'+i+'" style="cursor: pointer;"></a><a href="javascript:void(0)" class="questionMark"></a></td>';
			
			str +='<td class="optiontextCell" onclick = "void(0)" ><a class="optionTextClick" tabindex="'+tbCnt+'" href="javascript:void(0);">'+qStr+'</a></td>';
			//str +='<td class="uAnscontainer" ><div class="uAns"></div></td>';
		
		
		//str +='<td class="questionMarkHolder" ><div class="questionMark"></div></td>';
		str +='</tr>';
		tbCnt++;
		str +='<tr class="cellGap1"><td></td> <td></td> <td></td> </tr>';		
		
     }
	 str +='</table>'
	navigationEvent.updateGlobleFocus(tbCnt);
	$('.optionContainer').html(str);
	$('.queContainer').attr('style',pageXml.optionContent[0].style);
	str ='<a href="javascript:void(0);" class="a-button ok disabled" tabindex="'+(tbCnt+1)+'" ><span class="btntext"></span></a><div class="answerInstruction" ></div>'
	$(".pageInstruction").attr('tabIndex',tbCnt)
	tbCnt++;
	$('.optionContainer').append(str);
	$(".answerInstruction").attr('tabIndex',tbCnt)
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	var len = pageXml.contentText[0].text.length;
	
	$('.answerInstruction').html(pageXml.extraInstructionText[0].text[0].Text);	
	//$('.answerInstruction').html(pageXml.contentText[0].text[len-1].Text);	
	//setStyle($('.userFeedback'),pageXml.feedback[0] );
	updatePageLayOut();
	 //$("div[tabindex=1]").focus();
	 function updatePageLayOut(){
	 
	 }
	/* MRQ Logic*/	
	
	/*if ((globalSettings.isMobile())) {
		$(optionButton).click(function(){
			if ($(this).hasClass("disabled")) {
				return false;
			}
			onOptionClick($(this));
			
		});
	}*/
	$('.close_info').click(function(){
		$('.infoContainer').hide();
		$('.optiontextCell').parent().removeClass("disabledclickMark");	
		$('.feedback-holder').show();
		//$('.userFeedback').show();
		
	});
	$('.close_info').focusout(function() {			
		updateTabIndex();
	});

	$('.optionCell').click(function(){
		var opcellBtn=$(this).find('.optionButton');
		if(isInfo && isUserAns){
			upadteOptInfo($(opcellBtn).attr('id'));
			$('.optiontextCell').parent().removeClass("disabledclickMark");			
			$(this).parent().addClass("disabledclickMark");	
		}
		if ($(opcellBtn).hasClass("disabled")) {
			return false;
		}	
			
		onOptionClick(opcellBtn);
	});
	
	$('.optiontextCell, .uAnscontainer').click(function(){
		var opBtn=$(this).parent().find('.optionButton');
		
		if(isInfo && isUserAns){
			upadteOptInfo($(opBtn).attr('id'));
			$('.optiontextCell').parent().removeClass("disabledclickMark");	
			$(this).parent().addClass("disabledclickMark");	
		}
		if ($(opBtn).hasClass("disabled") ) {
			return false;
		}	
			
		onOptionClick(opBtn);		
	});
	
	
	$('.optionCell').hover( function(){		
		optRow=$(this).find('.optionButton');	
		if($(optRow).hasClass('disabledMrq'))return false;			
		if($(optRow).hasClass(selectedClass) || $(optRow).hasClass('disabled') || (!globalSettings.isDesktop())){
			return false;
		}
		$(optRow).addClass(optionHoverClass);
	},
	  function () {	  	
		$(optRow).removeClass(optionHoverClass);
	});
	
	$('.optiontextCell, .uAnscontainer').hover( function(){	
		optRow=$(this).parent().find('.optionButton');
		if($(optRow).hasClass('disabledMrq'))return false;	
		if($(optRow).hasClass(selectedClass) || $(optRow).hasClass('disabled') || (!globalSettings.isDesktop())){
			return false;
		}
		$(optRow).addClass(optionHoverClass);
	},
	  function () {	  	
		$(optRow).removeClass(optionHoverClass);
	});
	
	
	
	function upadteOptInfo(_id){
			$('.feedback-holder').hide();	
			//$('.userFeedback').hide();	
			var opid= parseInt(_id.split('op_')[1]);
			infoArray[opid] = 1;
			var ht=25;
			for(var i=0;i<=opid;i++){
				ht+=($('.optionContainer .optiontextCell').eq(i).height());
				if(i==0){
					ht-=($('.optionContainer .optiontextCell').eq(i).height())/2;
				}
				if(i>0){
					ht+=25;
				}
			}
			ht-=($('.infoArrow').height())/2
			$('.infoArrow').css('top',(ht)+'px');
			
			if(pageXml.optionInfo[0].option[opid].arrowTopPosition){
				$('.infoArrow').css('top',pageXml.optionInfo[0].option[opid].arrowTopPosition);			
			}
			
			var str="";
			for(var i=0;i<pageXml.optionInfo[0].option[opid].text.length;i++){
				if(i == pageXml.optionInfo[0].option[opid].text.length-1){
					str+="<div class='insertTab' style='margin-bottom:0px;'><p>"+pageXml.optionInfo[0].option[opid].text[i].Text+"</p></div>";
				}else{
					str+="<div class='insertTab'><p>"+pageXml.optionInfo[0].option[opid].text[i].Text+"</p></div>";
				}
			}
			$('.infoContainer').show();
			$('.infoContainer .infoText').html("<div class='insertTabDiv'>"+str+"</div>");
			
			if(pageXml.optionInfo[0].height!=null){
				$('.infoContainer .infoText').css('height', (parseInt(pageXml.optionInfo[0].height)-20)+'px');
			}
			if(pageXml.optionInfo[0].width!=null){
				$('.infoContainer .infoText').css('width', (parseInt(pageXml.optionInfo[0].width)-10)+'px');
				$('.infoContainer .infoText .insertTabDiv').css('width', (parseInt(pageXml.optionInfo[0].width)-20)+'px');
			}			
			if($('.insertTabDiv').outerHeight() > $('.infoText').outerHeight()){			
				$('.infoContainer .infoText .insertTabDiv').css('width', (parseInt(pageXml.optionInfo[0].width)-30)+'px');
				$('.infoContainer .infoText').fw_Scroll({color: "#0057A6", width: 10 });
			}	
			if(infoArray.toString().indexOf("0")<0){
				templateMediator.pageVisited();	
			}			
			updateTabIndex();
	}
	function onOptionClick(_btn){	
		if($(_btn).hasClass('disabledMrq'))return false;
		if($(_btn).hasClass(selectedClass)){			
			$(_btn).removeClass(selectedClass);			
			checkOk($(_btn).attr('id'),0);
		}else{
			$(_btn).addClass(selectedClass);			
			checkOk($(_btn).attr('id'),1);
		}		
	}
	function checkOk(_id,val){		
		var id= parseInt(_id.split('op_')[1]);		
		userAnsArray[id]=val;
		if(userAnsArray.toString().indexOf('1')>=0){
			enabledButton(okButton);
		}else{
			disabledButton(okButton);
		}
				
	}
	$('.optionTextClick').focus(function() {			
		$("a[tabindex=3]").focus();					
	});
	$(okButton).click(function(){
		if ($(this).hasClass("disabled")) {
			return false;
		}
		disabledButton('.optionCell');
		disabledButton('.optiontextCell');
		disabledButton('.uAnscontainer');
		disabledButton(okButton);
		disabledButton(optionButton);	
		$(okButton).hide();	
		$('.answerInstruction').hide();			
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		var corrCnt = 0;
		var incorrCnt=0;
		for (var i = 0; i < totalQption; i++) {
			if(userAnsArray[i]==correctAnswerArray[i] && userAnsArray[i]==1){
				$('#op_'+i).closest('.optionRow').addClass('uAnsTick');
			}else if(correctAnswerArray[i] ==1){
				$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
			}else if(userAnsArray[i]!=correctAnswerArray[i] && userAnsArray[i]==1){
				$('#op_'+i).closest('.optionRow').addClass('uAnsCross');
			}
			//console.log(userAnsArray[i]+"=="+correctAnswerArray[i])
			if (mrqType != "formativeTawa") {
				if (userAnsArray[i] != 0 && correctAnswerArray[i] != 0) {
					if (userAnsArray[i] == correctAnswerArray[i]) {
						corrCnt++;
					}else{
						incorrCnt++;//incorrect count
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
		}else if(isAlmostCorrect() && pageXml.feedback[0].partial!=null){	
			showFeedback(pageXml.feedback[0].partial[0]);	
		}else{
			showFeedback(pageXml.feedback[0].incorrect[0]);						
		}
		return false;
	});
	
	function isAlmostCorrect(){
		var incorrectCount = 0;
		var isAlmost = false;
		for(var i=0; i<correctAnswerArray.length; i++){
			if(userAnsArray[i] != correctAnswerArray[i]){
				incorrectCount++
			}
		}	
		
		if(incorrectCount>1){
			isAlmost = false;
		}else if(incorrectCount == 1){
			isAlmost = true;
		}		
		return isAlmost;
	}
	
	function showFeedback(obj,userAns){		
		isUserAns=true;
		var str="";
			
			for(var i=0;i<obj.text.length;i++){				
				
				str+="<div class='insertTab' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>";
				
			}
			$('.userFeedback .userFeedbackText .textContainer').html('<div>'+str+'</div>');	
			var fdHolderStyle = obj.fcStyle || '';
			$('.feedback-holder').attr('style',fdHolderStyle);	
			//$('.userFeedback').attr('style',obj.style);	
			$('.feedback-holder').show();	
			//$('.userFeedback').show();	
			$('.userFeedbackText').css('height',$('.userFeedbackText').parent().height()+'px');
			
			if($('.textContainer').height()>$('.textContainer').parent().height()){
				$('.textContainer').css('height',$('.textContainer').parent().height());
				$('.textContainer').fw_Scroll({color:"#FFF",width:10});
			}
			var tId= parseInt(obj.transcriptId);
			if(pageXml.transcript[0].text[tId].Text != "" && pageXml.transcript[0].text[tId].Text != null){
				var audioUrl= pageXml.transcript[0].text[tId].path;	
				navigation.playAudioByURL(audioUrl);
				$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
			}
			if(!isInfo){
				templateMediator.pageVisited();
			}
			updateTabIndex();
			if(isInfo){
				navigationEvent.updateNextPagePopupText();
				$('.questionMark').css({"display": "block"})
				$('.optiontextCell, .optionButton, .uAnscontainer').removeClass('disabled');
				$('.optiontextCell, .optionButton, .uAnscontainer ').addClass('disabledMrq');
				$('.optiontextCell, .optionCell, .optionButton, .uAnscontainer').addClass('optionCellCurosor');
				
			}
	}
	function enabledButton(_button){
		$(_button).removeClass('disabled');
		$(_button).css('cursor','pointer');
	}
	function disabledButton(_button){
		$(_button).addClass('disabled');
		$(_button).css('cursor','default');
	}	
	
	function setStyle(obj, _xml) {
		var clr = (_xml.color == null ? '#333740' : _xml.color);
		var fts = (_xml.fontSize == null ? '16px' : _xml.fontSize);
		var ftw = (_xml.fontWeight == null ? 'normal' : _xml.fontWeight);
		var txtA = (_xml.textAlign == null ? 'left' : _xml.textAlign);
		var txtB = (_xml.textAlign == null ? 'right' : _xml.textAlign);
		var wd = (_xml.width == null ? '' : _xml.width);
		var ht = (_xml.height == null ? '' : _xml.height);
		var lft = (_xml.left == null ? '' : _xml.left);
		var rit = (_xml.right == null ? '' : _xml.right);
		var tp = (_xml.top == null ? '' : _xml.top);
		var pos = (_xml.position == null ? 'absolute' : _xml.position);
		if(globalPath.languageDir == 'ltr'){
		$(obj).css({
			left: lft,
			top: tp,
			color: clr,
			width: wd,
			height: ht,
			'font-size': fts,
			'font-weight': ftw,
			'text-align': txtA,
			position: pos
		}); } else{
		$(obj).css({
			right: rit,
			top: tp,
			color: clr,
			width: wd,
			height: ht,
			'font-size': fts,
			'font-weight': ftw,
			'text-align': txtB,
			position: pos
		});
		}
		
	}

	function updateTabIndex(){
		$('.insertTab').removeAttr('tabindex');
		
			if($('.infoContainer').is(':visible')){
				tbCnt++	;
				$('.infoText').find('.insertTab').each(function(){
						$(this).attr('tabindex',tbCnt);
						tbCnt++	;
				})
				$('.close_info').attr('tabindex',tbCnt);
				tbCnt++	;
			}else{
			
				if($('.userFeedback').is(':visible')){
				tbCnt++	;
					$('.userFeedback .userFeedbackText').find('.insertTab').each(function(){
						$(this).attr('tabindex',tbCnt);
						tbCnt++	;
					})			
				}
			
			}
		navigationEvent.updateGlobleFocus(tbCnt);	

	 }
		
}
