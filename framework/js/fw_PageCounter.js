/*----------------------------------------
	Name: fw_PageCounter.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_PageCounter(){
	/**Variables*/
	this.updatePageCounter=updatePageCounter;
	/** Functions */
	$(pageContainer).bind('pageLoadComplete', function(e){updatePageCounter();});
	function updatePageCounter(){	
		var pageNo = menuData.pageIndex+1;
		var pageTotal = navigationData.getTotalPagesInModule();
		if(menuData.pageIndex+1 <= 9){
			pageNo = '0'+(menuData.pageIndex+1);
		}
		if(navigationData.getTotalPagesInModule() <= 9){
			pageTotal = '0'+(navigationData.getTotalPagesInModule());
		}
		$('.pageCounter').html('<span style="color:#333740; font-weight: normal;">'+pageNo+"</span> / "+pageTotal);		
	}
}