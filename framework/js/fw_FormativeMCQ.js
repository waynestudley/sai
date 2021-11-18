/*----------------------------------------
	Name: fw_FormativeMCQ.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_FormativeMCQ(_xml){    
	var pageXml=_xml;
	var optionButton=".formativeMCQ .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;
	
	globalSettings.addTitle('.pageText',pageXml.contentText[0].text[0].Text);
	var str='';
	var totalQption=pageXml.optionContent[0].option.length;	
	var tbCnt=6;
	var selectedId="";	
	var correctAnswerArray=pageXml.optionContent[0].answer.split(',');
	var optRow;
	var clsName = pageXml.className;
	var pageTxtStr="";
	var preloadImagesArray= new Array();
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
	$('.formativeMCQ').addClass(clsName);
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
	
	//var mcqBg=pageXml.contentBackground[0].img[0].path;
	//var mcqBgAltText=pageXml.contentBackground[0].img[0].Text;
//	 str+='<div class="mcqBgImg" tabindex="5"><img src="'+mcqBg+'" alt="'+mcqBgAltText+'" title="" /></div>';
	 str+= '<table border="0">';
	 str +='<tr class="cellGap"></tr>';
	for(var i=0;i<totalQption;i++){		
		var qStr=pageXml.optionContent[0].option[i].Text;
		userAnsArray.push(0);
		str +='<tr class="optionRow">';
		str +='<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="'+tbCnt+'" id="op_'+i+'" style="cursor: pointer;"></a></td>';
		str +='<td class="optiontextCell" onclick = "void(0)" ><a class="optionTextClick" tabindex="'+tbCnt+'" href="javascript:void(0);">'+qStr+'</a></td>';
		//str +='<td class="uAnscontainer" ><div class="uAns"></div></td>';
		str +='</tr>';
		tbCnt++;
		if(i!=totalQption-1){
			str +='<tr class="cellGap1"><td></td> <td></td> <td></td> </tr>';		
		}
     }
	 str +='</table>';
	navigationEvent.updateGlobleFocus(tbCnt);
	$('.optionContainer').html(str);
	str ='<a href ="javascript:void(0);" class="a-button ok disabled" tabindex="'+(tbCnt+1)+'" ><span class="btntext"></span></a>';
	
	$(".pageInstruction").attr('tabIndex',tbCnt)
	$('.optionContainer').append(str);
	$('.queContainer').attr('style',pageXml.optionContent[0].style);
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	updatePageLayOut();
	 //$("div[tabindex=1]").focus();
	 function updatePageLayOut(){
	 
	 }	
	/* MCQ Logic*/		
	/*$(optionButton).click(function(){
		if ($(this).hasClass("disabled")) {
			return false;
		}
		$(optionButton).removeClass(selectedClass);
		$(optionButton).css('cursor','pointer');
		$(this).addClass(selectedClass);
		$(this).css('cursor','default');
		checkOk($(this).attr('id'));
	});*/
	
	$('.optionCell').click(function(){
		var opcellBtn=$(this).find('.optionButton');
		if ($(opcellBtn).hasClass("disabled")) {
			return false;
		}
		$(optionButton).removeClass(selectedClass);
		$(opcellBtn).addClass(selectedClass);
		
		$('.optionCell,.optiontextCell, .uAnscontainer').css('cursor','pointer');
		$(optionButton).css('cursor','pointer');
		$(opcellBtn).css('cursor','default');
		$(this).css('cursor','default');
		$(this).parent().find('.optiontextCell, .uAnscontainer').css('cursor','default');
		checkOk($(opcellBtn).attr('id'));
	});
	
	$('.optiontextCell, .uAnscontainer').click(function(){
		var opBtn=$(this).parent().find('.optionButton');
		if ($(opBtn).hasClass("disabled")) {
			return false;
		}
		$(optionButton).removeClass(selectedClass);
		$(opBtn).addClass(selectedClass);
		
		$('.optionCell,.optiontextCell, .uAnscontainer').css('cursor','pointer');
		$(optionButton).css('cursor','pointer');
		$(opBtn).css('cursor','default');
		$(this).css('cursor','default');
		$(this).parent().find('.optionCell').css('cursor','default');
		checkOk($(opBtn).attr('id'));
	});
	
	
	$('.optionCell').hover( function(){		
		optRow=$(this).find('.optionButton');		
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
		if($(optRow).hasClass(selectedClass) || $(optRow).hasClass('disabled') || (!globalSettings.isDesktop())){
			return false;
		}
		$(optRow).addClass(optionHoverClass);
	},
	  function () {	  	
		$(optRow).removeClass(optionHoverClass);
	});
	
	
	
	
	function checkOk(_id){
		selectedId='#'+_id;
		var id= parseInt(_id.split('op_')[1]);
		userAnsArray= new Array();
		for (var i = 0; i < totalQption; i++) {			
			userAnsArray.push(0);
		}
		userAnsArray[id]=1;
		enabledButton(okButton);		
	}
	$(okButton).click(function(){
		if ($(this).hasClass("disabled")) {
			$("div[tabindex=1]").focus();
			return false;
		}
		//$('.userFeedback').attr('tabindex',(tbCnt+1))
		disabledButton('.optionCell');
		disabledButton('.optiontextCell');
		disabledButton('.uAnscontainer');
		disabledButton(okButton);
		disabledButton(optionButton);	
		$(okButton).hide();				
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		$('.userFeedbackHeader').removeClass('correctFB').removeClass('inCorrectFB');
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			$('.userFeedbackHeader').addClass('correctFB');		
			showFeedback(pageXml.feedback[0].correct[0]);
			$(selectedId).closest('.optionRow').addClass('uAnsTick');
		}else{
			$('.userFeedbackHeader').addClass('inCorrectFB');		
			showFeedback(pageXml.feedback[0].incorrect[0]);
			$(selectedId).closest('.optionRow').addClass('uAnsCross');
				for (var i = 0; i < totalQption; i++) {
					if(parseInt(correctAnswerArray[i])==1){
						$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
					}
				}
			
		}		
		return false;
	});
	function showFeedback(obj){		
		var str="";
		for(var i=0;i<obj.text.length;i++){				
			if(i == obj.text.length-1){
			str+="<div class='insertTab' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>";
			}else{
			str+="<div class='insertTab' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>";
			}
		}
		$('.userFeedback .userFeedbackText .textContainer').html('<div>'+str+'</div>');	
		
		var fdHolderStyle = obj.fcStyle || '';
		$('.feedback-holder').attr('style',fdHolderStyle);	
		$('.feedback-holder').show();	
		$('.userFeedback').attr('style',obj.style);	
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
		templateMediator.pageVisited();
		updateTabIndex();
	}
	function enabledButton(_button){
		$(_button).removeClass('disabled');
		$(_button).css('cursor','pointer');
	}
	function disabledButton(_button){
		$(_button).addClass('disabled');
		$(_button).css('cursor','default');
	}	
	
	 function updateTabIndex(){
		$('.insertTab').removeAttr('tabindex');
			if($('.userFeedback').is(':visible')){
			tbCnt++	;
				$('.userFeedback .userFeedbackText').find('.insertTab').each(function(){
					$(this).attr('tabindex',tbCnt);
					tbCnt++	;
				})			
			}
			
		navigationEvent.updateGlobleFocus(tbCnt);
	 }
}
