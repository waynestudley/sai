/*----------------------------------------
	Name: fw_DragNDrop.js
	Developed by: sunil vetal
----------------------------------------*/
function fw_DragNDrop1(_xml){  
	var pageXml=_xml;
	var normalClass = "optionNormal";
	var selectedClass = "optionSelect";
	var hoverClass ="optionHover";
	var dragClass ="optionDrag";
	var corrClass ="optionCorr";
	var incorrClass ="optionIncorr";
	var disableClass ="optionDisable";
	var disabled ="disabled";
	var dArea0="dArea0";
	var dArea1="dArea1";
	var dArea2="dArea2";
	var drop0Count=0;
	var drop1Count=0;
	var drop2Count=0;
	var correctCnt=0;
	var zIndex=0;
	this.updatePageLayOut=updatePageLayOut;

	
	var cntLen=pageXml.contentText[0].text.length;	
	var tbCnt=6;
	var selectedId="";	
	var str='';	
	var showBtmIcon=false;
	var preloadImagesArray=[];
	
	var dropArray0 = [];
    var dropArray1 = [];
    var dropArray2 = [];
    
	var orginPossArr=[];
	var drop0PossArr=[];
	var drop1PossArr=[];
	var drop2PossArr=[];
	var isPreload=false;
	var userArr=[];
	var totDropCount=0;
	var totalQption=pageXml.optionContent[0].option.length;
	var randomOptArr=createRandomizeArr(totalQption);
	var correctAnswerArray = [];
	var userArray = [];
	var okBtn='.dragNDrop1 .submit';
	var tryAgainBtn='.dragNDrop1 .tryAgain';
	var showAnsBtn='.dragNDrop1 .showAns';
	var attempt=0;
	var maxAttempt=2;
	var mxdropArr=[];
	var isTryAgainAvl=false;
	var isShowAnsAvl=false;
	
	var className= pageXml.className;
	var tempType= pageXml.type;
	
	$('.dragNDrop1').addClass(tempType);
	$('.dragNDrop1').addClass(className);
	
	
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
	var _mxAttempt=pageXml.maxAttempt;
	if(_mxAttempt!=null && _mxAttempt!=""){
		maxAttempt=_mxAttempt;
	}
	/************************/
	
	
	if(pageXml.contentBackground != null){
		//$('.panelBg').attr('src', pageXml.contentBackground[0].img[0].path);
		$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
	//	$('.panelBg').attr('alt',pageXml.contentBackground[0].img[0].Text);	
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
		isPreload=true;
	}else{
		$('.panelBg').remove();		
	}
	/*******************/
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
	if(pageXml.mainContentHolder!=null){
		var RPCstyle= pageXml.mainContentHolder[0].style||''; 
		$('.pageConHolder').attr('style',RPCstyle);
	}
	/*******************/
	
	for(var c=0;c<cntLen;c++){
		var cln="etext"+c;	
		var txtStyle= pageXml.contentText[0].text[c].style || '';
		str='<div id="'+cln+'" style="'+txtStyle+'" tabindex="'+tbCnt+'">'+pageXml.contentText[0].text[c].Text+'</div>';		
		$('.pageText').append(str);
		tbCnt++
	}	
	
	var labelLen=pageXml.labelText[0].text.length;
	
	for(var j=0;j<labelLen;j++){
		var lb="labelBG"+j;	
		var cln="labeltxt"+j;	
		var str1='<div id="'+lb+'" class="labelBackgn" ><div id="'+cln+'" class="labelText" tabindex="'+tbCnt+'" style="'+pageXml.labelText[0].text[j].style+'" ><p>'+pageXml.labelText[0].text[j].Text+'</p></div></div>'			
			$('.labelContainer').append(str1);
			tbCnt++
	}
	
	if(pageXml.optionContent[0].lable!=null){
		$('.optionContainer').append('<div class="optionConLable" style="'+pageXml.optionContent[0].lable[0].style+'">'+pageXml.optionContent[0].lable[0].Text+'</div>');
	}
	
	for(var j=0;j<totalQption;j++){
		userArray.push(-1);
		var _currId=randomOptArr[j];
		var cln="option_"+_currId;	
		var tick="optTick_"+_currId;	
		var dropId=pageXml.optionContent[0].option[_currId].option[0].dropId;
		
		var dropOrgId=pageXml.optionContent[0].option[j].option[0].dropId;
		correctAnswerArray.push(dropOrgId);
		var cs="";
		if(dropId=="0"){
			cs=" dropToZero"
		}else if(dropId=="1"){
			cs=" dropToOne"
		}else{
			cs=" dropToTwo"
		}
		var str2='<a id="'+cln+'" class="dragOption optionDargText '+normalClass+cs+'" tabindex="'+tbCnt+'"><div class="tickCross '+tick+'"></div><span class="opTxt">'+pageXml.optionContent[0].option[_currId].option[0].Text+'</span></a>';
		
			$('.optionContainer').append(str2);
			//--need to work on that this is basic
			setStyle("#"+cln,pageXml.optionContent[0].option[j].option[0]);
			tbCnt++;
     }
		
		var dropConObj = pageXml.dropContainer[0];
		var dropConStyle = dropConObj.style==null?'':dropConObj.style;
		$(".dropContainer").attr('style',dropConStyle);
		
		for(var i=0;i<dropConObj.dropArea.length;i++){
			var mxdrop=dropConObj.dropArea[i].maxDrop;
			if(mxdrop!=null && mxdrop!=""){
				mxdropArr[i]=mxdrop;
			}else{
				mxdropArr[i]="all"
			}
			var dropAreaStyle=dropConObj.dropArea[i].style==null?'':dropConObj.dropArea[i].style;
			
			var str3 = '<div id="dropArea_'+i+'" class="droppablearea" style="'+dropAreaStyle+'"><div class="dropAreaTextCon"><span class="dropAreaText" >'+dropConObj.dropArea[i].Text+'</span></div></div>';
			$(".dropContainer").append(str3);
		}
		
		var submitBtnObj= pageXml.buttonText[0].text[0];
		var btnTxt=submitBtnObj.Text;
		var btnStyle=submitBtnObj.style || "";
		$(".dragContainer ").append('<a href="javascript:void(0);" class="a-button ok submit disabled" tabindex="" style="'+btnStyle+'"><span class="btntext">'+btnTxt+'</span></a>');
		
		if(pageXml.buttonText[0].text[1]!=null){	
			if(pageXml.buttonText[0].text[1].Text!=""){
				var tryAginBtnObj= pageXml.buttonText[0].text[1];
				var btnTxt=tryAginBtnObj.Text;
				var btnStyle=tryAginBtnObj.style || "";
				$(".dragContainer ").append('<a href="javascript:void(0);" class="a-button ok tryAgain disabled" tabindex="" style="'+btnStyle+'"><span class="btntext">'+btnTxt+'</span></a>');
				isTryAgainAvl=true;
			}			
		}
		if(pageXml.buttonText[0].text[2]!=null){	
			if(pageXml.buttonText[0].text[2].Text!=""){
				var showAnsBtnObj= pageXml.buttonText[0].text[2];
				var btnTxt=showAnsBtnObj.Text;
				var btnStyle=showAnsBtnObj.style || "";
				$(".dragContainer ").append('<a href="javascript:void(0);" class="a-button ok showAns disabled" tabindex="" style="'+btnStyle+'"><span class="btntext">'+btnTxt+'</span></a>');
				isShowAnsAvl=true;
			}			
		}
		
		var labelTextStyle = pageXml.labelText[0].style ||'';
		$(".labelContainer .labelBackgn").attr('style',labelTextStyle);
		
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
					// templateMediator.pageVisited();
						addEvents();
				}catch(err){}
			}
		});		
	}else{
		templateMediator.templateLoadComplete();
		$("div[tabindex=1]").focus();
		createDropPossArr();
		createOrginPossArr();
		addEvents();
	}
	/**
 * @function addEvent
 * @description This function is used to add tab Events. 	
 */
    function addEvents() {
		$('.dragOption').draggable({         
            stack: ".optionContainer",
            zIndex: 1500,
            containment: ".dragContainer",
            scroll: false,
            start: function(event, ui) {
               var _id=$(this).attr('id').split("_")[1];
			   userArray[_id] = -1;
				if($(this).data('dropedIn')==0){
					$(this).data('dropedIn',-1);
					var dropedLoc=$(this).data('dropedLoc');					
					dropArray0.splice(dropedLoc,1);
					resetPosition(dropArray0,drop0PossArr);
					drop0Count--;
				}else if($(this).data('dropedIn')==1){
					$(this).data('dropedIn',-1);
					var dropedLoc=$(this).data('dropedLoc');					
					dropArray1.splice(dropedLoc,1);
					resetPosition(dropArray1,drop1PossArr);
					drop1Count--;
				}
			   
			    ui.helper.addClass(hoverClass);
                ui.helper.addClass(dragClass);
				zIndex++;
				$('.dragOption').css('z-index',0);				
				ui.helper.css('z-index',zIndex);	
				checkSubmit();	
            },
			revert: function(dropped){ 
			if(!dropped){	
				var _id=$(this).attr('id').split("_")[1];				
				DragDivOriginPoss(_id);	
				return false;
			}
			return !dropped;
			}
        });
		function resetPosition(arr,dropPossArr, _speed){
			var speed="slow";
			 if(_speed!==undefined){
				 speed=_speed;
			 }
			var count=0;			
			for(var i=0;i<arr.length;i++){				
				arr[i].data('dropedLoc',i);	
				setPossition(arr[i], count, dropPossArr, false, speed);
				count++;				
			}		
		}
        $('#dropArea_0').droppable({
            accept: '.dragOption',
            tolerance: 'intersect',
            drop: function(event, ui) {
				var _id=ui.helper.attr('id').split("_")[1];
				var dpId=$(this).attr('id').split('_')[1];
				if(ui.helper.data('dropedIn')==0){	
					drop0Count--;
				}else if(ui.helper.data('dropedIn')==1){	
					drop1Count--;
				}
				
				var maxLimit=mxdropArr[dpId];
				var isDrop=false;
				
				if(maxLimit=="all" || maxLimit==""){
					isDrop=true;
				}else if(drop0Count< parseInt(maxLimit)){
					isDrop=true;
				}else if(drop0Count>= parseInt(maxLimit)){
					isDrop=false;
				}
				if(isDrop){	
					ui.helper.data('dropedIn',0);
					userArray[_id] = dpId;
					dropArray0.push(ui.helper);
					for(var i=0;i<dropArray0.length;i++){
						dropArray0[i].data('dropedLoc',i);
					}									
					setPossition(ui.helper, drop0Count, drop0PossArr, false);
					drop0Count++;	
				}else{
					DragDivOriginPoss(_id);
				}
            }
        });

        $('#dropArea_1').droppable({
            accept: '.dragOption',
            tolerance: 'intersect',
            drop: function(event, ui) {
				var _id=ui.helper.attr('id').split("_")[1];
				var dpId=$(this).attr('id').split('_')[1];
				if(ui.helper.data('dropedIn')==0){	
					drop0Count--;
				}else if(ui.helper.data('dropedIn')==1){	
					drop1Count--;
				}
				
				var maxLimit=mxdropArr[dpId];
				var isDrop=false;				
				if(maxLimit=="all" || maxLimit==""){
					isDrop=true;
				}else if(drop1Count< parseInt(maxLimit)){
					isDrop=true;
				}else if(drop1Count>= parseInt(maxLimit)){
					isDrop=false;
				}
				if(isDrop){	
					ui.helper.data('dropedIn',1);
					userArray[_id] = dpId;
					dropArray1.push(ui.helper);
					for(var i=0;i<dropArray1.length;i++){
						dropArray1[i].data('dropedLoc',i);
					}					
					setPossition(ui.helper, drop1Count, drop1PossArr, false);
					drop1Count++;
				}else{
					DragDivOriginPoss(_id);
				}
            }
        });

		 $(okBtn).bind({
            click: function() {
                if ($(this).hasClass(disabled)) {
					return false;
				}
				$(this).addClass(disabled);				
				$(this).css('display','none');
				$('.dragOption').addClass(disableClass);
				$('.dragOption').draggable( "disable" );
				showCorrIncorrect();				
				if (correctAnswerArray.toString() === userArray.toString()) {
					$('.feedbackContainer').addClass('corrFeedback');
					showFeedback(pageXml.feedback[0].correct[0]);
					pageComplete();
				} else if(parseInt(attempt)<parseInt(maxAttempt)) {
					$('.feedbackContainer').addClass('inCorrFeedback');
					showFeedback(pageXml.feedback[0].incorrect[0]);
					if(isTryAgainAvl){
						$(tryAgainBtn).removeClass(disabled);
						$(tryAgainBtn).css('display','table');
						pageInstruction.updateText(pageXml.instructionText[0].text[2].Text);
					}else{
						pageComplete();
					}
					
				}else{					
					$('.feedbackContainer').addClass('inCorrFeedback');
					showFeedback(pageXml.feedback[0].incorrect[0]);	
					if(isShowAnsAvl){
						$(showAnsBtn).removeClass(disabled);
						$(showAnsBtn).css('display','table');
						pageInstruction.updateText(pageXml.instructionText[0].text[3].Text);
					}else{
						pageComplete();
					}					
				}				
            }           
        });
		$(tryAgainBtn).bind({
            click: function() {
				pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
                if ($(this).hasClass(disabled)) {
					return false;
				}
				$('.optionConLable').show();
				$(okBtn).addClass(disabled);				
				$(okBtn).css('display','none');
				$('.feedbackContainer').hide();
				$('.feedbackContainer').removeClass('corrFeedback').removeClass('inCorrFeedback');	
				$(showAnsBtn).css('display','none');
				
				$(this).addClass(disabled);
				$(this).css('display','none');
				
				attempt++;
				/* console.log("--------BEFORE--------");
				console.log("drop0Count: "+drop0Count);
				console.log("drop1Count: "+drop1Count);
				
				console.log("dropArray0: "+JSON.stringify(dropArray0));
				console.log("dropArray1: "+JSON.stringify(dropArray1));
				console.log("dropArray2: "+JSON.stringify(dropArray2));
				
				console.log("correctAnswerArray: "+correctAnswerArray);
				console.log("userArray: "+userArray); */
				if(attempt==1){	
					drop0Count = 0;
					drop1Count = 0;
					
					dropArray0=[];
					dropArray1=[];
					dropArray2=[];
					
					userArray = [];            
					for (var j = 0; j < totalQption; j++) {
						DragDivOriginPoss(j);
						$('#option_'+j).data('dropedIn',-1);				
					}
					$('.dragOption').removeClass(disableClass);
					$('.dragOption').draggable( "enable");
				}else{
					$('.dragOption').each(function(i){
						var _id=$(this).attr('id').split("_")[1];
						if (correctAnswerArray[_id] != userArray[_id]) {
							
							userArray[_id] = -1;
							DragDivOriginPoss(_id, "fast");
							
							if($(this).data('dropedIn')==0){
								$(this).data('dropedIn',-1);
								var dropedLoc=$(this).data('dropedLoc');					
								dropArray0.splice(dropedLoc,1);
								resetPosition(dropArray0,drop0PossArr, "fast");
								drop0Count--;
							}else if($(this).data('dropedIn')==1){
								$(this).data('dropedIn',-1);
								var dropedLoc=$(this).data('dropedLoc');					
								dropArray1.splice(dropedLoc,1);
								resetPosition(dropArray1,drop1PossArr, "fast");
								drop1Count--;
							}	
							$(this).data('dropedIn',-1);
						}else{
							
						}
						
					})
				}
				/* console.log("--------AFTER--------");
				console.log("drop0Count: "+drop0Count);
				console.log("drop1Count: "+drop1Count);
				
				console.log("dropArray0: "+JSON.stringify(dropArray0));
				console.log("dropArray1: "+JSON.stringify(dropArray1));
				console.log("dropArray2: "+JSON.stringify(dropArray2));
				
				console.log("correctAnswerArray: "+correctAnswerArray);
				console.log("userArray: "+userArray); */
            }           
        });
		$(showAnsBtn).bind({
            click: function() {
                if ($(this).hasClass(disabled)) {
					return false;
				}
				$(this).addClass(disabled);
				$('.feedbackContainer').hide();
				$(this).hide();
				
				var _mc=$('.dragOption')
				_mc.removeClass(corrClass);
				_mc.removeClass(incorrClass);			
				_mc.removeClass(dragClass);
				_mc.removeClass(disableClass);
								
				drop0Count=0;
				drop1Count=0;
				for (var j = 0; j < totalQption; j++) {
					var dropId = parseInt(pageXml.optionContent[0].option[j].option[0].dropId);
					switch (dropId) {
						case 0:							
							setPossition(('#option_' + j), drop0Count, drop0PossArr, true);
							drop0Count++;
							break;
						case 1:
							setPossition(('#option_' + j), drop1Count, drop1PossArr, true);
							drop1Count++;
							break;
					}					
				}
				$('.dragOption').addClass(disableClass);
				$('.dragOption').draggable( "disable" );	
				pageComplete();		
			}			
        });
		
		 $('.dragOption').bind({
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
		 $('.close_btn').on("click", function(){
			$('.feedbackContainer').hide();	
			
		})
	}	
	 function showHideDragDiv(_str){
		if(_str){
			$('.optionDargText').show();
		}else{
			$('.optionDargText').hide();
		}
	 }
	function setPossition(_mc, _num, _arr, isFinal, _speed) {
		//console.log(" _num :"+_num)
		var speed="slow";
		 if(_speed!==undefined){
			 speed=_speed;
		 }
        var nLeft = _arr[_num][0];
        var nTop = _arr[_num][1];
		var nWidth =_arr[_num][2];
		var nHeight =_arr[_num][3];
		$(_mc).removeClass(corrClass);
		$(_mc).removeClass(incorrClass);
		//$(_mc).css('width', nWidth);
		//$(_mc).css('height', nHeight);
		
        $(_mc).animate({
            left: nLeft,
            top: nTop,
			width: nWidth,
			height: nHeight
        }, speed, function(){
			if(!isFinal){
				checkSubmit();
			}else{
			 $(_mc).addClass(corrClass);
			}
			
		});
    }
  function createDropPossArr(){
		var drop0position = $('#dropArea_0').position();
		var drop1position = $('#dropArea_1').position();
		var drop2position = $('#dropArea_2').position();
		var leftGap= /* 22 */parseInt(pageXml.dropContainer[0].leftGap);
		var topGap= /* 88 */ parseInt(pageXml.dropContainer[0].topGap);
		
		var _last=$('.dragNDrop1 .labelContainer .labelBackgn').length - 1;
		var _dpBoxObj=$('.dragNDrop1 .labelContainer .labelBackgn').eq(_last);
		
		var optHeight=$('.dragNDrop1 .labelContainer .labelBackgn').height() + 10;
		var _paddLeft=parseInt($('.dragNDrop1 .dragOption').css('padding-left').split('px')[0]);
		var _paddRight=parseInt($('.dragNDrop1 .dragOption').css('padding-right').split('px')[0]);
		
		var _paddTop=parseInt($('.dragNDrop1 .dragOption').css('padding-top').split('px')[0]);
		var _paddBottom=parseInt($('.dragNDrop1 .dragOption').css('padding-bottom').split('px')[0]);

		var nWidth0=_dpBoxObj.width() - (_paddLeft + _paddRight);		
		var nWidth1=_dpBoxObj.width() - (_paddLeft + _paddRight);	
		var nWidth2=_dpBoxObj.width() - (_paddLeft + _paddRight);	
		
		var nHeight0=_dpBoxObj.height() - (_paddTop + _paddBottom);
		var nHeight1=_dpBoxObj.height() - (_paddTop + _paddBottom);
		var nHeight2=_dpBoxObj.height() - (_paddTop + _paddBottom);
		
		
		var bottomGap=0;
		if(pageXml.dropContainer[0].bottomGap!=null){
			bottomGap = parseInt(pageXml.dropContainer[0].bottomGap)
		}
		for(var j=0;j<totalQption;j++){
			drop0PossArr[j]=[];
			drop1PossArr[j]=[];
			drop2PossArr[j]=[];
			if(j==0){
				var OptLeft0=drop0position.left +leftGap;
				var OptTop0=drop0position.top +topGap;
				
				drop0PossArr[j][0]=OptLeft0;
				drop0PossArr[j][1]=OptTop0;
				drop0PossArr[j][2]=nWidth0;
				drop0PossArr[j][3]=nHeight0;
				
				var OptLeft1=drop1position.left +leftGap;
				var OptTop1=drop1position.top +topGap;
				
				drop1PossArr[j][0]=OptLeft1;
				drop1PossArr[j][1]=OptTop1;
				drop1PossArr[j][2]=nWidth1;
				drop1PossArr[j][3]=nHeight1;
				
				
				if(pageXml.dropContainer[0].dropArea[2]!=null && tempType=="DnD2"){
					var OptLeft2=drop2position.left +leftGap;
					var OptTop2=drop2position.top +topGap;
					drop2PossArr[j][0]=OptLeft2;
					drop2PossArr[j][1]=OptTop2;
					drop2PossArr[j][2]=nWidth2;
					drop2PossArr[j][3]=nHeight2;
				}
			
			}else{
				var OptLeft0=drop0position.left +leftGap;
				var OptTop0=drop0PossArr[j-1][1] +optHeight;
				
				drop0PossArr[j][0]=OptLeft0;
				drop0PossArr[j][1]=OptTop0+bottomGap;
				drop0PossArr[j][2]=nWidth0;
				drop0PossArr[j][3]=nHeight0;
				
				var OptLeft1=drop1position.left +leftGap;
				var OptTop1=drop1PossArr[j-1][1] +optHeight+bottomGap;
				
				drop1PossArr[j][0]=OptLeft1;
				drop1PossArr[j][1]=OptTop1;
				drop1PossArr[j][2]=nWidth1;
				drop1PossArr[j][3]=nHeight1;
				
				if(pageXml.dropContainer[0].dropArea[2]!=null && tempType=="DnD2"){
					var OptLeft2=drop2position.left +leftGap;
					var OptTop2=drop2PossArr[j-1][1] +optHeight+bottomGap;
					
					drop2PossArr[j][0]=OptLeft2;
					drop2PossArr[j][1]=OptTop2;
					drop2PossArr[j][2]=nWidth2;
					drop2PossArr[j][3]=nHeight2;
				}
			}			
		}
		
	 }
	/**
     * @function createOrginPossArr
     * @description This function is used to set original position of drag items.
     */
	function createOrginPossArr(){
		for(var j=0;j<totalQption;j++){
			orginPossArr[j]=[];
			var position = $('#option_'+j).position();
			orginPossArr[j][0]=position.left;
			orginPossArr[j][1]=position.top;
			orginPossArr[j][2]=$('#option_'+j).width();
			orginPossArr[j][3]=$('#option_'+j).height();
		}
		
	 }
	 /**
	 * @function DragDivOriginPoss
	 * @description This function is used to set incorrect drops to their original position.
	 */
	 function DragDivOriginPoss(_id, _speed){
		 var speed="slow";
		 if(_speed!==undefined){
			 speed=_speed;
		 }
		var _mc=$('#option_'+_id)
		_mc.removeClass(corrClass);
		_mc.removeClass(incorrClass);			
		_mc.removeClass(dragClass);
		_mc.removeClass(disableClass);
		_mc.animate({left: orginPossArr[_id][0],top: orginPossArr[_id][1], width: orginPossArr[_id][2], height: orginPossArr[_id][3]},speed, function(){
			$(this).draggable("enable");
			//$(this).css('z-index','0');
		});				
	 }
	 function showFeedback(obj){
		/* if(totDropCount==totalQption){ */
			$('.submit').hide();
			$('.submit').addClass('disabled');
			var fdObj=obj;
			
		
			var count=fdObj.text.length;
			var str=""
			//
			str+="<div class='feedbackText'><div class='feedText'>"
			for(var i=0; i<count; i++){
				var styleStr=fdObj.text[i].style==null?'':fdObj.text[i].style;
				str+="<div class='fText' id='fText_"+i+"' style='"+styleStr+"'>"+fdObj.text[i].Text+"</div>"
			}
			str+="</div></div>"
			
			if(pageXml.feedback[0].popUpWithClose){
				$('.SemiBlackPage').show();
				 str+="<a href='javascript:void(0);' class='closeFeedbackBtn'></a>";
				$('.feedbackContainer').html(str);
			}else{
				$('.feedbackContainer').html(str);
			}
		var fdStyle= fdObj.style || '';
		$('.feedbackContainer').attr('style',fdStyle);
		$('.feedbackContainer').show();
		
		$('.feedbackText').css('height','auto');
		if($('.feedbackText').height()>$('.feedbackText').parent().height()){
			$('.feedbackText').css('height',($('.feedbackText').parent().height()-4));
			$('.feedbackText').fw_Scroll({color:"#ffffff",width:10});
		}
		
		 $('.closeFeedbackBtn').click(function(){
			$('.SemiBlackPage').hide();
			$('.feedbackContainer').hide();
			 resetDragDrop()
		})
		
		
		/* }	 */	
	 }
	  function resetDragDrop(){
		navigation.replayPage();
	 }
	 
	/**
	 * @function showCorrIncorrect
	 * @description This function is used to add correct/incorrect class .
	 */
	function showCorrIncorrect() {
		for (var j = 0; j < totalQption; j++) {
			if (correctAnswerArray[j] == userArray[j]) {
				$('#option_'+j).addClass(corrClass);
			}else{
				$('#option_'+j).addClass(incorrClass);
			}
		}
	} 
	/**
	 * @function checkSubmit
	 * @description This function is used to check ok button state.
	 */
	function checkSubmit() {		
		var dropCount = drop0Count + drop1Count;
		if (dropCount === totalQption) {
			$(okBtn).removeClass(disabled);
			$(okBtn).css('display','table');
			$(tryAgainBtn).css('display','none');
			$(showAnsBtn).css('display','none');
			$('.optionConLable').hide();
		} else {
			$(okBtn).addClass(disabled);
			$(okBtn).css('display','none');
			$('.optionConLable').show();
		}
	}
	/**
     * @function pageComplete
     * @description This function is used to page completion.
     */
    function pageComplete() {
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		templateMediator.pageVisited();

    }
	function setStyle(obj,_xml){
		var clr =(_xml.color==null?'':_xml.color);
		var bgClr =(_xml.bgColor==null?'':_xml.bgColor);
		var pd =(_xml.padding==null?'':_xml.padding);
		var fts =(_xml.fontSize==null?'':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'':_xml.textAlign);
		var wd  =(_xml.width==null?'':_xml.width);
		var ht  =(_xml.height==null?'':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var tp  =(_xml.top==null?'':_xml.top);
	    var pos =(_xml.position==null?'absolute':_xml.position);
	    var textAlign =(_xml.textAlign==null?'':_xml.textAlign);
		var lineHeight  =(_xml.lineHeight==null?'':_xml.lineHeight);
		$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'font-size':fts,'font-weight':ftw,'text-align':txtA,position:pos,'background-color':bgClr,padding:pd,'text-align':textAlign,'line-height':lineHeight});
		if(_xml.cName!=null){
			var cName=_xml.cName;
			$(obj).addClass(cName);
		}
	}
}
