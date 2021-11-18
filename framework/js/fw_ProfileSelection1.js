/*----------------------------------------
	Name: fw_ProfileSelection1.js
	Developed by: sunil vetal
----------------------------------------*/
function fw_ProfileSelection1(_xml){    
	var pageXml=_xml;
	
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var optionDisableClass ="optionDisable";
	var optionContainer=".optionContainer";
	var userAnsArray= new Array();
	var okButton=".continue";
	this.updatePageLayOut=updatePageLayOut;
	
	var str='';
	var totalQption=pageXml.optionContent[0].option.length;	
	var tbCnt=6;
	var selectedId="";		
	var optRow;
	var iPadBackground=pageXml.contentBackground[0].img[0].ipadPath;
	var preloadImagesArray=new Array();
	var isPreload=false;
	
	var selectedData=navigationData.profileEnvironment;	
	
	var prevData=false;
	var userChange=false;
	
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
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			isPreload=true;
			preloadImagesArray.push(iPadImgPath);		
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			isPreload=true;
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
			isPreload=true;
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);					
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/	
	
	/*---------------*/
	
	str="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		str+='<div class="pText" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>'
	}
	$('.pageText').html(str);
	
	str="";
	for(var i=0; i<totalQption; i++){
		str="";
		var _optObj=pageXml.optionContent[0].option[i];
		var _style=_optObj.style;
		var _optObjStyle=_style==null?"":_style;
		var _profilerId=_optObj.profilerId;
		var _imgObj=_optObj.img[0];
		var _imgPath=_imgObj.path;
		var _imgAltText=_imgObj.Text;
		var _optText=_optObj.text[0].Text;
		var _optid="option_"+i;
		var _optClass="option";
		str+='<div id="'+_optid+'" class="'+_optClass+'">';
		if(_imgPath!="" && _imgPath!=null){
			isPreload=true;
			preloadImagesArray.push(_imgPath);
			str+='<img class="opt_img" src="'+_imgPath+'" alt="'+_imgAltText+'"/>';
		}
		str+='<a class="optionButtonContainer" data="'+_profilerId+'">'
			str+='<div class="optionButton"></div>'
			str+='<div class="optText"><span class="spText">'+_optText+'</span></div>'
		str+='</a>'
		$('.optionContainer').append(str);
	}
		
	str ='<a href ="javascript:void(0);" class="a-button continue disabled" ><span class="btntext"></span></a>';
	$('.profileSelection1 .content-bg').append(str);
	
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	navigationEvent.updateGlobleFocus(tbCnt);
	
	if(isPreload){
		$.imgpreload(preloadImagesArray,
		{
			each: function()
			{	
			},
			all: function()
			{
				try{
					pageLoaded();
					}catch(err){}
			}
		});
	}else{
		pageLoaded();
	}
	updatePageLayOut();
	 
	 function updatePageLayOut(){
	 
	 }	
	function pageLoaded(){
		templateMediator.templateLoadComplete();
		pageTitle.updateTitleByText(pageXml.contentTitle[0].text[0].Text);
		checkPrevData();
		addEvent();
		checkOkButton();
	 }
	 function checkPrevData(){
		if(selectedData!=""){
			$(".optionButtonContainer").each(function() {
			  var data=$(this).attr('data');
			  if(data==selectedData){
				$(this).addClass(selectedClass);
				prevData=true;
			  }
			});
		}
	 }
	 function checkOkButton(){		
		var isOptSelect=$(".optionButtonContainer").hasClass(selectedClass);
		if(isOptSelect){
			$(okButton).removeClass('disabled');
		}else{
			$(okButton).addClass('disabled');
		}	
			 
	 }
	function addEvent(){
		$('.optionButtonContainer').hover( function(){
		if($(this).hasClass(selectedClass) || $(this).hasClass(optionDisableClass)){
			return false;
		}
		$(this).addClass(optionHoverClass);
		},
		  function () {
			$(this).removeClass(optionHoverClass);
		});
		$('.optionButtonContainer').click( function(){
			if($(this).hasClass(selectedClass) || $(this).hasClass(optionDisableClass)){
				return false;
			}
			if(prevData){
				showreEnteryAlert(this);
			}else{	
				selectOption(this);
			}
			
		});
		$(okButton).click( function(){
			if($(this).hasClass('disabled')){
				return false;
			}
			$(this).addClass('disabled');
			$('.optionButtonContainer').addClass(optionDisableClass);			
			navigationData.updateUserNavigation(selectedData, userChange);
		});
	}	
	 function selectOption(_mc){
		$('.optionButtonContainer').removeClass(selectedClass);
		$(_mc).addClass(selectedClass);
		selectedData=$(_mc).attr('data');
		prevData=false;
		checkOkButton();
			
	}
	function showreEnteryAlert(_mc){
		
		$('.SemiBlack').show();
		
		$.fw_BookMark({text:globalData.navigationTextXML.reEntryProfilerPopup[0].text[0].Text,yes:globalData.navigationTextXML.reEntryProfilerPopup[0].text[1].Text,no:globalData.navigationTextXML.reEntryProfilerPopup[0].text[2].Text});
		$('.fw_BookMarkPopWindow').addClass('reEntryAlert');	
		$('.fw_BookMarkYes').addClass('reEntryAlert');	
		$('.fw_BookMarkNo').addClass('reEntryAlert');	
		$('.fw_BookMarkText').addClass('reEntryAlert');	
	
		$('.fw_BookMarkPopWindow').bind(courseEvent.BOOKMARK_YES, function(e){	
			userChange=true;
			$.fw_BookMark('hide');		
			
			$('.SemiBlack').hide();			
			selectOption(_mc);
		});
		$('.fw_BookMarkPopWindow').bind(courseEvent.BOOKMARK_NO, function(e){
			$('.fw_BookMarkPopWindow').removeClass('reEntryAlert');
			$('.fw_BookMarkYes').removeClass('reEntryAlert');	
			$('.fw_BookMarkNo').removeClass('reEntryAlert');	
			$('.fw_BookMarkText').removeClass('reEntryAlert');	
			$.fw_BookMark('hide');
			
			$('.SemiBlack').hide();	
		});		
	}	
}
