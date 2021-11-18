/*---------------------
	Name: fw_PreLoader.js
	Developed by: Suyog Shaha	
----------------------------------------*/
function fw_PreLoader(){
	/**Variables*/
	this.showPreLoader=showPreLoader;
	this.hidePreLoader=hidePreLoader;
	 var cPreloaderTimeout = false;
	 var SECONDS_BETWEEN_FRAMES = 0;
	  var cIndex = 0;
    var cXpos = 0;
	var cTotalFrames = 8;
    var cFrameWidth = 61;
	/** Functions */
	
	function showPreLoader(mesg){
		/* if(mesg==null || mesg==""){
			mesg= "Loading...";
		} */
		$('.preloadeMeg').html(mesg)
		$('.preLoaderParent').show();
		startAnimation();
	}
	function hidePreLoader(){
		$('.preLoaderParent').hide();
	}
	function startAnimation() {        
        var FPS = Math.round(100 /15);
        SECONDS_BETWEEN_FRAMES = 1 / FPS;
        cPreloaderTimeout = setTimeout(continueAnimation, SECONDS_BETWEEN_FRAMES / 1000);
    }
	 function continueAnimation() {
        cXpos += cFrameWidth;
        //increase the index so we know which frame of our animation we are currently on
        cIndex += 1;
        //if our cIndex is higher than our total number of frames, we're at the end and should restart
        if (cIndex >= cTotalFrames) {
            cXpos = 0;
            cIndex = 0;
        }
        if ($('.loaderAnim'))
            $('.loaderAnim').css({
                backgroundPosition: (-cXpos) + 'px 0'
            });
        cPreloaderTimeout = setTimeout(continueAnimation, SECONDS_BETWEEN_FRAMES * 1000);
    }
}