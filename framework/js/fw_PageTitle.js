/*----------------------------------------
	Name: fw_PageTitle.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_PageTitle(){
	/**Variables*/
	this.updateTitle=updateTitle;
	this.updateTitleByText=updateTitleByText;
	this.updateModuleTitleByText=updateModuleTitleByText;
	/** Functions */
	$(pageContainer).bind('pageLoadComplete', function(e){updateTitle();});
	function updateTitle(){
		$('.moduleTitle p').html(navigationData.getModuleTitle());
		//$('.moduleTitle').attr('title',navigationData.getModuleTitle());
		$('.pageTitle p').html(navigationData.getPageTitle());
		if(navigationData.getPageTitle()==""){
			$('.pageTitle').removeAttr('tabindex');
		}else{
			$('.pageTitle').attr('tabindex',2);
		}
		$('.courseTitle p').html(navigationData.getCourseTitle())
		//$('.pageTitle').attr('title',navigationData.getPageTitle());
	}
	function updateTitleByText(_title){		
		$('.pageTitle p').html(_title);
		if(_title==""){
			$('.pageTitle').removeAttr('tabindex');
		}else{
			$('.pageTitle').attr('tabindex',2);
		}
		//$('.pageTitle').attr('title',_title);	
	}
	function updateModuleTitleByText(_title){		
	
		$('.moduleTitle p').html(_title);
		//$('.moduleTitle').attr('title',_title);
	}
}