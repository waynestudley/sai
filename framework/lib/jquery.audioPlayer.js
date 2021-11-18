(function(e) {
    if (typeof e.audioPlayer === "undefined" || !e.audioPlayer) {
        var b = {
            support: false,
            added: false,
            IEEvent: false,
            volume: 1,
            create: function() {
                if (e.audioPlayer.added) {
                    return this
                }
                return new function() {
                    var h = "audioPlayer";
                    this.absolutePath = ""; /* e.audioPlayer.getAbsolutePath(); */
                    var g = "content/eng/audio/blank.mp3";
                    if (e.audioPlayer.support == "qtime" || e.audioPlayer.support == "wmp") {
                        g = this.absolutePath + "content/eng/audio/audio1.mp3"
                    }
                    this.player = e.audioPlayer.createAudioElement[e.audioPlayer.support](g);
                    this.play = e.audioPlayer.playAudioElement;
                    this.pause = e.audioPlayer.pauseAudioElement;
                    this.loadAudioURL = e.audioPlayer.loadAudioPath;
                    this.setVolume = e.audioPlayer.setVolume;
                    this.getTotalTime = e.audioPlayer.getTotalTime;
                    e.audioPlayer.added = true
                }
            },
            loadAudioPath: function(g) {
                if (mediaPlayer != null) {
                    mediaPlayer.mediaEvent("play")
                }
                switch (e.audioPlayer.support) {
                    case "mp3":
                    case "ogg":
                    case "m4a":
                        this.player.src = g + "." + e.audioPlayer.support;
                        this.player.play();
                        break;
                    case "wmp":
                        var g = this.absolutePath + g + ".mp3";
                        this.player.FileName = g;
                        this.player.Play();
                        if (!e.audioPlayer.IEEvent) {
                            e.audioPlayer.IEEvent = true;
                            this.player.attachEvent("EndOfStream", function(j) {
                                window.clearInterval(a);
                                e.audioPlayer.endMedia();
                                e.audioPlayer.audioProgress(h.CurrentPosition)
                            })
                        }
                        var h = this.player;
                        window.clearInterval(a);
                        a = window.setInterval(function() {
                            e.audioPlayer.audioProgress(h.CurrentPosition)
                        }, 500);
                        break;
                    case "rp":
                        e("#audioPlayer").attr("src", g + ".mp3");
                        this.player.Play();
                        break;
                    case "qtime":
                        if (this.player != null) {
                            var g = this.absolutePath + g + ".mp3";
                            this.player.SetURL(g);
                            this.player.Play();
                            if (this.volume == 0) {
                                this.player.setVolume(0)
                            } else {
                                this.player.setVolume(256)
                            }
                            window.clearInterval(a);
                            a = window.setInterval(function() {
                                var k = document.audioPlayer;
                                var j = (k.GetTime() / k.GetTimeScale());
                                e.audioPlayer.audioProgress(j)
                            }, 500);
                            if (!e.audioPlayer.IEEvent) {
                                e.audioPlayer.IEEvent = true;
                                this.player.attachEvent("onqt_ended", function() {
                                    window.clearInterval(a);
                                    var k = document.audioPlayer;
                                    var j = (k.GetTime() / k.GetTimeScale());
                                    e.audioPlayer.audioProgress(j);
                                    e.audioPlayer.endMedia()
                                })
                            }
                        }
                        break
                }
            },
            createAudioElement: {
                mp3: function(g) {
                    return e.audioPlayer.createHTML5Audio(g)
                },
                ogg: function(g) {
                    return e.audioPlayer.createHTML5Audio(g)
                },
                m4a: function(g) {
                    return e.audioPlayer.createHTML5Audio(g)
                },
                qtime: function(g) {
                    return e('<!--[if IE]><object id="qt_event_source" classid="clsid:CB927D12-4FF7-4a9e-A169-56E4B8A75598"></object><![endif]--><object  classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" width="100" height="50" codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=7,3,0,0" id="audioPlayer" style="behavior:url(#qt_event_source)"><param name="src" value="' + g + '"><param name="enablejavascript" value="True"><param name="postdomevents" value="True"><param name="autostart" value="True"><param name="loop" value="false"></object>').appendTo("body").get(1)
                },
                wmp: function(g) {
                    return e('<object id="audioPlayer" classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" width="1" height="0" ><param name="FileName" value="' + g + '" /><param name="autoplay" value="true" /><param name="loop" value="false"></object>').appendTo("body").get(0)
                },
                rp: function(g) {
                    return e('<embed type="audio/x-pn-realaudio-plugin" style="height:0" id="audioPlayer" src="" loop="false" autostart="false" hidden="true" />').appendTo("body").get(0)
                }
            },
            createHTML5Audio: function(g) {
                var h = new Audio();
                h.addEventListener("ended", function() {
                    e.audioPlayer.endMedia()
                }, false);
                h.addEventListener("timeupdate", function() {
                    e.audioPlayer.audioProgress(h.currentTime)
                }, false);
                return h
            },
            playAudioElement: function() {
                if (mediaPlayer != null) {
                    mediaPlayer.mediaEvent("play")
                }
                switch (e.audioPlayer.support) {
                    case "mp3":
                    case "ogg":
                    case "m4a":
                        this.player.play();
                        break;
                    case "wmp":
                        this.player.play();
                        break;
                    case "rp":
                        e.audioPlayer.support == "rp" ? this.player.DoPlay() : this.player.Play();
                        break;
                    case "qtime":
                        this.player.Play();
                        break
                }
            },
            pauseAudioElement: function() {
                if (mediaPlayer != null) {
                    mediaPlayer.mediaEvent("pause")
                }
                switch (e.audioPlayer.support) {
                    case "mp3":
                    case "ogg":
                    case "m4a":
                        this.player.pause();
                        break;
                    case "wmp":
                        this.player.pause();
                        break;
                    case "rp":
                        e.audioPlayer.support == "rp" ? this.player.DoPause() : this.player.Pause();
                        break;
                    case "qtime":
                        this.player.Stop();
                        break
                }
            },
            setVolume: function(g) {
                this.volume = g;
                switch (e.audioPlayer.support) {
                    case "mp3":
                    case "ogg":
                    case "m4a":
                        if (g == 0) {
                            this.player.volume = 0
                        } else {
                            this.player.volume = 1
                        }
                        break;
                    case "wmp":
                        if (g == 0) {
                            this.player.Volume = -10000
                        } else {
                            this.player.Volume = 0
                        }
                        break;
                    case "rp":
                        break;
                    case "qtime":
                        if (g == 0) {
                            this.player.setVolume(0)
                        } else {
                            this.player.setVolume(256)
                        }
                        break
                }
            },
            getAbsolutePath: function() {
                var h = window.location;
                var g = h.href.lastIndexOf("/");
                return h.href.substring(0, h.href.lastIndexOf("/") + 1)
            },
            endMedia: function() {
                if (mediaPlayer != null) {
                    mediaPlayer.mediaEvent("ended")
                }
            },
            audioProgress: function(g) {
                if (mediaPlayer != null) {
                    mediaPlayer.mediaEvent("progress", g)
                }
            },
            getTotalTime: function() {
                var g = 0;
                switch (e.audioPlayer.support) {
                    case "mp3":
                    case "ogg":
                    case "m4a":
                        g = this.player.duration;
                        break;
                    case "wmp":
                        g = this.player.Duration;
                        break;
                    case "rp":
                        g = 0;
                        break;
                    case "qtime":
                        g = this.player.GetDuration() / this.player.GetTimeScale();
                        break
                }
                return g
            }
        };
        e.extend({
            audioPlayer: b
        })
    }
    var a;
    var f = document.createElement("audio");
    if ("Audio" in window && f.canPlayType != null) {
        f = new Audio();        
		if (!!(f.canPlayType && f.canPlayType("audio/mpeg;").replace(/no/, ""))) {
                e.audioPlayer.support = "mp3"
        } else {
            if (!!(f.canPlayType && f.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ""))) {
				e.audioPlayer.support = "ogg"
            } else {
                if (!!(f.canPlayType && f.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ""))) {
                    e.audioPlayer.support = "m4a"
                } else {
                    e.audioPlayer.support = "mp3"
                }
            }
        }
    } else {
        if (e.browser.msie) {
            e.audioPlayer.support = "wmp"
        } else {
            if (navigator.userAgent.indexOf("Safari") != -1) {
                e.audioPlayer.support = "qtime"
            }
        }
    }
    if (e.audioPlayer.support == "qtime") {
        var d = false;
        if (navigator.plugins) {
            for (i = 0; i < navigator.plugins.length; i++) {
                if (navigator.plugins[i].name.indexOf("QuickTime") >= 0) {
                    d = true;
                    break
                }
            }
        }
        if (!d) {
            alert("Please install QuickTime to play Audio")
        }
    }

    function c(h) {
        var g = h.substring(h.lastIndexOf("."));
        if (g.indexOf("mp3") >= 0 || g.indexOf("ogg") >= 0 || g.indexOf("webm") >= 0) {
            h = h.substring(0, h.lastIndexOf("."))
        }
        return h
    }
})(jQuery);