/*----------------------------------------
	Name: fw_videoPlayerWithText.js
	Developed by: Maneesh Nanu
----------------------------------------*/
function fw_videoPlayerWithText(_xml){    
	var pageXml=_xml;
	var prePath1="";
	var vidLeft = 0;
	var vidRight = 0;
	//this.updatePageLayOut=updatePageLayOut;
	var className=pageXml.className;
	$('.videoPlayerWithText').addClass(className)
	var tIndex = 5;	
	var lang = globalPath.userLanguage;
	var preloadImagesArray=new Array();
	var vPlayer 		= "";
	var _videoName 		= pageXml.video[0].vName;
	var _videoHt 		= pageXml.video[0].height== null ? '650' : pageXml.video[0].height;//650
	var _videoWd 		= pageXml.video[0].width == null ? '1010' : pageXml.video[0].width;//1010
	var _videoAutoPlay 	= pageXml.video[0].autoplay == null ? 'true' : pageXml.video[0].autoplay;
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
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
	
	if(pageXml.contentBackground != null){
		$('.panelBg').css('background-image','url(' + pageXml.contentBackground[0].img[0].path + ')');
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path);	
		isPreload=true;
	}else{
		$('.panelBg').remove();		
	}
	
	/************************/
	var cntLen=pageXml.contentText[0].text.length;	
	for(var c=0;c<cntLen;c++){
		var cln="etext"+c;	
		var txtStyle= pageXml.contentText[0].text[c].style || '';
		str='<div id="'+cln+'" style="'+txtStyle+'" tabindex="'+tIndex+'">'+pageXml.contentText[0].text[c].Text+'</div>';		
		$('.pageText').append(str);
		tIndex++;
	}	
	
		var pTextLen=pageXml.panelContainer[0].text.length;	
		var pStr='';
		for(var j=0;j<pTextLen;j++){
			var pTxtStyle = pageXml.panelContainer[0].text[j].style || '';
			pStr+="<div class='insertTab' style='"+pTxtStyle+"'><p>"+pageXml.panelContainer[0].text[j].Text+"</p></div>"
		}
		$('.panelContainer .videoText').append("<div class='videoTextCont'>"+pStr+"</div>");
		$('.videoText').css('height',$('.videoText').parent().height());
		
	$('.panelContainer .videoImg').html('<img src="content/'+lang+'/video/'+pageXml.panelContainer[0].img[0].path+'" alt="'+pageXml.panelContainer[0].img[0].Text+'" />');
	//updatePageLayOut();
	$('.pageInstruction').attr('tabindex',(tIndex));
	navigationEvent.updateGlobleFocus(tIndex);
	if(isPreload){
		$.imgpreload(preloadImagesArray,
		{
			each: function()
			{	
			},
			all: function()
			{
				try{
					 templateMediator.templateLoadComplete();
					if(is_chrome){
						$('body').addClass('chrome');
					}
					 setScroll();
				}catch(err){}
			}
		});		
	}else{
		templateMediator.templateLoadComplete();
		if(is_chrome){
			$('body').addClass('chrome');
		}
		setScroll();
	}
	
	/* if(!playerSetting.isAudio){
		$('.videoPlayerWithText .play').hide();
		pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
		templateMediator.pageVisited();
	}else{ */
		pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
	/* } */
	if(!navigationData.firstTime){
		templateMediator.pageVisited();
	}else{
		$('.btn_Next').addClass('disabledNavBtn');
		navigation.removeBlinker();
	}
	
	$("div[tabindex=1]").focus();

	$('.videoPlayerWithText .transcript').hide();
	$('.videoPlayerWithText .play').bind('click',function(){
			mediaPlayer.clearAudio();
			$('#btn_TranscriptOnOff,#btn_AudioOnOff').addClass('disabledNavBtn');
			$(".playerPos").remove();
			if($('.videoPlayerWithText .play').hasClass("disabled")){
				return false;
			}
			$('.videoPlayerWithText .play').hide();
			$('.videoTextParent').removeClass('IE');
			if(!!document.createElement('video').canPlayType){
				vPlayer  = '<video id="h5Video" width="'+_videoWd+'" height="'+_videoHt+'"   tabindex="'+tIndex+'">';
				vPlayer += '<source id="hdVdMP4" class="h5VdSrc" src="content/'+lang+'/video/'+_videoName+'.mp4" type="video/mp4">';
				vPlayer += '<source id="hdVdOGV" class="h5VdSrc" src="content/'+lang+'/video/'+_videoName+'.ogv" type="video/ogg">';
				vPlayer += 'Doesn\'t Support Video';
				vPlayer += '</video>'; 
				$('.panelContainer .videoImg').html('<div id="vdCont" class="playerPos" tabindex="'+(tIndex++)+'"><div class="videoCon">'+vPlayer+'</div></div>');
				var videoObjStyle = pageXml.videoObj[0].style || '';
				$('.videoCon').attr('style',videoObjStyle);
				var video = document.getElementById("h5Video");
				video.play();
					setTimeout(function(){$('video').attr('controls','true');},1500);
				$('#h5Video').bind('ended', function () {
					 $('.sliderPatch').hide();
					 $('video').attr('controls','true');
					 pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
					templateMediator.pageVisited();
				});
			}else{
				vPlayer += '<object id="objVideo" width="'+_videoWd+'" height="'+_videoHt+'" classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95"  STANDBY="Loading Windows Media Player components..." TYPE="application/x-oleobject">';
				vPlayer += '<param name="src" value="content/'+lang+'/video/'+_videoName+'.mp4">';
				vPlayer += '<param name="controller" value="true">';
				vPlayer += '<param name="uiMode" value="full">';
				vPlayer += '<param name="autosize" value="1">';
				vPlayer += '<param name="playcount" value="1">';
				vPlayer += '<param name="SCALE" value="ToFit">';
				vPlayer += '<param name="autoplay" value="true">';
				vPlayer += '<embed id="embdVideo" src="content/'+lang+'/video/'+_videoName+'.mp4" autoplay="'+_videoAutoPlay+'" TYPE="application/x-mplayer2" ShowControls="1" ShowStatusBar="0" ShowDisplay="0" autostart="1"></embed>';
				vPlayer += '</object>';
				$('.panelContainer .videoImg').html(vPlayer);
				setStyle(".panelContainer object",pageXml.video[0]);
				$('.videoTextParent').addClass('IE');
				var obj = document.getElementById("objVideo")
				obj.attachEvent("playStateChange",  function(){mediaplayerStatus(obj)});
				
			}
			var vdContTop=pageXml.videoCont[0].top || '';
			$('.playerPos').css('top',vdContTop);
			if(!navigationData.isCurrentPageComplete()){
				$('.videoCon').append('<div class="sliderPatch"></div>');
			}
			
	});

	function setScroll(){
		if($('.videoTextCont').parent().height() < $('.videoTextCont').height()){
			$('.videoText').css('height',$('.videoText').parent().height())
			$('.videoText').fw_Scroll({color:"#FFFFFF",width:10});
		}
	}
	/* function updatePageLayOut(){
	 if($('#vdCont')){
		 if(globalPath.languageDir == 'ltr'){
			 var l = parseInt($('.panelContainer').offset().left) + parseInt(vidLeft);
             $('#vdCont').css('left',l)
		 } else{
			 var l = parseInt($('.panelContainer').offset().left) + parseInt(vidRight);
             $('#vdCont').css('right',l)
		 }
                
            }
        } */
	function isIE() {
		var myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}
		function mediaplayerStatus(obj){
				switch (obj.PlayState){
					 case 0:  
						//$('#objVideo')
					  templateMediator.pageVisited();
					  $('.sliderPatch').hide();
					  pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
					 break;
					case 8:
						//templateMediator.pageVisited();
						$('.pauseBtn').hide();				
						$('.playBtn').show();	
						pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
						break;
					case 2:    // Paused
						$('.pauseBtn').show();				
						$('.playBtn').hide();
					break;
					case 0:    // MediaEnded
						$('.pauseBtn').hide();				
						$('.playBtn').show();	
					break;      
					default:
					 break;
				}
	}
	

	function setStyle(obj,_xml){
		var clr =(_xml.color==null?'#504f56':_xml.color);
		var fts =(_xml.fontSize==null?'16px':_xml.fontSize);
		var ftw =(_xml.fontWeight==null?'normal':_xml.fontWeight);
		if(globalPath.languageDir == 'ltr'){
			var txtA=(_xml.textAlign==null?'left':_xml.textAlign);
			var wd  =(_xml.width==null?'auto':_xml.width);
			var ht  =(_xml.height==null?'auto':_xml.height);
			var lft =(_xml.left==null?'':_xml.left);
			var tp  =(_xml.top==null?'':_xml.top);
			var pos =(_xml.position==null?'absolute':_xml.position);
			var bgColor =(_xml.bgColor==null?'':_xml.bgColor);
			$(obj).css({left:lft,top:tp,color:clr,'font-size':fts,'font-weight':ftw,'text-align':txtA,position:pos,'background-color':bgColor});
		} else{
			var txtA=(_xml.textAlign==null?'right':_xml.textAlign);
			var wd  =(_xml.width==null?'auto':_xml.width);
			var ht  =(_xml.height==null?'auto':_xml.height);
			var lft =(_xml.right==null?'':_xml.right);
			var tp  =(_xml.top==null?'':_xml.top);
			var pos =(_xml.position==null?'absolute':_xml.position);
			var bgColor =(_xml.bgColor==null?'':_xml.bgColor);
			$(obj).css({right:lft,top:tp,color:clr,'font-size':fts,'font-weight':ftw,'text-align':txtA,position:pos,'background-color':bgColor});
		}
		
	}
}
