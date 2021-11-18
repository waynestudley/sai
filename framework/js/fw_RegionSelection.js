function fw_RegionSelection(_xml){	
   	var pageXml=_xml;
	var optionButton=".regionSelection .optionButton";
	var selectedClass = "optionSelect";
	var userChange=false;	
	var selval="";	
	var optionHoverClass ="optionHover";
	var optionSelect=0;
	this.updatePageLayOut=updatePageLayOut;
	var prevProfileData=navigationData.userProfileLocVal.toString();
	$('.courseName').html(pageXml.contentText[0].text[0].Text);	
	$('.btntext').html(pageXml.buttonText[0].text[0].Text);
	/**************/
		var className= pageXml.contentBackground[0].img[0].className || '';
		var imgStyle= pageXml.contentBackground[0].img[0].style || '';
		$('.panelBg').addClass(className);
		$('.panelBg').attr('style',imgStyle);
	/**************/

	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			//$('.panelBg').attr("alt", pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/
	var tempArray= new Array();
	for(var i=0;i<pageXml.dropDownMenu[0].option.length;i++){		
		var txt=pageXml.dropDownMenu[0].option[i].Text;
		var val=pageXml.dropDownMenu[0].option[i].id;		
		var obj={val:val,data:txt};
		tempArray.push(obj);
	}
	var defSelect = "";
	if (prevProfileData != "") {
	 	 defSelect=prevProfileData;	
			selval = prevProfileData;
		$('.regionSelection .continue').removeClass('disabled');
	}
	$('.RSCombBg').fw_DropDown({dataArray:tempArray,defaultSelect:defSelect,tabIndex:5,callback:function(regionSel){
		if((prevProfileData !="" && prevProfileData!=null && prevProfileData!=undefined && prevProfileData!="undefined" && !userChange)){
			if(regionSel!=prevProfileData){
				selval = regionSel;
				showreEnteryAlert(this);
			}else{			
				selval = regionSel;
			}		
		}else{
			if(regionSel!="" && regionSel!=null && regionSel.toLowerCase()!="r0"){
				//globalPath.userRegion=regionSel;
				$('.regionSelection .continue').removeClass('disabled');
				selval = regionSel;
			}else{
				selval = "";
				$('.regionSelection .continue').addClass('disabled');
				
			}
		}
	}});
	
	$('.regionSelection .continue').live('click',function(){
		if($(this).hasClass('disabled'))return false;
		$(this).addClass('disabled');		
		var selectLoc = selval;
		
		navigationData.updateUserNavigation2(selectLoc,userChange);

	});	
	$('.regionSelection .continue').focusout(function() {
		$("div[tabindex=1]").focus();	
	});
		
	try{
	 templateMediator.templateLoadComplete();
	}catch(err){}
	
	$('.regionSelection .continue').focus(function() {	
		if($(this).hasClass('disabled')){
			$("div[tabindex=1]").focus();
			return false;
		}				
	});
	//$("a[tabindex=1]").focus();	
	function selectOption(){
		selval = prevProfileData;
		$('.RSCombBg').fw_DropDown('update');
	}
	function updatePageLayOut(){
		
	
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
			//selectOption(_mc);
		});
		$('.fw_BookMarkPopWindow').bind(courseEvent.BOOKMARK_NO, function(e){
			$('.fw_BookMarkPopWindow').removeClass('reEntryAlert');
			$('.fw_BookMarkYes').removeClass('reEntryAlert');	
			$('.fw_BookMarkNo').removeClass('reEntryAlert');	
			$('.fw_BookMarkText').removeClass('reEntryAlert');	
			$.fw_BookMark('hide');
			selectOption();
			$('.SemiBlack').hide();	
		});		
	}
}