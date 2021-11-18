/*----------------------------------------
	Name: fw_Reveal.js
	Developed by: Suyog Shaha
----------------------------------------*/ 
function fw_Reveal(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var tabButton=".tabButton";
	var selectedClass = "tabSelect";
	var tabHoverClass ="tabHover";
	this.updatePageLayOut=updatePageLayOut;	

	var totalTab=pageXml.tabs[0].tab.length;
	var str='';
	var lmsData=navigationData.getCurrentPageData();
	var tabClickArray= new Array();
	var tabClickLocalArray= new Array();		
	var updateDone=false;
	var currentTabId=0;
	var tbCnt;
	var preloadImagesArray=new Array();
	var className=pageXml.className;
	var type=pageXml.type;
	var iPadBackground=pageXml.contentBackground[0].img[0].ipadPath;	
	var rType = pageXml.type.toLowerCase();
	var parentClass = '.reveal';
	var revealTypeArray = new Array("reveal", "reveal2");
	for (var i = 0; i < revealTypeArray.length; i++) {
		if (rType == revealTypeArray[i].toLowerCase()) {
			revealType = i;
			break;
		}
	}
	parentClass = '.' + revealTypeArray[revealType];
	$('.reveal').attr('class', revealTypeArray[revealType]);
	$(parentClass).addClass(className);
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
	
	str="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		str+='<div class="pText" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>'
	}
	$('.pageText').html(str);
	str = '';
	if (lmsData != "") {		
		tabClickArray = lmsData.split('^');
	}else{
		for (var i = 0; i < totalTab; i++) {
			tabClickArray.push(0);
		}
	}
	for (var i = 0; i < totalTab; i++) {
			tabClickLocalArray.push(0);
	}
	
	for(var i=0;i<totalTab;i++){		
		var tabName= pageXml.tabs[0].tab[i].tabName[0].Text;
		var buttonImg=pageXml.tabs[0].tab[i].buttonImg[0].path;
		var altText=pageXml.tabs[0].tab[i].buttonImg[0].Text;
		var tabName=pageXml.tabs[0].tab[i].tabName[0].Text;
		var tabHeight= '';		
		var tickTop= '';		
		var fontSize= '';
		
		if(pageXml.tabs[0].tab[i].height!=null){
		 tabHeight='style="height:'+pageXml.tabs[0].tab[i].height+';"';
		}
		if(pageXml.tabs[0].tab[i].tickCross!=null){
		 tickTop='style="'+pageXml.tabs[0].tab[i].tickCross[0].style+'"';
		}
		if(pageXml.tabs[0].tab[i].fontSize!=null){
		 fontSize='style="font-size:'+pageXml.tabs[0].tab[i].fontSize+';"';
		}
		var tabNameStyle = pageXml.tabs[0].tab[i].tabName[0].style || '';
		preloadImagesArray.push(buttonImg);
		var warningIcon="";
		if(pageXml.tabs[0].tab[i].warningIcon!=null){
			warningIcon=pageXml.tabs[0].tab[i].warningIcon[0].path;
			preloadImagesArray.push(warningIcon);
		}
		var style1="";
		var tickStyle="";
		if(pageXml.tabs[0].tab[i].style!=null){
			 style1= pageXml.tabs[0].tab[i].style;
		}
		
		str+='<div style="'+style1+'" class="tab'+(i+1)+' tabButtonCont clearfix" '+tabHeight+' s>';
		str+='<a class="tabButton"  id="tabBtn_'+(i+1)+'" href="javascript:void(0)" >';
		if(warningIcon!=""){
			str+='<img class="tabButtonImg" src="'+buttonImg+'" title="" /><img class="warningIcon" src="'+warningIcon+'" alt="'+altText+'" title="" />';
		}else{
			str+='<img class="tabButtonImg" src="'+buttonImg+'" alt="'+altText+'" title="" />';
		}
		
		str+='<div class="tabButtonText" style="'+tabNameStyle+'"><table class="buttonText"><tr><td>'+tabName+'</td></tr></table></div></a><div class="tick" '+tickTop+'></div></div>';	
		tbCnt++;
		if(revealType == 0){
			$('.tabDataContainer').remove();
			//for(var j=0;j<totalTab;j++){
				var tabBgObj=getImgObject(pageXml.tabs[0].tab[i].backgroungImg[0]);
				
				var _style="";
				var obj=pageXml.tabs[0].tab[i].popupStyle;
				if(obj!=null){
					var obj1=obj[0].style;
					_style=obj1==null?"":obj1;
				}
				
				str+='<div class="tab'+(i+1)+' tabData clearfix" style="'+_style+'">';
				str+='<img class="tabBg" alt="'+tabBgObj.Text+'" src="'+tabBgObj.path+'" title="" />';
				var tabText0="";
				for(var j=0;j<pageXml.tabs[0].tab[i].tabText[0].text.length;j++){
					tabText0+="<div class='insertTab' ><p>"+pageXml.tabs[0].tab[i].tabText[0].text[j].Text+"</p></div>";
				}
				var obj=pageXml.tabs[0].tab[i].tabText[0].style;
				var _style=obj==null?"":obj;
				
				str+='<div class="tabTextCont clearfix" style="'+_style+'">'+tabText0+'</div>';			
				str+='</div>';
				preloadImagesArray.push(tabBgObj.path);
			//}
		}else{
			if( pageXml.popupBackground!=null){
				$('.tabDataContainer .tabDataContainerImg').attr('src',pageXml.popupBackground[0].img[0].path);
				$('.tabDataContainer .tabDataContainerImg').attr('alt',pageXml.popupBackground[0].img[0].Text);
			}
		}
		
 	}	
	$('.tabs').html(str);
	var tabHolderStyleStr=pageXml.tabHolder[0].style || '';
	$('.revealContainer').attr('style',tabHolderStyleStr);
	
	var tabConStyleStr =pageXml.tabs[0].style || '';
	$('.tabs').attr('style',tabConStyleStr);
	if($('.reveal').hasClass('linear')){ 
		$('.tabButtonCont').addClass(selectedClass);
		$('.tab1').removeClass(selectedClass);
	}
	navigationEvent.updateGlobleFocus(tbCnt);
	if(pageXml.contentBackground[0].img[0].path!=""){
		if(iPadBackground != undefined){
				if(globalSettings.isDesktop()){
					//$('.revealBg').attr("src", pageXml.contentBackground[0].img[0].path);
					$('.revealBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
				}else{
					//$('.revealBg').attr("src", pageXml.contentBackground[0].img[0].ipadPath);
					$('.revealBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].ipadPath + ')');
				}
		}else{
			$('.revealBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
		}
		//$('.revealBg').attr("alt", pageXml.contentBackground[0].img[0].Text);
	}
	else{
		$('.revealBg').remove();
	}
	
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);	
	$(tabButton).hover( function(){
		if($(this).hasClass(selectedClass)  || (!globalSettings.isDesktop())){
			return false;
		}
		$(this).parent().addClass(tabHoverClass);
	},
	  function () {
		$(this).parent().removeClass(tabHoverClass);
	});
	updateTabIndex();
	$(tabButton).click(function(){
		if ($(this).parent().hasClass(selectedClass)) {
			/* $('.tabButtonCont').removeClass(selectedClass);
			$(tabButton).css('cursor','pointer');
			$('.tabData').hide(); */
			return false;
		}				
		$('.tabButtonCont').removeClass(selectedClass);
		$(tabButton).css('cursor','pointer');
		$(this).parent().addClass(selectedClass);
		$(this).css('cursor','default');
		$(this).next('.tick').show();
		var id=parseInt($(this).attr('id').split('_')[1]);
		currentTabId=id;
		if(revealType == 0){
				 $('.tabData').hide();
				if(type=="thought_bubble"){
					$('.tab'+id+'.tabData').fadeIn("slow",function(){
						updateTabIndex();
					});
				}else{
					$('.tab'+id+'.tabData').animate({width: 'show'},function(){
						updateTabIndex();
					});
				}
		}else{
			var _cId = id-1;
			var tabTextObj = pageXml.tabs[0].tab[_cId].tabText[0];
			var tabTextStyle= tabTextObj.style || '';
			$('.tabTextImg').attr("src", pageXml.tabs[0].tab[_cId].backgroungImg[0].img[0].path);
			$('.tabTextImg').attr("alt", pageXml.tabs[0].tab[_cId].backgroungImg[0].img[0].Text);
			$('.tabTextHolder').attr('style',tabTextStyle);
			var str = "";
			for (var i = 0; i < tabTextObj.text.length; i++) {
				var txtStyle=tabTextObj.text[i].style || '';
				str += "<div class='insertTab' style='"+txtStyle+"'><p>" + tabTextObj.text[i].Text + "</p></div>";
				
			}
			$('.tabTextHolder .tabTextArea').html('<div class="textConatiner" >'+str+'</div>');
			$('.tabTextContainer').show();
			$('.tabTextArea').css('height','auto');
			if($('.tabTextArea').height()>$('.tabTextArea').parent().height()){
				$('.tabTextArea').css('height',$('.tabTextArea').parent().height());
				$('.tabTextArea').fw_Scroll({color:"#ffffff",width:10});
			}
		}
		
		updateClick(id);
		$('body').scrollTop(0);
		//updateTabIndex();
	});	
	
	if(pageXml.contentBackground[0].img[0].path!=""){
		if(iPadBackground != undefined){
		if(globalSettings.isDesktop()){
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
			}else{
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].ipadPath);
			}
	}else{
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
	}
		
	}
	
	
	$.imgpreload(preloadImagesArray,{
		each: function(){},
		all: function(){
			try{
				templateMediator.templateLoadComplete();	
				$("div[tabindex=1]").focus();	 			
			}catch(err){}
		}
	});
	
	$(tabButton).focus(function() {			
		$(this).parent().addClass('tabClass');	
	});	
	
	$(tabButton).focusout(function() {			
		$(this).parent().removeClass('tabClass');
		if($(this).parent().hasClass(selectedClass)){
			var fid= Number($(this).attr('tabindex'));
			var str="img[tabindex="+(fid+1)+"]";
			$(str).focus();
		}		
		//updateTabIndex();		
	});
	
	
	function updateLMSData(){
		var tempData=tabClickArray.join("^");
		navigationData.updateCurrentPageData(tempData);
	}
	
	function updateClick(_id){
		var id=_id-1;
		var preVal=parseInt(tabClickArray[id]);
		tabClickArray[id]=1;
		tabClickLocalArray[id]=1;
		if(preVal==0){
			updateLMSData();
		}		
		showTick();
	}
	
	function showTick(){
		if(tabClickArray.toString().indexOf('0')<0 && tabClickLocalArray.toString().indexOf('0')<0){
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			templateMediator.pageVisited();			
		}
	}
	
	function getImgObject(obj){
	 	var wW=$(window).width();
		var wH=$(window).height();
		var pathObj=obj.img[0];		
		for(var k=0;k<obj.img.length;k++){
			var imgWd=parseInt(obj.img[k].minwidth);
			var imgHd=parseInt(obj.img[k].minheight);
			if(wW>imgWd && wH>imgHd){
				pathObj=obj.img[k];
			}
		}
		return pathObj;
	}
	
	function updatePageLayOut(){
	 	if(updateDone){
			return false;
		}
		updateDone=true;
	 	for (var i = 0; i < totalTab; i++) {
			var tabBgObj=getImgObject(pageXml.tabs[0].tab[i].backgroungImg[0]);
			var prepath=$('.tab'+(i+1)+' .tabBg').attr('src');
			if (prepath != tabBgObj.path) {
				$('.tab' + (i + 1) + ' .tabBg').attr('src', tabBgObj.path);
			}			
		}
		updateDone=false;
	}
	 function updateTabIndex(){	 	
		$('.tabBg, .tabTextCont').removeAttr("tabindex");		
		tbCnt=7;		
		for (var i = 1; i <= totalTab; i++) {
			$('#tabBtn_'+i).attr('tabindex',tbCnt);
				tbCnt++;
			if($('.tab'+currentTabId+'.tabData').is(':visible') && i==currentTabId){
				$('#tabBtn_'+i).attr('tabindex',tbCnt);							
				tbCnt++;
				$('.tab'+i+' .tabBg').attr('tabindex',tbCnt);
				tbCnt++;
				//$('.tab'+i+' .tabTextCont ').attr('tabindex',tbCnt);

				$('.tab'+i+' .tabTextCont ').find('.insertTab').each(function(){
					$(this).attr('tabindex',tbCnt);
					tbCnt++	;
				})
			}				
		}				
		navigationEvent.updateGlobleFocus(tbCnt);
	 }
	
	
}
