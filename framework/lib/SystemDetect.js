/**
 * @author Shivaji Babar
 * @name SystemDetect.js
 * @namespace 
 * @version 2.0
 */
function SystemDetect() {
    var self = this;
    var UA = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase().replace(/_/g, '.');
    self.deviceType = '';
    self.deviceModel = '';
    self.deviceOrientation = '';
    self.osName = '';
    self.osVersion = '';
    self.browserName = '';
    self.browserVersion = '';
    self.browserEngine = '';
    self.screenWidth = '';
    self.screenHeight = '';
    self.plugins = [];
    self.init = init;
    self.videoSupport = videoSupport;
    self.androidBrowser = androidStockBrowser;
    var deviceTypes = ["tv", "tablet", "mobile", "desktop"];
    var plugins2detect = {
        java: {
            substrs: ['Java'],
            progIds: ['JavaWebStart.isInstalled']
        },
        flash: {
            substrs: ['Shockwave', 'Flash'],
            progIds: ['ShockwaveFlash.ShockwaveFlash']
        },
        mediaplayer: {
            substrs: ['Windows Media'],
            progIds: ['MediaPlayer.MediaPlayer']
        },
        quicktime: {
            substrs: ['QuickTime'],
            progIds: ['QuickTime.QuickTime']
        }
    };

    function test(regex) {
        return regex.test(UA);
    }
    function exec(regex) {
        return regex.exec(UA);
    }
    function is(key) {
        return UA.indexOf(key) > -1;
    }
    function init() {
        self.screenWidth = window.screen.width;
        self.screenHeight = window.screen.height;
        detectDevice();
        detectOS();
        detectBrowser();
        detectOrientation();
        detectPlugins();
    }
    function androidStockBrowser() {

        var isAndroidMobile = UA.indexOf('android') > -1 && UA.indexOf('mozilla/5.0') > -1 && UA.indexOf('applewebkit') > -1;

// Android Browser (not Chrome)
        var regExAppleWebKit = new RegExp(/applewebkit\/([\d.]+)/);
        var resultAppleWebKitRegEx = regExAppleWebKit.exec(UA);
        var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(UA)[1]));
        var isAndroidBrowser = isAndroidMobile && appleWebKitVersion !== null && appleWebKitVersion < 537;
        return isAndroidBrowser;
    }
    function detectDevice() {
        if (test(/googletv|smarttv|smart-tv|internet.tv|netcast|nettv|appletv|boxee|kylo|roku|dlnadoc|roku|pov.tv|hbbtv|ce\-html/)) {
            // Check if user agent is a smart tv
            self.deviceType = deviceTypes[0];
            self.deviceModel = "smartTv";
        } else if (test(/xbox|playstation.3|wii/)) {
            // Check if user agent is a game console
            self.deviceType = deviceTypes[0];
            self.deviceModel = "gameConsole";
        } else if (test(/ip(a|ro)d/)) {
            // Check if user agent is a iPad
            self.deviceType = deviceTypes[1];
            self.deviceModel = "ipad";
        } else if (test(/linux/) && test(/android/) && !test(/fennec|mobi|htc.magic|htcX06ht|nexus.one|sc-02b|fone.945/)) {
            // Check if user agent is an Android Tablet
            self.deviceType = deviceTypes[1];
            self.deviceModel = "android";
        } else if (test(/kindle/) || (test(/mac.os/) && test(/silk/))) {
            // Check if user agent is a Kindle or Kindle Fire
            self.deviceType = deviceTypes[1];
            self.deviceModel = "kindle";
        } else if (test(/gt-p10|sc-01c|shw-m180s|sgh-t849|sch-i800|shw-m180l|sph-p100|sgh-i987|zt180|htc(.flyer|\.flyer)|sprint.atp51|viewpad7|pandigital(sprnova|nova)|ideos.s7|dell.streak.7|advent.vega|a101it|a70bht|mid7015|next2|nook/) || (test(/mb511/) && test(/rutem/))) {
            // Check if user agent is a pre Android 3.0 Tablet
            self.deviceType = deviceTypes[1];
            self.deviceModel = "android";
        } else if (test(/bb10/)) {
            // Check if user agent is a BB10 device
            self.deviceModel = "blackberry";
            if (test(/tablet/))
                self.deviceType = deviceTypes[1];
            else
                self.deviceType = deviceTypes[2];
        } else {
            // Check if user agent is one of common mobile types
            self.deviceModel = exec(/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|j2me/);
            if (self.deviceModel !== null) {
                if (test(/tablet/))
                    self.deviceType = deviceTypes[1];
                else
                    self.deviceType = deviceTypes[2];
                self.deviceModel = String(self.deviceModel);
            } else {
                self.deviceModel = "";
                if (test(/bolt|fennec|iris|maemo|minimo|mobi|mowser|netfront|novarra|prism|rx-34|skyfire|tear|xv6875|xv6975|google.wireless.transcoder/)) {
                    // Check if user agent is unique Mobile User Agent
                    self.deviceType = deviceTypes[2];
                } else if (test(/opera/) && test(/windows.nt.5/) && test(/htc|xda|mini|vario|samsung\-gt\-i8000|samsung\-sgh\-i9/)) {
                    // Check if user agent is an odd Opera User Agent - http://goo.gl/nK90K
                    self.deviceType = deviceTypes[2];
                } else if (test(/windows.(nt|xp|me|9)/) && test(/touch/) && test(/tablet/)) {
                    // Check if user agent is Windows tablet PC
                    self.deviceType = deviceTypes[1];
                    self.deviceModel = 'windows tablet';
                } else if (test(/windows.(nt|xp|me|9)/) && test(/wpdesktop/) && test(/touch/)) {
                    // Check if user agent is Windows phone desktop mode
                    self.deviceType = deviceTypes[2];
                    self.deviceModel = 'windows phone';
                } else if ((test(/windows.(nt|xp|me|9)/) && !test(/phone/)) || test(/win(9|.9|nt)/) || test(/\(windows 8\)/)) {
                    // Check if user agent is Windows Desktop, "(Windows 8)" Chrome extra exception
                    self.deviceType = deviceTypes[3];
                } else if (test(/macintosh|powerpc/) && !test(/silk/)) {
                    // Check if agent is Mac Desktop
                    self.deviceType = deviceTypes[3];
                    self.deviceModel = "mac";
                } else if (test(/linux/) && test(/x11/)) {
                    // Check if user agent is a Linux Desktop
                    self.deviceType = deviceTypes[3];
                } else if (test(/solaris|sunos|bsd/)) {
                    // Check if user agent is a Solaris, SunOS, BSD Desktop
                    self.deviceType = deviceTypes[3];
                } else if (test(/cros/)) {
                    // Check if user agent is a Chromebook
                    self.deviceType = deviceTypes[3];
                } else if (test(/bot|crawler|spider|yahoo|ia.archiver|covario-ids|findlinks|dataparksearch|larbin|mediapartners-google|ng-search|snappy|teoma|jeeves|tineye/) && !test(/mobile/)) {
                    // Check if user agent is a Desktop BOT/Crawler/Spider
                    self.deviceType = deviceTypes[3];
                    self.deviceModel = "crawler";
                } else {
                    // Otherwise assume it is a Mobile Device
                    self.deviceType = deviceTypes[2];
                }
            }
        }
    }
    function detectOS() {
        /** OS detection **/
        if (self.deviceModel !== "") {
            if (self.deviceModel === "ipad" || self.deviceModel === "iphone" || self.deviceModel === "ipod") {
                self.osName = "ios";
                self.osVersion = (test(/os\s([\d.]+)/) ? RegExp.$1 : "").replace(/_/g, ".");
            } else if (self.deviceModel === "android") {
                self.osName = "android";
                self.osVersion = (test(/android\s([\d\.]+)/) ? RegExp.$1 : "");
            } else if (self.deviceModel === "blackberry") {
                self.osName = "blackberry";
                self.osVersion = (test(/version\/([^\s]+)/) ? RegExp.$1 : "");
            } else if (self.deviceModel === "playbook") {
                self.osName = "blackberry";
                self.osVersion = (test(/os ([^\s]+)/) ? RegExp.$1.replace(";", "") : "");
            }
        }

        if (!self.osName) {
            if (is("win") || is("16bit")) {
                self.osName = "windows";
                if (is('wpdesktop') && is("windows nt 6.2")) {
                    self.osName = "windows phone";
                    self.deviceModel = 'windows phone';
                    self.osVersion = "8";
                } else if (is("windows nt 6.2") && is("arm")) {
                    self.osName = "windows rt";
                    self.deviceModel = 'windows tablet';
                    self.osVersion = "8";
                } else if (is('wpdesktop') && is("windows nt 6.3")) {
                    self.osName = "windows phone";
                    self.deviceModel = 'windows phone';
                    self.osVersion = "8.1";
                } else if (is("windows nt 6.3") && is("arm")) {
                    self.osName = "windows rt";
                    self.deviceModel = 'windows tablet';
                    self.osVersion = "8.1";
                } else if (is("windows nt 6.2") || test(/\(windows 8\)/)) { //windows 8 chrome mac fix
                    //self.osVersion = "8";
                    self.osVersion = "6.2";
                } /*else if (is("windows nt 10")) {
                 //self.osVersion = "8.1";
                 self.osVersion = "10";
                 } else if (is("windows nt 6.3")) {
                 //self.osVersion = "8.1";
                 self.osVersion = "6.3";
                 } else if (is("windows nt 6.1")) {
                 //self.osVersion = "7";
                 self.osVersion = "6.1";
                 } else if (is("windows nt 6.0")) {
                 //self.osVersion = "vista";
                 self.osVersion = "6.0";
                 } */ else if (is("windows nt 5.2") || is("windows nt 5.1") || is("windows xp")) {
                    //self.osVersion = "xp";
                    self.osVersion = "5.2";
                } else if (is("windows nt")) {
                    self.osVersion = (test(/windows\snt\s([\d.]+)/) ? RegExp.$1 : "").replace(";", "");
                } else if (is('windows phone')) {
                    self.osName = "windows phone";
                    self.deviceModel = 'windows phone';
                    self.osVersion = (test(/windows\sphone\s([\d.]+)/) ? RegExp.$1 : "").replace(/_/g, ".");
                } else if (is('windows phone os')) {
                    self.osName = "windows phone";
                    self.deviceModel = 'windows phone';
                    self.osVersion = (test(/windows\sphone\sos\s([\d.]+)/) ? RegExp.$1 : "").replace(/_/g, ".");
                }
            } else if (is("mac") || is("darwin")) {
                self.osName = "mac";
                if (is("68k") || is("68000")) {
                    self.osVersion = "68k";
                } else if (is("ppc") || is("powerpc")) {
                    self.osVersion = "ppc";
                } else if (is("os x")) {
                    self.osVersion = (test(/os\sx\s([\d.]+)/) ? RegExp.$1 : "os x").replace(/_/g, ".");
                }
            } else if (is("webtv")) {
                self.osName = "webtv";
            } else if (is("x11") || is("inux")) {
                self.osName = "linux";
            } else if (is("sunos")) {
                self.osName = "sun";
            } else if (is("irix")) {
                self.osName = "irix";
            } else if (is("freebsd")) {
                self.osName = "freebsd";
            } else if (is("bsd")) {
                self.osName = "bsd";
            }
        }
    }

    function detectBrowser() {
        /** Browser detection **/
        if (self.osName === 'blackberry') {
            self.browserEngine = "gecko";
            self.browserName = "blackberry";
            self.browserVersion = (test(/version\/([\d\.]+)/) ? RegExp.$1 : "");
        } else if (!test(/opera|webtv/) && (test(/msie\s([\d\w\.]+)/) || is("trident"))) {
            self.browserEngine = "trident";
            self.browserName = "ie";
            if (!window.addEventListener && document.documentMode && document.documentMode === 7) {
                self.browserVersion = "8.compat";
            } else if (test(/trident.*rv[ :](\d+)\./)) {
                self.browserVersion = RegExp.$1;
            } else {
                self.browserVersion = (test(/trident\/4\.0/) ? "8" : RegExp.$1);
            }
        } else if (is("firefox")) {
            self.browserEngine = "gecko";
            self.browserName = "firefox";
            self.browserVersion = (test(/firefox\/([\d\w\.]+)/) ? RegExp.$1 : "");
        } else if (is("gecko/")) {
            self.browserEngine = "gecko";
        } else if (is("opera")) {
            self.browserName = "opera";
            self.browserEngine = "presto";
            self.browserVersion = (test(/version\/([\d\.]+)/) ? RegExp.$1 : (test(/opera(\s|\/)([\d\.]+)/) ? RegExp.$2 : ""));
        } else if (is("opr")) {
            self.browserName = "opera";
            self.browserEngine = "presto";
            self.browserVersion = (test(/version\/([\d\.]+)/) ? RegExp.$1 : (test(/opr(\s|\/)([\d\.]+)/) ? RegExp.$2 : ""));
        } else if (is("konqueror")) {
            self.browserName = "konqueror";
        } else if (is("edge")) {
            self.browserEngine = "webkit";
            self.browserName = "edge";
            self.browserVersion = (test(/edge\/([\d\.]+)/) ? RegExp.$1 : "");
        } else if (is("chrome")) {
            self.browserEngine = "webkit";
            self.browserName = "chrome";
            self.browserVersion = (test(/chrome\/([\d\.]+)/) ? RegExp.$1 : "");
        } else if (is("iron")) {
            self.browserEngine = "webkit";
            self.browserName = "iron";
        } else if (is("crios")) {
            self.browserName = "chrome";
            self.browserEngine = "webkit";
            self.browserVersion = (test(/crios\/([\d\.]+)/) ? RegExp.$1 : "");
        } else if (is("applewebkit/")) {
            self.browserName = "safari";
            self.browserEngine = "webkit";
            self.browserVersion = (test(/version\/([\d\.]+)/) ? RegExp.$1 : "");
        } else if (is("mozilla/")) {
            self.browserEngine = "gecko";
        }
    }

    function detectOrientation() {
        /** Detect orientation **/
        if (self.deviceType !== deviceTypes[0] && self.deviceType !== deviceTypes[3]) {
            if (window.innerHeight > window.innerWidth) {
                self.deviceOrientation = "portrait";
            } else {
                self.deviceOrientation = "landscape";
            }
        }
    }

    function detectPlugins() {
        for (var alias in plugins2detect) {
            if (plugins2detect.hasOwnProperty(alias)) {
                var plugin = plugins2detect[alias];
                if (detectPlugin(plugin.substrs) || detectObject(plugin.progIds, plugin.fns)) {
                    self.plugins.push(alias);
                }
            }
        }
    }

    function detectPlugin(substrs) {
        if (navigator.plugins) {
            for (i = 0, j = navigator.plugins.length; i < j; i += 1) {
                var plugin = navigator.plugins[i],
                        haystack = plugin.name + plugin.description,
                        found = 0;
                for (k = 0, l = substrs.length; k < l; k += 1) {
                    if (haystack.indexOf(substrs[k]) !== -1) {
                        found += 1;
                    }
                }
                if (found === substrs.length) {
                    return true;
                }
            }
        }
        return false;
    }
    function detectObject(progIds, fns) {
        if (window.ActiveXObject) {
            for (i = 0, j = progIds.length; i < j; i += 1) {
                try {
                    var obj = new ActiveXObject(progIds[i]);
                    if (obj) {
                        return fns && fns[i] ? fns[i].call(obj) : true;
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }
        return false;
    }
    function videoSupport() {
        if (!!document.createElement('video').canPlayType)
        {
            var vidTest = document.createElement("video");
            oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
            if (!oggTest)
            {
                h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
                if (!h264Test)
                {
                    return false;//"Sorry. No video support."
                }
                else
                {
                    if (h264Test == "probably")
                    {
                        return true;//"Yeah! Full support!";
                    }
                    else
                    {
                        return true;//"Meh. Some support.";
                    }
                }
            }
            else {
                if (oggTest == "probably")
                {
                    return true;//"Yeah! Full support!";
                }
                else
                {
                    return true;////"Meh. Some support.";
                }
            }
        }
        else
        {
            return false;//"Sorry. No video support."
        }
    }
}
