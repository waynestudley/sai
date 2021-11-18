/*----------------------------------------
	Name: fw_InteractiveVideo.js
	Developed by: 
----------------------------------------*/
function fw_InteractiveVideo(_xml){
    //
	var pageXml=_xml;
	var prePath1=""; 
	var stripDiv='';
	var strip_count=pageXml.stripContent[0].strip.length;
	var strip_width=777;
	var currentStrip=0;
	var stripArray= new Array();
	var clickArray= new Array();
	var currStripArr = new Array();	
	var clickStripArray = new Array();
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
	var videoTextObj = pageXml.videoContent[0].videos[0];
	var Selectors = {
	disabled:"disabled",
	player:".videoContainer",
	hover:"mhover",
	visited:"visited",
	selected:"selected"
	};
	
	$('.interactiveVideo').addClass(className);
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
	/************************/
	
	var imgPath = pageXml.contentBackground[0].img[0].path;
	var iPadBackground = pageXml.contentBackground[0].img[0].ipadPath;
	if (imgPath != "") {
		if (iPadBackground != undefined) {
			if (globalSettings.isDesktop()) {
				$('.interactiveVideoBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
			} else {
				$('.interactiveVideoBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].ipadPath + ')');
				preloadImagesArray.push(pageXml.contentBackground[0].img[0].ipadPath);
			}
		} else {
			$('.interactiveVideoBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
			preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);
		}
	} else {
		$('.interactiveVideoBg').remove();
	}
	
	/* $('.videoContainer img').attr('src',pageXml.videoContent[0].videos[0].) */
	
	
	addVideoContainer();
	createHTMLForStripImgTextCon();
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
	$(".interactiveVideoContainer .tabSelection").hide();
	currStripArr = new Array(0);
	stripArray[0]=1;
	$("#stripProgDiv_"+currentStrip).addClass('visited');
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
					$("div[tabindex=1]").focus();
					navigation.clearCustomVideoObj();
				}catch(err){}
			}
	});
	
	if(!navigationEvent.isPageAudioOn){
		showNonVideoConatiner();
	}else{
		showVideoContainer();	
	}
	
	if(navigationData.isCurrentPageComplete()){
		templateMediator.pageVisited();
	}
	function addVideoContainer(){
		pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
		$('.videoIntroDiv .videoImg').attr('src',videoTextObj.poster);   
	}
	function pageSwiped(direction){		
		if(isAnimate){
			return true;
		}
		
		var od=stripArray[currentStrip];
		if(direction=="left"){
			if(currentStrip<(strip_count-1)){
				isAnimate=true;				
				currentStrip++;
				stripArray[currentStrip]=1;
				animateStrips();
				updateStrips();
			}else{			
				isAnimate=true;				
				$('.stripContainer').effect('bounce', { distance:8,times:4,direction:"left" }, 200,function(){
					isAnimate=false;
				}); 
			}
		}else if(direction=="right"){
			if(currentStrip>0){
				isAnimate=true;				
				currentStrip--;
				stripArray[currentStrip]=1;			
				animateStrips();
				updateStrips();	
			}else{				
				isAnimate=true;
				$('.stripContainer').effect('bounce', {distance:8, times:4,direction:"right" }, 200,function(){
					isAnimate=false;;
				}); 
			}
		}	
		
	}
	function stripTabClick(cTabId){
		currStripArr[0] = currentStrip;
		currStripArr[0] = currentStrip;
		currStripArr[1] = currentStrip;
		stripArray = clickStripArray[0];
		clickArray = clickStripArray[0];			
		currentStrip = currStripArr[0];
		strip_count=pageXml.stripContent[0].strip.length;
		updatePageLayOut();
	}
	function updatePageLayOut(){
		var wW=$(window).width();
		var wH=$(window).height();
		strip_width=(wW>640 && wH>550)?647:300;	
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
		var comstrip_count=pageXml.stripContent.length;
		clickStripArray = new Array();
		for(var i=0;i<comstrip_count;i++){
			var tmpstrpAr = new Array();
			var comstrip_strip_count=pageXml.stripContent[i].strip.length;
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
	
	function createHTMLForStripImgTextCon(){
		stripDiv='';
		stripProgDiv='';
		tabIdx=5;
		preloadImagesArray= new Array();
		var interactiveVideoConStyle= pageXml.stripContent[0].style || '';
		var interactiveBtnConStyle= pageXml.stripContent[0].btnConStyle|| '';
		$('.interactiveVideoContainer').attr('style',interactiveVideoConStyle);
		$('.interactiveBtnContainer').attr('style',interactiveBtnConStyle);
	 	for(var i=0;i<strip_count;i++){
			stripDiv+='<div class="img_slider" id="slider_'+(i+1)+'" >';
			var img1Obj=getImgObject(pageXml.stripContent[0].strip[i].stripBackground[0]);
			var bg_txtObj=pageXml.stripContent[0].strip[i].stripBackground[0].text;
			stripDiv+='<img class="csImgBg" id="myImg_'+(i)+'" src="'+img1Obj.path+'" alt="'+img1Obj.Text+'" title="" tabindex="'+tabIdx+'"  />';
			tabIdx++;
			stripDiv+='</div>';
			
			stripProgDiv+='<div id="stripProgDiv_'+i+'" class="stripProgDiv" ></div>';
			preloadImagesArray.push(img1Obj.path);		
		}
		$('.stripContainer').html(stripDiv);
		$('.progressContainer .progDivCon').html(stripProgDiv);
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
	 function updateStripText(val){
		var textObj='';
		var txtStr='';
		if(pageXml.stripContent[0].strip[val].stripText!=null){
			textObj= pageXml.stripContent[0].strip[val];
			for (var j = 0; j < textObj.stripText.length; j++) {
				var txtDivStyle = textObj.stripText[0].text[j].style || '';
				txtStr+='<div class="insertTab" style="'+txtDivStyle+'"><p>'+textObj.stripText[0].text[j].Text+'</p></div>';
			}
		}else{
			textObj= videoTextObj.cc[val];
			var txtDivStyle = textObj.style || '';
			txtStr+='<div class="insertTab" style="'+txtDivStyle+'"><p>'+textObj.Text+'</p></div>';
		}
		$('.stripTextContainer').html(txtStr);
	 }
	function animateStrips(){
		$('.img_slider').show();
		if(currentStrip==0){
			if(globalPath.languageDir == 'ltr'){
				isAnimate=true;
				$('.stripContainer').animate({left:"0px"},200,function(){
					$('.stripContainer').css('left','0px');
					if(isAnimate)checkpos();
					isAnimate=false;
					$('.img_slider').hide();
					$('#slider_'+(currentStrip+1)).show();
				});
			}else{
				isAnimate=true;
				$('.stripContainer').animate({right:"0px"},200,function(){
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
				$('.stripContainer').animate({left:-lt+"px"},200,"swing",function(){
					$('.img_slider').hide();
					$('#slider_'+(currentStrip+1)).show();
					$('.stripContainer').css('left',-lt+'px');
					if(isAnimate)checkpos();
					isAnimate=false;				
				}); 
			}else{
				isAnimate=true;
				var lt=(currentStrip*strip_width);
				$('.stripContainer').animate({right:-lt+"px"},200,"swing",function(){
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
		strip_width=(wW>640 && wH>550)?647:300;	
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
		updateStripText(currentStrip);
		if(currentStrip>0){
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
			$(".top-content-bg").hide();
			$(".stripBackBtn,.stripTextContainer").show();
			$(".stripBackBtn").removeClass('disabled');
		}else{
			$(".top-content-bg").show();
			$(".stripBackBtn,.stripTextContainer").hide();
			$(".stripBackBtn").addClass('disabled');
		}
		
		if(currentStrip<(strip_count-1)){
			$(".stripNextBtn").show();
			$(".stripNextBtn").removeClass('disabled');
		}else{
			$(".stripNextBtn").hide();
			$(".stripNextBtn").addClass('disabled');
		}
		 for (var i = 0; i < strip_count; i++) {
			if(stripArray[i]==1){
				$('#stripProgDiv_'+i).addClass('visited');
			}
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
		return true;
	}
	
	function arrangeSlider(){
	 	var wW=$(window).width();
		var wH=$(window).height();
		strip_width=(wW>640 && wH>550)?647:300;
		var stripWidth=pageXml.stripContent[0].width;
		if(stripWidth==null){
			stripWidth=strip_width;
		}
		var stripProgDiv_width=pageXml.stripContent[0].imgWidth;	 
		var gap=4;
		for(var i=0;i<strip_count;i++)
		{
			if(globalPath.languageDir == 'ltr'){
				$('.stripContainer .img_slider:eq('+i+')').css("left",(i*strip_width)+"px");
				$('.progDivCon .stripProgDiv:eq('+i+')').css("left",((i*stripProgDiv_width)+(i*gap))+"px");
			}else{
				$('.stripContainer .img_slider:eq('+i+')').css("right",(i*strip_width)+"px");
				$('.progDivCon .stripProgDiv:eq('+i+')').css("right",((i*stripProgDiv_width)+(i*gap))+"px");
			}
			
			$('.progDivCon .stripProgDiv:eq('+i+')').css("width",stripProgDiv_width+"px");
		}
		$('.img_slider').hide();
		$('#slider_'+(currentStrip+1)).show();
	 }
	 function addEvent(){
		$('.vPlay').click(function(){
			$('.videoIntroDiv').hide();
			navigationEvent.isVideoPlaying=true;
			initVideoPlayer(videoTextObj);
			if(!globalSettings.isDesktop()){
				navigationData.videoObj.playVideo();
			}
			if(!navigationData.isCurrentPageComplete()){
				$('.v-video-slider').addClass('disabled');
			}
		})
		$(navigation).bind('page_external_audioOff', function(e){
			showVideoContainer();
		});
		$(navigation).bind('page_external_audioOn', function(e){
			showNonVideoConatiner();
		});
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
		});
		$(".stripNextBtn").click(function(){
			if($(this).hasClass('disabled'))return false;
			currentStrip++;
			updateStrips();		
			animateStrips();	
		
		});
		
	 }
	 function updateTabIndex(){	 	

	 }
	function initVideoPlayer(obj){
			/* qpointObj = obj.qpoints; */
			videoInit = true;
			var vposter = obj.mposter ?obj.mposter: obj.poster;
			var vpath = obj.mpath ?obj.mpath: obj.path;
			var vWidth=obj.width;
			var vHeight=obj.height;
			navigationData.videoObj.init({
				videoContainer: "#video-container",
				pauseContainer: "",
				width: vWidth,
				height: vHeight,
				autoplay: true,
				videoslector: "myVideo",
				poster:vposter,
				path: vpath,
				cc:  obj.cc,
				fitToScreen:true,
				resizeParent:Selectors.player,
				loader:{animate:true,width:70,frameRateMs:300,imgcount:10},
				completion:1,
				icons: {
					include: true,
					play: "&#xe905;",
					pause: "&#xe904;",
					volumeon: "&#xe902;",
					volumeoff: "&#xe903;",
					zoomin: "&#xe900;",
					zoomout: "&#xe901;",
					ccon: "&#xe906;",
					ccoff: "&#xe907;"
				},
				controls: {
					include:true,
					above:true,
					hideOnoutside:false,
					playpause: true,
					slider: {include:true, hideDragger:false},
					volume: true,
					time: true,
					zoom: true
				},
				timeUpdate: null,
				ended: function (){
					makePageCompleted();
				},
				autoPlayClick: function (){
					if(!globalSettings.isDesktop()){
						audioPlayer.play();
						bgMusic.play();
					}
				}
		});	
	}
	function makePageCompleted(){
		templateMediator.pageVisited();
		$('.v-video-slider').removeClass('disabled');
	}
	function showVideoContainer(){
		$('.nonVideoContaner').hide();
		$('.videoMainContainer').show();
		//console.log(navigationEvent.isVideoPlaying);
		if(navigationEvent.isVideoPlaying){
			$('.top-content-bg').hide();
			navigationData.videoObj.playVideo();
		}else{
			$('.top-content-bg').show();
			pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
			navigation.clearCustomVideoObj();
			$('.videoIntroDiv').show();
		}	
		/* $('.v-video-slider-handle').addClass('disabled') */
	}
	function showNonVideoConatiner(){
		navigationData.videoObj.pauseVideo();	
		$('.videoIntroDiv, .videoMainContainer').hide();
		if(currentStrip<=0){
			$('.top-content-bg').show();
			pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		}else{
			$('.top-content-bg').hide();
		}
		$('.nonVideoContaner').show();
	}
	 function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#333740':_xml.color);
		var bgColor =(_xml.bgColor==null?'':_xml.bgColor);
		var padding =(_xml.padding==null?'':_xml.padding);
		var fts =(_xml.fontSize==null?'15px':_xml.fontSize);
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
