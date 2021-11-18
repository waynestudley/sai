/*----------------------------------------
	Name: fw_ComicStrip.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_ComicStrip(_xml){
    //
	var pageXml=_xml;
	var prePath1="";
	//$('.pageText p').html(pageXml.contentText[0].text[0].Text); 
	//globalSettings.addTitle('.pageText',pageXml.contentText[0].text[0].Text);    
	
	var stripDiv='';
	var thumbDiv='';
	var strip_count=pageXml.comicStrip[0].strip.length;
	var strip_width=777;
	var thumb_width=85.5;
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
	var tabIdx=5;
	var tabIdx=5;
	var className=pageXml.className;
	var isRefPage=parseInt(pageXml.isRefPage);
	stripArray[0]=1;
	if((pageXml.type == "multiTab") && (pageXml.defaultTab != null)){
		stripTab = parseInt(pageXml.defaultTab);
	}
	createHTMLForComicStrip();
	arrangeSlider();
	var updateOtherPage=false;
	var pageId=0;
	if(pageXml.updateComicPage!=null){
		updateOtherPage=true;
		pageId=navigationData.getPageNumByComicId(pageXml.updateComicPage);
		
	}
	var pageTxtStr="";
	for (var i = 0; i < pageXml.contentText[0].text.length; i++) {
		var obj=pageXml.contentText[0].text[i].style;
		var _style=obj==null?"":obj;
		pageTxtStr+='<div class="accText insertTab" style="'+_style+'">'+pageXml.contentText[0].text[i].Text+'</div>';
	}
	$('.pageText').html(pageTxtStr);
	
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
		$('.content-bg .introCOntainer').attr('style',pageXml.contentBg[0].wtbgStyle)
	}
	/************************/
	pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);	
	stripArray = new Array();
	for (var i = 0; i < strip_count; i++) {
		stripArray.push(0);
	}
	createTabStripArray();
	
	for (var i = 0; i < strip_count; i++) {
		clickArray.push(0);
	}
        //$('.pageText p').html(pageXml.contentText[0].text[0].Text); 
        
      
        
	//if(pageXml.comicStrip[0])
	if(pageXml.type != "multiTab"){
		$(".comicStripContainer .tabSelection").hide();
		currStripArr = new Array(0);
	}else{
		currStripArr = new Array();
		$(".comicStripContainer .tabSelection").show();
		var stripCnt = pageXml.comicStrip.length;
		var tabHtml = "<div class='tabSelection'>";
		for(var i=0;i<stripCnt;i++){
			tabHtml+="<a class='stripTabLink stripTab_"+i+"' href='javascript:void(0)' id='stripTab_"+i+"'>"+pageXml.comicStrip[i].title[0].Text + "</a><br/>";
			currStripArr.push(0);
		}
		tabHtml += '</div>';
		$(".comicStrip").append(tabHtml);
		$("#stripTab_"+stripTab).addClass('selectedTab');
		
		if(pageXml.defaultTab != null){
			stripTab = parseInt(pageXml.defaultTab);
		}
		$(".comicStrip .stripTabLink").click(function(){
			if($(this).hasClass('selectedTab')) return false;
			
			var cTabId = parseInt($(this).attr("id").split("_")[1]);
			$(".comicStrip .stripTabLink").removeClass('selectedTab');
			$(this).addClass('selectedTab');
			stripTabClick(cTabId);
		});
		
	}
	//createTabStripArray()
	stripArray[0]=1;
	updateStrips();
	$("#thumbClick_"+currentStrip).addClass('thumbSelected thumbVisited');
	moveStrips();
	$("div[tabindex=1]").focus();
	var pgContHt=$('.pageContainer').height();			
	$('.comicStrip').css('height',pgContHt+'px');
	$('.comicStrip').addClass(className);
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
					
				}catch(err){}
			}
	});
	
	function pageSwiped(direction){		
		if(isAnimate){
			return true;
		}
		
		var od=stripArray[currentStrip];
		//if($('.thumb_img').hasClass('thumbLocked'))return false;
		//alert(strip_count)
		
		if(direction=="left"){
		if(!$("#thumbClick_"+(currentStrip+1)).hasClass('thumbVisited')){
			
			if(pageXml.type == "multiTab" && stripTab!=pageXml.defaultTab){
				isAnimate=true;				
				if(globalPath.languageDir == 'ltr'){
				$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"left" }, 200,function(){
					isAnimate=false;
				}); } else{
				$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"right" }, 200,function(){
					isAnimate=false;
				}); }
				return false;
			}
		}
		
		//alert($("#thumbClick_"+currentStrip))
		if($("#thumbClick_"+(currentStrip+1)).hasClass('thumbLocked')){
			isAnimate=true;				
			if(globalPath.languageDir == 'ltr'){
			$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"left" }, 200,function(){
				isAnimate=false;
			}); } else {
			$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"right" }, 200,function(){
				isAnimate=false;
			});}
			return false;
		}
			
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
			//if($("#thumbClick_"+(currentStrip+1)).hasClass('thumbLocked'))return false;
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
		
		//if (od == 0) {
		//	updateLMSData();
		//}
	}
	function stripTabClick(cTabId){
		//if(cTabId==pageXml.defaultTab)
		currStripArr[stripTab] = currentStrip;
		currStripArr[0] = currentStrip;
		currStripArr[1] = currentStrip;
		//clickStripArray[stripTab] = stripArray;
		stripTab = cTabId;
		if(pageXml.type != "multiTab")stripArray = clickStripArray[0];
		clickArray = clickStripArray[0];			
		//stripArray[0] = clickArray[0] = 1;
		//if(stripTab==pageXml.defaultTab)
		currentStrip = currStripArr[stripTab];
		strip_count=pageXml.comicStrip[stripTab].strip.length;
		updatePageLayOut();
		$("#thumbClick_"+currentStrip).addClass('thumbSelected');
	}
	function updatePageLayOut(){
		var wW=$(window).width();
		var wH=$(window).height();
		strip_width=(wW>700 && wH>550)?777:300;	
		var pgContHt=$('.pageContainer').height();			
		$('.comicStrip').css('height',pgContHt+'px');
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
		//tempData=stripArray.join("^")+"~"+currentStrip;
		navigationData.updateCurrentPageData(tempData);
		if(updateOtherPage){
			navigationData.updatePageDataByPageNum(pageId,tempData);
		}
	}
	
	function bgImageLoad(){
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
	}
	function createHTMLForComicStrip(){
		stripDiv='';
		thumbDiv='';
		tabIdx=5;
		preloadImagesArray= new Array();
		bgImageLoad();
		/*************** /clickStripArray = new Array();/***************/
		/*************** /tmpstrpAr = new Array();/***************/
	 	for(var i=0;i<strip_count;i++){
			var img2Obj=getImgObject(pageXml.comicStrip[stripTab].strip[i].stripThumImg[0]);
			var thumbTitle=pageXml.comicStrip[stripTab].strip[i].stripThumImg[0].title[0].Text;
			var lockStrip = "";
			var lockStrip2 = "";
			if( pageXml.comicStrip[stripTab].strip[i].locked == "true" ){
				lockStrip = " thumbLocked";
				lockStrip2 = "thumbLocked2";
			}
			
			/*if(pageXml.type == "multiTab" && stripTab != pageXml.defaultTab){
				thumbDiv+='<div class="thumbnail"> <div class="thumbId" id="thumb_'+i+'">'+pageXml.comicStrip[stripTab].strip[i].stripThumImg[0].numberText+'</div> <a href="javascript:void(0)" id="thumbClick_'+i+'" class="thumb_img '+lockStrip+'" tabindex="'+tabIdx+'" > <img alt="'+img2Obj.Text+'" src="'+img2Obj.path+'" id="thumbnailImg_'+i+'" class="thumbnailImg"> <div class="selectedImgArrow"></div> <div class="thumbBorder"> <div class="thumbInnerBorder"></div> </div> <div class="selectedImg"></div> </a> </div>';
			}else{
				thumbDiv+='<div class="thumbnail"> <div class="thumbId" id="thumb_'+i+'">'+pageXml.comicStrip[stripTab].strip[i].stripThumImg[0].numberText+'</div> <a href="javascript:void(0)" id="thumbClick_'+i+'" class="thumb_img '+lockStrip+'" tabindex="'+tabIdx+'" ><div class="'+lockStrip2+'"></div> <img alt="'+img2Obj.Text+'" src="'+img2Obj.path+'" id="thumbnailImg_'+i+'" class="thumbnailImg blackThumb"> <div class="selectedImgArrow"></div> <div class="thumbBorder"> <div class="thumbInnerBorder"></div> </div> <div class="selectedImg"></div> </a> </div>';
			}*/
			thumbDiv+='<div class="thumbnail"> <a href="javascript:void(0)" id="thumbClick_'+i+'" class="thumb_img '+lockStrip+'" tabindex="'+tabIdx+'" > <div class="thumbId" id="thumb_'+i+'">'+pageXml.comicStrip[stripTab].strip[i].stripThumImg[0].numberText+'</div><div class="'+lockStrip2+'"></div> <img alt="'+thumbTitle+'" src="'+img2Obj.path+'" id="thumbnailImg_'+i+'" class="thumbnailImg blackThumb"> <div class="selectedImgArrow"></div> <div class="thumbBorder"> <div class="thumbInnerBorder"></div> </div> <div class="selectedImg"></div> </a> </div>';
			
			tabIdx++;
			
			stripDiv+='<div class="img_slider" id="slider_'+(i+1)+'" >';
			var img1Obj=getImgObject(pageXml.comicStrip[stripTab].strip[i].stripBackground[0]);
			var bg_txtObj=pageXml.comicStrip[stripTab].strip[i].stripBackground[0].text;
			stripDiv+='<img class="csImgBg" id="myImg_'+(i)+'" src="'+img1Obj.path+'" alt="'+img1Obj.Text+'" title="" tabindex="'+tabIdx+'"  />';
			tabIdx++;
			if (bg_txtObj != null) {
				if(globalPath.languageDir == 'ltr'){
				stripDiv += '<p class="posAB" style="left:'+bg_txtObj[0].left+'px; top:'+bg_txtObj[0].top+'px; width:'+bg_txtObj[0].width+'px; z-index:10;font-size:12px;">' + bg_txtObj[0].Text + '</p>';
				}else{
				stripDiv += '<p class="posAB" style="right:'+bg_txtObj[0].left+'px; top:'+bg_txtObj[0].top+'px; width:'+bg_txtObj[0].width+'px; z-index:10;font-size:12px;">' + bg_txtObj[0].Text + '</p>';
				}
			}
			var obj= getCallOutObject(pageXml.comicStrip[stripTab].strip[i].stripCallOut[0]);
			var  arrowDir=getStripClass(pageXml.comicStrip[stripTab].strip[i].stripCallOut[0]);		
			if(globalPath.languageDir == 'ltr'){
				stripDiv+='<div class="stripCallOut '+arrowDir+' clearfix"  style="left:'+obj.x+'px; top:'+obj.y+'px; width:'+obj.width+'px;" >';			
			} else {
			stripDiv+='<div class="stripCallOut '+arrowDir+' clearfix"  style="right:'+obj.x+'px; top:'+obj.y+'px; width:'+obj.width+'px;" >';			
			}
			
			if(pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].showArrow!='false'){
				var arrStyle = "";
                                if(pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].callOut[0].arrowStyle!=null){
                                       arrStyle = pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].callOut[0].arrowStyle;
                                    }
                                 stripDiv+='<div class="stripArrow" style="'+arrStyle+'"></div>';		
			}
			var cText=pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].text[0].Text;		
			var tmpStyle = "";
			var obj= getCallOutObject(pageXml.comicStrip[stripTab].strip[i].stripCallOut[0]);
			
			if(pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].stripNonBg=='true'){
				tmpStyle='style="background-color:'+pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].bColor+';text-align:'+pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].textAlign+';color: '+pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].color+';line-height: '+pageXml.comicStrip[stripTab].strip[i].stripCallOut[0].lineHeight+'px;display:block; visibility:visible}"';	
			}
			
			var calloutTextstr="";
			var calloutTextObj=pageXml.comicStrip[stripTab].strip[i].stripCallOut[0];
			for(var j=0;j<calloutTextObj.text.length;j++){
				var txtStyle = calloutTextObj.text[j].style;
				calloutTextstr+='<div class="insertTab" tabindex="'+tabIdx+'" style="'+txtStyle+'"><p>'+calloutTextObj.text[j].Text+'</p></div>';
				tabIdx++;
			}
			
			stripDiv+='<div   id="mystText_'+(i)+'" class="stripCallOutText" '+tmpStyle+' >'+calloutTextstr+'</div></div>';
			if(pageXml.comicStrip[stripTab].strip[i].stripCallOut.length>1){
				for (var j = 1; j < pageXml.comicStrip[stripTab].strip[i].stripCallOut.length; j++) {
					var obj= getCallOutObject(pageXml.comicStrip[stripTab].strip[i].stripCallOut[j]);
					var  arrowDir=getStripClass(pageXml.comicStrip[stripTab].strip[i].stripCallOut[j]);		
					if(globalPath.languageDir == 'ltr'){
					stripDiv+='<div class="stripCallOut '+arrowDir+' clearfix"  style="left:'+obj.x+'px; top:'+obj.y+'px; width:'+obj.width+'px;" >';
					} else{
					stripDiv+='<div class="stripCallOut '+arrowDir+' clearfix"  style="right:'+obj.x+'px; top:'+obj.y+'px; width:'+obj.width+'px;" >';
					}
					var tmpStyle = "";
					
					if(pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].stripNonBg=='true'){
						tmpStyle='style="background-color:'+pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].bColor+';text-align:'+pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].textAlign+';color: '+pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].color+';line-height: '+obj.lineHeight+'px;}"';	
					}
					//var cText=pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].text[0].Text;
                                         //console.log(pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].callOut[0].arrowStyle)
					if(pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].showArrow!='false'){
						var arrStyle = "";
                                                if(pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].callOut[0].arrowStyle!=null){
                                                       arrStyle = pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].callOut[0].arrowStyle;
                                                    }
                                                 stripDiv+='<div class="stripArrow" style="'+arrStyle+'"></div>';	
					}
					var calloutTextstr="";
					var calloutTextObj=pageXml.comicStrip[stripTab].strip[i].stripCallOut[j];
					for(var p=0;p<calloutTextObj.text.length;p++){
						var txtStyle = calloutTextObj.text[p].style || '';
						calloutTextstr+='<div class="insertTab2" tabindex="'+tabIdx+'" style="'+txtStyle+'"><p>'+calloutTextObj.text[p].Text+'</p></div>';
						tabIdx++;
					}
					stripDiv+='<div tabindex="'+tabIdx+'" id="mystText_'+(i)+'" class="stripCallOutText" '+tmpStyle+'><p >'+calloutTextstr+'</p>';
					tabIdx++;
					/*var objTextnn = pageXml.comicStrip[stripTab].strip[i].stripCallOut[j].text;
					 if(objTextnn.length > 1){
						for(var p = 1; p < objTextnn.length; p++){
							var cText2=objTextnn[p].Text;
							stripDiv+='<p class="insertTab2">'+cText2+'</p>';
						tabIdx++;
						}
						
					} */
					stripDiv+='</div></div>';
					
				}
			}
			
			stripDiv+='</div>';
			preloadImagesArray.push(img1Obj.path);
			preloadImagesArray.push(img2Obj.path);		
		}
		/* if(pageXml.type == "multiTab" && stripTab != pageXml.defaultTab){
			$('#thumbClick_'+currentStrip).removeClass('thumbVisited');
			$("#thumbClick_"+currentStrip).addClass('thumbSelected');
		} 
		if(pageXml.type == "multiTab"){			/* If its a multitab Comic Strip 
			for(var x =1;x<pageXml.comicStrip.length ; x++){
				strip_img_count=pageXml.comicStrip[x].strip.length;
				for(var i=0;i<strip_img_count;i++){
					var img2Obj=getImgObject(pageXml.comicStrip[x].strip[i].stripThumImg[0]);
					var img1Obj=getImgObject(pageXml.comicStrip[x].strip[i].stripBackground[0]);
					preloadImagesArray.push(img1Obj.path);
					preloadImagesArray.push(img2Obj.path);	
				}
			}
		}*/
		$('.stripContainer').html(stripDiv);
		$('.thumbnailContainer').html(thumbDiv);
		$('.stripCallOutText').find('.tabSum').each(function(){					
			$(this).attr('summary',$(this).text());			
		});
		$('.thumb_img').hover( function(){
			var id=parseInt($(this).attr('id').split('_')[1]);
			var isClass=$('#thumbnailImg_'+id).hasClass('blackThumb');		
			if($(this).hasClass('thumbSelected') || $(this).hasClass('thumbLocked') || isClass || globalSettings.isIpad || globalSettings.iPhone || globalSettings.Android || globalSettings.BlackBerry){
				$(this).css('cursor','default');
				return false;
			}
			$(this).find('.thumbBorder').addClass('thumbHover');
			$(this).css('cursor','pointer');
		},
		  function () {
			$(this).find('.thumbBorder').removeClass('thumbHover');
		});
		
		$(".thumb_img").click(function(){
			if(isAnimate || $(this).hasClass('thumbLocked') || $(this).hasClass('thumbSelected')){
				return true;
			}
			
			var id=parseInt($(this).attr('id').split('_')[1]);
			var isClass=$('#thumbnailImg_'+id).hasClass('blackThumb');
			if(isClass) return false;
			currentStrip=id;			
			var od=stripArray[currentStrip];
			if(pageXml.type != "multiTab"){
				stripArray[currentStrip]=1;
			}else{				
				if(stripTab==pageXml.defaultTab ){					
					stripArray[currentStrip]=1;						
				}							
			}
			
			currStripArr[stripTab] = currentStrip;
			updateStrips();		
			animateStrips();			
			$('#thumbClick_'+id).addClass('thumbVisited');
			if (od == 0) {
				//updateLMSData();
			}
			$(this).parent().focus();
		});
		$('.thumb_img').focus(function() {			
			var id=parseInt($(this).attr('id').split('_')[1]);
			var isClass=$('#thumbnailImg_'+id).hasClass('blackThumb');
			if(isClass){
				var str="a[tabindex="+(tabIdx+1)+"]";
				
				$(str).focus();
				return false;
			}					
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

	function getCallOutObject(obj){
	 	var wW=$(window).width();
		var wH=$(window).height();
		var _obj=obj.callOut[0];		
		for(var k=0;k<obj.callOut.length;k++){
			var imgWd=parseInt(obj.callOut[k].minwidth);
			var imgHd=parseInt(obj.callOut[k].minheight);			
			if(wW>imgWd && wH>imgHd){				
				_obj=obj.callOut[k];
			}
		}
		return _obj;
	 }	 
	function getStripClass(obj){
	 	var dirNm='stripRight';		
		if(obj.align.toLowerCase()=='left'){
			dirNm='stripLeft';
		}
		if(obj.align.toLowerCase()=='top'){
			dirNm='stripTop';
		}
		if(obj.align.toLowerCase()=='bottom'){
			dirNm='stripBottom';
		}
		if(obj.align.toLowerCase()=='bottomleft'){
			dirNm='stripBottomLeft';
		}
		if(obj.align.toLowerCase()=='bottomright'){
			dirNm='stripBottomRight';
		}
		if(obj.align.toLowerCase()=='leftbottom'){
			dirNm='stripLeftBottom';
		}
		if(obj.align.toLowerCase()=='topleft'){
			dirNm='stripTopLeft';
        }
		if(obj.align.toLowerCase()=='topright'){
			dirNm='stripTopRight';
        }
		if(obj.align.toLowerCase()=='leftbottom'){
			dirNm='stripLeftBottom';
		}
               
		if(obj.align.toLowerCase()=='rightbottom'){
			dirNm='stripRightBottom';
		}
		if(obj.isThoughtbubble.toLowerCase()=='true'){
			dirNm+=' thoughtBubble';
		}
		if(obj.align=="" || obj.align== null){
			dirNm='none';	
		}	
		return dirNm;		
	 }	
	
	function animateStrips(){
		$('.img_slider').show();
		if(currentStrip==0){
			isAnimate=true;
			if(globalPath.languageDir == 'ltr'){
			$('.stripContainer').animate({left:"0px"},400,function(){
				$('.stripContainer').css('left','0px');
				if(isAnimate)checkpos();
				isAnimate=false;
				$('.img_slider').hide();
				$('#slider_'+(currentStrip+1)).show();
				
			});} else{
			$('.stripContainer').animate({right:"0px"},400,function(){
				$('.stripContainer').css('right','0px');
				if(isAnimate)checkpos();
				isAnimate=false;
				$('.img_slider').hide();
				$('#slider_'+(currentStrip+1)).show();
				
			});	}
		}else{
			isAnimate=true;
			var lt=(currentStrip*strip_width);
			if(globalPath.languageDir == 'ltr'){
			$('.stripContainer').animate({left:-lt+"px"},400,"swing",function(){
				$('.img_slider').hide();
				$('#slider_'+(currentStrip+1)).show();
				$('.stripContainer').css('left',-lt+'px');
				if(isAnimate)checkpos();
				isAnimate=false;				
			}); } else {
			$('.stripContainer').animate({right:-lt+"px"},400,"swing",function(){
				$('.img_slider').hide();
				$('#slider_'+(currentStrip+1)).show();
				$('.stripContainer').css('right',-lt+'px');
				if(isAnimate)checkpos();
				isAnimate=false;				
			});	}
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
		$(".thumb_img").removeClass('thumbSelected');
		$(".thumb_img").removeClass('thumbNext');
		$('.thumbBorder').removeClass('thumbNext_border');
		if(pageXml.type != "multiTab"){
			clickArray = clickStripArray[0];
		}else{
			clickArray = clickStripArray[0];
		}
		clickArray[currentStrip]=1;
		
		for (var i = 0; i < strip_count; i++) {
			if(stripArray[i]==1){
				$('#thumbClick_'+i).addClass('thumbVisited');
				if($('#thumbClick_'+i).hasClass('thumbLocked')){
					continue;
				}						
				$('#thumbClick_'+i).removeClass('blackThumb');
				$('#thumbnailImg_'+i).removeClass('blackThumb');
				$('#thumbnailImg_'+i).removeClass('thumbNext');				
			}
			if(clickArray[i]==1){
				//$('#thumbClick_'+i).addClass('thumbVisited');
			}
		}
		var fnd=true;
			
		for (var i = 0; i < strip_count; i++) {
			/*if(stripArray[i]!=1 || clickArray[i]!=1){	*/	
			if(stripArray[i]!=1){
					
				if(pageXml.type == "multiTab" && stripTab!=pageXml.defaultTab){
					//continue;
					fnd=false;
					break;	
				}else{
					if($('#thumbClick_'+i).hasClass('thumbLocked')){
						continue;
					}
					$('#thumbClick_'+i).addClass('thumbNext');
					$('.thumbNext').find('.thumbBorder').addClass('thumbNext_border');
					$('#thumbnailImg_'+i).removeClass('blackThumb');
					$('#thumbClick_'+i).removeClass('blackThumb');
					fnd=false;
					break;				
				}
				
			}
		}
		if(fnd){
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		}
		if(fnd && !pageComplete){
			pageComplete=true;
			templateMediator.pageVisited();
		}
		$('#thumbClick_'+currentStrip).removeClass('thumbVisited');
		$('#thumbClick_'+currentStrip).addClass('thumbSelected');
		/*if(currentStrip<6)
			$('#thumbnailImg_'+(currentStrip+1)).removeClass('blackThumb');*/
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
		
		//thumb_width=(wW>700 && wH>550)?115.5:42.5;
		
		var stripWidth=pageXml.comicStrip[0].width;
		if(stripWidth==null){
			stripWidth=strip_width;
		}
		var thumb_width=pageXml.comicStrip[stripTab].imgWidth;	 
		var wd = ((stripWidth-(thumb_width*strip_count))/strip_count)+(8-strip_count);		
		var wd = 6;		
		for(var i=0;i<strip_count;i++)
		{
		
			if(globalPath.languageDir == 'ltr'){
			$('.stripContainer .img_slider:eq('+i+')').css("left",(i*strip_width)+"px");			
				$('.thumbnailContainer .thumbnail:eq('+i+')').css("left",((i*thumb_width)+(i*wd))+"px");
				$('.thumbnailContainer .thumbnail:eq('+i+')').css("width",thumb_width+"px");
			} else{
			$('.stripContainer .img_slider:eq('+i+')').css("right",(i*strip_width)+"px");			
				$('.thumbnailContainer .thumbnail:eq('+i+')').css("right",((i*thumb_width)+(i*wd))+"px");
				$('.thumbnailContainer .thumbnail:eq('+i+')').css("width",thumb_width+"px");
		
			}
		}
			$('.thumbnailContainer').css("width",((thumb_width*strip_count)+((strip_count-1)*wd))+"px");
		$('.img_slider').hide();
		$('#slider_'+(currentStrip+1)).show();
	 }
	 
	 function updateTabIndex(){	 	
		$('.stripCallOutText a').removeAttr("tabindex");
		var tbCnt=5;		
		var lsT=0;
		for (var i = 0; i < strip_count; i++) {
			if(i==currentStrip){				
				tbCnt++;
				$('#thumbClick_'+i).attr('tabindex',tbCnt);
				tbCnt++;
				$('#myImg_'+i).attr('tabindex',tbCnt);
				tbCnt++;
				$('#mystText_'+i+' ').attr('tabindex',(tbCnt));
				lsT=i;
			}else if(stripArray[i]==1){
				tbCnt++;
				$('#thumbClick_'+i).attr('tabindex',tbCnt);
				lsT=i;
			}			
								
		}		
		if (lsT < 7) {
			lsT++;
			tbCnt++;
			$('#thumbClick_' + lsT).attr('tabindex', tbCnt);
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
