/*----------------------------------------
	Name: fw_MediaPlayer.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_MediaPlayer(){
	/**Variables*/
	var isAudioReady=false;
	var isVideoReady=false;	
	this.audioON=audioON;
	this.audioOFF=audioOFF;
	this.loadAudio=loadAudio;
	this.playPlayer=playPlayer;
	this.pausePlayer=pausePlayer;
	this.clearAudio=clearAudio;
	this.mediaEvent=mediaEvent;
	var temptime;
	/** Event */
		$(pageContainer).bind(courseEvent.PAGE_LOAD_COMPLETE, function(e){updatePageMedia();});
		$(pageContainer).bind(courseEvent.PAGE_LOAD_START, function(e){
			clearAudio();
			clearVideo();			
			pausePlayer(); 
		});
	/** Functions */
	function updatePageMedia(){
		if (navigationData.isAssessmentPage()) {			
				clearAudio();
				return false;
		}
		if(playerSetting.isAudio || (globalSettings.isDesktop())){
			var _url= navigationData.getPageAudioURL();			
			if(_url=="" || _url==null || _url.toLowerCase()=="none"){return false;}
			loadAudio(_url);
		}
	}	
	function loadAudio(audioUrl){	
		if(audioUrl.indexOf('none')>=0){
			audioUrl="content/eng/audio/blank.mp3";
		} 
		audioUrl=removeExtention(audioUrl);
		//alert(audioUrl)		
		auPlayer.loadAudioURL(audioUrl);
	}	
	function removeExtention(audioUrl){
		var ext = audioUrl.substr(audioUrl.lastIndexOf('.')+1);
		ext=ext.toLowerCase();		
		if(ext.indexOf('mp3')>=0 || ext.indexOf('ogg')>=0 || ext.indexOf('webm')>=0 || ext.indexOf('mp4')>=0){
		  audioUrl=audioUrl.substr(0, audioUrl.lastIndexOf('.'));		
		}
		return audioUrl;
	}
	
	function mediaEvent(_type,_currentTime){
		switch(_type){
			case "ended":
				endedMedia();
			break;
			case "play":
				playedMedia();
			break;
			case "pause":
				pausedMedia();
			break;
			case "progress":
				//$('.moduleTitle').html(_currentTime+":"+auPlayer.getTotalTime())
			break;
		}		
	}
	function playedMedia(){
		 $(mediaPlayer).trigger(courseEvent.PLAYED_MEDIA);
	}
	function pausedMedia(){
		$(mediaPlayer).trigger(courseEvent.PAUSED_MEDIA);
	}
	function endedMedia(){
		$(mediaPlayer).trigger(courseEvent.ENDED_MEDIA);
	}
	function audioON(){
		if(globalSettings.isDesktop()){
			try{
				auPlayer.setVolume(1);
			}catch(err){}
					
		}else{
			playerSetting.isAudio=true;
			updatePageMedia();			
		}		
		$(mediaPlayer).trigger(courseEvent.AUDIO_ON);
	}
	function audioOFF(){
		if (globalSettings.isDesktop()) {
			try{
				auPlayer.setVolume(0);
			}catch(err){ }			
			
		}else{
			clearAudio();
			playerSetting.isAudio=false;			
		}
		$(mediaPlayer).trigger(courseEvent.AUDIO_OFF);
	}
	function playPlayer(){
		try{
			auPlayer.play();
		}catch(err){}
	}
	function pausePlayer(){	
		try{
			auPlayer.pause();
		}catch(err){}				
	}
	
	function clearAudio(){
		try{
			auPlayer.pause();
		}catch(err){}
		
		$(mediaPlayer).trigger(courseEvent.CLEAR_MEDIA);
	}
	
	/******************  Video ************************ */
	function loadVideo(f_Name){
		
	}
	
	function changeVideo(webmurl, oggUrl, mp4Url,posterUrl){     
		
	
	}
	function initVideoPlayer(webmurl, oggUrl, mp4Url,posterUrl){
		
	}
	function clearVideo(){
		try{			
		}catch(err){}
		$(mediaPlayer).trigger(courseEvent.CLEAR_MEDIA);
	}	
}