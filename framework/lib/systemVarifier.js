/*----------------------------------------
	Name: systemVarifier.js
	Developed by: Maneesh Nanu
----------------------------------------*/
function systemVarifier(){
	var systemCheckerXML = null;
	
	var fldName = new Array("OS","BR","SR","CD","DT");
	var fldChkName = new Array("operatingSys","browser","resolution","colorDepth","device");
	
	this.init = init;
	
	var isDT=false;
	var isOs=false;
	var isBR=false;
	var isSR=false;
	var isCL=false;
	var systemDetect;
	function init(){
		systemDetect = new SystemDetect();
		systemDetect.init();
		var isDTArray=new Array();
		var isOsArray=new Array();
		var isBRArray=new Array();
		var isSRArray=new Array();
		var isCLArray=new Array();
		
		var deviceType = systemDetect.deviceType;
		var deviceModel = systemDetect.deviceModel;
		var os = systemDetect.osName;			
		var osVer =  systemDetect.osVersion;	
		var brVer = systemDetect.browserVersion;	
	
		var brName = systemDetect.browserName;
		
		var wW = screen.width;
		var wH = screen.height;
		var j = 0;
		var osNameText=os;
		var osVerText=osVer;
		$.ajax({
			type: "GET",
			url: 'content/xml/systemChecker.xml',
			dataType: "xml",
			success: function(xml){  
				systemCheckerXML = $.xmlToJSON(xml);
				if(systemChecker()){
                    window.location = "shell.html";
					//$(".optionContainer").show();
                    //showTableContent();
				}else{
                    $(".optionContainer").show();
                    showTableContent();
				}				
			},
			error: function(err){
                $(".CB").show();
			}
		});
		
		function systemChecker(){
			
					if (os === 'windows') {
						if (osVer === '5.2') {
							osVer = 'xp';
							osVerText='XP';
						} else if (osVer === '6.0') {
							osVer = 'vista';
							osVerText='Vista';
						} else if (osVer === '6.1') {
							osVer = '7';
							osVerText=osVer;
						} else if (osVer === '6.2') {
							osVer = '8';
							osVerText=osVer;
						} else if (osVer === '6.3') {
							osVer = '8.1';
							osVerText=osVer;
						}
						osNameText="Windows";
					} else if (os === 'mac') {
						osVer = osVer;
						osVerText=osVer;
						osNameText="Mac";
					} else if (os === 'ios') {						
						osVer = osVer;
						osVerText=osVer;
						osNameText="iOS";
					}	
					//--code for remove extra dot 					
					var temp=osVer.split('.');
					if(temp.length>2){
						osVer=temp[0]+'.'+temp[1];
						osVerText=osVer;
					}
					var temp1=brVer.split('.');
					if(temp1.length>2){
						brVer=temp1[0]+'.'+temp1[1];
					}
					//--
                    isOsArray	= systemCheckerXML.checker[0].text[0].item; 	// array of operating system
                    isBRArray	= systemCheckerXML.checker[0].text[1].item;  	// array of browser
                    isSRArray	= systemCheckerXML.checker[0].text[2].item; 	// array of screen resolution
                    isCLArray	= systemCheckerXML.checker[0].text[3].item; 	// array of Color Depth Detail
                    //isJSArray	= systemCheckerXML.checker[0].text[4].item; 	// array of Flash Details
                    isDTArray	= systemCheckerXML.checker[0].text[4].item;   	// array of  device type

                    var browser = (brName === 'ie') ? "IE" : brName;
                    $("."+fldChkName[0]+" .ulResult").html(osNameText +" "+osVerText);
					
                    $("."+fldChkName[1]+" .ulResult").html(browser +" "+ brVer);
                    $("."+fldChkName[2]+" .ulResult").html(wW+" x "+wH);
                    $("."+fldChkName[3]+" .ulResult").html(getColorDepth()+" bit");
					if(deviceType=="desktop"){
						if(deviceModel==""){
							deviceModel = "desktop";
						}
						deviceModel=deviceModel.capitalize();
					}
					if(deviceModel=='ipad'){
						deviceModel='iPad';
					}
					/*console.log("-----");
					console.log("brName: "+brName);
					console.log("osNameText: "+osNameText);
					console.log("osVerText: "+osVerText);
					console.log("browser: "+browser);
					console.log("brVer: "+brVer);
					console.log("-----");*/
                    $("."+fldChkName[4]+" .ulResult").html(deviceModel);
                    //$("."+fldChkName[4]+" .ulResult").html("Enabled");	
					
					/*******************TO BE DYNAMIC*******************/

                    $(".optionContainer").css("backgroundImage","url("+systemCheckerXML.contentBackground[0].img[0].path+")");
                    $(".sysChkr").html(systemCheckerXML.content[0].text[0].Text);
                    $(".warninfoText").html(systemCheckerXML.content[0].text[1].Text);
                    $(".passed").html(systemCheckerXML.passFail[0].pass[0].Text);
                    $(".failed").html(systemCheckerXML.passFail[0].fail[0].Text);
                    $(".link").html(systemCheckerXML.launchCourse[0].text[0].Text);
					
                    var tableHeadLen=systemCheckerXML.heading[0].text.length;
                    var checkerObj=systemCheckerXML.checker[0].text;
                    for(var i=0;i<tableHeadLen;i++){
                            $(".titlContTxt"+(i+1)).html(systemCheckerXML.heading[0].text[i].Text);
                    }
                    for(var i=0;i<checkerObj.length;i++){
                            $(".rowHead"+(i+1)).html(systemCheckerXML.checker[0].text[i].label[0].Text);							
                    }

                    for(i = 0; i < isDTArray.length; i ++){
                            if(deviceType === isDTArray[i].type){
                                    isDT = true;
                            }
                    }

                    for(var x = 0; x < checkerObj.length; x++){
                            var curChkrObj = checkerObj[x].item;
                            var txtForScr = "";
                            for(var y = 0; y < curChkrObj.length; y++){
                                    txtForScr+=curChkrObj[y].itemLabel[0].Text;						
                                    if(y<curChkrObj.length) txtForScr+="<br />";
                            }
							$("."+fldChkName[x]+" ."+fldName[x]).html(txtForScr);
                    }

                    if(parseInt(getColorDepth()) >= parseInt(isCLArray[0].depth)){
                            isCL = true;
                    }

                    for(i = 0; i < isSRArray.length; i ++){
                            if(wW >= isSRArray[i].width && wH >= isSRArray[i].height){
                                    isSR = true;
                            }
                    }

                    for(i = 0; i < isBRArray.length; i ++){
                            if(brName === isBRArray[i].type){
                                    for(j = 0; j < isBRArray[i].version.length; j ++){
											if(isBRArray[i].version[j].greaterVersion === "true" ){			
                                            /*if(parseFloat(brVer) >= parseFloat(isBRArray[i].version[j].type)){


														isBR = true;
												}*/
												if(validateVersion(brVer,isBRArray[i].version[j].type )){
												//---this update for ipad other browser
													if(os==="ios" && brName!=="safari"){
														isBR = false;
													}else{
														isBR = true;
													}
												//----	
												}

                                            }else if(validateVersion(isBRArray[i].version[j].type, brVer)){
                                                //---this update for ipad other browser
													if(os==="ios" && brName!=="safari"){
														isBR = false;
													}else{
														isBR = true;
													}
												//----
                                            }else{
												 isBR = false;
											}
											
                                    }
                            }
                    }
                    for(i = 0; i < isOsArray.length; i ++){
						if(os === isOsArray[i].type){
							for(j = 0; j < isOsArray[i].version.length; j ++){
							//--for non numberic value like xp, vista
								
								if(isNaN(osVer)){
									
									if(osVer==isOsArray[i].version[j].type){
										isOs = true;
									}
								}else{
									if(isOsArray[i].version[j].greaterVersion === "true" ){
										 /*if(osVer >= isOsArray[i].version[j].type){
												isOs = true;
										}*/
										
										if(validateVersion(osVer,isOsArray[i].version[j].type )){
											isOs = true;
										
										}
									}else if(validateVersion(isOsArray[i].version[j].type, osVer)){
											isOs = true;
									}else{
										 isOs = false;
									}
								}
							}
						}
                    }
                    if(isCL === true && isOs === true && isBR === true && isSR === true && isDT === true){
                            return true;
                    }else{
                            return false;
                    }
					
		}		
		$("tr:last").css({"padding-bottom":"5px"});
	}
	function validateVersion(left, right) {		
        if (left === undefined || right === undefined) {
            return false;
        }
		
        var a = left.toString();
        var b = right.toString();
        var i, cmp, len, re = /(\.0)+[^\.]*$/;
        a = (a + '').replace(re, '').split('.');
        b = (b + '').replace(re, '').split('.');
        len = Math.min(a.length, b.length);
        for (i = 0; i < len; i++) {
            cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
            if (cmp !== 0) {
                return (cmp >= 0);
            }
        }
        return ((a.length - b.length) >= 0);
    }


		
	function getColorDepth() {	 
		return screen.colorDepth;
	}
	
	
	function showTableContent(){	
		$(".failed").show(); 
		$(".passed").hide(); 
		
		if(isOs){
			$(".operatingSys .failed").hide();
			$(".operatingSys .passed").show(); 
		}
		if(isBR){
			$(".browser .failed").hide();
			$(".browser .passed").show();
		}
		if(isSR){
			$(".resolution .failed").hide(); 
			$(".resolution .passed").show(); 
		}
		if(isCL){
			$(".colorDepth .failed").hide(); 
			$(".colorDepth .passed").show(); 
		}
		if(isDT){
			$(".device .failed").hide(); 
			$(".device .passed").show(); 
		}
	}
}
 function fnLaunchPopup(val){
	window.location = val;		
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}