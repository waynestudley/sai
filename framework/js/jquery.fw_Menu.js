/*----------------------------------------
Name: jquery.fw_Menu.js
Developed by: Suyog Shaha  
 ----------------------------------------*/

(function($) {
	var defaults = {};
	var navTextXML;	
	var menuGroup;
	var navXml;
	var menuButton=".menuModule";
	var menuHoverClass="menuModuleHover";
	var totGr=0;
	var evenAdd=false;
	var isTranscriptOn=false;
	var anyComplete=0;
	var anySubModulesComplete=false;
	var subModulesCompleted=false;
	var assessmentModule=false;
	var isAnyIncomplete=true;
	var startBtn;
	var tabCnt=0;
	var anySubModulesInComplete=false;
	var subModId = "";
	var assessmentModId = "";
	var challangesModId = "";
	var certificateModId = "";
	var allunlockModuleComplete = true;
	var optionalText="";
	var compalsaryModArr=new Array();
	var allModArr=new Array();
	var methods = {		
		init : function(options) {
			preLoade.showPreLoader("Loading Page....");
			$('.subGroupContainer').hide();
			$('.groupContainer').hide();
			navigationEvent.hideIconForMenu();
			allunlockModuleComplete = true;
			var preloadImagesArray=new Array();
			navTextXML=globalData.navigationTextXML;
			for (var j= 0; j <navTextXML.contentBackground[0].img.length; j++) {
				preloadImagesArray.push(navTextXML.contentBackground[0].img[j].path);
			}
			
			for (var i= 0; i <navTextXML.module.length; i++) {
				preloadImagesArray.push(navTextXML.module[i].imgPath);
			}	
			$('#btn_AudioOnOff,#btn_TranscriptOnOff,#btn_PlayPauseReplay').addClass("disabledNavBtn");
			$.fw_Transcript('hide');			
			mediaPlayer.clearAudio();			
			navXml=globalData.navigationXML;
			menuGroup=navXml.menuGroup[0];
			totGr=menuGroup.group.length;
			startBtn=navTextXML.buttonText[0].text[0].Text;
			optionalText=navTextXML.optionalText[0].text[0].Text;
			compalsaryModArr=new Array();
			allModArr=new Array();
			var str='<div class="menupage"  ><div class="panelBg" ></div><div class="content-panel" ><div class="content-bg"><div class="white-background-bg" ><div class="pageTitle" tabindex="2" ><p></p></div>	<div class="contentText" tabindex="4" ></div><div class="pageInstruction menuInstr" tabindex="5"><p class="instructionText"></p></div></div><div class="groupContainer" ></div><div class="subGroupContainer" ></div></div></div></div>';
			
			
			$(".pageContainer").html(str);
			updateContentText();
			/************************/
			if(navTextXML.pageTitle!=null){
				var pageTitleStyle= navTextXML.pageTitle[0].style||''; 
				$('.pageTitle').attr('style',pageTitleStyle)
			}
			if(navTextXML.instructionText[0].style!=null){
				var instStyle= navTextXML.instructionText[0].style||''; 
				$('.pageInstruction').attr('style',instStyle)
			}
			if(navTextXML.transcript[0].style!=null){
				$('.fw_TranscriptContainer').attr('style',navTextXML.transcript[0].style)
			}
			if(navTextXML.contentBg[0].style!=null){
				$('.content-bg').attr('style',navTextXML.contentBg[0].style)
			}	
			/************************/
			pageTitle.updateTitleByText(navTextXML.title[0].text[0].Text);
			pageTitle.updateModuleTitleByText(navTextXML.title[0].text[2].Text);
			pageInstruction.updateText(navTextXML.instructionText[0].text[0].Text);
			var totMcnt=0;
			var totCmp=0;
			for (var i= 1; i <navXml.module.length; i++) {
				if(navXml.module[i].subModule == "true"){
					subModId = navXml.module[i].id;
				}
				if(navXml.module[i].modType == "assessment"){
					assessmentModId = navXml.module[i].id;
				}
				if(navXml.module[i].modType == "certificate"){
					certificateModId = navXml.module[i].id;
				}
				if(navXml.module[i].modType == "challanges"){
					challangesModId = navXml.module[i].id;
				}
				if(navXml.module[i].subMod!=null){
					totMcnt++;
					var modId=parseInt(navXml.module[i].id);
					var findStr=navigationData.getRemoveModulesIdArray().toString();	
					var str=modId.toString();
					var found=false;			
					if (findStr.compareSingleChar(str)) {				
						found=true;				
					}
					if(found){
						totMcnt--;
					}else{
						totCmp+=navigationData.isModuleComplete(modId);
					}
				}
				var _id=navXml.module[i].id;
				allModArr.push(_id);
			}
			
			if(totCmp==(totMcnt*2)){
				subModulesCompleted=true;
			}else if(totCmp>0){
				anySubModulesInComplete=true;
			}
						
			for (var i = 0; i < allModArr.length; i++) {		
				var findStr=navigationData.getRemoveModulesIdArray().toString();	
				var str=allModArr[i].toString();
				var found=false;			
				if (findStr.compareSingleChar(str)) {				
					found=true;				
				}
				if(!found){
					compalsaryModArr.push(str);
				}
			}
			//console.log("allModArr: "+allModArr)
			//console.log("compalsaryModArr: "+compalsaryModArr)
			var removeItem = subModId;
			compalsaryModArr = $.grep(compalsaryModArr, function(value) {
			  return value != removeItem;
			});	
			var removeItem = assessmentModId;
			compalsaryModArr = $.grep(compalsaryModArr, function(value) {
			  return value != removeItem;
			});	
			var removeItem = certificateModId;
			compalsaryModArr = $.grep(compalsaryModArr, function(value) {
			  return value != removeItem;
			});			
			//console.log("11compalsaryModArr: "+compalsaryModArr)
			//--
			navigationData.gb_compalsaryModArr=compalsaryModArr;
			//--
			tabCnt=6;
			isAnyIncomplete = false;
			for (var i = 0; i < menuGroup.group.length; i++) {					
				if (menuGroup.group[i].moduleId.length>0) {
					var grpId = menuGroup.group[i].id;
					var temp = menuGroup.group[i].moduleId.split(',');
					for (var j = 0; j < temp.length; j++) {
						tabCnt++;
						addModuleText(grpId, temp[j], j,tabCnt);
					}
				}
				
			}
			//--
			dataStore.updateUserData();
			//--
			navigationEvent.updateGlobleFocus(tabCnt);	
								
			$.imgpreload(preloadImagesArray,{
				each: function()
				{	
				},
				all: function()
				{
					try{
						$('.menupage').show();
						preLoade.hidePreLoader();
						
					}catch(err){}
				}
			});
				
			$('.startBtn').click(function() {				
				hideMenuToolTip();
				var modId=getModId($(this).attr('id').split("moduleSt")[1]);
				modId= parseInt(modId);
				loadModulePages(modId);			
			 });
			 
			$('.closeOverText').click(function() {				
				closeOverTextPopUp();			
			});
			$(menuButton).click(function() {
				if ($(this).hasClass('disabled')) return false;				
				closeOverTextPopUp();
				var overtext = $(this).parent().find('.overText');
				overtext.css('display','block');
				$(this).parent().addClass(menuHoverClass);			
				$(this).parent().find('.overTextArrow').css('display','block');
				$(this).parent().find('.startBtn').css('display','block');
							
				var ht = $(this).height();
				var wt = $(this).width();
				var pos0 = $('.groupContainer').offset();
				if(navigation.isSubModuleLoad){
					pos0 = $('.subGroupContainer').offset();
				}
				
				var pos1 = $(this).offset();
				var btn_left = pos0.left-pos1.left;
				//var btn_right = pos1.left-pos0.left;
				var btn_right = 0;
				var btn_top = pos0.top-pos1.top;
				
				var overTextWidth =overtext.width();
				var overTextHeight=overtext.outerHeight();
				var padding;
				if(globalPath.languageDir == 'ltr'){
					padding= getNumber($('.groupContainer').css('padding-left'));
				} else{
					padding= getNumber($('.groupContainer').css('padding-right'));
				}
				var arrowHeight = 10;
				var arrowWidth = 12;
				var lf = 0;
				var ri = 0;
				var tp = ht+arrowHeight;
				var a_left = (wt/2)-(arrowWidth/2);
				var a_right = (wt/2)-(arrowWidth/2);
				var a_top = ht;
				if(globalPath.languageDir == 'ltr'){
					if(btn_left+overTextWidth>1010){
						lf = -(overTextWidth-wt+(padding/2))-1;
					}
				} else{
					if(btn_right+overTextWidth<1010){
						ri = -(overTextWidth-wt+(padding/2))-1;
					}
				}
				if((btn_top+ ht+arrowHeight)>450){
					tp = -(overTextHeight+arrowHeight - 2);
					a_top = -arrowHeight;
					$('.overTextArrow').addClass('down');
				}				
				
					$('.overText').css({left:btn_left+'px',top:(btn_top)+'px'});
					
			});
					
			if (!evenAdd) {
				evenAdd=true;
			}	
			
			$("div[tabindex=1]").focus();
			$('body').scrollTop(0);	
			navigation.removeBlinker();		
			if(navTextXML.contentBackground[0].img[0].path!=""){
				$('.panelBg').css('background-image','url(' + navTextXML.contentBackground[0].img[0].path + ')');
				$('.panelBg').attr('title',navTextXML.contentBackground[0].img[0].Text);						
			}else{
				$('.panelBg').remove();
			}
			
			if(navigation.isSubModuleLoad){
				loadSubModules();	
			}else{
				playAudio();	
			}
			
			
			
			$(menuButton).hover( function(){
				if ($(this).hasClass("disabled") || !globalSettings.isDesktop()) {
					return false;
				}
				$(this).addClass(menuHoverClass);		
			},
			  function () {
				$(this).removeClass(menuHoverClass);
				
				
			});
		},
		updateCurrentPage : function(indexs) {
			
		},
		updateVisitedPage: function(indexs) {
			
		},
		hideToolTip: function(indexs) {
			hideMenuToolTip();
		},
		replayAudio: function(indexs) {
			playAudio();
		}
	};
	
	$.fn.fw_Menu = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if( typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.customMenu');
		}
	};
	
	function updateContentText(){
		$(".contentText").removeClass("submenu");
		var txt = navTextXML.contentText[0].text[0].Text;
		var txt2 = navTextXML.contentText[0].text[1].Text;
		var txt3 = navTextXML.contentText[0].text[2].Text;
		
		
		$(".contentText").html('<p>'+txt+'</p><p>'+txt2+'</p><p>'+txt3+'</p>');
		if(navigation.isSubModuleLoad){
			txt = navTextXML.contentText[0].text[3].Text;
			$(".contentText").html('<p>'+txt+'</p>');
			$(".contentText").addClass("submenu");
		}
		
	}
	function closeOverTextPopUp(){
		$('.overTextArrow').removeClass('down');
		$('.overTextArrow').hide();
		$('.overText').hide();
		$('.startBtn').hide();
		$('.menuModuleParent').removeClass(menuHoverClass);
	}
	function playAudio(){
		
		if(navigation.isSubModuleLoad){
			palySubModulesAudio();
		}else{
			if(anyComplete || subModulesCompleted){
				var audioPath=navTextXML.transcript[0].text[1].path;
				navigation.playAudioByURL(audioPath);
				$.fw_Transcript('updateText', navTextXML.transcript[0].text[1].Text);
			}else{
				var audioPath=navTextXML.transcript[0].text[0].path;
				navigation.playAudioByURL(audioPath);
				$.fw_Transcript('updateText', navTextXML.transcript[0].text[0].Text);
			}
			
			if(!isAnyIncomplete){
				var audioPath=navTextXML.transcript[0].text[1].path;
				navigation.playAudioByURL(audioPath);
				$.fw_Transcript('updateText', navTextXML.transcript[0].text[1].Text);
				pageInstruction.updateText(navTextXML.instructionText[0].text[2].Text);
			}
			
		}
		
	}
	
	function loadModulePages(modId){	
		if(navXml.module[modId].id==subModId){
			loadSubModules();
		}else{	
			$('.panelBg').css('background-image','url(' + navTextXML.contentBackground[0].img[1].path + ')');
		   $('.panelBg').attr('title',navTextXML.contentBackground[0].img[1].Text);		
			menuData.moduleIndex=modId;				
			menuData.pageIndex=0;
			if(navigationData.getSubModuleId()>0){
				navigation.loadCurrentPage();
			}else{
				checkBookMark();
			}
			hideMenuToolTip();
		}
	
	}
	function loadSubModules(){	
		navigation.isSubModuleLoad=true;
		updateContentText();
		$('.subGroupContainer').show();
		$('.panelBg').css('background-image','url(' + navTextXML.contentBackground[0].img[1].path + ')');
		$('.panelBg').attr('title',navTextXML.contentBackground[0].img[1].Text);			
		if(navTextXML.contentBg[0].chanStyle!=null){
			$('.content-bg').attr('style',navTextXML.contentBg[0].chanStyle)
		}	
		$('.groupContainer').hide();
		navigationEvent.hideIconForMenu();	
		$("div[tabindex=1]").focus();	
		pageInstruction.updateText(navTextXML.instructionText[0].text[1].Text);		
		pageTitle.updateTitleByText(navTextXML.title[0].text[1].Text);
		pageTitle.updateModuleTitleByText(navTextXML.title[0].text[3].Text);
		palySubModulesAudio();
		$.fw_Transcript('hide');
	}
	
	function palySubModulesAudio(){		
		if(navTextXML.transcript[0].text[1].Text != "" && navTextXML.transcript[0].text[1].Text != null){
			var audioPath=navTextXML.transcript[0].text[1].path;
			$.fw_Transcript('updateText',navTextXML.transcript[0].text[1].Text);
			navigation.playAudioByURL(audioPath);
			/* if(subModulesCompleted){
				pageInstruction.updateText(navTextXML.instructionText[0].text[4].Text);
			} */
		}
		if(subModulesCompleted){
				pageInstruction.updateText(navTextXML.instructionText[0].text[4].Text);
		}
	}
	
	function showBookMark(_pg){
		mediaPlayer.clearAudio();
		$(".pageContainer").html("");
		pageTitle.updateTitleByText("");
		pageTitle.updateModuleTitleByText("");			
		$.fw_BookMark({text:navTextXML.bookMark[0].text[0].Text,yes:navTextXML.bookMark[0].buttonText[0].text[0].Text,no:navTextXML.bookMark[0].buttonText[0].text[1].Text});		
		$('.fw_BookMarkPopWindow').bind(courseEvent.BOOKMARK_YES, function(e){		
			menuData.pageIndex =_pg;			
			if(navigationData.getPageType() == "knowledgeCheckSummary"){
				menuData.pageIndex=1;
			}
			$.fw_BookMark('hide');			
			navigation.loadCurrentPage();
		});
		$('.fw_BookMarkPopWindow').bind(courseEvent.BOOKMARK_NO, function(e){
			$.fw_BookMark('hide');			
			navigation.loadCurrentPage();
		});		
	}
	
	function checkBookMark(){
		var pg= parseInt(navigationData.getBookMark());
		if(pg>=0 && playerSetting.isBookmark){
			showBookMark(pg);
		}else{			
			navigation.loadCurrentPage();
		}		
	}
	
	function showMouseOver(mId){
		
		
	}
	
	function hideMenuToolTip(){
		$('.menuToolTip').hide();		
	}
	function addModuleText(groupId,modId,_mCnt,_tabCnt){		
		var tText=getTitleById(modId);
		var oText=getOverTextById(modId);
		var bgImgPath=getBgImgPathById(modId);
		var bgImgPopPath=getBgImgPopPathById(modId);
		var bgImgAltTxt=getAltTextById(modId);
		var mClass="";	
		
		switch(navigationData.isModuleComplete(modId)){
			case 0:
		
				mClass="";	
			
			break;
			case 1:			
				mClass="menuIncomplete";				
			break;
			case 2:
				mClass="menuComplete";
				if(_mCnt==0){
					anyComplete=1;
				}
				
			break;			
		}
		if(subModulesCompleted && modId==subModId){
			mClass="menuComplete";
		}else if(anySubModulesInComplete && modId==subModId){
			mClass="menuIncomplete";			
		}
		
		if(mClass != 'menuComplete'){
			isAnyIncomplete = true;
		}
		
		var cs="";		
	  	if(modId==challangesModId || modId==certificateModId || modId==assessmentModId ){
			cs=" disabled";
		} 
		var str ='<div class="menuModuleParent  '+mClass+'"><a href="javascript:void(0)"  class="menuModule transparentBg moduleFirst '+mClass+ cs+'" id="module'+modId+'" tabindex="'+_tabCnt+'" alt="'+tText+'"><img class="menuImage" src="'+bgImgPath+'" alt="'+bgImgAltTxt+'" /><div class="tickCross"></div><div class="moduleText"><div class="text">'+tText+'</div></div></a><div class="overTextArrow" ></div><div class="overText"><a class="closeOverText" href="javascript:void(0);" tabindex="'+(_tabCnt+2)+'"></a><img class="menuPopImage" src="'+bgImgPopPath+'" alt="'+bgImgAltTxt+'" /><div class="oTxtCon-table" ><div class="oTxtCon" ><div class="oTxtCon-div" ><p class="title">'+tText+'</p>'+oText+'</div><a href ="javascript:void(0);" id="moduleSt'+modId+'" class="a-button startBtn '+mClass+'" tabindex="'+(_tabCnt+1)+'" ><span class="btntext">'+startBtn+'</span></a></div></div></div><div class="optinalTextDiv" ><div class="optinalText" >'+optionalText+'</div><div class="optinalArrow" ></div></div>';
			_tabCnt+=3;
			str+='</div>';
		if(_mCnt==0){	
			$('.groupContainer').append(str);
			$('a').on('dragstart', function(event) { event.preventDefault(); });		
		}else{			
			$('.subGroupContainer').append(str);
			$('a').on('dragstart', function(event) { event.preventDefault(); });
		}
		
		checkOptionalModuleStatus(modId);
		checkModuleStatus();
	}
	
	function checkOptionalModuleStatus(_modId){
		var findStr=navigationData.getRemoveModulesIdArray().toString();	
		var str=_modId;
		var found=false;			
		if (findStr.compareSingleChar(str)) {				
			found=true;				
		}
		if(found){
			var _currMod=$('#module'+_modId);
			_currMod.siblings(".optinalTextDiv").css('display','table');
			
			_currMod.addClass('moduleOptional');
			_currMod.addClass('menuOptional');
			var isComplete=_currMod.hasClass('menuComplete');
			var isInComplete=_currMod.hasClass('menuIncomplete');
			if(isComplete || isInComplete){
				_currMod.removeClass('menuOptional');
			}
		}
	}
	
	function checkModuleStatus(){
		
		var assessmentMod=$('#module'+assessmentModId);
		var certificateMod=$('#module'+certificateModId);
		var challangesMod=$('#module'+challangesModId);
		var totMod=compalsaryModArr.length;
		var completedMod=0;
		for (var i= 0; i <totMod; i++) {
			var _id=parseInt(compalsaryModArr[i]);
			completedMod+=navigationData.isModuleComplete(_id);
		}
		if(assessmentModId!=""){
			assessmentMod.addClass('disabled');
			certificateMod.addClass('disabled');
			if(completedMod==(totMod*2)){				
				assessmentMod.removeClass('disabled');
			}
			if (navigationData.isPass){
				
				assessmentModule=true;
				certificateMod.removeClass('disabled');
				assessmentMod.addClass('menuComplete');
			}
		}else{
			certificateMod.addClass('disabled');
			if(completedMod==(totMod*2)){				
				certificateMod.removeClass('disabled');
			}
		}
		var fCom=0;
		for (var i= 0; i <totMod; i++) {
			if(compalsaryModArr[i] < 11){
				var _id=parseInt(compalsaryModArr[i]);
				if(navigationData.isModuleComplete(_id)){
					fCom++;
				}
			}	
		}
		if(fCom==(totMod-1)){
			challangesMod.removeClass('disabled');
		}
		
	}
	
	function getTitleById(modId){
		var str="";
		for (var i= 0; i <navTextXML.module.length; i++) {				
			if(navTextXML.module[i].id==modId){
				str=navTextXML.module[i].title[0].Text;
				break;
			}					
		}
		return str;
	}
	
	function getModId(modId){
		var _modId=0;
		for (var i= 0; i <navXml.module.length; i++) {				
			if(navXml.module[i].id==modId){
				_modId=i;
				break;
			}					
		}
		return _modId;
	}
	function getOverTextById(modId){
		var str="";
		for (var i= 0; i <navTextXML.module.length; i++) {				
			if(navTextXML.module[i].id==modId){
				str=navTextXML.module[i].overText[0].Text;
				break;
			}					
		}
		return str;
	}
	function getAltTextById(modId){
		var str="";
		for (var i= 0; i <navTextXML.module.length; i++) {				
			if(navTextXML.module[i].id==modId){
				str=navTextXML.module[i].altText[0].Text;
				break;
			}					
		}
		return str;
	}
	function getBgImgPathById(modId){
		var str="";
		for (var i= 0; i <navTextXML.module.length; i++) {				
			if(navTextXML.module[i].id==modId){
				str=navTextXML.module[i].imgPath;
				break;
			}					
		}
		return str;
	}
	function getBgImgPopPathById(modId){
		var str="";
		for (var i= 0; i <navTextXML.module.length; i++) {				
			if(navTextXML.module[i].id==modId){
				str=navTextXML.module[i].imgPopPath;
				break;
			}					
		}
		return str;
	}
	
	$.extend({
		fw_Menu : $.fn.fw_Menu
	});
	
	addMenuTip = function() {  
		var mTip ='<div class="menuToolTip menuToolTipLeft"><div class="menuArrow "></div><div class="menuToolTipText"><p>Text</p></div></div>';
		if ($(".menuToolTip").length > 0){
		 
		}else{
			$("body").prepend(mTip);
		}
   };
   	
	
})(jQuery);

