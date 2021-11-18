/*
 Framework for Responsive eLearning Development (FRED)
 Version 2.0
 Copyright © Upside Learning Solutions Pvt. Ltd.

 This is a legal agreement between you or the company, organization, employer, or other entity on behalf of whom you are entering into this agreement ("Purchaser") and Upside Learning Solutions Pvt. Ldt., a provider of learning solutions having its head office at Punakar Complex, Survey No-117, 1st Floor, Bangalore Pune Highway, Warje, Pune – 411058, Maharashtra, India, as the licensor hereunder ("Upside Learning"). The Purchaser has been granted a one-time non-exclusive non-transferable license for FRED v2.0. This grants permission to the Purchaser or any Purchaser employee to use this framework (including templates) and its associated documentation to:
 1.Modify the framework and templates as desired.
 2.Use the (modified) framework and templates to create eLearning content.

 The Purchaser may not resell or freely redistribute FRED or its associated documentation to anyone outside the Purchaser (including vendors, service providers, partners, clients or customers); nor may the Purchaser transfer this license to anyone.

 It is strongly recommended that the framework and template source files included in the packaged eLearning content (i.e. the output) should be minified prior to distribution, to restrict unauthorized access to the source.
 */

 /*
 * @author Suyog Shaha
 * @name VideoPlayer.js
 * @namespace FRED
 * @version 2.0
 */
 
function VideoPlayer() {
	var visitedArr = [0];
	var _self = this;
	var defaults = {};
	var pageObj;
	var container;
	var isDesktop = globalSettings.isDesktop();
	var vPlayer;
	var vIcons;
	var controls;
	var playingStart = false;
	var totalTime = 0;
	var isHTML5 = HTML5videoSupport();
	var currentTime = 0;
	var vidContainer;
	var btnplaypause;
	var btnvolume ;
	var btncc ;
	var btnzoom;
	var playIcon;
	var pauseIcon;
	var volumeOn;
	var volumeOff;
	var ccOn;
	var ccOff;
	var zoomIn;
	var zoomOut;
	var ctime;
	var tototime;
	var sliderBG;
	var sliderBar;
	var handle;
	var bufferBar;
	var audioFill;
	var controlsCont;
	var zoomElement; 
	var sliderCnt;	
	var max = 100;
	var currentPos = 0;
	var prePos = 0;
	var drag = false;
	var ldCnt = 0;
	var wmPlaying = false;
	var rmAutoPlay = false;
	var zoomed = false;
	var completionSend = false;
	var isCC = false;
	var vLoader;
	var autoPlayBtn;
	var autoPlayCnt;	
	var controlContainer;	
	var ccObj = null;	
	this.playVideo = playPlayer;
	this.pauseVideo = pausePlayer;
	this.showControls = showControls;
	this.updateVideo = updateVideo;
	this.reSizeVideo = reSizeVideo;
	this.clearVideo = clearVideo;
	this.updateTime = updateVideoPosition;
	this.isPlaying = isPlaying;

	
	this.getPageDataObj = getPageDataObj;
	this.init = init;
	this.getContainer = getContainer;
	this.lmsData = null;
	this.getPageInteractionData = getPageInteractionData;
	this.isComponentCompleted = isComponentCompleted;
	//Template Events
	this.COMPONENT_COMPLETED = 'componentCompleted';
	
	function init(params) {		
		defaults = {
			pageSelector: '',
			activityParentSelector: '',
			pauseContainer: "",
			dataindex: 0,
			element: "",
			width: 600,
			height: 400,
			autoplay: false,
			support: "html5",
			loop: false,
			fitToScreen: false,
			resizeParent:"body",
			preload: false,
			videoslector: "cm-myVideo",
			poster: "",
			path: "",
			cc: null,
			loader:{animate:true,width:70,frameRateMs:300,imgcount:10},
			completion:0,
			icons: {
				include: true,
				play: ">",
				pause: "||",
				volumeon: "On",
				volumeoff: "Off",
				zoomin: "Zoom +",
				zoomout: "Zoom-",
				ccon: "cc on",
				ccoff: "cc off"
			},
			controls: {
				include:true,
				above:true,
				hideOnoutside:true,
				playpause: true,
				slider: true,
				volume: false,
				time: true,
				zoom: true
			},
			timeUpdate: null,
			ended: null
		};
		defaults = $.extend(defaults, params);
		controls = defaults.controls;
		vIcons = defaults.icons;
		ccObj = defaults.cc;
		if (isHTML5) {
			vPlayer = getHTML5PLayer();
			addHTML5Event();
		} else {
			vPlayer = getMediaPlayer();
			addMediaPlayerEvent();
		}		
		if(controls.include){
			addCustomControls();	
			vidContainer = $(defaults.videoContainer).find('#v-player');
			btnplaypause = $(defaults.videoContainer).find('#v-playpause');
			btnvolume = $(defaults.videoContainer).find('#v-volume');
			btncc = $(defaults.videoContainer).find('#cc-btn');
			btnzoom = $(defaults.videoContainer).find('#v-fullscreen');
			playIcon = btnplaypause.find('.v-play');
			pauseIcon = btnplaypause.find('.v-pause');
			volumeOn = btnvolume.find('.v-on');
			volumeOff = btnvolume.find('.v-off');
			ccOn = btncc.find('.v-on');
			ccOff = btncc.find('.v-off');
			zoomIn = btnzoom.find('.v-on');
			zoomOut = btnzoom.find('.v-off');
			ctime = $(defaults.videoContainer).find('.v-current');
			tototime = $(defaults.videoContainer).find('.v-duration');
			sliderBG = $(defaults.videoContainer).find('.v-video-slider');
			sliderBar = $(defaults.videoContainer).find('.v-video-slider-bar');
			handle = $(defaults.videoContainer).find('.v-video-slider-handle');
			bufferBar = $(defaults.videoContainer).find('.v-video-slider-bar-buffer');
			audioFill = $(defaults.videoContainer).find('.v-video-slider-bar-fill');
			controlsCont = $(defaults.videoContainer).find('.v-controls');
			sliderCnt = $(defaults.videoContainer).find('.v-video-slider-cnt');
			controlContainer = $(defaults.videoContainer).find('.v-control-cnt');
			zoomElement = document.getElementById('v-player');
			if(!isDesktop){
				zoomElement = vPlayer;
			}
		}else{
			vIcons.include = false;
			controls.slider.include = false;
			controls.time = false;
		}
		vLoader = $(defaults.videoContainer).find('.video-loader');	
		autoPlayBtn = $(defaults.videoContainer).find('.video-auto-play-btn');	
		autoPlayCnt = $(defaults.videoContainer).find('.video-auto-play-cnt');
		/* $(window).resize(function () {
			reSizeVideo();
		}); */	
		animateLoader();
		toggleCC();
		setTimeout(function(){reSizeVideo();},200);
		
		if (vIcons.include) {
			playIcon.html(vIcons.play);
			pauseIcon.html(vIcons.pause);
			volumeOn.html(vIcons.volumeon);
			volumeOff.html(vIcons.volumeoff);
			ccOn.html(vIcons.ccon);
			ccOff.html(vIcons.ccoff);
			zoomIn.html(vIcons.zoomin);
			zoomOut.html(vIcons.zoomout);
		}
		if(controls.include){
			addControlsEvent();
		}
	}
	
	function addControlsEvent() {
		btnplaypause.click(function () {
			if (isPlaying()) {
				pausePlayer();
			} else {
				playPlayer();
			}
		});
		btnvolume.click(function () {
			toggleVolume();
		});
		btncc.click(function () {
			toggleCC();
		});
		btnzoom.click(function () {
			toggleZoom();
		});
		if($(autoPlayBtn).length>0){
			autoPlayBtn.click(function(e){
				if(defaults.autoPlayClick){
					defaults.autoPlayClick();
				}
				autoPlayCnt.remove();
				playPlayer();
			});
		}
		
		if (controls.slider.include && !controls.slider.hideDragger) {
			sliderBG.click(function(e){
				 if($(this).hasClass('disabled'))return false;
				 var xPos = e.pageX - sliderBar.offset().left;
				 var barwdth = sliderBar.width();
				 var sec = Math.round((xPos / barwdth) * totalTime);
				 updateVideoPosition(sec);
			});
			handle.draggable({
				containment: bufferBar,
				axis: "x",
				start: function (event, ui) {
					if(sliderBG.hasClass('disabled'))return false;
					handle.stop(true, true);
					drag = true;
					var barwdth = sliderBar.width() - handle.outerWidth();
					max = totalTime;
					
					
						prePos = Math.round((ui.position.left / barwdth) * totalTime);
					
					pausePlayer();
				},
				drag: function () {
				},
				stop: function (event, ui) {
					var barwdth = sliderBar.width() - handle.outerWidth();
					max = totalTime;
					
						currentPos = Math.round((ui.position.left / barwdth) * totalTime);
					
					updateVideoPosition(currentPos);
					drag = false;
				}
			});
			bufferBar.css('width', '100%');
		}
		var zoomEvent = document;
		if(!isDesktop){
			zoomEvent = vPlayer;
		}
		$(zoomEvent).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange webkitendfullscreen', function(e) {
			var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (document.msFullscreenElement!=null);			
			zoomed = state;
			onFullscreenchange();
		});
		if(controls.above && controls.hideOnoutside){
			$(vidContainer).on('mouseenter',function () {
				controlContainer.stop(true,true).fadeIn();
			});
			$(vidContainer).on('mouseleave', function () {            
				controlContainer.stop(true,true).fadeOut();
			});
		}

	}
	function updateSliderPos(val) {
		if (drag) {
			return false;
		}
		max = totalTime;
		if (val > max) {
			val = max;
		}
		//var barwdth = sliderBar.width() - handle.outerWidth();
		//var lp = Math.round((val / max) * barwdth);
		var per = ((val / max) * 100);		
		if (!controls.slider.hideDragger) {
			
				handle.stop(true, true).animate({ 'left': per + '%' }, 250, 'linear');
			
		}
		audioFill.stop(true, true).animate({ 'width': per + '%' }, 250, 'linear');
	}

	function buffered(val) {
		if(!controls.include){
			return false;
		}
		if (val >= 99) {
			val = 100;
		}
		bufferBar.css('width', val + '%');
	}

	function onVideoEnd() {
		if (defaults.ended) {
			defaults.ended();			
		}
		if(defaults.completion>0 && !completionSend){
			completionSend = true;
			visitedArr[0]=1;
			onComponentCompleted();
		}
		if(controls.include){
			btnplaypause.attr('class', 'play');
		}
	}

	function updateTime(obj) {
		totalTime = obj.totalTime;
		currentTime = obj.currentTime; 
		if(ccObj!=null){			
			for(var i=0; i<ccObj.length; i++){
				 
				if(ccObj[i].time<=Math.round(currentTime)){
					var tt = ccObj[i].Text;
					$('.video-caption-window').html('<span class="captions-text">'+tt+'</span>');
					if(tt==""){
						$('.video-caption-window').css('opacity',0);
					}else{
						$('.video-caption-window').css('opacity',1);
					}
					//break;
				}
			}
			
		}
		
		if(totalTime == null || isNaN(totalTime)){
			return false;
		}
		if (controls.time) {
			ctime.html(getTimeFormat(obj.currentTime));
			tototime.html(getTimeFormat(obj.totalTime));
		}
		if (controls.slider.include) {
			updateSliderPos(obj.currentTime);
		}
		if (defaults.timeUpdate) {
			defaults.timeUpdate(obj);
		}		
	}
	function toggleZoom(){		
		zoomed = !zoomed;		 
		if(zoomed){			
			if (zoomElement.requestFullscreen) {
				zoomElement.requestFullscreen();
			}else if (zoomElement.msRequestFullscreen) {
				zoomElement.msRequestFullscreen();
			} else if (zoomElement.mozRequestFullScreen) {
				zoomElement.mozRequestFullScreen();
			} else if (zoomElement.webkitRequestFullscreen) {
				zoomElement.webkitRequestFullscreen();
			}  else if (zoomElement.webkitEnterFullScreen) {
				zoomElement.webkitEnterFullScreen();
			}
		}else{
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.webkiteFullScreen) {
				document.webkiteFullScreen();
			}else if (document.webkitendfullscreen) {
				document.webkitendfullscreen();
			}
		}
		onFullscreenchange();		
	}

	function onFullscreenchange() {
		if(!controls.include){ return false;}
		var vclass = 'on';
		vclass = zoomed ? 'on' : 'off';
		btnzoom.attr('class', vclass);
		if(zoomed){
			vidContainer.addClass('v-zoom');
		}else{
			vidContainer.removeClass('v-zoom');
		}
		if(isDesktop){
			updateVideoZoom();
		}else{
			if(zoomed){
				$(zoomElement).attr('controls','true');
			}else{
				$(zoomElement).removeAttr('controls');
			}
		}		
	}
	
	function updateVideoPosition(_time) {
		if (isHTML5) {
			vPlayer.currentTime = _time;
		} else {
			if (vPlayer.SetTime) {
				vPlayer.SetTime(_time);
			} else {
				vPlayer.controls.currentPosition = _time;
			}
		}
		var tobj = { currentTime: vPlayer.currentTime, totalTime: vPlayer.duration };
		updateTime(tobj);
		playPlayer();
	}
	
	function toggleCC() {
		isCC = !isCC;	
		var vclass = 'off';
		vclass = isCC ? 'on' : 'off';
		btncc.attr('class', vclass);
		if(isCC){
			$('.video-caption-window').show();
			$('.top-content-bg').hide();
		}else{
			$('.video-caption-window').hide();
			$('.top-content-bg').show();
		}
		
	}
	function toggleVolume() {
		if (!vPlayer) {
			return false;
		}
		if (isHTML5) {
			vPlayer.muted = !vPlayer.muted;
		} else {
			if (vPlayer.settings.volume > 0) {
				vPlayer.settings.volume = 0;
			} else {
				vPlayer.settings.volume = 100;
			}
			onVolumechange();
		}
	}
	function showControls(flag){
		if(flag){
			controlContainer.removeClass('disable');
		}else{
			if(isCC){
				toggleCC();
			}
			controlContainer.addClass('disable');
		}
	}
	function updateVideo(path,poster, _ccObj){
		pausePlayer();		
		if(ccObj!=null){
			vPlayer.currentTime = 0;
		}
		$('video').css('opacity','0');
		ccObj = _ccObj;
		vPlayer.src = path;
		$('#'+defaults.videoslector).attr('poster', poster);
		playPlayer();
		showControls(true);
	}
	function clearVideo(){
		pausePlayer();
		if(ccObj!=null){
			vPlayer.currentTime = 0;
		}
		ccObj = null;
		if(vPlayer!=null){
			vPlayer.src = "";
			showControls(false);
		}
	}
	
	function pausePlayer() {
		if (!vPlayer) {
			return false;
		}
		if (isHTML5) {
			vPlayer.pause();
		} else {
			wmPlaying = false;
			if (vPlayer.Pause) {
				vPlayer.Pause();
			} else {
				vPlayer.controls.Pause();
			}
		}
	}

	function playPlayer() {
		if (!vPlayer) {
			return false;
		}
		$('.video-auto-play-cnt').hide();
		
		if (isHTML5) {
			vPlayer.play();
		} else {
			wmPlaying = true;
			if (vPlayer.play) {
				vPlayer.play();
			} else {
				vPlayer.controls.play();
			}
		}
		if(controls.include){
			btnplaypause.attr('class', 'pause');
		}		
	}
	function onPause() {
		if(!controls.include){ return false;}
		btnplaypause.attr('class', 'play');
	}
	function onPlay() {
		if(!controls.include){ return false;}
		btnplaypause.attr('class', 'pause');
	}
	function onVolumechange() {
		if(!controls.include){ return false;}
		var vclass = 'on';
		if (isHTML5) {
			vclass = vPlayer.muted ? 'off' : 'on';
		} else {
			vclass = vPlayer.settings.volume === 0 ? 'off' : 'on';
		}
		btnvolume.attr('class', vclass);
	}
	

	function isPlaying() {
		if (isHTML5) {
			if (vPlayer.paused || vPlayer.ended) {
				return false;
			}
			return true;
		} else {
			return wmPlaying;
		}

	}
	function addCustomControls() {
		if(controls.above){
			$(defaults.videoContainer).find('.v-control-cnt').addClass('above');
		}
		var str = '<div class="disable-controls" ></div><table class="v-controls">';
		str += '<tr>';
		if (controls.playpause) {
			str += '<td class="v-btn">';
			str += '<a href="javascript:void(0)" id="v-playpause" class="play" >';
			str += '	<span class="v-icon v-play"></span>';
			str += '	<span class="v-icon v-pause"></span>';
			str += '</a>';
			str += '</td>';
		}
		if (controls.slider.include) {
			str += '<td class="v-slider">';
			str += getVideoSlider();
			str += '</td>';
		}
		if (controls.time) {
			str += '<td class="v-time">';
			str += '<span class="v-current">00:00</span><span class="v-time-sep">/</span><span class="v-duration">00:00</span>';
			str += '</td>';
		}
		if (controls.volume && isDesktop) {
			str += '<td class="v-btn">';
			str += '<a href="javascript:void(0)" id="v-volume" class="on" >';
			str += '	<span class="v-icon v-on"></span>';
			str += '	<span class="v-icon v-off"></span>';
			str += '</a>';
			str += '</td>';
		}
		//if (controls.cc && isHTML5) {
			str += '<td class="v-btn">';
			str += '<a href="javascript:void(0)" id="cc-btn" class="on" >';
			str += '	<span class="v-icon v-on"></span>';
			str += '	<span class="v-icon v-off"></span>';
			str += '</a>';
			str += '</td>';
		//}
		
		if (controls.zoom && isHTML5) {
			str += '<td class="v-btn">';
			str += '<a href="javascript:void(0)" id="v-fullscreen" class="off" >';
			str += '	<span class="v-icon v-on"></span>';
			str += '	<span class="v-icon v-off"></span>';
			str += '</a>';
			str += '</td>';
		}
		str += '</tr>';
		str += '</table>';
		$(defaults.videoContainer).find('.v-control-cnt').html(str);
	}
	function getVideoSlider() {
		var str = '';
		str += '<div class="v-video-slider">';
		str += '<div class="v-video-slider-bar">';
		str += '<div class="v-video-slider-bar-buffer"></div>';
		str += '<div class="v-video-slider-bar-fill"></div>';
		if (!controls.slider.hideDragger) {
			str += '<div class="v-video-slider-cnt"><a class="v-video-slider-handle" href="javascript:void(0)" ></a><div>';
		}
		str += '</div>';
		str += '</div>';
		return str;
	}
	function addMediaPlayerEvent() {
		vPlayer.enableContextMenu = false;
		vPlayer.attachEvent("playStateChange", function () {
			switch (vPlayer.PlayState) {
				case 2:    // Paused
					onPause();
					wmPlaying = false;
					break;
				case 3:    // Playing
					vLoader.hide();
					onPlay();
					wmPlaying = true;
					break;
				case 7:    // Waiting
					vLoader.show();
					break;
				case 8:    // MediaEnded
					vLoader.hide();
					onVideoEnd();
					onPause();
					wmPlaying = false;
					break;
			}
		});
		vPlayer.attachEvent("MediaError", function (err) {
			alert('error' + err);
		});
		var mediaInt = setInterval(function () {
			if (vPlayer) {
				var tobj = { currentTime: vPlayer.controls.currentPosition, totalTime: vPlayer.currentMedia.duration };
				if(!rmAutoPlay){
					rmAutoPlay = true;
					autoPlayCnt.remove();
				}
				if(defaults.completion === 0 && !completionSend){
					completionSend = true;
					visitedArr[0]=1;
					onComponentCompleted();
				}
				updateTime(tobj);
			} else {
				clearInterval(mediaInt);
			}
		}, 100);

	}

	function addHTML5Event() {
		vPlayer.addEventListener("loadedmetadata", function () {
			totalTime = vPlayer.duration.toFixed(1);
			playingStart = true;
			var tobj = { currentTime: vPlayer.currentTime, totalTime: vPlayer.duration };
			updateTime(tobj);
		});
		vPlayer.addEventListener("timeupdate", function () {
			var tobj = { currentTime: vPlayer.currentTime, totalTime: vPlayer.duration };
			updateTime(tobj);
			//var bfObj = {currentTime: vPlayer.currentTime, totalTime: vPlayer.duration, bufferedEnd:vPlayer.buffered.end(0)};
			var ct = vPlayer.currentTime;
			if (vPlayer.buffered) {
				try{					
					if((ct >= vPlayer.buffered.start(0)) && (ct<= vPlayer.buffered.end(0))){
						vLoader.hide();
					}
					//var loaded = parseInt(((vPlayer.buffered.end(0) / vPlayer.duration) * 100), 10);
					
				} catch (err){

				}
			}	
			if((!rmAutoPlay && isDesktop) || (!rmAutoPlay && vPlayer.currentTime>0)){
				rmAutoPlay = true;
				autoPlayCnt.remove();
			}
			
			if(defaults.completion === 0 && !completionSend){
				completionSend = true;
				visitedArr[0]=1;
				onComponentCompleted();
			}
		});
		vPlayer.addEventListener("pause", function () {
			onPause();
		});
		vPlayer.addEventListener("play", function () {
			onPlay();
		});
		vPlayer.addEventListener("ended", function () {
			vLoader.hide();
			onVideoEnd();
		});
		vPlayer.addEventListener("canplay", function () {
			vLoader.hide();
		});
		vPlayer.addEventListener("canplaythrough", function () {
			vLoader.hide();
		});
		vPlayer.addEventListener("waiting", function () {
			vLoader.show();
		});
		vPlayer.addEventListener("playing", function () {
			$('video').css('opacity','1');
			vLoader.hide();
		});
		vPlayer.addEventListener("seeking", function () {
			vLoader.show();
		});
		vPlayer.addEventListener("error", function (err) {

		});
		vPlayer.addEventListener("loadstart", function () {

		});
		vPlayer.addEventListener("progress", function () {

		});
		vPlayer.addEventListener("volumechange", function () {
			onVolumechange();
		});
				
	}
	
	function animateLoader(){
		if(!defaults.loader.animate){
			return false;
		}
		setTimeout(function(){
			if(vLoader.length ===0){
				return false;
			}
			if(ldCnt>defaults.loader.imgcount-1){
				ldCnt = 0;
			}
			vLoader.css('background-position-x', (-ldCnt*defaults.loader.width)+'px');
			ldCnt++;
			animateLoader();
		},defaults.loader.frameRateMs);	
	}
	function getMediaPlayer() {
		var control = null;
		try {
			control = new ActiveXObject('WMPlayer.OCX');
		} catch (e) { }
		if (!control) {
			alert("Unable to create Media player Object.");
		}

		var str = '<table class="v-player" id="v-player" ><tr><td class="v-video-cnt">';
		str += "<object  id='" + defaults.videoslector + "' class='custom-video' width='" + defaults.width + "' height='" + defaults.height + "' ";
		var videoUrl = encodeURI(defaults.path);
		str += 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" >';
		str += '<param name="url" value="' + videoUrl + '" />';
		str += '<param name="autoStart" value="' + defaults.autoplay + '" />';
		str += ' <param name="uiMode" value="none">';
		str += ' <param name="windowlessVideo" value="true">';
		str += "</object>";
		if(!defaults.autoplay || !isDesktop){
			str += "<div class='video-auto-play-cnt' ><a href='javascript:void(0)' class='video-auto-play-btn' ><span class='icon-autoplay'>"+vIcons.play+"</span></a></div>";
		}
		str += "<div class='video-caption-window' ></div>";
		str += "<div class='video-loader'></div><div class='v-control-cnt'></div></td></tr></table>";
		$(defaults.videoContainer).html(str);
		return document.getElementById(defaults.videoslector);
	}

	function getHTML5PLayer() {
		var str = '<table class="v-player" id="v-player" ><tr><td class="v-video-cnt">';
		str += "<video webkit-playsinline playsinline id='" + defaults.videoslector + "' class='custom-video' width='" + defaults.width + "' height='" + defaults.height + "' ";
		if (defaults.autoplay)
			str += "autoplay ";
		if (defaults.loop)
			str += "loop ";
		if (defaults.preload)
			str += "preload ";
		if (defaults.poster)
			str += "poster='" + defaults.poster + "'";
		str += " controlsList='nodownload' >";
		str += "<source src='" + defaults.path + "' type='video/mp4' />";
		str += "</video>";
		if(!defaults.autoplay || !isDesktop){
			str += "<div class='video-auto-play-cnt' ><a href='javascript:void(0)' class='video-auto-play-btn' ><span class='icon-autoplay'>"+vIcons.play+"</span></a></div>";
		}
		str += "<div class='video-caption-window' ></div>";
		str += "<div class='video-loader'></div><div class='v-control-cnt'></div></td></tr></table>";
		$(defaults.videoContainer).html(str);
		return document.getElementById(defaults.videoslector);
	}

	var getTimeFormat = function (seconds) {
		var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
		var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
		return m + ":" + s;
	};
	
	function HTML5videoSupport(){
        if (!!document.createElement('video').canPlayType){
			var vidTest = document.createElement("video");
            var h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
			if (!h264Test){
				return false;
			}else{
				return true;
			}
        }else{
            return false;
        }
    }
	
	function updateVideoZoom() {
		if(zoomed){		
			$('.video-caption-window').hide();
			$('.top-content-bg').hide();
			var ww =  screen.width;
			var wh = screen.height;
			if(ww>wh){
				vidContainer.find('video').css({'width':'auto','height':wh+'px'});
			}else{
				vidContainer.find('video').css({'height':'auto','width':wh+'px'});
			}
			vidContainer.find('video').css({'height':wh+'px','width':ww+'px'});
		}else{
			vidContainer.find('video').css({'height':defaults.height+'px','width':defaults.width+'px'});
			vidContainer.css({'height':defaults.height+'px','width':defaults.width+'px'});
			reSizeVideo();
			if(isCC){
				$('.video-caption-window').show();
				$('.top-content-bg').hide();
			}else{
				$('.video-caption-window').hide();
				$('.top-content-bg').show();
			}
		}	
		
	}
	function reSizeVideo() {
		if(zoomed){
			return false;
		}
		/* if(defaults.fitToScreen || isMobile()){		
			var width = defaults.width;
			var height = defaults.height;
			//var select = isMobile()? $(window):$(defaults.resizeParent);
			var cntrHT = 0;
			if(controls.include && !controls.above){ 
				cntrHT = $(controlsCont).height();
			}
			if(isMobile()){
				cntrHT = $('.header').height();
			}		
			var winW = $(window).width();
			var winHt = window.innerHeight - cntrHT;
			if(winW>width){
				winW = width;
			}
			if(winHt>height){
				winHt = height;
			}
			var nHt = (height * winW)/width;
			var resizeWidth = width;
			var resizeHeight = height;
			if(nHt> winHt){			
				resizeWidth = (width * winHt)/height;
				resizeHeight = winHt;
			}else{
				resizeWidth = winW;
				resizeHeight = nHt;
			}
			vidContainer.find('#'+defaults.videoslector).css({'width':resizeWidth+'px','height':resizeHeight+'px'});
			vidContainer.css({'width':resizeWidth+'px','height':resizeHeight+'px'});			
		}else{ */
			vidContainer.find('#'+defaults.videoslector).css({'height':defaults.height+'px','width':defaults.width+'px'});
			vidContainer.css({'height':defaults.height+'px','width':defaults.width+'px'});
		/* }	 */	
	}
	
	
	// ---------------------Template required Functions---------------------
	function isComponentCompleted() {
		return (visitedArr.toString().indexOf('0') === -1);
	}

	function onComponentCompleted() {
		
	}

	function getPageInteractionData() {
		return visitedArr;
	}

	function getPageDataObj() {
		return pageObj;
	}

	function getContainer() {
		return container;
	}	
}