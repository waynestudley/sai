/*----------------------------------------
/*----------------------------------------
	Name: fw_RevealCallOut.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_RevealCallOut(_xml) {
	var pageXml = _xml;
	var prePath1 = "";
	var revealCallOutButton = ".revealCallOutButton";
	var selectedClass = "revealCallOutSelect";
	var revealCallOutHoverClass = "revealCallOutHover";
	this.updatePageLayOut = updatePageLayOut;
	
	var totalrevealCallOut = pageXml.revealCallOutContent[0].revealCallOut.length;
	var str = '';
	var lmsData = navigationData.getCurrentPageData();
	var dataArray = new Array();
	var tempArray = new Array();
	var buttonArray = new Array();
	var updateDone = false;
	var currentTabId = 1;
	var currentSPId = 0;
	var send = false;
	var tbCnt;
	var rType = pageXml.type.toLowerCase();
	var revealCallOutType = 0;
	var parentClass = '.revealCallOut1';
	var className = pageXml.className;
	var iPadBackground = pageXml.contentBackground[0].img[0].ipadPath;
	var revealCallOutTypeArray = new Array("revealCallOut1", "revealCallOut2", "revealCallOut3");
	
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
	/************************/
	
	
	for (var i = 0; i < revealCallOutTypeArray.length; i++) {
		if (rType == revealCallOutTypeArray[i].toLowerCase()) {
			revealCallOutType = i;
			break;
		}
	}
	parentClass = '.' + revealCallOutTypeArray[revealCallOutType];
	$('.revealCallOut1').attr('class', revealCallOutTypeArray[revealCallOutType]);
	$(parentClass).addClass(className);
	
	if (lmsData != "") {
		dataArray = lmsData.split('^');
	} else {
		for (var i = 0; i < totalrevealCallOut; i++) {
			dataArray.push(0);
		}
	}
	
	str="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		str+='<div class="pText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
	}
	$('.pageText').html(str);
	
	str="";
	for (var i = 0; i < totalrevealCallOut; i++) {
		var txt = pageXml.revealCallOutContent[0].revealCallOut[i].buttonText[0].Text;
		var txtStyle = pageXml.revealCallOutContent[0].revealCallOut[i].buttonText[0].style || '';
		var tickStyle;
		if(globalPath.languageDir == 'ltr'){
				tickStyle = 'style="top:'+pageXml.revealCallOutContent[0].revealCallOut[i].ticktop+'; right:'+pageXml.revealCallOutContent[0].revealCallOut[i].tickleft+'"';
			} else{
				tickStyle = 'style="top:'+pageXml.revealCallOutContent[0].revealCallOut[i].ticktop+'; left:'+pageXml.revealCallOutContent[0].revealCallOut[i].tickright+'"';
			}
		
		var id = "hot_" + i;
		if (revealCallOutType == 0) {
			
			
			var buttonTextArrow = pageXml.revealCallOutContent[0].revealCallOut[i].buttonTextArrow;
			var buttonTextArrowstyle="";
			if(buttonTextArrow!=null){
				buttonTextArrowstyle=buttonTextArrow[0].style;
			}
			str += '<a class="revealCallOutButton" id="' + id + '" tabindex="' + currentTabId + '" href="javascript:void(0);" >'
			str += '<span id="tick_' + i + '" class="tickCross" '+tickStyle+'></span>'
			str += '<div  class="revealCallOut" ><span class="revealCallOutText" style="'+txtStyle+'">' + txt + '</span><div class="revealArrow" style="'+buttonTextArrowstyle+'"></div></div>';
                        if(pageXml.revealCallOutContent[0].revealCallOut[i].img!=null){
                            var cBgImg = pageXml.revealCallOutContent[0].revealCallOut[i].img[0].path;
                            var altText = pageXml.revealCallOutContent[0].revealCallOut[i].img[0].Text;
                             str += '<img src="' + cBgImg + '" alt="' + altText + '" title="" />';
                        } 
                        str += '</a>';
			
		} else if (revealCallOutType == 1) {
			str += '<a class="revealCallOutButton" id="' + id + '" tabindex="' + currentTabId + '" href="javascript:void(0);" >'
			str += '<span id="tick_' + i + '" class="tickCross" '+tickStyle+'></span>'
			str += '<img class="rCallOutImg" src="' + pageXml.revealCallOutContent[0].revealCallOut[i].img[0].path + '" alt="' + pageXml.revealCallOutContent[0].revealCallOut[i].img[0].Text + '" title="" /><div class="revealCallOutText" style="'+txtStyle+'"> <table class="midText"><tr><td>' + txt + '</td></tr></table></div></a>';
		} else if (revealCallOutType == 2) {
			str += '<a class="revealCallOutButton" id="' + id + '" tabindex="' + currentTabId + '" href="javascript:void(0);" >'
			str += '<span id="tick_' + i + '" class="tickCross" '+tickStyle+'></span>'
			str += '<div class="revealCallOutText" style="'+txtStyle+'"> <table class="midText"><tr><td>' + txt + '</td></tr></table></div>';
			str += '<div class="revealCallOutBg"></div></a>';
		}
		
		
		buttonArray.push('#' + id);
		tempArray.push(0);
		currentTabId++;
	}
	var imgPath = pageXml.contentBackground[0].img[0].path
	if (imgPath != "") {
		if (iPadBackground != undefined) {
			if (globalSettings.isDesktop()) {
				//$('.revealCallOutBg').attr("src", pageXml.contentBackground[0].img[0].path);
				$('.revealCallOutBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			} else {
				$('.revealCallOutBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].ipadPath + ')');
				//$('.revealCallOutBg').attr("src", pageXml.contentBackground[0].img[0].ipadPath);
			}
		} else {
			$('.revealCallOutBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
		}
		//$('.revealCallOutBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
	} else {
		$('.revealCallOutBg').remove();
	}
	$('.revealCallOutContainer').html(str);
	var revealContainerStyle = pageXml.revealCallOutContent[0].style || '';
	$('.revealCallOutContainer').attr('style',revealContainerStyle);
	
	if($('.revealCallOut1').hasClass('linear')){ 
		$('.revealCallOutButton').addClass(selectedClass);
		$('#hot_0').removeClass(selectedClass);
	}
	for (var i = 0; i < totalrevealCallOut; i++) {
		setPosition(buttonArray[i], pageXml.revealCallOutContent[0].revealCallOut[i]);
		//setStyle($(buttonArray[i] + ' .revealCallOut'), pageXml.revealCallOutContent[0].revealCallOut[i].buttonText[0]);
		setPosition($(buttonArray[i] + ' .revealCallOutText'), pageXml.revealCallOutContent[0].revealCallOut[i].buttonText[0]);
		if (revealCallOutType == 0) {} else if (revealCallOutType == 2) {
			$(buttonArray[i]).find('.revealCallOutBg').css("background-image", "url(" + pageXml.revealCallOutContent[0].revealCallOut[i].img[0].path + ")");
		}
	}
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);

$(revealCallOutButton).hover( function(){
		if($(this).hasClass(selectedClass)  || (!globalSettings.isDesktop())){
			return false;
		}
		$(this).addClass(revealCallOutHoverClass);
	},
	  function () {
		$(this).removeClass(revealCallOutHoverClass);
	});

	updateTabIndex();
	$(revealCallOutButton).click(function() {
		if ($(this).hasClass(selectedClass)) {
			return false;
		}
		var isExtraPop=false;
		var btnObj="#"+$(this).attr('id');
		var id = parseInt($(this).attr('id').split('hot_')[1]);
		
		//console.log("btnObj: "+tempArray+"::"+dataArray)
		$(revealCallOutButton).removeClass(selectedClass);
		$(revealCallOutButton).removeClass(revealCallOutHoverClass);
		$(this).addClass(selectedClass);
		
		currentSPId = id;
		$('.popUpContainer').show();
		if (pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].arrowdir != null) {
			$('.popUpArrow').addClass('rightarrow');
		} else {
			$('.popUpArrow').removeClass('rightarrow');
		}
		//if (revealCallOutType != 1) {
			$(".extraPopupContainer").remove();
		//}
		if(pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].img!=null){
				var path=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].img[0].path;
				var alt=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].img[0].Text;
				var style=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].img[0].style;
				$('.popBg').show();
				$('.popBg').attr('src',path);
				$('.popBg').attr('alt',alt);
				$('.popBg').attr('style',style);
			}else{
				$('.popBg').hide();
			}
		if (revealCallOutType == 0) {
			if(globalPath.languageDir == 'ltr'){
			$('.popUpArrow').css('left', pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].arrowleft)
			} else{
			$('.popUpArrow').css('right', pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].arrowright)
				}
			var reg = new RegExp("\<[^>]+\>", "g");
			$('.PopUpHeader p').html(pageXml.revealCallOutContent[0].revealCallOut[id].buttonText[0].Text.replace(reg, ""));
			var str = "";
			for (var i = 0; i < pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text.length; i++) {
				var txtStyle=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text[i].style || '';
				str += "<div class='insertTab' style='"+txtStyle+"'><p>" + pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text[i].Text + "</p></div>";
				
			}
			var obj=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].style;
			var _style=obj==null?"":obj;
			$('.popUpText').html('<div class="scrollContent" style="'+_style+'"><div>'+str+'</div></div>');
			
			//---
			var _extraPopObj=pageXml.revealCallOutContent[0].revealCallOut[id].extraPop;
				if(_extraPopObj!=null){
					isExtraPop=true;
					for (var j = 0; j < _extraPopObj.length; j++) {
						var str1="";
						var class1=""
						if(tempArray[id]==1){
							class1="selected";
						}
						var _id="extraButton_"+id+"-"+j;
						var obj=_extraPopObj[j].buttonText[0].style;
						var _style=obj==null?"":obj;
						str1+='<a class="extraButton '+class1+'" id="' + _id + '" style="' + _style + '" 	href="javascript:void(0);" ><span class="extraButtonTxt">'+_extraPopObj[j].buttonText[0].Text+'</span></a>'
						
						var extraPopId="extraPopup_"+id+"-"+j;
						var obj=_extraPopObj[j].popText[0].style;
						var _popStyle=obj==null?"":obj;
						var str2='<div class="extraPopup '+class1+'" id="'+extraPopId+'" style="'+_popStyle+'">';
						for (var k = 0; k < _extraPopObj[j].popText[0].text.length; k++) {					
							var obj=_extraPopObj[j].popText[0].text[k].style;
							var _popTxtStyle=obj==null?"":obj;
							str2+='<div class="extraInsertTab" style="'+_popTxtStyle+'"><p>' + _extraPopObj[j].popText[0].text[k].Text + '</p></div>'
						}
					str2+='</div>';
					
					
					$('.popUpText').append(str1);
					$('.popUpText').append(str2);
				}

				$('.extraButton').click(function() {
					if ($(this).hasClass('selected')) {
						return false;
					}
					$(this).addClass('selected');					
					var _id = $(this).attr('id').split('_')[1];
					var _curPop= "#extraPopup_"+_id;
					$(_curPop).addClass('selected');
					updateData(btnObj, id);
				})
				
			}
			//---
			
			$('.scrollContent').fw_Scroll({color:"#FFFFFF",width:10});
		} else if (revealCallOutType == 1) {
			var lf = getNumber($(this).css('left')) + ($(this).width() / 2);
			var rt = getNumber($(this).css('right')) + ($(this).width() / 2);
			lf = lf - 48;
			rt = rt - 48;
			if(globalPath.languageDir == 'ltr'){
				$('.popUpArrow').css('left', lf + "px");
			} else{
				$('.popUpArrow').css('right', rt + "px");
			}
			if(pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].showHeader=='true' && pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].showHeader!=null){
				var reg = new RegExp("\<[^>]+\>", "g");
				$('.PopUpHeader p').html(pageXml.revealCallOutContent[0].revealCallOut[id].buttonText[0].Text.replace(reg, ""));
			}else{
				$('.PopUpHeader').hide();
			}
			var str = "";
			for (var i = 0; i < pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text.length; i++) {
				var txtStyle=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text[i].style || '';
				str += "<div class='insertTab' style='"+txtStyle+"'><p>" + pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text[i].Text + "</p></div>";
				
			}
			$('.popUpText').html('<div class="scrollContent"><div class="textDiv">'+str+'</div></div>');
			
			var obj=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].textDivWidth;
			var popTxtWidth=obj==null?"":obj;
			$('.popUpText .insertTab').css('width',popTxtWidth);
			
			var obj=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].style;
			var _style=obj==null?"":obj;
			$('.popUpContainer').attr('style',_style);
			$('.popUpContainer').show();
			
			var obj=pageXml.revealCallOutContent[0].revealCallOut[id].popupArrow;
			var _style=obj==null?"":obj[0].style;
			$('.popUpArrow').attr('style',_style);
			//--for scroll
			
			var _extraPopObj=pageXml.revealCallOutContent[0].revealCallOut[id].extraPop;
				if(_extraPopObj!=null){
					isExtraPop=true;
					for (var j = 0; j < _extraPopObj.length; j++) {
						var str1="";
						var class1=""
						if(tempArray[id]==1){
							//class1="selected";
						}
						var _id="extraButton_"+id+"-"+j;
						var obj=_extraPopObj[j].buttonText[0].style;
						var _style=obj==null?"":obj;
						
						if(_extraPopObj[j].buttonImg!=null){
							str1+='<a class="extraButton '+class1+'" id="' + _id + '" style="' + _style + '" 	href="javascript:void(0);" ><span class="extraButtonTxt">'+_extraPopObj[j].buttonText[0].Text+'</span></a>'
						}else{
							str1+='<a class="extraButton '+class1+'" id="' + _id + '" style="' + _style + '" 	href="javascript:void(0);" ><span class="extraButtonTxt">'+_extraPopObj[j].buttonText[0].Text+'</span></a>'
						}
						var extraPopId="extraPopup_"+id+"-"+j;
						var obj=_extraPopObj[j].popText[0].style;
						var _popStyle=obj==null?"":obj;
						//var str2='<div class="extraPopupSemiBlack" ></div><div class="extraPopup '+class1+'" id="'+extraPopId+'" style="'+_popStyle+'">';
						var str2='<div class="extraPopup '+class1+'" id="'+extraPopId+'" style="'+_popStyle+'">';
					/* 	var extraArrow=_extraPopObj[j].popText[0].extraInfoArrow[0].style
						str2+='<div class="extraInfoArrow" style="'+extraArrow+'" ></div><a class="extraClose_info" href="javascript:void(0);" ></a>';	 */
						for (var k = 0; k < _extraPopObj[j].popText[0].text.length; k++) {					
							var obj=_extraPopObj[j].popText[0].text[k].style;
							var _popTxtStyle=obj==null?"":obj;
							str2+='<div class="extraInsertTab" style="'+_popTxtStyle+'"><p>' + _extraPopObj[j].popText[0].text[k].Text + '</p></div>'
						}
					str2+='</div>';
					if(pageXml.revealCallOutContent[0].revealCallOut[id].extraPop[0].addButton!=null){
						if(pageXml.revealCallOutContent[0].revealCallOut[id].extraPop[0].addButton=="up"){
							$('.popUpText .textDiv').prepend(str2);
							$('.popUpText .textDiv').prepend(str1);
						}
					}else{
						$('.popUpText .textDiv').append(str1);
						$('.popUpText .textDiv').append(str2);
					}
					
				}
				
				var _curPop;
				$('.extraButton').click(function() {
					if ($(this).hasClass('selected')) {
						return false;
					}
					$(this).addClass('selected');					
					var _id = $(this).attr('id').split('_')[1];
					_curPop= "#extraPopup_"+_id;
					$(_curPop).addClass('selected');
					if($('.textDiv').hasClass('scrollable')){
						var scrollTop = $('.scrollable').css('top').split('px')[0];
						$('.scrollContent').fw_Scroll('update');
						scrollTop=(scrollTop*2)+"px";
						$('.scrollable').css('top',scrollTop)
					}else{ 
						if($('.textDiv').parent().height() < $('.textDiv').height()){				
							$('.scrollContent').fw_Scroll({color:"#ffffff",width:10});
						}
						var scrollTop = $(_curPop).css('height').split('px')[0];
						$('.scrollContent').fw_Scroll('update');
						scrollTop=(scrollTop-10)+"px";
						$('.scrollable').css('top',"-"+scrollTop);
					 } 
					
					
					updateData(btnObj, id);
				})
				}
				
				
				
			var popH=$('.popUpContainer').outerHeight();
			var popHeaderH=$('.PopUpHeader').outerHeight();
			var PopTextMargin=20;
			//var _ht=popH-popHeaderH-PopTextMargin+"px"
			var _ht=popH-PopTextMargin+"px"
			
			$('.popUpText').css('height',_ht);
			$('.scrollContent').css('height','auto');			

			//-----
			$('.scrollContent').css('height',($('.scrollContent').parent().height()-5))		
			$('.scrollContent .textDiv').css('height','auto');			
			if($('.textDiv').parent().height() < $('.textDiv').height()){				
				$('.scrollContent').fw_Scroll({color:"#ffffff",width:10});
			}
		} else if (revealCallOutType == 2) {
			var w = pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].width;
			var h = pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].height;
			var lp = pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].left;
			var rp = pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].right;
			var tp = pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].top;
			if(globalPath.languageDir == 'ltr'){
			$('.popUpContainer').css({
				height: h,
				width: w,
				left: lp,
				top: tp
			})
			} else{
			$('.popUpContainer').css({
				height: h,
				width: w,
				right: rp,
				top: tp
			})
				}
			var str = "";
			for (var i = 0; i < pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text.length; i++) {
				str += "<div class='insertTab'><p>" + pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].text[i].Text + "</p></div>"
			}
			var obj=pageXml.revealCallOutContent[0].revealCallOut[id].popText[0].style;
			var _style=obj==null?"":obj;
			$('.popUpText').html('<div class="scrollContent" style="'+_style+'"><div>'+str+'</div></div>');
			
		}
		if(!isExtraPop){
			updateData(btnObj, id);
		}
		
		
	});
	function updateData(_btn, _id){
			var preVal = parseInt(dataArray[_id]);
			dataArray[_id] = 1;
			tempArray[_id] = 1;
			if (preVal == 0) {
				updateLMSData();
			}
			$(_btn).find('.tickCross').addClass('tick');
			updateTabIndex();
			if (tempArray.toString().indexOf("0") < 0 && !send) {
				send = true;
				pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
				templateMediator.pageVisited();
			}
		}
		
	$('.closePopUp').click(function() {
		$('.popUpContainer').hide();
		if (revealCallOutType == 1) {
			$('.rCallOutImg').attr('style', '');
		}
		$(revealCallOutButton).removeClass(selectedClass);
		updateTabIndex();
		return true;
	});
	$('.closePopUp').focusout(function() {
		var fid = Number($("#hot_" + currentSPId).attr('tabindex'));
		if (currentSPId == (totalrevealCallOut - 1)) {
			var str = "a[tabindex=" + (tbCnt + 1) + "]";
			$(str).focus();
		} else {
			$("#hot_" + (currentSPId + 1) + " ").focus();
		}
	});
	
	var preloadImagesArray = new Array();
	if (imgPath != "") {
		if (iPadBackground != undefined) {
			if (globalSettings.isDesktop()) {
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
			} else {
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].ipadPath);
			}
		} else {
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
		}
	}
        
            for (var i = 0; i < totalrevealCallOut; i++) {
                if(pageXml.revealCallOutContent[0].revealCallOut[i].img!=null){
                    preloadImagesArray.push(pageXml.revealCallOutContent[0].revealCallOut[i].img[0].path);
                 }
              }
	$.imgpreload(preloadImagesArray, {
		each: function() {},
		all: function() {
			try {
				templateMediator.templateLoadComplete();
				$("div[tabindex=1]").focus();
			} catch (err) {}
		}
	});

	function updateLMSData() {
		var tempData = dataArray.join("^");
		navigationData.updateCurrentPageData(tempData);
	}

	function updatePageLayOut() {}

	function setStyle(obj, _xml) {
		var clr = (_xml.color == null ? '#333740' : _xml.color);
		var fts = (_xml.fontSize == null ? '16px' : _xml.fontSize);
		var ftw = (_xml.fontWeight == null ? 'normal' : _xml.fontWeight);
		var txtA = (_xml.textAlign == null ? 'left' : _xml.textAlign);
		var txtB = (_xml.textAlign == null ? 'right' : _xml.textAlign);
		var wd = (_xml.width == null ? 'auto' : _xml.width);
		var ht = (_xml.height == null ? 'auto' : _xml.height);
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
		});
		} else{
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

	function updateTabIndex() {
		$('.popUpText, .closePopUp, .PopUpHeader').removeAttr("tabindex");
		tbCnt = 7;
		$('.insertTab').removeAttr('tabindex');
		for (var i = 0; i <= totalrevealCallOut; i++) {
			$('#hot_' + i).attr('tabindex', tbCnt);
			tbCnt++;
			if ($('.popUpContainer').is(':visible') && i == currentSPId) {
				$('#hot_' + i).attr('tabindex', tbCnt);
				tbCnt++;
				$('.popUpContainer .PopUpHeader').attr('tabindex', tbCnt);
				tbCnt++;
				$('.popUpContainer .popUpText').find('.insertTab').each(function() {
					$(this).attr('tabindex', tbCnt);
					tbCnt++;
				})
				$('.popUpContainer .closePopUp').attr('tabindex', tbCnt);
				tbCnt++;
			}
		}
		navigationEvent.updateGlobleFocus(tbCnt);
	}
}