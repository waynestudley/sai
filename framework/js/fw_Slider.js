/*----------------------------------------
	Name: fw_Slider.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_Slider(_xml){    
	var pageXml=_xml;
	var prePath1="";
	this.updatePageLayOut=updatePageLayOut;
	var SlideButton=".slideButton";
	var slideArray= new Array();
	var slideLocalArray= new Array();	
	var slideInfoArray= new Array();	
	$('.pageText p').html(pageXml.contentText[0].text[0].Text);
	var marL=pageXml.contentText[0].text[0].marginLeft;
	var marT=pageXml.contentText[0].text[0].marginTop;
	$('.pageText p').css({'margin-left':marL,'margin-top':marT });
	var totalSlides=pageXml.sliderContent[0].slideOption.length;
	var slideCnt=1;
	var tbCnt=6;
	var userAnsArray= new Array();
	var str='';
	var topLable='';
	var okButton=".ok";
	var isInfo=true;
	var isUserAns=false;
	var lmsData=navigationData.getCurrentPageData();
	var preloadImagesArray=new Array();
	var className=pageXml.className;
	var parentClass='.slider';
   	$(parentClass).addClass(className);
	if(globalPath.languageDir == 'ltr')
	{
		var dragPart = [0, 126, 254];
	}else{
		var dragPart = [0, -126, -254];
	}
	
	var cntLen=pageXml.slidTopLable[0].lableText.length;	
	var correctAnswerArray=pageXml.sliderContent[0].answer.split(',');
	var flag=false;
	if(cntLen>0){
		for(var c=0;c<cntLen;c++){
			var cln="etext"+c;		
			var topLable='<div id="'+cln+'" class="posAB" ><p>'+pageXml.slidTopLable[0].lableText[c].Text+'</p><div class="arrImg"></div></div>'
			$('.sliderContainer').append(topLable);
			setStyle("#"+cln,pageXml.slidTopLable[0].lableText[c]);
		}	
	}	
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	if (lmsData != "") {		
		slideArray = lmsData.split('^');
	}else{
		for (var i = 0; i < totalSlides; i++) {
			slideArray.push(0);
		}
	}
	for (var i = 0; i < totalSlides; i++) {
		slideLocalArray.push(0);
		slideInfoArray.push(0);
	}
	for(var i=0;i<totalSlides;i++){	
		userAnsArray.push(0);
		var slideText=pageXml.sliderContent[0].slideOption[i].slideText[0].Text;
		var riskBtnText=pageXml.riskBtnLable[0].lableText[0].Text;
		str+='<div class="slideOption'+(i+1)+' slideButtonCont clearfix">';
		str+='<div tabindex="'+tbCnt+'" class="slideButton" id="slideBtn_'+(i+1)+'">';
		str+='<table class="slideButtonContainer"><tr><td class="slideButtonText">'+slideText+'</td><td class="slideButtonImg"><div class="bgImage" ><div class="container"><a class="sliderImg" href="javascript:void(0)" id="slideImg_'+(i)+'"></a></div></div><div class="riskContainer"><a id="riskBtn_'+i+'" class="sliderRiskImg" href="javascript:void(0)" ><p>'+riskBtnText+'</p></a></div></td></tr></table></div></div>';	
		tbCnt++;
 	}
	var btnText=pageXml.buttonText[0].text[0].Text;
	 str+='<a href="javascript:void(0);" class="a-button ok disabled" title="" tabindex="'+tbCnt+'" ><span class="btntext">'+btnText+'</span></a>'	
	$('.sliderContent').html(str);

	if(preloadImagesArray.length>=1){
		$.imgpreload(preloadImagesArray,{each: function(){},all: function(){onLoadAllImages();}});	
	}else{
		onLoadAllImages();	
	}
	
			
	function updatePageLayOut(){}
	function onLoadAllImages(){
		try{
				templateMediator.templateLoadComplete();				
				initDrager();
			}catch(err){}
	}
	

	function initDrager(){	
		$('.sliderImg').click( function() {
			if($(this).hasClass('dragInit'))return false;
			$(this).addClass('dragInit');
			var leftVal=$(this).css('left').split('px')[0];
			if(globalPath.languageDir == 'ltr'){
				if(leftVal<0){
				$(this).animate({left : "0px",top : "0px"}, 500);
				updateDrag($(this).attr('id'));
				}
			}else{				
				if(leftVal>0){
				$(this).animate({left : "0px",top : "0px"}, 500);
				updateDrag($(this).attr('id'));
				}
			}
			
		});
		
		$(".sliderImg").draggable({
			axis : 'x',		
			containment : 'parent',
			drag : function() {
			},
			revert: function(dropped,ui){ 
				var leftVal=$(this).css('left').split('px')[0];
				var lf=closest(dragPart,leftVal );	
				$(this).data("draggable").originalPosition={left: lf+'px',top:'0px'};
				updateDrag($(this).attr('id'));
				return !dropped;
			},
			stop : function(event, ui) {				
			}
		});
		$('.sliderRiskImg').click(function(){
			var imgId=$(this).attr('id');
			if($(this).hasClass('disabled')) return false;
			
			$('.sliderRiskImg').removeClass('disabled');
			$(this).addClass('disabled');
			upadteOptInfo(imgId);
		});
		$('.slideClose_info').click(function(){
			$('.slideInfoContainer,.slideInfoArrow').hide();
			$('.sliderRiskImg').removeClass('disabled');
			$('.userFeedback').show();
			updateTabIndex();
		});
		
		$(okButton).click(function(){
			
			isUserAns=true;
			if($(this).hasClass('disabled'))
			return false;
			$(okButton).addClass('disabled');
			checkSliderPos();
			var xmlObj;				
			if (userAnsArray.toString() == correctAnswerArray.toString()) {
				xmlObj=pageXml.feedback[0].correct[0];
				showFeedback(xmlObj);
			}else{
				xmlObj=pageXml.feedback[0].incorrect[0];
				showFeedback(xmlObj);				
			}
			navigationEvent.updateNextPagePopupText();
			$('.riskContainer').show();
			$(".sliderImg").draggable( "destroy");
			$(".sliderImg").css('cursor','default');		
		})
		$('.userFeedback').hide();
		$('.riskContainer').hide();
	}
	
	function checkSliderPos(){
		$('.slideButtonImg .container .sliderImg').each(function(){
			var lft=parseInt($(this).css('left'));
			var id =	parseInt($(this).attr('id').split('_')[1])
			for(var i=0;i<=dragPart.length;i++){	
				
				if(lft==dragPart[i]){
					userAnsArray[id] = i;
				}				
			}
		});
		
	}
	function showFeedback(obj){
		var str="";
			for(var i=0;i<obj.text.length;i++){
				str+="<div class='insertTab'><p>"+obj.text[i].Text+"</p></div>"
			}
			$('.userFeedback').html(str);
			$('.userFeedback').show();	
		
			var tId= parseInt(obj.transcriptId);
			var audioUrl= pageXml.transcript[0].text[tId].path;	
			//alert(audioUrl)
			navigation.playAudioByURL(audioUrl);			
			$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			
			//templateMediator.pageVisited();					
			updateTabIndex();
			setStyle($('.userFeedback'),obj);
	}
	function updateDrag(_Id){
		$('#'+_Id).css('background-position','-385px -20px');
		var id=parseInt(_Id.split('slideImg_')[1]);		
		slideLocalArray[id]=1;
		slideArray[id]=1;		
		if(slideLocalArray.toString().indexOf('0')>=0){
			disabledButton(okButton);
		}else{
			enabledButton(okButton);			
		}
		
	}
	function closest(array,num){
		var i=0;
		var minDiff=1000;
		var ans;
		for(i in array){
			 var m=Math.abs(num-array[i]);
			 if(m<minDiff){ 
					minDiff=m; 
					ans=array[i]; 
				}
		  }
		return ans;
	}
	function updateLMSData(){
		var tempData=slideArray.join("^");
		navigationData.updateCurrentPageData(tempData);
	}	
	function upadteOptInfo(_id){
		$('.slideInfoArrow').show();
		$('.userFeedback').hide();
		var opid= parseInt(_id.split('riskBtn_')[1]);
		slideInfoArray[opid] = 1;
		var ht=0;
		ht = $('.slideOption'+(opid+1)).height();			
		var pt = $('.slideOption'+(opid+1)).position().top;
		var padding =10;
		var tp = pt + (ht/2)+($('.slideInfoArrow').height()/2)-padding;
        if(globalPath.languageDir == "ltr"){
		var aleft =$('.sliderContent').position().left+$('.sliderContent').width()+getNumber($('.sliderContent').css('margin-left'));
		$('.slideInfoArrow').css({'top':tp+'px',left:aleft+'px'});
		} else {
		var aright =$('.sliderContent').width()+getNumber($('.sliderContent').css('margin-right'));
		$('.slideInfoArrow').css({'top':tp+'px',right:aright+'px'});
		}
		var str="";
		for(var i=0;i<pageXml.sliderInfo[0].slideText[opid].text.length;i++){
			str+="<div class='insertTab'><p>"+pageXml.sliderInfo[0].slideText[opid].text[i].Text+"</p></div>"
		}
		//this is for scroll remove
		$('.popupText').html('');
		var _str='<div class="slideInfoText"></div>'
		$('.popupText').html(_str);
		//--
		$('.slideInfoContainer .slideInfoText').html(str);
		$('.slideInfoContainer').show();
		setStyle($('.slideInfoContainer'),pageXml.sliderInfo[0].slideText[opid]);
		
		if($('.slideInfoText').outerHeight() > $('.popupText').outerHeight()){
			$('.popupText').fw_Scroll({color:"#0057a6",width:10});
		}
		updateTabIndex();
		if(slideInfoArray.toString().indexOf("0")<0){
			templateMediator.pageVisited();	
		}
	}
	function enabledButton(_button){
		$(_button).removeClass('disabled');	
	}
	function disabledButton(_button){
		$(_button).addClass('disabled');
		//$(_button).css('cursor','default');
	}
	function setStyle(obj,_xml){
		var clr=_xml.color;
		var fts=_xml.fontSize;
		var ftw=_xml.fontWeight;
		var txtA=_xml.textAlign;
		var wd =_xml.width;
		var ht =_xml.height;
		var lft=_xml.left;
		var rgt=_xml.right;
		var tp =_xml.top;
		var padding =_xml.padding;
		if(globalPath.languageDir == 'ltr'){
			$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding});
		} else{
			$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding});
			}
	}
	function updateTabIndex(){
		$('.insertTab').removeAttr('tabindex');
			if($('.slideInfoContainer').is(':visible')){
				tbCnt++	;
				$('.infoText').attr('tabindex',tbCnt);
				tbCnt++	;
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
