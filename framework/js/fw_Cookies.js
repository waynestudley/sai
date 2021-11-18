/*----------------------------------------
	Name: Cookies.js
	Developed by: Suyog Shaha
----------------------------------------*/

/**
 * This File is used to store the user data in Cookies. This is a small client-side JavaScript library that makes managing cookies easy.
 * @class "Cookies" is the object of this file and used to store user data in the Cookies.
 * 
 */
var fw_Cookies = { };
var cookiesAPI = false;
var cookiesKey='frameWork_version';
var cookiesKeyPrefix='v100';
/**
 * @function Cookies.init
 * @description This function checks whether the browser has cookies enabled or not.
 * @returns cookiesAPI {boolean} Return true if cookies is enabled.
 */
fw_Cookies.init = function(){
	cookiesAPI = Cookies.enabled;
	if(playerSetting.revisionNumber){
		cookiesKeyPrefix=playerSetting.revisionNumber;
	}
	if(cookiesAPI){
		setTrackData('fw_Cookies.init','','','You have cookies ENABLED',cookiesAPI);
	}else{
		setTrackData('fw_Cookies.init','','','You have cookies DISABLED',cookiesAPI);	
	}	
	if(cookiesAPI){
		var data=parseInt(Cookies.get(cookiesKey));
		if(isNaN(data) || data!=2){
			Cookies.set(dataStore.VAR_BOOKMARK, '');
			Cookies.set(dataStore.VAR_SUSPENDDATA, '');
			Cookies.set(dataStore.VAR_LESSONSTATUS, '');
			Cookies.set(dataStore.VAR_SCORE, '');
			Cookies.set(dataStore.VAR_SESSIONTIME, '');			
			Cookies.set(cookiesKey, '2');
		}
	}
	return cookiesAPI;
};

/**
 * @function fw_Cookies.get
 * @description This function returns the value of the most locally scoped cookie with the specified key.
 * @param _key {String } variable name
 * @returns data {String} variable value
 */
fw_Cookies.get = function(_key){
	var key=cookiesKeyPrefix+"_"+_key;
	if (!cookiesAPI) {
		setTrackData('Get Data',key,'','You have cookies DISABLED',false);	
		return;
	};	
	var data=Cookies.get(key);
	setTrackData('fw_Cookies.get',key,'',data,true);	
	return data;
};

/**
 * @function fw_Cookies.set
 * @description This function sets a cookie in the document. If the cookie does not already exist, it will be created
 * @param _key {String } variable name
 * @param value {String} variable value
 * @param callback {function} callback function
 */
 
fw_Cookies.set = function(_key, value, callback){
	var key=cookiesKeyPrefix+"_"+_key;
	if (!cookiesAPI) {
		setTrackData('fw_Cookies.set',key,'','You have cookies DISABLED',false);	
		return;
	}
	setTrackData('fw_Cookies.set',key,value,true,true);
	Cookies.set(key, value);	
};

fw_Cookies.save = function(){
	return true;
};

fw_Cookies.finish = function(){
	return true;
};
fw_Cookies.getTCAPI = function(){
	return TCDriver_ConfigObject();
}


