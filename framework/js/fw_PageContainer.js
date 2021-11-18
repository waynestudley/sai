/*----------------------------------------
	Name: fw_PageContainer.js
	Developed by: Suyog Shaha

----------------------------------------*/
function fw_PageContainer(){
	/**Variables*/	
	this.loadPage=loadPage;
	this.play=play;
	this.pause=pause;
	this.replayPage=replayPage;
	this.isPlay=false;
	/** Functions */	
	function loadPage(_urlHTML,_urlXML){
		$('.fw_ToolTip').css('display','none');
		try{
		clearInterval(timeIntvl);
		}catch(e){}
		$(pageContainer).trigger(courseEvent.PAGE_LOAD_START);
		$.fw_Menu('hideToolTip');
		preLoade.showPreLoader("");
		$(".pageContainer").html("");
		$(".pageContainer").load(_urlHTML, function(response, status, xhr){
			if (status == "success") {
				$.fw_Menu('hideToolTip');
				$('body').scrollTop(0);
				$(".pageContainer>div").hide();
                loadCurrentPageXML(_urlXML);
			}else if (status == "error") {				
			}
		});
	}

	function play(){
		pageContainer.isPlay=true;
		mediaPlayer.playPlayer();
	}
	function pause(){
		pageContainer.isPlay=false;
		mediaPlayer.pausePlayer();
	}
	function replayPage(){
		
	}
    function loadCurrentPageXML(_urlXML){
        $.ajax({
        	type: "GET",
        	url: _urlXML,
        	dataType: "xml",
        	success: function(xml){        	  
              templateMediator.updatePageXML($.xmlToJSON(xml));
        	},
        	error: function(err){
				if(!isAlertShow){
					alert("page Not found"+_urlXML);
				}
        	}
        });
    }
}