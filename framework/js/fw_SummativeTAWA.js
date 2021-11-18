/*----------------------------------------
	Name: fw_SummativeTAWA.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_SummativeTAWA(_xml,isFeedBack,callback){    
	var pageXml=_xml;	
	var optionButton=".summativeTAWA .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;
	
	$('.pageText').attr('tabindex','4')
	var str='<table border="0" >';
	var totalQption=pageXml.options[0].option.length;	
	var tbCnt=4;	
	var optRow;
	var correctAnswerArray=pageXml.options[0].answer.split(',');
	var qText = "";	
	for(var i=0;i<pageXml.questionText[0].text.length;i++){
		var obj=pageXml.questionText[0].text[i].style;
		var _style=obj==null?"":obj;
		qText+='<p class="pText insertTab" tabindex="'+tbCnt+'" style="'+_style+'">'+pageXml.questionText[0].text[i].Text+'</p>';	
		tbCnt++;		
	}	
	$('.pageText').html(qText);
	
	for(var i=0;i<totalQption;i++){		
		var qStr=pageXml.options[0].option[i].Text;
		userAnsArray.push(0);
		str +='<tr class="optionRow">';
		str +='<td class="uAnscontainer" ><div class="uAns"></div></td>';
		str +='<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="'+tbCnt+'" id="op_'+i+'" style="cursor: pointer;"></a></td>';
		tbCnt++;
		str +='<td class="optiontextCell"  onclick = "void(0)" ><a class="optionTextClick" tabindex="'+tbCnt+'" href="javascript:void(0);">'+qStr+'</a></td>';
		str +='</tr>';
		tbCnt++;
		str +='<tr class="cellGap"><td></td> <td></td> <td></td> </tr>';		
		
     }
	
	 str +='</table><a href ="javascript:void(0);" class="a-button ok disabled" ><span class="btntext"></span></a><div class="answerInstruction"></div>'
	$('.optionContainer').html(str);	
	pageInstruction.updateText(pageXml.instruction[0].Text);
	$('.answerInstruction').html(pageXml.extraInstruction[0].Text);
	 $('.answerInstruction').attr('tabindex',tbCnt);
	 tbCnt++;
	 $(".pageInstruction").attr('tabIndex',tbCnt);
	 tbCnt++;
	 $(".ok").attr('tabIndex',tbCnt);
	 $(okButton).show();
	 $('.answerInstruction').show();
	updatePageLayOut();
	navigationEvent.updateGlobleFocus(tbCnt);
	// $("a[tabindex=1]").focus();
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
	$('.optionCell').click(function(){
		var opcellBtn=$(this).find('.optionButton');
		if ($(opcellBtn).hasClass("disabled") ) {
			return false;
		}		
		onOptionClick(opcellBtn);
	});
	
	$('.optiontextCell').click(function(){
		var opBtn=$(this).parent().find('.optionButton');
		if ($(opBtn).hasClass("disabled")) {
			return false;
		}		
		onOptionClick(opBtn);		
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
	
	$('.optiontextCell').hover( function(){		
		optRow=$(this).parent().find('.optionButton');
		if($(optRow).hasClass(selectedClass) || $(optRow).hasClass('disabled') || (!globalSettings.isDesktop())){
			return false;
		}
		$(optRow).addClass(optionHoverClass);
	},
	  function () {	  	
		$(optRow).removeClass(optionHoverClass);
	});
	$('.optionTextClick').focus(function() {			
		$("a[tabindex=3]").focus();					
	});
	function onOptionClick(_btn){				
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
	$(okButton).click(function(){
		if ($(this).hasClass("disabled")) {
			$("div[tabindex=1]").focus();
			return false;
		}
		$('.userFeedback').attr('tabindex',(tbCnt+1));
		disabledButton('.optionCell');
		disabledButton('.optiontextCell');
		disabledButton(okButton);
		disabledButton(optionButton);		
		var oneCorrect = false;
			for (var i = 0; i < totalQption; i++) {
				if(userAnsArray[i]==correctAnswerArray[i] && userAnsArray[i]==1){
					$('#op_'+i).closest('.optionRow').addClass('uAnsTick');
					oneCorrect = true;
				}else if(correctAnswerArray[i] ==1 && isFeedBack ){
					$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
				}else if(userAnsArray[i]!=correctAnswerArray[i] && userAnsArray[i]==1){
					$('#op_'+i).closest('.optionRow').addClass('uAnsCross');
				}
			}	
			if (!isFeedBack && oneCorrect) {
				for (var i = 0; i < totalQption; i++) {
					if(correctAnswerArray[i] == 1){
						$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
					}		
				}
			}
			
		$('.userFeedbackHeader').removeClass('correctFB').removeClass('inCorrectFB');
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			$('.userFeedbackHeader').addClass('correctFB');				
		}else if(isAlmostCorrect() && pageXml.feedback[0].partialCorrect!=null){	
			$('.userFeedbackHeader').addClass('partialCorrectFB');		
		}else{
			$('.userFeedbackHeader').addClass('inCorrectFB');					
		}
		
		if (isFeedBack) {
			if (userAnsArray.toString() == correctAnswerArray.toString()) {
				showFeedback(pageXml.feedback[0].correct[0],1);	
			}else if(isAlmostCorrect() && pageXml.feedback[0].partialCorrect!=null){	
				showFeedback(pageXml.feedback[0].partialCorrect[0],2);	
			}else{
				showFeedback(pageXml.feedback[0].incorrect[0],0);				
			}
		}			
		if(callback!=null){
			callback(userAnsArray,tbCnt);
			return false;
		}
		
	});
	function isAlmostCorrect(){
		var incorrectCount = 0;
		var isAlmost = false;
		for(var i=0; i<correctAnswerArray.length; i++){
			if(userAnsArray[i] == correctAnswerArray[i]){
				incorrectCount++
			}
		}	
		
		if(incorrectCount>=1){
			isAlmost = true;
		}else{
			isAlmost = false;
		}		
		return isAlmost;
	}
	function showFeedback(feedObj,userAns){		
		var feedText = "";
		$(okButton).hide();
		$('.answerInstruction').hide();
		for(var i=0;i<feedObj.text.length;i++){
			var obj=feedObj.text[i].style;
			var _style=obj==null?"":obj;
			feedText+='<div class="fText insertTab" style="'+_style+'">'+feedObj.text[i].Text+'</div>';		
		}		
		$('.userFeedbackText').css('width','804px');
		$('.userFeedbackText').html('<div class="textContainer"><div class="textdiv">'+feedText+'</div></div>');	
		$('.userFeedback').attr('style',feedObj.style);		
		$('.userFeedbackText .textdiv').css('padding-right','0px');
		$('.userFeedbackText').css('height',$('.userFeedback').height()+'px');
		$('.userFeedback').show();		
		if($('.textContainer').height()>$('.textContainer').parent().height()){
			$('.userFeedbackText').css('width','825px');
				$('.userFeedbackText .textdiv').css('padding-right','15px');
			$('.textContainer').css('height',$('.textContainer').parent().height());
			$('.textContainer').fw_Scroll({color:"#FFF",width:10});
		}
		if(userAns==1){
			$('.userFeedback').addClass('correctFB');			
		}else if(userAns==2){
			$('.userFeedback').addClass('partialCorrectFB');
		}else if(userAns==0){
			$('.userFeedback').addClass('inCorrectFB');
		}		
		$('.userFeedback').show();	
		//updateTabIndex();	
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
		navigationEvent.updateGlobleFocus(tbCnt);
	 }
		
}
