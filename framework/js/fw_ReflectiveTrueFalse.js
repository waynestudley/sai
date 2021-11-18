/*----------------------------------------
	Name: fw_FormativeMCQ.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_ReflectiveTrueFalse(_xml){    
	var pageXml=_xml;
	var optionButton=".reflectiveTrueFalse .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;
	$('.pageText p').html(pageXml.contentText[0].text[0].Text);	
	globalSettings.addTitle('.pageText',pageXml.contentText[0].text[0].Text);
	var str='';
	var totalQption=pageXml.optionContent[0].option.length;	

	var tbCnt=6;
	var selectedId="";	
	var correctAnswerArray=pageXml.optionContent[0].answer.split(',');
	
	var optRow;	

	
	
	str+='<div class="Agree" tabindex="'+tbCnt+'">'+pageXml.OptionHeading[0].text[0].Text+'</div>';
	tbCnt++;
	str+='<div class="Disagree" tabindex="'+tbCnt+'">'+pageXml.OptionHeading[0].text[1].Text+'</div>';
	tbCnt++;
	$('.labelContainer').html(str);
	str='';
	
	// addition ends
	
	if(pageXml.contentBackground[0].img.length>1)
	{
		str='<div class="mcqBgImg">'
		 for(var i=0;i<totalQption;i++)
		{
			var mcqBg=pageXml.contentBackground[0].img[i].path;
			var mcqBgAltText=pageXml.contentBackground[0].img[i].Text;
			str+='<div class="imgHolder" tabindex="5"><img src="'+mcqBg+'" alt="'+mcqBgAltText+'" /></div><div class="calloutRight"></div>';
		}
			str+='</div>';
	}else
	{
		var mcqBg=pageXml.contentBackground[0].img[0].path;
		var mcqBgAltText=pageXml.contentBackground[0].img[0].Text;
		 str+='<div class="mcqBgImg" tabindex="5"><img src="'+mcqBg+'" alt="'+mcqBgAltText+'" /></div>';	
		
	}
	 //addition ends
	 
		str+= '<table border="0" style="width:75%">';
	 str +='<tr class="cellGap"></tr>';
	for(var i=0;i<totalQption;i++){		
		var qStr=pageXml.optionContent[0].option[i].Text;
		userAnsArray.push(0);
		//Code Modification for Impact button modification start from here
		
		
		//Modification ends Here.
		
	
		if(globalPath.languageDir == 'ltr'){
		str +='<tr class="optionRow" style="padding-left:5px">';
		str +='<td class="optiontextCell"  tabindex="'+tbCnt+'" style="padding-left:90px; padding-right:10px;" onclick = "void(0)" >'+qStr+'</td>';
		} else{
		str +='<tr class="optionRow" style="padding-right:5px">';
		str +='<td class="optiontextCell"  tabindex="'+tbCnt+'" style="padding-right:90px; padding-left:10px;" onclick = "void(0)" >'+qStr+'</td>';
			}
		str +='<td class="Whitespacer" ></td>';
		tbCnt++;	
	
		
		str +='<td class="spacerContainer" ><div class="uspacer"></div></td>';
		str +='<td class="uAnscontainer" ></td>';
		//addition ends
		str +='<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="'+tbCnt+'" id="op1_'+i+'" val="op_'+(i)+'Y" style="cursor: pointer;"></a></td>';
                str +='<td class="uAnscontainer" ><div class="uAns" id="op1'+i+'"></div></td>';
		
		str +='<td class="spacerContainer" ><div class="uspacer"></div></td>';
		str +='<td class="uAnscontainer" ></td>';
		str +='<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="'+tbCnt+'" id="op2_'+i+'" val="op_'+(i)+'N" style="cursor: pointer;"></a></td>';
                str +='<td class="uAnscontainer" ><div class="uAns" id="op2'+i+'"></div></td>';
		// addition ends
		str +='</tr>';
		str +='<tr class="cellGap1"><td></td><td></td> <td></td> </tr>';		
		tbCnt++;
		
     }
	 str +='</table>'
	navigationEvent.updateGlobleFocus(tbCnt);
	$('.optionContainer').html(str);
	if(pageXml.contentBackground[0].img.length>1)
		{
			$(".optiontextCell").css('border', '1px solid #cccccc');
			
		}
	str ='<a href ="#" class="a-button ok disabled" tabindex="'+(tbCnt+1)+'" ><span class="btntext"></span></a>'
	
	 $(".pageInstruction").attr('tabIndex',tbCnt)
	$('.optionContainer').append(str);
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	updatePageLayOut();
	 //$("div[tabindex=1]").focus();
	 function updatePageLayOut(){
	 
	 }	

	
	$('.optionCell').click(function(){
		var opcellBtn=$(this).find('.optionButton');
		var mNae = $(opcellBtn).attr('id').split('_')[1]
		if ($(opcellBtn).hasClass("disabled")) {
			return false;
		}
	
	
	
		$('#op1_'+mNae).removeClass(selectedClass);
		$('#op1_'+mNae).css('cursor','pointer');
		$('#op2_'+mNae).removeClass(selectedClass);
		$('#op2_'+mNae).css('cursor','pointer');
		$(opcellBtn).css('cursor','pointer');
		$(opcellBtn).addClass(selectedClass);
		$(opcellBtn).css('cursor','default');
	
		checkOk();
		
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
	
	$(okButton).focus(function() {		
		var tbCn = tbCnt+1;		
		if($(this).hasClass('disabled')){
			$("a[tabindex=13]").focus();	
		}
	});
	
	
	
	var preloadImagesArray= new Array(pageXml.contentBackground[0].img[0].path+"")
	
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
	 			// templateMediator.pageVisited();
			}catch(err){}
		}
	});
	
	function checkOk(){
		for (var i = 0; i < totalQption; i++) 
		{			
			userAnsArray[i]=0;
		}
		
		var cnt=0;
		$('.optionCell').find('.optionButton').each(function(){			
			if($(this).hasClass('optionSelect')){	
				userAnsArray[cnt]=$(this).attr('id').split('op')[1]
				cnt++;
			}			
		});	
	
		if(totalQption ==cnt ){
			enabledButton(okButton)
				 
		}else{
			
			
		}		
	}
	$(okButton).click(function(){
		if ($(this).hasClass("disabled")) {
			$("div[tabindex=1]").focus();
			return false;
		}
		//$('.userFeedback').attr('tabindex',(tbCnt+1))
		disabledButton('.optionCell');
		disabledButton('.optiontextCell');
		disabledButton(okButton);
		disabledButton(optionButton);
		var corrct=0;
		var wrong=0;
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);	
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			showFeedback(pageXml.feedback[0].correct[0]);
			for(var i=0;i<totalQption;i++)
			{
				var selId ='op'+userAnsArray[i].split('_')[0]+''+userAnsArray[i].split('_')[1];
				$("#"+selId).addClass('uAnsTick');
			}
		}else{
			for (var i = 0; i < totalQption; i++) {
				if(correctAnswerArray[i] == userAnsArray[i]){
					var selId ='op'+userAnsArray[i].split('_')[0]+''+userAnsArray[i].split('_')[1];
					$("#"+selId).addClass('uAnsTick');
					corrct++;
					//$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
				}else
				{
				wrong++;
					var selId ='op'+userAnsArray[i].split('_')[0]+''+userAnsArray[i].split('_')[1];
					$("#"+selId).addClass('uAnsCross');
				}
			}
			showFeedback(pageXml.feedback[0].incorrect[0]);			
		}	
		
		ShowAnswer(); 
		$('.ImpactContainer').css('display','block');
		// Modification Ends
		return false;
	});
	
	
	function ShowAnswer()
	{
		for (var i = 0; i < totalQption; i++)
		 {
			$("#op"+correctAnswerArray[i]).parent().addClass('showAns')	
		 }
	
	}
			
	function showFeedback(obj){		
		var str="";
			for(var i=0;i<obj.text.length;i++){
				str+="<div class='insertTab'><p>"+obj.text[i].Text+"</p></div>"
			}
			$('.userFeedback .userFeedbackText').html(str);	
		$('.userFeedback').show();
		if($('.userFeedback').height()>370){
			$('.userFeedback').css('height','370px')
			$('.userFeedbackText').css('height','350px')
			$('.userFeedbackText').fw_Scroll({color:"#dfb302",width:10});
		}
				
		var tId= parseInt(obj.transcriptId);
		var audioUrl= pageXml.transcript[0].text[tId].path;	
		navigation.playAudioByURL(audioUrl);
		$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
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










