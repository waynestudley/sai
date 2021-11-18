/*----------------------------------------
	Name: fw_DragNDrop.js
	Developed by: sunil vetal
----------------------------------------*/
function fw_DragNDrop(_xml){  
	var pageXml=_xml;
	var normalClass = "optionNormal";
	var selectedClass = "optionSelect";
	var hoverClass ="optionHover";
	var dragClass ="optionDrag";
	var dragedClass ="optionDraged";
	var corrClass ="optionCorr";
	var incorrClass ="optionIncorr";
	var disableClass ="optionDisable";
	var initClass ="optionInitialPoss";
	
	var zIndex=0;
	this.updatePageLayOut=updatePageLayOut;

	var tbCnt=6;
	var selectedId="";	
	var str='';	
	var className=pageXml.className;
	var preloadImagesArray=new Array();
	var orginPossArr=new Array();
	var dropPossArr=new Array();
	var isPreload=false;
	var userArr=new Array();
	var corrAnsArr=new Array();
	var infoArray= new Array();
	var totDropCount=0;
	var totalQption=pageXml.dropContent[0].option.length;
	var totalDragOption=pageXml.dragContent[0].option.length;
	var okButton=".ok";
	var isExtendFeedback=false;
	
	$('.dragNDrop').addClass(className);
	
	if(pageXml.contentBackground != null && pageXml.contentBackground[0].img[0].path != ""){
		$('.panelBg').attr('src', pageXml.contentBackground[0].img[0].path);
		$('.panelBg').attr('alt',pageXml.contentBackground[0].img[0].Text);	
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
		isPreload=true;
	}else{
		$('.panelBg').remove();		
	}
	
	str="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		str+='<div class="pText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>'
	}
	$('.pageText').html(str);
	str="";	
		
	for(var i=0; i<totalQption; i++){
		
		str="";
		var optObj=pageXml.dropContent[0].option[i];
		var _optId="optDiv_"+i;
		var obj=optObj.style;
		var _optStyle=obj==null?"":obj;
		var _optClass=" dropTo_"+optObj.dropId;
		corrAnsArr.push(optObj.dropId);
		var optImgObj=optObj.optionImg[0];
		var _optImgId="optImg_"+i;
		var _optImgPath=optImgObj.path;
		var _optImgAltText=optImgObj.Text;
		var obj=optImgObj.style;
		var _optImgStyle=obj==null?"":obj;
		var _optImgClass=" optImg";
		
		var extendFeedbackBtnObj=optObj.extendFeedbackBtn;
		if(extendFeedbackBtnObj!=null){
			isExtendFeedback=true;
			infoArray.push("0");
		}
		var optTxtObj=optObj.optionText[0];
		var _optTxtId="optTxt_"+i;
		var obj=optTxtObj.style;
		var _optTxtStyle=obj==null?"":obj;
		var _optTxtClass=" optTxt";
		var _optText=optTxtObj.Text;
		
		var optDpAreaObj=optObj.optionDropArea[0];
		var _optDpAreaId="optdropArea_"+i;
		var obj=optDpAreaObj.style;
		var _optDpAreaStyle=obj==null?"":obj;
		var _optDpAreaClass=" optdropArea";
		
		var optTickObj=optObj.tick[0];
		var _optTickId="optTick_"+i;
		var obj=optTickObj.style;
		var _optTickStyle=obj==null?"":obj;
		var _optTickClass=" optTick";
		
		str+='<div id="'+_optId+'" class="optDiv" val="'+_optClass+'" style="'+_optStyle+'">';
		if(_optImgPath!=null && _optImgPath!=""){
			str+='<img id="'+_optImgId+'" class="'+_optImgClass+'" style="'+_optImgStyle+'" src="'+_optImgPath+'" alt="'+_optImgAltText+'"/>';
			preloadImagesArray.push(_optImgPath);	
			isPreload=true;
		}
		str+='<div id="'+_optTxtId+'" class="'+_optTxtClass+'" style="'+_optTxtStyle+'"><span class="optText">'+_optText+'</span></div>';
		
		
		if(isExtendFeedback){			
			var _optExFeedId="optExfeedBtn_"+i;
			var obj=extendFeedbackBtnObj[0].style;
			var _optExFeedStyle=obj==null?"":obj;
			var _optExFeedClass=" optExfeedBtn";
			str+='<a href="javascript:void(0);" id="'+_optExFeedId+'" class="'+_optExFeedClass+'" style="'+_optExFeedStyle+'"></a>';
		}
		str+='</div>'
		str+='<div id="seprator_'+i+'" class="seprator"></div>';
		str+='<div id="'+_optDpAreaId+'" class="'+_optDpAreaClass+'" style="'+_optDpAreaStyle+'"></div>';
		
		str+='<div id="'+_optTickId+'" class="'+_optTickClass+'" style="'+_optTickStyle+'"></div>';
	
		$('.optionContainer').append(str);
	}
	
	var okBtnObj=pageXml.buttonText[0].text[0];	
	var obj=okBtnObj.style;
	var _okBtnStyle=obj==null?"":obj;
	var _okBtnText=okBtnObj.Text;
	str='<a href="javascript:void(0);" class="a-button ok disabled" style="'+_okBtnStyle+'"><span class="btntext">'+_okBtnText+'</span></a>';
	$('.optionContainer').append(str);	
	
	str="";
	for(var j=0;j<totalQption;j++){
		userArr.push("-1");
		
		for(var k=0;k<totalDragOption;k++){
			str="";
			var _obj=pageXml.dragContent[0].option[k];
			var _id="dragOpt_"+j+"-"+k;
			var _cl=initClass+" dragOpt_"+k;
			var _class=" dropTo_"+_obj.dropId;
			var objstyle=_obj.style;
			var _style=objstyle==null?"":objstyle;
			var _txt=_obj.optionText[0].Text;
			
			str='<a id="'+_id+'" class="optDrag '+_cl+'" val="'+_class+'" style="'+_style+'"><span class="dragOpTxt">'+_txt+'</span></a>'			
			$('.optionContainer').append(str);
			
		}
		
	}		
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	$(".pageInstruction").attr('tabIndex',tbCnt)
	navigationEvent.updateGlobleFocus(tbCnt++);
	updatePageLayOut();
	$("div[tabindex=1]").focus();
	
	function updatePageLayOut(){	 
	}	
	
	if(isPreload){
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
					   createDropPossArr();
					   createOrginPossArr();
					   addEvent();
					// templateMediator.pageVisited();
				}catch(err){}
			}
		});		
	}else{
		templateMediator.templateLoadComplete();
		$("div[tabindex=1]").focus();
		createDropPossArr();
		createOrginPossArr();
		addEvent();
	}
	function addEvent(){
		 $('.optDrag').bind({
			 click: function() {
				//$(this).addClass(selectedClass);
			  },
			  mouseenter: function() {
				if($(this).hasClass(disableClass)){return false;}
				$(this).addClass(hoverClass);
				$(this).removeClass(normalClass);
			  },
			  mouseleave: function() {
				$(this).addClass(normalClass);
				$(this).removeClass(hoverClass);
			  }
		 })
		  
		
		 $('.optDrag').draggable({  
				revert: false,  
				stack: ".optionContainer",
				containment: "parent", 
				scroll: false,
				start: function( event, ui ) {
					var prevDrop=$(this).attr("prevDrop");
					if(prevDrop!=null && prevDrop!=""){
						$('#'+prevDrop).removeClass("disable");
						var _prevDropId=$('#'+prevDrop).attr('id').split("_")[1];
						userArr[_prevDropId]="-1";
						ui.helper.removeClass(dragedClass);
					}					
					ui.helper.removeClass(initClass);
					ui.helper.addClass(hoverClass);
					ui.helper.addClass(dragClass);
					zIndex++;
					ui.helper.css('z-index',zIndex);
					
				},
				stop: function( event, ui ) {
				var isDrop=$(this).hasClass(dragedClass);
				if(!isDrop){
					$(this).attr("prevDrop","");					
					var _dragId=ui.helper.attr('id').split("_")[1];
					var _pid=_dragId.split("-")[0];
					var _id=_dragId.split("-")[1];
					ui.helper.addClass(initClass);
					DragDivOriginPoss(_pid, _id);
					checkOkBtn();
				}	
				}
			});				

		
		$('.optDiv').droppable({ 		
		 accept: '.optDrag',
		 tolerance: 'intersect',	
		 drop: function( event, ui ) {
				
				var _dragId=ui.helper.attr('id').split("_")[1];
				var _pid=_dragId.split("-")[0];
				var _id=_dragId.split("-")[1];
				
				var dropVal=$(this).attr("val");				
				var dragVal=ui.helper.attr('val');
				var _dropId=$(this).attr('id').split("_")[1];
				var temp=dragVal.split("_")[1];				
							
				var t=$(this).hasClass("disable");
				$(this).addClass("disable");
				
				if(t){
					//DragDivOriginPoss(_pid, _id);
					return false;
				}else{
					ui.helper.removeClass(dragedClass);
					ui.helper.removeClass(initClass);
					ui.helper.addClass(dragedClass);						
					ui.helper.attr('prevDrop',$(this).attr('id'));
					userArr[_dropId]=temp;
					setPossition(ui.helper, _dropId, dropPossArr);
					checkOkBtn();
				}	
									
			}				
		 });
		 $(okButton).click(function(){
			if ($(this).hasClass("disabled")) {
				return false;
			}
			$(this).addClass("disabled");
			$( ".optDrag" ).draggable( "disable" );
			$( ".optDrag" ).addClass(disableClass);
			$( ".optDrag" ).css('z-index','0');
			$('.optDrag.'+initClass).hide();
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			var corrCnt = 0;
			var incorrCnt=0;
			for (var i = 0; i < totalQption; i++) {
				if(userArr[i]==corrAnsArr[i]){
					$('#optTick_'+i).addClass('tick');
					corrCnt++;
				}else{
					$('#optTick_'+i).addClass('cross');
					incorrCnt++;
				}
			}
			if(isExtendFeedback){
				navigationEvent.updateNextPagePopupText();
				$('.optExfeedBtn').show();
			}
			if(corrCnt==totalQption){
				showFeedback(pageXml.feedback[0].correct[0]);
			}else if(corrCnt>0){
				if(pageXml.feedback[0].partial!=null){
				showFeedback(pageXml.feedback[0].partial[0]);	
				}else{
					showFeedback(pageXml.feedback[0].incorrect[0]);		
				}
			}else{
				showFeedback(pageXml.feedback[0].incorrect[0]);		
			}
		})
		$('.optExfeedBtn').click(function(){
			if ($(this).hasClass("disabled")) {
				return false;
			}
			$('.optExfeedBtn').removeClass("disabled");
			$(this).addClass("disabled");
			var _id=$(this).attr('id').split("_")[1];
			upadteOptInfo(_id);
		})
			$('.close_info').click(function(){
				$('.infoContainer').hide();
				$('.userFeedback').show();	
				$('.optExfeedBtn').removeClass("disabled");
		});
	}	
	
		
	 function checkOkBtn(){
		if(userArr.toString().indexOf("-1")==-1){
			$(okButton).removeClass('disabled');
			disableDrag(true);
		}else{
			$(okButton).addClass('disabled');
			disableDrag(false);
		}
	 }

	 function disableDrag(_str){
		if(_str){
			$('.optDrag').each(function() {
			  var _initClass=$(this).hasClass(initClass);
			  if(_initClass){
				$(this).addClass(disableClass);
				$(this).draggable( "disable" );
			  }
			});
		}else{
			$('.optDrag').removeClass(disableClass);
			$( ".optDrag" ).draggable( "enable" );
		}
	 }
	 
	 function setPossition(_mc, _num, _arr){		
			var nLeft=_arr[_num][0];
			var nTop=_arr[_num][1];
			$(_mc).animate({left: nLeft,top: nTop},"slow", function(){
			});	
	 } 
	 function createDropPossArr(){
		 for(var i=0;i<totalQption;i++){
			dropPossArr[i]=new Array();
			var dropPosition = $('#optdropArea_'+i).position();
			var OptLeft=dropPosition.left;
			var OptTop=dropPosition.top;
			dropPossArr[i][0]=OptLeft;
			dropPossArr[i][1]=OptTop;
		 }
	 }

	function createOrginPossArr(){
		for(var j=0;j<totalDragOption;j++){
			orginPossArr[j]=new Array();
			var position = $('.dragOpt_'+j).position();
			orginPossArr[j][0]=position.left;
			orginPossArr[j][1]=position.top;
		}		
	 }
	 
	 function DragDivOriginPoss(_pId, _id){	
		var _curr=$("#dragOpt_"+_pId+"-"+_id);
		_curr.removeClass(selectedClass);
		_curr.removeClass(hoverClass);
		_curr.removeClass(dragClass);			
		_curr.animate({left: orginPossArr[_id][0],top: orginPossArr[_id][1]},"slow", function(){
		
		});				
	 }
	 function showFeedback(obj){
			var str="";			
			for(var i=0;i<obj.text.length;i++){
				if(i == obj.text.length-1){
				str+="<div class='insertTab' style='margin-bottom:0px;'><p>"+obj.text[i].Text+"</p></div>";
				}else{
				str+="<div class='insertTab'><p>"+obj.text[i].Text+"</p></div>";
				}
			}
			$('.userFeedback .userFeedbackText .textContainer').html(str);


		
			var objstyle=pageXml.feedback[0].style;
			var _style=objstyle==null?"":objstyle;			
			$('.userFeedback').attr('style',_style);	
			$('.userFeedback').show();	
			
			var _ht=$('.userFeedback .userFeedbackText').parent().height();
			$('.userFeedback .userFeedbackText').css('height', _ht+'px');
			$('.textContainer').css('height','auto');
			if($('.textContainer').outerHeight() > $('.userFeedbackText').outerHeight()){	
				$('.userFeedback .userFeedbackText').fw_Scroll({color: "#0057A6", width: 10 });
			}
			
			var tId= parseInt(obj.transcriptId);
			var audioUrl= pageXml.transcript[0].text[tId].path;	
			navigation.playAudioByURL(audioUrl);
			$.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
			if(!isExtendFeedback){
				pageComplete();
			}
	 }
	 function pageComplete(){				
		templateMediator.pageVisited();			
	 }

	 function upadteOptInfo(_id){
		$('.userFeedback').hide();			
		infoArray[_id] = "1";
		var str="";
		for(var i=0;i<pageXml.optionInfo[0].option[_id].text.length;i++){
			if(i == pageXml.optionInfo[0].option[_id].text.length-1){
				str+="<div class='insertTab' style='margin-bottom:0px;'><p>"+pageXml.optionInfo[0].option[_id].text[i].Text+"</p></div>";
			}else{
				str+="<div class='insertTab'><p>"+pageXml.optionInfo[0].option[_id].text[i].Text+"</p></div>";
			}
		}		
		$('.infoContainer .infoText').html("<div class='insertTabDiv'>"+str+"</div>");
		var objstyle=pageXml.optionInfo[0].style;
		var _style=objstyle==null?"":objstyle;			
		$('.infoContainer').attr('style',_style);
		
		var objstyle=pageXml.optionInfo[0].option[_id].optionArrow[0].style;
		var _style=objstyle==null?"":objstyle;			
		$('.infoContainer .infoArrow').attr('style',_style);
					
		$('.infoContainer').show();
		var _ht=$('.infoText').parent().height()-23;
		$('.infoText').css('height', _ht+'px');
		$('.infoText').css('padding', '0px');
		$('.infoText').css('margin', '10px 5px 10px 10px');
		$('.insertTabDiv').css('height','auto');
		if($('.insertTabDiv').outerHeight() > $('.infoText').outerHeight()){			
			$('.infoContainer .infoText').fw_Scroll({color: "#0057A6", width: 10 });
		}
		
		if(infoArray.toString().indexOf("0")<0){
			pageComplete();	
		}			
	}
	
}
