/*----------------------------------------
	Name: fw_MatchingMultiAns.js
	Developed by: Nishant Pownarkar
----------------------------------------*/
function fw_MatchingMultiAns(_xml) {
	var pageXml = _xml;
	var tIndex = 6;
	var preloadImagesArray = new Array();
	var currentDrag = ""
	var lineArray = new Array();
	var userAnsArray= new Array();
	var correctAnswerArray= new Array();
	var correctAnswerArray2= new Array();
	var okButton=".ok";
	var paper
	var visitCounter = 0;
	this.updatePageLayOut = updatePageLayOut;
	var className = pageXml.className;
	var isInfo=true;
	var isRandom=false;
	var onlySticksCorrect=false;
	var optionFeedback=true;
	var infoArray= new Array();
	
	if(pageXml.isRandom == 'true'){
		isRandom=true;
	}
	if(pageXml.onlySticksCorrect == 'true'){
		onlySticksCorrect=true;
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
	
	/************************/
	
	
	$('.matching').addClass(className)
	$('.activityContainer').attr('style',pageXml.matchingActivity[0].style);
	function initMatchingActivity() {
		$('.boundingRect').attr('style',pageXml.matchingActivity[0].boundingRectStyle);
		
		$('.rightColum').attr('style',pageXml.matchingActivity[0].rightSideTabs[0].style);
		$('.leftColum').attr('style',pageXml.matchingActivity[0].leftSideTabs[0].style);
		addContentText();
		addTabs();
		var h = 290;
		var w = 990;
		if(pageXml.matchingActivity[0].lineHolderH != null && pageXml.matchingActivity[0].lineHolderH != ""){
			h = Number(pageXml.matchingActivity[0].lineHolderH)
		}
		if(pageXml.matchingActivity[0].lineHolderW != null && pageXml.matchingActivity[0].lineHolderW != ""){
			w = Number(pageXml.matchingActivity[0].lineHolderW);			
			$('#lineHolder').css('width',w+'px');
		}
		
		paper = new Raphael(document.getElementById('lineHolder'), w, h);
	}

	function addContentText() {
		var pageTxtStr="";
		for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
			var obj=pageXml.contentText[0].text[i].style;
			var _style=obj==null?"":obj;
			pageTxtStr+='<div class="htcText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
		}
		$('.pageText').html(pageTxtStr);
	} 

	function addTabs() {
		if(!pageXml.matchingActivity[0].optfeedbacks){
			 isInfo=false;
			 $('.infoContainer').remove();
		 }
		var tabDiv
		for (var j = 0; j < pageXml.matchingActivity[0].leftSideTabs[0].tab.length; j++) {
			//correctAnswerArray[j] = pageXml.matchingActivity[0].leftSideTabs[0].tab[j].id;
			tabDiv = createTab(j, "left", j);
			
		}
		var len = pageXml.matchingActivity[0].rightSideTabs[0].tab.length;
		var rpObj = new fw_GetRandomNum(len - 1);		
		for (var i = 0; i < len; i++) {			
			userAnsArray[i] = -1;
			var val = i;
			if(isRandom){
				val=rpObj.getNum();	
			}
			
			tabDiv = createTab(i, "right" , val);
			
			var _id = pageXml.matchingActivity[0].rightSideTabs[0].tab[val].id.split(',');
			if(_id.length > 1){
				correctAnswerArray[val] = _id[0];
				correctAnswerArray2[val] =_id[1];
			//	alert('ss'+correctAnswerArray2)
			}else{
				correctAnswerArray[i] = pageXml.matchingActivity[0].rightSideTabs[0].tab[val].id;
			}
			
					
				
			if(isInfo){
				infoArray.push(0);
			}
		}
		addDragFunctionality();
		addDropFunctionality();
		
		/* for(var i=0; i <  pageXml.matchingActivity[0].leftSideTabs[0].tab.length; i++){

		}
		 */
		
		
		if(pageXml.buttonText){
			var style = pageXml.buttonText[0].text[0].style;
			var str ='<a href ="javascript:void(0);" class="a-button ok disabled" style="'+style+'"  ><span class="btntext">'+pageXml.buttonText[0].text[0].Text+'</span></a>';
			
			$('.activityContainer').append(str);
		}
		
		$(okButton).click(function(){
			if ($(this).hasClass("disabled")) {
				$("div[tabindex=1]").focus();
				return false;
			}			
			$(okButton).hide();				
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			$('.userFeedbackHeader').removeClass('correctFB').removeClass('inCorrectFB');
			var allTabTrue=true;
			for(var i = 0; i < userAnsArray.length; i++){
				//alert(correctAnswerArray2+"d"+correctAnswerArray+"d"+userAnsArray)
				if(userAnsArray[i] == correctAnswerArray[i] || userAnsArray[i] == correctAnswerArray2[i]){				
					//$('#rightTab'+i).addClass('matchedTab');
					//$('#leftTab'+(userAnsArray[i]-1)).addClass('matchedTab');
					
					$('#leftTab'+(userAnsArray[i]-1)).find('.tickCross').css('display', 'block');
					$('#leftTab'+(userAnsArray[i]-1)).find('.tickCross').addClass('tick');
					//alert('#leftTab'+(userAnsArray[i]-1))
				}else{
					$('#leftTab'+(userAnsArray[i]-1)).find('.tickCross').css('display', 'block');
					$('#leftTab'+(userAnsArray[i]-1)).find('.tickCross').addClass('cross');
						allTabTrue=false;
				}	
				
				/* if(userAnsArray[i] == correctAnswerArray[i]){					
					$('#leftTab'+i).find('.tickCross').css('display', 'block');
						$('#leftTab'+i).find('.tickCross').addClass('tick');
				}else{
					$('#leftTab'+i).find('.tickCross').css('display', 'block');
					$('#leftTab'+i).find('.tickCross').addClass('cross');
				} */
			}
			if(pageXml.matchingActivity[0].feedback){
				if(pageXml.matchingActivity[0].feedback[0].type == 'semiBlack'){
					$('.activityContainer .feedback').remove();	
				}else{
					$('.popupSemiBlack .feedback').remove();	
				}
				//if(userAnsArray.toString() == correctAnswerArray.toString()) {
				if(allTabTrue){	
					$('.userFeedbackHeader').addClass('correctFB');		
					showFeedback(pageXml.matchingActivity[0].feedback[0].correct[0]);
					if(pageXml.instructionText[0].text[2]!=null){
						pageInstruction.updateText(pageXml.instructionText[0].text[2].Text);	
					}else{
						pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
					}
					templateMediator.pageVisited();	
					
				}else{
					$('.userFeedbackHeader').addClass('inCorrectFB');		
					showFeedback(pageXml.matchingActivity[0].feedback[0].incorrect[0]);		
					pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
				}	
			}else{
				//if (userAnsArray.toString() == correctAnswerArray.toString()){
				if(allTabTrue){	
					if(pageXml.instructionText[0].text[2]!=null){
						pageInstruction.updateText(pageXml.instructionText[0].text[2].Text);	
					}else{
						pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
					}
					templateMediator.pageVisited();
				}else{
					pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
				}
				if(isInfo){
					$('.questionMark').css('display','block');
					$('.infoContainer .close_info').click(closeExtedFeedback);
				}else{
					templateMediator.pageVisited();
				}
			
			}			
			return false;
		});
		
		$('.questionMark').click(function(){
			if ($(this).hasClass("disabledclickMark")) {
				return false;
			}
			upadteOptInfo($(this).attr('id'));						
		});
	}

	function createTab(id, side, val) {
		
		var iNum =  val;
		var tabDiv = $("<div/>", {
			"id": side + "Tab" + id
		});
		var imgDiv = $("<div/>", {
			"class": "tabIconDiv"
		});
		if (side == "right") {
			var disTextSpan = pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].text[0].style;
			var titleSpan = $("<span/>", { "class": "tabTitle", "tabindex": tIndex++, "style": disTextSpan });
 		} else {
			var disTextSpan = pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].text[0].style || '';
			var titleSpan = $("<span/>", { "class": "tabTitle", "tabindex": tIndex++, "style": disTextSpan });
		}
		var blankSpan;
		var dragSpan;
		var dragIcon;
		var iconSpan;
		var tick;
		
		if (side == "right") {			
			$(tabDiv).append(titleSpan);
			blankSpan = $("<div/>", {});
			$(blankSpan).addClass('dropItem');			
			$(blankSpan).attr('style', pageXml.matchingActivity[0].rightSideTabs[0].tab[id].dropPosition);
			$('.activityContainer').append(blankSpan)
			$(tabDiv).addClass('rightTab')
			$(".rightColum").append(tabDiv)
			$(".rightColum").find('.header').html(pageXml.matchingActivity[0].rightSideTabs[0].heder[0].Text);
			
			$(blankSpan).data('matchId', pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].id)
			$(titleSpan).html(pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].text[0].Text);
			
			var tp = $(tabDiv).position().top+parseInt($(tabDiv).css('margin-top'));
			//var ht = $(tabDiv).outerHeight();
			$(tabDiv).attr('style',pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].style);
			
			//$(blankSpan).css({'top':+(tp+3)+'px'});	
			var altTxt = pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].rightIcon[0].Text;
			iconSpan = $("<img/>", {"src" : pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].rightIcon[0].path, "class" : 			"rightImage", "alt": altTxt, "id": "iconSpan"+id});
			$(tabDiv).append(iconSpan);
			$(iconSpan).attr('style', pageXml.matchingActivity[0].rightSideTabs[0].tab[iNum].rightIcon[0].style);
			$(blankSpan).data('idRef', val)
			
			if(isInfo){
			$(tabDiv).append('<div class="uAnscontainer" ><div class="table" ><div class="table-cell" ><a href="javascript:void(0)"class="questionMark" id="qem_'+val+'"></a></div></div></div>');
			}
		} else {
			tick = $("<div/>", {"class": "tickCross"});
			$(tabDiv).append(tick);
			$(tabDiv).append(titleSpan)
			blankSpan = $("<div/>", {});
			$(blankSpan).addClass('leftBlank');		
			$(tabDiv).append(blankSpan)
			dragSpan = $("<div/>", {
				"class": "dragItem",
				"id": "drag" + id
			});
			dragIcon = $("<img/>", {
				"src": pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].dragIcon[0].path,
				"class": "dragIcon",
				"id": "dragIcon" + id
			});
			$(dragSpan).append(dragIcon)
			$(dragSpan).data('matchId', pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].id)
			$(tabDiv).addClass('leftTab');
			
			$(tabDiv).attr('style',pageXml.matchingActivity[0].leftSideTabs[0].tab[id].style);
			$('.activityContainer').append(dragSpan);
			$(".leftColum").append(tabDiv);
			
			$(".leftColum").find('.header').html(pageXml.matchingActivity[0].leftSideTabs[0].heder[0].Text);
			$(titleSpan).html(pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].text[0].Text);
			$(dragSpan).attr('style', pageXml.matchingActivity[0].leftSideTabs[0].tab[id].dragPosition)
			if(globalPath.languageDir == 'ltr'){
				$(dragSpan).data('startX', parseInt($(dragSpan).css('left')) + ($(dragSpan).width()-1));
			} else{
				$(dragSpan).data('startX', parseInt($(dragSpan).css('left')) - (($(dragSpan).width() * 2))+10);
			}
			$(dragSpan).data('startY', parseInt($(dragSpan).css('top')) + ($(dragSpan).height()/2)+3);
			$(dragSpan).data('idRef', iNum);
			$(dragSpan).data('idRefAns', id);
			
			
			$(tabDiv).attr('style',pageXml.matchingActivity[0].rightSideTabs[0].tab[id].style);			
			//var tp = $(tabDiv).position().top+parseInt($(tabDiv).css('margin-top'));
			//$(blankSpan).css({'top':+(tp+3)+'px'});

var altTxt = pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].leftIcon[0].Text;			
			
			iconSpan = $("<img/>", {"src" : pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].leftIcon[0].path, "class" : "leftImage", "alt": altTxt, "id": "iconSpan"+id});
			$(tabDiv).prepend(iconSpan)
			$(iconSpan).attr('style', pageXml.matchingActivity[0].leftSideTabs[0].tab[iNum].leftIcon[0].style);
		}
		return $(tabDiv);
	}

	function addDragFunctionality() {
		$('.dragItem').draggable({
			containment: '.boundingRect',
			stack: ".dragItem",
			start: function(event, ui) {
				$(this).css({
					"z-index": "2000"
				});
				currentDrag = this;
				createLine($(currentDrag).data('idRef'))
				$(this).data('drop', 'null');
			},
			revert: function() {
				if(onlySticksCorrect){
					if ($($(this).data('drop')).data('matchId') == $(this).data('matchId')) {
						$(this).draggable("option", "disabled", true);
						$(this).addClass('disableDrag');
						$($(this).data('drop')).addClass('disableDrop');
						$(this).find('.dragIcon').css('display', 'none');
						$('#leftTab' + $(this).data('idRefAns')).addClass('matchedTab');
						$('#leftTab' + $(this).data('idRefAns')).find('.tick').css('display', 'block')
						for (var i = 0; i < pageXml.matchingActivity[0].rightSideTabs[0].tab.length; i++) {
							if (pageXml.matchingActivity[0].rightSideTabs[0].tab[i].id == $($(this).data('drop')).data('matchId')) {
								$('#rightTab' + i).addClass('matchedTab');								
								var val2 = $($(this).data('drop')).data('matchId');							
								var val = $(this).data('matchId');		
								userAnsArray[$($(this).data('drop')).data('idRef')] = $(this).data('matchId');	

								checkOk(parseInt(val)-1,val2);
								
								break;
							}
						}
						/* visitCounter++
						if(pageXml.buttonText == undefined){						
							if (visitCounter >= pageXml.matchingActivity[0].rightSideTabs[0].tab.length) {
								templateMediator.pageVisited()
								pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
							}
						} */
						return false;
					}
					removeLine(lineArray[$(currentDrag).data('idRef')]);
					return true;
					
				}else if ($($(this).data('drop')).data('matchId') != undefined   && !$($(this).data('drop')).hasClass('dropped')) {
					$(this).draggable("option", "disabled", true);
					$(this).addClass('disableDrag');
					$($(this).data('drop')).addClass('disableDrop');
					$(this).find('.dragIcon').css('display', 'none');
					$($(this).data('drop')).addClass('dropped');
					$('#leftTab' + $(this).data('idRefAns')).addClass('matchedTab');
					$('#leftTab' + $(this).data('idRefAns')).find('.tick').css('display', 'block');
					
					for (var i = 0; i < pageXml.matchingActivity[0].rightSideTabs[0].tab.length; i++) {
						//alert( $($(this).data('drop')).data('matchId'))
						if (pageXml.matchingActivity[0].rightSideTabs[0].tab[i].id == $($(this).data('drop')).data('matchId')) {
							var val2 = $($(this).data('drop')).data('matchId');							
							var val = $(this).data('matchId');
							$('#rightTab' + i).addClass('matchedTab');
							userAnsArray[$($(this).data('drop')).data('idRef')] = $(this).data('matchId');	
							//alert(userAnsArray)
							checkOk(parseInt(val)-1,val2)
							break;
						}
					}
					visitCounter++;					
					return false;
				}
				removeLine(lineArray[$(currentDrag).data('idRef')]);
				return true;
			},
			revertDuration: 20,
			drag: function() {
				closeFeedback();
				//resetObjColor();
				var containerOffset = $('.wrapper').offset();
				var sx = $(this).data('startX')
				var sy = $(this).data('startY')
				var ex;
				if(globalPath.languageDir == 'ltr'){
					ex = $(this).position().left+2;
				} else{
					ex = $(this).position().left - 23;
				}
				var ey = $(this).position().top +($(this).height()/2);
				updateLine(lineArray[$(currentDrag).data('idRef')], sx, sy, ex, ey);
				$(this).addClass('dropped');
			},
			stop: function(event, ui) {}
		});
		
		
	}

	function addDropFunctionality() {
		$(".dropItem").droppable({
			accept: ".dragItem",
			drop: function(event, ui) {
				$(ui.draggable).data('drop', this);
				$(ui.draggable).css({
					left: $(this).css('left'),
					top: $(this).css('top')
				});
				var containerOffset = $('.wrapper').offset();
				var sx = $(currentDrag).data('startX')
				var sy = $(currentDrag).data('startY')
				var ex;
				if(globalPath.languageDir == 'ltr'){
					ex = $(this).position().left+2;
				} else{
					ex = $(this).position().left - 23;
				}
				var ey = $(this).position().top +($(this).height()/2);
				updateLine(lineArray[$(currentDrag).data('idRef')], sx, sy, ex, ey)
			}
		});
	}
	function checkOk(_id,val){	
		//userAnsArray[_id]=val;
		if(userAnsArray.indexOf(-1) == -1){
			if(pageXml.buttonText != undefined){
				enabledButton(okButton);	
			}else{
				$('.questionMark').css('display','block');
				pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
				$('.infoContainer .close_info').click(closeExtedFeedback);
			}				
		}		
	}
	function upadteOptInfo(_id){
		
		var opid= parseInt(_id.split('qem_')[1]);
		infoArray[opid] = 1;			
		var str="";
		var obj = pageXml.matchingActivity[0].optfeedbacks[0].optfeedback;
		
		
		for(var i=0;i<obj[opid].text.length;i++){
			if(i == obj[opid].text.length-1){
				var style= obj[opid].text[i].style;
				str+="<div class='insertTab' style='"+style+"'><p>"+obj[opid].text[i].Text+"</p></div>";
			}else{
				str+="<div class='insertTab'><p>"+obj[opid].text[i].Text+"</p></div>";
			}
		}
		var infoContainerstyle= obj[opid].style;
		$('.infoContainer').attr('style',infoContainerstyle);
		$('.infoContainer').show();
		$('.infoContainer .infoText').html("<div class='insertTabDiv'>"+str+"</div>"); 
		$('.infoContainer').css({'display': 'block'});
		if(infoArray.toString().indexOf("0")<0){
			templateMediator.pageVisited();	
			pageInstruction.updateText(pageXml.instructionText[0].text[2].Text);
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
	function showFeedback(obj) {	
		
		var str="";
		for(var i=0;i<obj.text.length;i++){				
			if(i == obj.text.length-1){
			str+="<div class='insertTab' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>";
			}else{
			str+="<div class='insertTab' style='"+obj.text[i].style+"'><p>"+obj.text[i].Text+"</p></div>";
			}
		}
		
		$('.feedback .popupText').html("<div class='scrollableContent' >"+str+"</div>")
		$('.feedback').attr('style', obj.style);
		$('.feedback').css({'display': 'block'});
		if(pageXml.matchingActivity[0].feedback[0].type == 'semiBlack'){
			$('.popupSemiBlack').css({'display': 'block'});
		}
		$('.feedback .closePopup').click(closeFeedback);
		
		$('.feedback .popupText').attr("tabindex", tIndex++);
		$('.feedback .closePopup').attr("tabindex", tIndex++);
		if($('.scrollableContent').outerHeight() > $('.popupText').outerHeight()){
		$('.popupText').fw_Scroll({color:"#0057a6",width:10});
		}
		navigationEvent.updateGlobleFocus(tIndex);
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		if(isInfo){
			$('.questionMark').css('display','block');
			$('.infoContainer .close_info').click(closeExtedFeedback);
		}else{
			templateMediator.pageVisited();
		}
	}

	function closeFeedback() {
		$('.feedback').css({
			'display': 'none'
		});
		$('.popupSemiBlack').css({
			'display': 'none'
		});
		//resetObjColor();
	}
	function closeExtedFeedback() {
		$('.infoContainer').css({
			'display': 'none'
		});
		/* $('.popupSemiBlack').css({
			'display': 'none'
		}); */
		//resetObjColor();
	}

	function resetObjColor() {
		$('.matching .matchedTab').css({
			'background-color': '#cccccc'
		});
		$('.matching .matchedTab').css({
			'color': '#333740'
		})
	}

	function removeLine(line) {
		line.remove();
	}

	function createLine(id) {		
		var path = paper.path();
		lineArray[id] = path;
	}

	function updateLine(line, sx, sy, ex, ey) {		
		var newPath = ["M", sx, sy-2, "L", ex, ey];
		line.attr({
			path: newPath,
			stroke: "#00549e",
			"stroke-width": 3
		});
	}
	Raphael.el.addPart = function(point) {
		var pathParts = this.attr('path') || [];
		pathParts.push(point);
		this.attr('path', pathParts);
	};
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	$('.pageInstruction').attr('tabindex', (tIndex));
	navigationEvent.updateGlobleFocus(tIndex);
	if (preloadImagesArray.length >= 1) {
		$.imgpreload(preloadImagesArray, {
			each: function() {},
			all: function() {
				onLoadAllImages();
			}
		});
	} else {
		onLoadAllImages();
	}

	function onLoadAllImages() {
		try {
			templateMediator.templateLoadComplete();
			$("div[tabindex=1]").focus();
			if (navigationData.isCurrentPageComplete()) {
				templateMediator.pageVisited();
			}
			initMatchingActivity();
		} catch (err) {}
	}
	if (globalSettings.isDesktop()) {}

	function updatePageLayOut() {}

	function setStyle(obj, _xml) {}
}