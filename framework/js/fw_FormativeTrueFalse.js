/*----------------------------------------
	Name: fw_FormativeMCQ.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_FormativeTrueFalse(_xml){    
	var pageXml=_xml;
	var optionButton=".formativeTrueFalse .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".ok";
	this.updatePageLayOut=updatePageLayOut;
	$('.pageText p').html(pageXml.contentText[0].text[0].Text);	
	
	//globalSettings.addTitle('.pageText',pageXml.contentText[0].text[0].Text);
	var str='';
	var totalQption=pageXml.optionContent[0].option.length;	
	var tbCnt=5;
	var selectedId="";	
	var correctAnswerArray = new Array();
	var optRow;
	var yes=pageXml.optionAnswer[0].text[0].Text;
	var no=pageXml.optionAnswer[0].text[1].Text;
	var preloadImagesArray=new Array();
	
	for(var i=0;i<totalQption;i++){
		var tbtxt=pageXml.optionContent[0].option[i].text[0].Text;
		var clr=pageXml.optionContent[0].option[i].text[0].color;
		var wd =pageXml.optionContent[0].option[i].text[0].width;
		var ht =pageXml.optionContent[0].option[i].text[0].height;
		
		var tp =pageXml.optionContent[0].option[i].text[0].top;
		var optImgWT =pageXml.optionContent[0].option[i].path[0].width;
		var optImgHT =pageXml.optionContent[0].option[i].path[0].height;
		
		if(globalPath.languageDir == 'ltr'){
		var lft=pageXml.optionContent[0].option[i].text[0].left;
		var optstyle='style="top:'+tp+';left:'+lft+';height:'+ht+';width:'+wd+';"';
		var optBgstyle='style="height:'+optImgHT+';width:'+optImgWT+';"';
		str+='<div class="opt" id="opt_'+i+'" '+optstyle+'><p class="optTop" ></p><img class="optBg" '+optBgstyle+' tabindex="'+tbCnt+'" title="" />';
		tbCnt++;
		str+='<span class="optText" tabindex="'+tbCnt+'">'+tbtxt+'</span>'
		tbCnt++;
 	    str+='<div class="optionDiv"><div class="optionRow"><div class="optionLabel" tabindex="'+tbCnt+'"><span >'+yes+'</span></div><span class="tickCross"></span>'
		tbCnt++;
		str+='<a  id="op_0_'+i+'"  tabindex="'+tbCnt+'" href="javascript:void(0);" class="optionButton" ></a></div>';
		tbCnt++;
		str+='<div class="optionRow"><div class="optionLabel" tabindex="'+tbCnt+'"><span>'+no+'</span></div><span class="tickCross"></span>'
		tbCnt++;
		str+='<a id="op_1_'+i+'"  tabindex="'+tbCnt+'" href="javascript:void(0);" class="optionButton" ></a></div></div>';
		tbCnt++;
		str+='</div>';
		userAnsArray.push(-1);
		correctAnswerArray.push(pageXml.optionContent[0].option[i].answer.split(','));
		}else{
		var rit=pageXml.optionContent[0].option[i].text[0].right;
		var optstyle='style="top:'+tp+';right:'+rit+';height:'+ht+';width:'+wd+';"';
		var optBgstyle='style="height:'+optImgHT+';width:'+optImgWT+';"';
		str+='<div class="opt" id="opt_'+i+'" '+optstyle+'><p class="optTop" ></p><img class="optBg" '+optBgstyle+' tabindex="'+tbCnt+'" title="" />';
		tbCnt++;
		str+='<span class="optText" tabindex="'+tbCnt+'">'+tbtxt+'</span>'
		tbCnt++;
 	    str+='<div class="optionDiv"><div class="optionRow"><div class="optionLabel" tabindex="'+tbCnt+'"><span >'+yes+'</span></div><span class="tickCross"></span>'
		tbCnt++;
		str+='<a  id="op_0_'+i+'"  tabindex="'+tbCnt+'" href="javascript:void(0);" class="optionButton" ></a></div>';
		tbCnt++;
		str+='<div class="optionRow"><div class="optionLabel" tabindex="'+tbCnt+'"><span>'+no+'</span></div><span class="tickCross"></span>'
		tbCnt++;
		str+='<a id="op_1_'+i+'"  tabindex="'+tbCnt+'" href="javascript:void(0);" class="optionButton" ></a></div></div>';
		tbCnt++;
		str+='</div>';
		userAnsArray.push(-1);
		correctAnswerArray.push(pageXml.optionContent[0].option[i].answer.split(','));
		}
	}
    $(".pageInstruction").attr('tabIndex',tbCnt)
	str+='<a href ="javascript:void(0);" class="a-button ok disabled" tabindex="'+(tbCnt+1)+'" ><span class="btntext"></span></a>'
	$('.optionContainer').html(str);
	//$('.formativeTrueFalse').css("background-image", "url("+pageXml.contentBackground[0].img[0].path+")");	
	if(pageXml.contentBackground !=null){
		$('.formativeTrueFalse').css("background-image", "url("+pageXml.contentBackground[0].img[0].path+")");
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
	}else{		
	}
	
	$('#opt_'+i+" .optBg").css("")
	
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);	
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	
	for(var i=0;i<totalQption;i++){
		$('#opt_'+i+" .optBg").attr('src',pageXml.optionContent[0].option[i].path[0].imgPath);
		$('#opt_'+i+" .optBg").attr('alt',pageXml.optionContent[0].option[i].path[0].Text);
	}
	updatePageLayOut();
	 updateTabIndex();
	 $("div[tabindex=1]").focus();
	 
	$(optionButton).click(function(){
		if ($(this).hasClass("disabled")) {
			return false;
		}
		$(optionButton).removeClass('showCoreect selectCoreect');
		var ptOp=$(this).parent().parent();
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
		//$('.userFeedback').attr('tabindex',(tbCnt+1));	
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);		
			
		if (userAnsArray.toString() == correctAnswerArray.toString()) {
			showFeedback(pageXml.feedback[0].correct[0]);
		}else{
			showFeedback(pageXml.feedback[0].incorrect[0]);
		}		
		
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
					//$(str).parent().find('.tickCross').addClass('tick');
					$(str).addClass('showCoreect');					
				}				
			}
		}
		return false;
	});
	
	/*
$(okButton).focusout(function() {
		$("div[tabindex=1]").focus();	
	});
*/
	
	function showFeedback(obj){		
			var str="";
			for(var i=0;i<obj.text.length;i++){
				str+="<div class='insertTab'><p>"+obj.text[i].Text+"</p></div><br />"
			}
			$('.userFeedback .userFeedback_text').html(str);	
		$('.userFeedback').show();
		$('.userFeedback').fw_Scroll({color:"#dfb302",width:10});
		var tId= parseInt(obj.transcriptId);
		var audioUrl= pageXml.transcript[0].text[tId].path;	
		navigation.playAudioByURL(audioUrl);
		$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
		templateMediator.pageVisited();
		 updateTabIndex();
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
