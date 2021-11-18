/*------------------
Name: jquery.fw_DropDown.js
Developed by: Suyog Shaha
---------------------*/
(function( $ ){
var tab=0;
var defaults = "";
var defaultSelectVal = "";
var defSelectedtext = "";
  var methods = {
    init : function( options ) {
		defaults = {dataArray:[],defaultSelect:"",tabIndex:1,callback:function(){}};
		options = $.extend(defaults, options);
		tab=defaults.tabIndex;
		$(this).css({position: 'relative'})
		$(this).html(getDropDown());
		var str="";
		defaultSelectVal = defaults.defaultSelect;
		defSelectedtext=defaults.dataArray[0].data;
		var defval=defaults.dataArray[0].val;		
		for(var i=1;i<defaults.dataArray.length;i++){
			var lng=defaults.dataArray[i].data;	
			var val=defaults.dataArray[i].val;
			tab++;
			str+="<a href='#' id='drp_"+i+"' tabindex='"+tab+"'class='dropOptions' >"+lng+"</a>";
			if(defaults.defaultSelect==val){
				defSelectedtext=defaults.dataArray[i].data;
				defval=defaults.dataArray[i].val;
			}
		}
		$( '.dropOptionsContainer' ).html(str);
		var ht=defaults.dataArray.length*30;
		if(ht>150){
			ht=150;
		}		
		$( '.dropContent' ).css('height',ht+'px');		
		$( '.dropHeader' ).click(function(){
			$( '.ScrollContainer' ).css('top','0px');		
			$( '.dropIcon').toggleClass('dropOpen');
			if($( '.dropIcon').hasClass('dropOpen')){
				$( '.dropContent' ).show();
				$( '.dropContent' ).fw_Scroll({color:"#0057a6",width:10});					
			}else{
				$( '.dropContent' ).hide();					
			}							
		});
		$( '.dropText' ).html(defSelectedtext);
		$( '.dropOptions' ).click(function(){
			var selectText=$(this).html();
			var val=$(this).attr('val');			
			$( '.dropText' ).html(selectText);
			$( '.dropIcon').toggleClass('dropOpen');
			$( '.dropContent' ).hide();
			var id=parseInt($(this).attr('id').split('drp_')[1]);
			var data=defaults.dataArray[id].val;
			defaults.callback(data);			
		});
		return this;
    },
    show : function() {
      
    },
    hide : function() { 
      
    },
    update : function() {
		
		$( '.dropText' ).html(defSelectedtext);
    }
  };

  $.fn.fw_DropDown = function( method ) {   
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };
 
  getDropDown = function() {  
	var str ='<div class="dropDown"><a href="javascript:void(0);" class="dropHeader"  tabindex="'+tab+'" ><div class="dropText"> Select</div><div class="dropIcon"> </div></a><div class="dropContent"><div class="dropOptionsContainer" ></div></div></div>';
	if ($(".dropDown").length > 0){
	  return "";
	}else{
	 return str;  
	}
   }

})( jQuery );