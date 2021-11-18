/*----------------------------------------
	Name: fw_ProfileSelection.js
	Developed by: Suyog Shaha
----------------------------------------*/

function fw_ProfileSelection(_xml){
	var pageXml=_xml;
	var userChange=false;	
	var optionButton=".profileSelection .optionButton";
	var selectedClass = "optionSelect";
	var optionHoverClass ="optionHover";
	var yes=pageXml.profilerAnswer[0].text[0].Text;
	var no=pageXml.profilerAnswer[0].text[1].Text;
	var totalQue=pageXml.profilerQuestions[0].text.length;
	var displayQue=0;
	this.updatePageLayOut=updatePageLayOut;
	var str='';	
	$('.pageText p').html(pageXml.contentText[0].text[0].Text);	
	str ='<table border="0" ><tr><td></td> <td class="optionLabel">'+yes+'</td><td ></td><td class="optionLabel">'+no+'</td> </tr><tr><td colspan="4"><div class="blanktr"></div></td></tr>'
	var tbCnt=6;
	 //-------updated for reEntry alert
	var prevProfileData=navigationData.userProfileArray.toString();
	
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
	//----------
	for(var i=0;i<totalQue;i++){
		//if(navigationData.profileQueArray[i]!=null){
			var qStr=getProfileQuestion(i);
			displayQue++;
			str +='<tr>';
			str +='<td class="colm1" ><div tabindex="'+tbCnt+'"><p>'+qStr+'</p></div></td>';
			tbCnt++;
			str +='<td class="colm2"><a  href="javascript:void(0);" class="optionButton" tabindex="'+tbCnt+'" id="a_'+(i+1)+'" val="op_'+(i+1)+'Y" style="cursor: pointer;"></a></td>';
			str +='<td class="blkWidth"></td>';
			tbCnt++;
			str +='<td class="colm3"><a  href="javascript:void(0);" class="optionButton" tabindex="'+tbCnt+'" id="r_'+(i+1)+'" val="op_'+(i+1)+'N" style="cursor: pointer;"></a></td>';
			str +='</tr>';
			tbCnt++;
			str +='<tr><td colspan="4"><div class="blanktr"></div></td></tr>';			
		//}
     }
	 //-------updated for reEntry alert
	 str +='</table><a href ="javascript:void(0);" class="a-button continue disabled" ><span class="btntext"></span></a>'
	 $('.profileQues').html(str);
	 //--------
	 $('.pageInstruction').attr('tabindex',tbCnt);
	 /*-----Below code is added for two separate background for iPad and desktop.-------*/
	if(globalSettings.isIpad){
		var iPadImgPath=pageXml.contentBackground[0].img[0].ipadPath;
		if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){					
			$('.panelBg').css('background-image','url(' + iPadImgPath + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
		}else if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);
		}else{
			$('.panelBg').remove();
		}
	}else{
		if(pageXml.contentBackground[0].img[0].path!=""){
			$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			$('.panelBg').attr('title',pageXml.contentBackground[0].img[0].Text);						
		}else{
			$('.panelBg').remove();
		}
	}
	/*---------------*/	
	
	 $('.btntext').html(pageXml.buttonText[0].text[0].Text);
	 $('.profileSelection .continue').attr('tabindex',(tbCnt+1));
		navigationEvent.updateGlobleFocus(tbCnt);
	 if(navigationData.userProfileArray.length>0){
	 	for (var i = 0; i < navigationData.userProfileArray.length; i++) {
			var opt="#"+navigationData.userProfileArray[i];
			$(opt).addClass(selectedClass);
			$(opt).css('cursor','default');
		}
	 }
	 checkSelection();
	 
	 pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	 $(optionButton).live('click',function(){
		 //-------updated for reEntry alert
		if($(this).hasClass('optionSelect'))return false;
		//alert("prevProfileData: "+prevProfileData)
		if(prevProfileData !="" && prevProfileData!=null && prevProfileData!=undefined && prevProfileData!="undefined" && !userChange){
			showreEnteryAlert(this)
		}else{
			userChange=true;
			selectOption(this);
		}
		//----------
	})
	
	$('.profileSelection .continue').live('click',function(){
		if($(this).hasClass('disabled'))return false;
		$(this).addClass('disabled');		
		var selectArray=new Array();
		var proArray=new Array();
		$('.profileQues').find('.optionButton').each(function(){			
			if($(this).hasClass('optionSelect')){
 				selectArray.push($(this).attr('val').split('op_')[1]);
				proArray.push($(this).attr('id'));
			}			
		});
		//alert("selectArray: "+selectArray+"\n:userChange: "+userChange+"\n:proArray: "+proArray)
		navigationData.updateUserNavigation1(selectArray,userChange,proArray);
	})
	
	$('.profileSelection .continue').focus(function() {	
		if($(this).hasClass('disabled')){
			$("div[tabindex=1]").focus();	
			return false;
		}				
	});	
	$('.profileSelection .continue').focusout(function() {
		$("div[tabindex=1]").focus();	
	});
	$(optionButton).hover( function(){
		if($(this).hasClass(selectedClass) || (!globalSettings.isDesktop())){
			return false;
		}
		$(this).addClass(optionHoverClass);
	},
	  function () {
		$(this).removeClass(optionHoverClass);
	});
	$("div[tabindex=1]").focus();
	function getProfileQuestion(_id){
		var qs="";		
		for (var i = 0; i < totalQue; i++) {
			if(parseInt(_id)== parseInt(pageXml.profilerQuestions[0].text[i].id)-1){
				qs=pageXml.profilerQuestions[0].text[i].Text;
				break;
			}
		}
		return qs;
	}
	function checkSelection(){		
		var cnt=0;
		$('.profileQues').find('.optionButton').each(function(){			
			if($(this).hasClass('optionSelect')){				
				cnt++;
			}			
		});	
		if(displayQue ==cnt ){
			$('.profileSelection .continue').removeClass('disabled');			 
		}else{
			$('.profileSelection .continue').addClass('disabled');
		}
	}
	 try{
         templateMediator.templateLoadComplete();
		 pageTitle.updateTitleByText(pageXml.contentTitle[0].text[0].Text);
		navigationEvent.initToolTip();
     }catch(err){}
	 
	  $('.profileQues').find('.psQtext').each(function(){	 	
	 	if($(this).height()>20){			
			$(this).addClass('mt5')
		}
	 })
	 
	 
	 function updatePageLayOut(){
	 	
		
	 }
	 //-------updated for reEntry alert
	 function selectOption(_mc){
			var mNae=$(_mc).attr('id').split('_')[1];
			$('#a_'+mNae).removeClass(selectedClass);
			$('#a_'+mNae).css('cursor','pointer');
			$('#r_'+mNae).removeClass(selectedClass);
			$('#r_'+mNae).css('cursor','pointer');
			
			$(_mc).css('cursor','pointer');
			$(_mc).addClass(selectedClass);
			$(_mc).css('cursor','default');
			checkSelection();
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
	//-----------
}
