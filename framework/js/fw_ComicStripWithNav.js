/*----------------------------------------
	Name: fw_ComicStripWithNav.js
	Developed by: 
----------------------------------------*/
function fw_ComicStripWithNav(_xml){
    //
	var pageXml=_xml;
	var prePath1=""; 
	var stripDiv='';
	var strip_count=pageXml.comicStrip[0].strip.length;
	var strip_width=777;
	var currentStrip=0;
	var stripTab = 0;
	var stripArray= new Array();
	var clickArray= new Array();
	var currStripArr = new Array();	// helpful for keeping track of currentStrip between tabs
	var clickStripArray = new Array();	// helpful for keeping track of clickArray between tabs
	var isResize=true;
	var lmsData=navigationData.getCurrentPageData();
	var preloadImagesArray= new Array();
	this.updatePageLayOut=updatePageLayOut;
	this.pageSwiped=pageSwiped;
	var pageComplete=false;
	var isAnimate=false;
	var setTab=true;
	var tabIdx=5;
	var className=pageXml.className;
	stripArray[0]=1;


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
	if(pageXml.contentBg != undefined){
		if(pageXml.contentBg[0].style!=null){
			$('.content-bg').attr('style',pageXml.contentBg[0].style)
		}
	}
	/************************/
	
	var imgPath = pageXml.contentBackground[0].img[0].path;
	var iPadBackground = pageXml.contentBackground[0].img[0].ipadPath;
	if (imgPath != "") {
		if (iPadBackground != undefined) {
			if (globalSettings.isDesktop()) {
				$('.comicstripwithNavBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
			} else {
				$('.comicstripwithNavBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].ipadPath + ')');
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].ipadPath);
			}
		} else {
			$('.comicstripwithNavBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
		}
	} else {
		$('.comicstripwithNavBg').remove();
	}
	
	createHTMLForComicStrip();
	arrangeSlider();
	addEvent();
	var updateOtherPage=false;
	var pageId=0;
	stripArray= new Array();
	for (var i = 0; i < strip_count; i++) {
		stripArray.push(0);
	}
	createTabStripArray();
	
	for (var i = 0; i < strip_count; i++) {
		clickArray.push(0);
	}
        
        var cntLen=pageXml.contentText[0].text.length;
        if(cntLen>0){
		for(var c=0;c<cntLen;c++){
			tabIdx++;
			var cln="ctext"+c;		
			var pStr='<div id="'+cln+'" class="posAB" tabindex="'+tabIdx+'">'+pageXml.contentText[0].text[c].Text+'</div>';
			$('.pageText').append(pStr);
			setStyle("#"+cln,pageXml.contentText[0].text[c]);
		}	
	}
     pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);	   
	$(".comicStripContainer .tabSelection").hide();
	currStripArr = new Array(0);
	stripArray[0]=1;
	updateStrips();
	moveStrips();
	$("div[tabindex=1]").focus();
	var pgContHt=$('.pageContainer').height();			
	$('.comicStripWithNav').css('height',pgContHt+'px');
	$('.comicStripWithNav').addClass(className);
	$.imgpreload(preloadImagesArray,
		{
			each: function()
			{	
			},
			all: function()
			{
				try{
					templateMediator.templateLoadComplete();
					updateStripTextScorll(1);
					$("div[tabindex=1]").focus();
					
					
				}catch(err){}
			}
	});
	
	function pageSwiped(direction){		
		if(isAnimate){
			return true;
		}
		
		var od=stripArray[currentStrip];
		if(direction=="left"){
			if(currentStrip<(strip_count-1)){
				isAnimate=true;				
				currentStrip++;
				if(pageXml.type != "multiTab"){
					stripArray[currentStrip]=1;
				}else{				
					if(stripTab==pageXml.defaultTab ){					
						stripArray[currentStrip]=1;						
					}							
				}
				animateStrips();
				updateStrips();
			}else{			
				isAnimate=true;				
				if(globalPath.languageDir == 'ltr'){
				$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"left" }, 200,function(){
					isAnimate=false;
				}); } else {
				$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"right" }, 200,function(){
					isAnimate=false;
				}); }
				
			}
		}else if(direction=="right"){
			if(currentStrip>0){
				isAnimate=true;				
				currentStrip--;
				if(pageXml.type != "multiTab"){
					stripArray[currentStrip]=1;
				}else{				
					if(stripTab==pageXml.defaultTab ){					
						stripArray[currentStrip]=1;						
					}							
				}				
				animateStrips();
				updateStrips();	
			}else{				
				isAnimate=true;
				if(globalPath.languageDir == 'ltr'){
				$('.stripContainer').effect('bounce', {distance:8, times:4,direction:"right" }, 200,function(){
					isAnimate=false;;
				}); } else {
				$('.stripContainer').effect('bounce', {distance:8, times:4,direction:"left" }, 200,function(){
					isAnimate=false;;
				});}
			}
		}	
		
	}
	function stripTabClick(cTabId){
		currStripArr[stripTab] = currentStrip;
		currStripArr[0] = currentStrip;
		currStripArr[1] = currentStrip;
		stripTab = cTabId;
		stripArray = clickStripArray[0];
		clickArray = clickStripArray[0];			
		currentStrip = currStripArr[stripTab];
		strip_count=pageXml.comicStrip[stripTab].strip.length;
		updatePageLayOut();
	}
	function updatePageLayOut(){
		var wW=$(window).width();
		var wH=$(window).height();
		strip_width=(wW>700 && wH>550)?777:300;	
		var pgContHt=$('.pageContainer').height();			
		$('.comicStripWithNav').css('height',pgContHt+'px');
		if(!isResize) return false;
		isResize=false;
		createHTMLForComicStrip();
		arrangeSlider();			
		moveStrips();		
		updateStrips();
	}
	function createTabStripArray(){
		var comstrip_count=pageXml.comicStrip.length;
		clickStripArray = new Array();
		for(var i=0;i<comstrip_count;i++){
			var tmpstrpAr = new Array();
			var comstrip_strip_count=pageXml.comicStrip[i].strip.length;
			for(var j=0;j<comstrip_strip_count;j++){
				tmpstrpAr.push(0);
			}
			clickStripArray.push(tmpstrpAr);
		}
	}
	function updateLMSData(){
		var tabArrVl = new Array();
		for(var i=0;i<clickStripArray.length;i++){
			tabArrVl[i]	= clickStripArray[i].join("^");
		}
		var tempData = tabArrVl.join("/")+"~"+currStripArr.join("+");
		navigationData.updateCurrentPageData(tempData);
		if(updateOtherPage){
			navigationData.updatePageDataByPageNum(pageId,tempData);
		}
	}
	
	function createHTMLForComicStrip(){
		stripDiv='';
		tabIdx=5;
		preloadImagesArray= new Array();
		/*************** /clickStripArray = new Array();/***************/
		/*************** /tmpstrpAr = new Array();/***************/
		var comicStripContainerStyle= pageXml.comicStrip[stripTab].style || '';
		var comicStripBtnContainerStyle= pageXml.comicStrip[stripTab].btnConStyle|| '';
		$('.comicStripContainer').attr('style',comicStripContainerStyle);
		$('.comicStripBtnContainer').attr('style',comicStripBtnContainerStyle);
	 	for(var i=0;i<strip_count;i++){
			stripDiv+='<div class="img_slider" id="slider_'+(i+1)+'" >';
			var img1Obj=getImgObject(pageXml.comicStrip[stripTab].strip[i].stripBackground[0]);
			 var bg_txtObj=pageXml.comicStrip[stripTab].strip[i].stripBackground[0].text;
			stripDiv+='<img class="csImgBg" id="myImg_'+(i)+'" src="'+img1Obj.path+'" alt="'+img1Obj.Text+'" title="" tabindex="'+tabIdx+'"  />';
			tabIdx++;
			if (bg_txtObj != null) {
				stripDiv += '<p class="posAB" style="left:'+bg_txtObj[0].left+'px; top:'+bg_txtObj[0].top+'px; width:'+bg_txtObj[0].width+'px; z-index:10;font-size:12px;">' + bg_txtObj[0].Text + '</p>';
			}
				for (var j = 0; j < pageXml.comicStrip[stripTab].strip[i].stripCallOut.length; j++) {
					var calloutObj = pageXml.comicStrip[stripTab].strip[i].stripCallOut[j];
					var calloutObjStyle = calloutObj.style;	
					stripDiv+='<div class="stripCallOut clearfix"  style="'+calloutObjStyle+'" >';
					var textStr ='';
					for(var k=0;k<calloutObj.text.length;k++){
						var calloutTextStyle = calloutObj.text[k].style || '';
						textStr+='<div class="insertTab" tabindex="'+tabIdx+'" style="'+calloutTextStyle+'"><p>'+calloutObj.text[k].Text+'</p></div>';
						tabIdx++;
					}
					var tmpStyle = calloutObj.callOut[0].style || '';
					stripDiv+='<div class="stripCallOutTextHolder" style="'+tmpStyle+'" ><div tabindex="'+tabIdx+'" id="mystText_'+(i)+'" class="stripCallOutText"  ><div class="textContainer"><p >'+textStr+'</p></div></div></div></div>';
					tabIdx++;
				}
			stripDiv+='</div>';
			preloadImagesArray.push(img1Obj.path);		
			//console.log($('.stripCallOutText').height())
		}
		$('.stripContainer').html(stripDiv);
		updateStripTextScorll(1);
		$('.stripCallOutText').find('.tabSum').each(function(){					
			$(this).attr('summary',$(this).text());			
		});
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
	function animateStrips(){
		$('.img_slider').show();
		if(currentStrip==0){
			
			if(globalPath.languageDir == 'ltr'){
				isAnimate=true;
				$('.stripContainer').animate({left:"0px"},400,function(){
					$('.stripContainer').css('left','0px');
					if(isAnimate)checkpos();
					isAnimate=false;
					$('.img_slider').hide();
					$('#slider_'+(currentStrip+1)).show();
				});
			}else{
				isAnimate=true;
				$('.stripContainer').animate({right:"0px"},400,function(){
					$('.stripContainer').css('right','0px');
					if(isAnimate)checkpos();
					isAnimate=false;
					$('.img_slider').hide();
					$('#slider_'+(currentStrip+1)).show();
				});
			}
		}else{
			if(globalPath.languageDir == 'ltr'){
				isAnimate=true;
				var lt=(currentStrip*strip_width);
				$('.stripContainer').animate({left:-lt+"px"},400,"swing",function(){
					$('.img_slider').hide();
					$('#slider_'+(currentStrip+1)).show();
					$('.stripContainer').css('left',-lt+'px');
					if(isAnimate)checkpos();
					isAnimate=false;				
				});
			}else{
				isAnimate=true;
				var lt=(currentStrip*strip_width);
				$('.stripContainer').animate({right:-lt+"px"},400,"swing",function(){
					$('.img_slider').hide();
					$('#slider_'+(currentStrip+1)).show();
					$('.stripContainer').css('right',-lt+'px');
					if(isAnimate)checkpos();
					isAnimate=false;				
				});				
			}
			 
		}
	}
	function checkpos(){
				
	}
	function moveStrips(){
		var wW=$(window).width();
		var wH=$(window).height();
		strip_width=(wW>700 && wH>550)?777:300;	
		if(currentStrip==0)
		{
			if(globalPath.languageDir == 'ltr'){
			$('.stripContainer').css({left:"0px"},250);
			} else{
			$('.stripContainer').css({right:"0px"},250);
			}
		}else{
			if(globalPath.languageDir == 'ltr'){
			$('.stripContainer').css({left:"-"+(currentStrip*strip_width)+"px"});
			} else{
			$('.stripContainer').css({right:"-"+(currentStrip*strip_width)+"px"});
			}
		}	
		isResize=true;	
	}
	
	function updateStrips(){
		clickArray = clickStripArray[0];
		stripArray[currentStrip]=1;
		if(currentStrip>0){
			$(".stripBackBtn").show();
			$(".stripBackBtn").removeClass('disabled');
		}else{
			$(".stripBackBtn").hide();
			$(".stripBackBtn").addClass('disabled');
		}
		
		if(currentStrip<(strip_count-1)){
			$(".stripNextBtn").show();
			$(".stripNextBtn").removeClass('disabled');
		}else{
			$(".stripNextBtn").hide();
			$(".stripNextBtn").addClass('disabled');
		}
		var fnd=true;
		for (var i = 0; i < strip_count; i++) {
			if(stripArray[i]!=1){
					fnd=false;
					break;				
			}
		}

		if(fnd){
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		}
		if(fnd && !pageComplete){
			pageComplete=true;
			templateMediator.pageVisited();
		}
		if(setTab){
			setTab=false;
			updateTabIndex();
		}
		return true;
	}
	
	function arrangeSlider(){
	 	var wW=$(window).width();
		var wH=$(window).height();
		strip_width=(wW>700 && wH>550)?777:300;
		var stripWidth=pageXml.comicStrip[0].width;
		if(stripWidth==null){
			stripWidth=strip_width;
		}
		var thumb_width=pageXml.comicStrip[stripTab].imgWidth;	 
		var wd = ((stripWidth-(thumb_width*strip_count))/strip_count)+(8-strip_count);		
		for(var i=0;i<strip_count;i++)
		{
		
			if(globalPath.languageDir == 'ltr'){
				$('.stripContainer .img_slider:eq('+i+')').css("left",(i*strip_width)+"px");			
			} else{
			$('.stripContainer .img_slider:eq('+i+')').css("right",(i*strip_width)+"px");			
			}
		}
		$('.img_slider').hide();
		$('#slider_'+(currentStrip+1)).show();
	 }
	 function addEvent(){
		$('.stripBtn').hover( function(){
				$(this).addClass('btnHover');
		},
		  function () {
				$(this).removeClass('btnHover');
		});
		$(".stripBackBtn").click(function(){
			if($(this).hasClass('disabled'))return false;
			currentStrip--;
			updateStrips();		
			animateStrips();	
			updateStripTextScorll(currentStrip+1);
		});
		$(".stripNextBtn").click(function(){
			if($(this).hasClass('disabled'))return false;
			currentStrip++;
			updateStrips();		
			animateStrips();	
			updateStripTextScorll(currentStrip+1);
		
		});
	 }
	 function updateStripTextScorll(val){
		var stripTextObj =  $('#slider_'+(val)).find('.stripCallOutText');
		if(stripTextObj.height()>stripTextObj.parent().height()){
			stripTextObj.css('height',stripTextObj.parent().height());
			stripTextObj.fw_Scroll({color:"#ffffff",width:10});
		}
	 }
	 function updateTabIndex(){	 	
		var tbCnt=5;		
		var lsT=0;
		for (var i = 0; i < strip_count; i++) {
			if(i==currentStrip){				
				tbCnt++;
				$('#myImg_'+i).attr('tabindex',tbCnt);
				tbCnt++;
				$('#mystText_'+i+' ').attr('tabindex',(tbCnt));
				lsT=i;
			}else if(stripArray[i]==1){
				lsT=i;
			}			
								
		}		
		if (lsT < 7) {
			lsT++;
		}
		navigationEvent.updateGlobleFocus(tbCnt);
	 }
	 
	 function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var bgColor =(_xml.bgColor==null?'':_xml.bgColor);
		var padding =(_xml.padding==null?'':_xml.padding);
		var fts =(_xml.fontSize==null?'16px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
		var txtB=(_xml.textAlign==null?'right':_xml.textAlign);
		var wd  =(_xml.width==null?'auto':_xml.width);
		var ht  =(_xml.height==null?'auto':_xml.height);
		var lft =(_xml.left==null?'':_xml.left);
		var rgt =(_xml.right==null?'':_xml.right);
		var tp  =(_xml.top==null?'':_xml.top);
		var lineHeight  =(_xml.lineHeight==null?'':_xml.lineHeight);
                  var pos =(_xml.position==null?'absolute':_xml.position);
		if(globalPath.languageDir == 'ltr'){
			if(_xml.right!=null){
				$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos,'line-height':lineHeight});
			}else{
				$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtA,'padding':padding,position:pos,'line-height':lineHeight});
			}
		} else{
			if(_xml.left!=null){
				$(obj).css({left:lft,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos,'line-height':lineHeight});
			}else{
				$(obj).css({right:rgt,top:tp,color:clr,width:wd,height:ht,'background-color':bgColor,'font-size':fts,'font-weight':ftw,'text-align':txtB,'padding':padding,position:pos,'line-height':lineHeight});
			}
			}
	}
}
