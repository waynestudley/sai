/*----------------------------------------
	Name: fw_SummativeMCQ.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_SummativeMCQ(_xml,isFeedBack,callback){    
	var pageXml=_xml;	
	var optionButton=".summativeMCQ .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;
	var str='<table border="0" >';
	var totalQption=pageXml.options[0].option.length;	
	var tbCnt=4;
	var selectedId="";
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
		str +='<td class="optiontextCell" onclick = "void(0)" ><a class="optionTextClick" tabindex="'+tbCnt+'" href="javascript:void(0);">'+qStr+'</a></td>';
		str +='</tr>';
		tbCnt++;
		str +='<tr class="cellGap"><td></td> <td></td> <td></td> </tr>';		
		
     }
	 str+='</table>'; 
	 
	 $(".pageInstruction").attr('tabIndex',tbCnt);
	 tbCnt++;
	str +='<a href ="javascript:void(0);" class="a-button ok disabled" tabindex="'+(tbCnt+1)+'" ><span class="btntext"></span></a>';	
	$('.optionContainer').html(str);	
	$(okButton).show();
	pageInstruction.updateText(pageXml.instruction[0].Text);
	updatePageLayOut();
    navigationEvent.updateGlobleFocus(tbCnt);
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
		if ($(opcellBtn).hasClass("disabled") ) {
			return false;
		}
		$(optionButton).removeClass(selectedClass);
		$(opcellBtn).addClass(selectedClass);
		
		$('.optionCell,.optiontextCell').css('cursor','pointer');
		$(optionButton).css('cursor','pointer');
		$(opcellBtn).css('cursor','default');
		$(this).css('cursor','default');
		$(this).parent().find('.optiontextCell').css('cursor','default');
		checkOk($(opcellBtn).attr('id'));
	});
	
	$('.optiontextCell').click(function(){
		var opBtn=$(this).parent().find('.optionButton');
		if ($(opBtn).hasClass("disabled")) {
			return false;
		}
		$(optionButton).removeClass(selectedClass);
		$(opBtn).addClass(selectedClass);
		
		$('.optionCell,.optiontextCell').css('cursor','pointer');
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
		$("a[tabindex=1]").focus();					
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
		$('.userFeedback').attr('tabindex',(tbCnt+1));
		disabledButton('.optionCell');
		disabledButton('.optiontextCell');
		disabledButton(okButton);
		disabledButton(optionButton);
		
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
				$(selectedId).closest('.optionRow').addClass('uAnsTick');
		}else{
			$(selectedId).closest('.optionRow').addClass('uAnsCross');
			for (var i = 0; i < totalQption; i++) {
				if(parseInt(correctAnswerArray[i])==1 && isFeedBack){
					$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
				}
			}			
		}
		$('.userFeedbackHeader').removeClass('correctFB').removeClass('inCorrectFB');
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			$('.userFeedbackHeader').addClass('correctFB');				
		}else{
			$('.userFeedbackHeader').addClass('inCorrectFB');					
		}
		
		
		if (isFeedBack) {
			if (userAnsArray.toString() == correctAnswerArray.toString()) {
				showFeedback(pageXml.feedback[0].correct[0],1);
				
			}else{
				showFeedback(pageXml.feedback[0].incorrect[0],0);
					
			}
		}
		if(callback!=null){
			callback(userAnsArray,tbCnt);
			return false;
		}
	});
	
	function showFeedback(feedObj,userAns){	
		var feedText = "";
		$(okButton).hide();
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
		//$('.userFeedbackText').fw_Scroll({color:"#dfb302",width:10});
		if(userAns==1){
			$('.userFeedback').addClass('correctFB');			
		}else if(userAns==0){
			$('.userFeedback').addClass('inCorrectFB');
		}		
		
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
