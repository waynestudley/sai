/*----------------------------------------
Name: jquery.fw_Glossary.js
Developed by: Suyog Shaha
 ----------------------------------------*/
(function($) {
	var glossaryXML;
	var fw_GlossaryDiv = "";
	var gloParH;
	var gloAreaH;
	var gloScrH;
	var gloData = {};
	var gloAvailChars = [];
	var defaults = {};
	var glossaryXML=null;
	var methods = {
		init : function(options) {
			defaults = {
				speed : 500,
				glossaryXML : null
			}
			var options = $.extend(defaults, options);
			glossaryXML=defaults.glossaryXML;
			$(".wrapper").prepend(getHtml());
			var glossary = $('.fw_Glossary');

			/* Positioning of the fw_Glossary */
			if(defaults.bottom != 0) { $('.fw_Glossary').css('bottom', defaults.bottom + 'px');}
			else 					 { $('.fw_Glossary').css('top', defaults.top + 'px');}
			if(defaults.right != 0)  { $('.fw_Glossary').css('right', defaults.right + 'px');} 
			else 					 { $('.fw_Glossary').css('left', defaults.left + 'px');}

			/* create Glossary depending on the XML */
			fw_GlossaryCreate( glossary);

            /* initialize the default information*/
			$(".fw_GloListDiv_"+gloAvailChars[0]).addClass('showList');
            var TmpTitle = $(".fw_GloListDiv_"+gloAvailChars[0]+" a:first-child").text();
            glossaryInfo(TmpTitle)
            $('.fw_GlossarySelector a.fw_GloPointer:first-child').addClass('fw_GloCharCurrent');

			/* Close The fw_Glossary Window */
			$('.fw_GlossaryClose').bind('click', function() {
				methods.hide();
			});

			/* Click on the fw_Glossary Charecter */
			$('.fw_GloPointer').bind('click', function() {
    		    $('.fw_GloSearchTxt').val("")
                $(".fw_GloCharList").show();
				$(".fw_GloListDiv").removeClass('showList');
				$(".fw_GloListDiv_"+$(this).text()).addClass('showList');
				$('.fw_GloPointer').removeClass('fw_GloCharCurrent');
				$(this).addClass('fw_GloCharCurrent');
				$('.fw_GloCharList').removeClass('fw_GloListCurrent');
				$(".fw_GloListDiv_"+$(this).text()+" a:first-child").addClass('fw_GloListCurrent');
                $(".fw_GloInfoTitle,.fw_GloInfoContent").html("");
				var Tmp = $(".fw_GloListDiv_"+$(this).text()+" a:first-child").text();
				glossaryInfo(Tmp);
			});

			/* Close on the fw_Glossary list link to display Info */
			$('.fw_GloCharList').bind('click', function() {
				$(".fw_GloInfoTitle,.fw_GloInfoContent").html("");
				var Tmp = $(this).text();
				glossaryInfo(Tmp);
				$('.fw_GloCharList').removeClass('fw_GloListCurrent');
				$(this).addClass('fw_GloListCurrent');
			});

          	$(".fw_GlossaryText").html(glossaryXML.title[0].Text);
			$(".fw_Glossary_parent").hide();			
			$(".fw_Glossary").focus();
			navigationEvent.updateToolTip();
		},
		show : function() {
			$(".fw_Glossary_parent").show();
			$(".fw_GloListDiv a.fw_GloListCurrent").css('display','block');
			$(".fw_Glossary").focus();
			navigation.pausePageExternal();
			
		},
		hide : function() {
			$(".fw_Glossary_parent").hide();
			navigation.playPageExternal();
		},
		destroy : function() {},
		reposition : function() {},
		update : function(content) {}
	};

	$.fn.fw_Glossary = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if( typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.customglossary');
		}
	};
	
	$.extend({ fw_Glossary : $.fn.fw_Glossary });

	getHtml = function() {
		var str = "<div class='fw_Glossary_parent'>";
		str += "<div class='semiBlack'></div>";
		str += "<div class='fw_Glossary'>";
		str += "<div class='fw_GlossaryHeader'>";
		str += "<div class='fw_GlossaryText'></div><a class='fw_GlossaryClose'></a>";
		str += "<div class='fw_GlossarySearch'><input type='text' class='fw_GloSearchTxt' ><a class='fw_SrchBtn'>&nbsp;</a></div>";
		str += "</div>";
		str += "<div class='fw_GlossaryContent'>";
		str += "<div class='fw_GlossaryScrollable'>";
		str += "<div class='fw_GlossaryList'></div>";
		str += "<div class='fw_GlossaryInfo'>";
		str += "<div class='fw_GloInfoTitle'></div>";
		str += "<div class='fw_GloInfoContent' id ='fw_GloInfoContent' ><div class='scrollable'></div></div>";
		str += "</div>";
		str += "<div class='fw_GlossarySelector'>";
		str += "</div>";
		str += "</div>";
		str += "</div>";
		str += "</div>";
		str += "</div>";
		if($(".fw_Glossary").length > 0) {return "";}
		else {return str;}
	};

	/* generate Glossary Div*/
	function fw_GlossaryCreate(glossary) {
		var fw_GloSelect = fw_GloInfo = fw_GloList = "";
		var added=false;
		for(var i = 0; i < glossaryXML.alphabet.length; i++) {
			if(typeof glossaryXML.alphabet[i].term === 'undefined'){
				continue;
			};
			fw_GloList+='<div class="fw_GloListDiv fw_GloListDiv_'+glossaryXML.alphabet[i].character[0].Text+'"><div class="scrollable">';
			gloAvailChars.push(glossaryXML.alphabet[i].character[0].Text);
			for(var j = 0; j < glossaryXML.alphabet[i].term.length; j++) {
				if (j == 0 && !added) {
					added = true;
					fw_GloList += '<a id="fw_GloCharDiv_' + glossaryXML.alphabet[i].character[0].Text + '_' + j + '" href="javascript:void(0)" class="fw_GloCharList fw_GloListCurrent">' + glossaryXML.alphabet[i].term[j].word[0].Text + '</a>';
				}else {
					fw_GloList += '<a id="fw_GloCharDiv_' + glossaryXML.alphabet[i].character[0].Text + '_' + j + '" href="javascript:void(0)" class="fw_GloCharList">' + glossaryXML.alphabet[i].term[j].word[0].Text + '</a>';
				}
				gloData[glossaryXML.alphabet[i].term[j].word[0].Text]=glossaryXML.alphabet[i].term[j].text[0].Text;
			}
			fw_GloList += '</div></div>';
		}
		var tcnt=10;
		for(var x = 65;x<91;x++)
		{
			var cntStr=containChar(String.fromCharCode(x));
			if(cntStr!=""){
				tcnt++;
				fw_GloSelect += "<a class='fw_GlossaryChar"+cntStr+"' tabindex='"+tcnt+"'>"+String.fromCharCode(x)+"</a>";
			}else{
				fw_GloSelect += "<a class='fw_GlossaryChar'>"+String.fromCharCode(x)+"</a>";
			}
			
		}
		$(glossary).find(".fw_GlossaryList").html(fw_GloList);
		$(glossary).find(".fw_GlossarySelector").html(fw_GloSelect);
	}
	
	/* generate Glossary Div*/
	function glossaryInfo(gloTmpData)
	{
		var fw_GloInfo = "";
		fw_GloInfo += "<div class='fw_GloInfoTitle'>"+gloTmpData+"</div>";
		fw_GloInfo += "<div class='fw_GloInfoContent' id ='fw_GloInfoContent' ><div class='scrollable'>"+gloData[gloTmpData]+"</div></div>";
		$(".fw_GlossaryInfo").html(fw_GloInfo);
		$("#fw_GloInfoContent").fw_Scroll({color:"#303030",width:10});
	}

    /* Check If the charecter is available in the list to make enabled in the bottom glossary list*/
	function containChar(character)
	{
		for (var i = 0; i < gloAvailChars.length; i++) {
			if (gloAvailChars[i] == character) {
				return " fw_GloPointer";
			}
		}
		return "";
	}
})(jQuery);