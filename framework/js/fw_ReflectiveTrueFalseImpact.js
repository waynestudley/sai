/*----------------------------------------
	Name: fw_FormativeMCQ.js
	Developed by: Suyog Shaha
----------------------------------------*/
function fw_ReflectiveTrueFalseImpact(_xml) {
    var pageXml = _xml;
    var optionButton = ".reflectiveTrueFalseImpact .optionButton";
    var selectedClass = "optionSelect";
    var optionHoverClass = "optionHover";
    var optionContainer = ".optionContainer";
    var userAnsArray = new Array();
    var infoArray = new Array();
    var okButton = ".ok";
    this.updatePageLayOut = updatePageLayOut;
    $('.pageText p').html(pageXml.contentText[0].text[0].Text);
    globalSettings.addTitle('.pageText', pageXml.contentText[0].text[0].Text);
    var str = '';
    var totalQption = pageXml.optionContent[0].option.length;
	var className=pageXml.className;
    var tbCnt = 6;
    var selectedId = "";
    var correctAnswerArray = pageXml.optionContent[0].answer.split(',');
	
    var optRow;
    $('.reflectiveTrueFalseImpact').addClass(className);
    //added by deepak for Agree disagree
    str += '<div class="Agree" tabindex="' + tbCnt + '">' + pageXml.OptionHeading[0].text[0].Text + '</div>';
    tbCnt++;
    str += '<div class="Disagree" tabindex="' + tbCnt + '">' + pageXml.OptionHeading[0].text[1].Text + '</div>';
    tbCnt++;
    $('.labelContainer').html(str);
    str = '';
	var preloadImagesArray = new Array();
	/*-----Below code is added for two separate background for iPad and desktop.-------*/
	
	if(pageXml.panelBackground!=null){ 
		if(globalSettings.isIpad){
			var iPadImgPath=pageXml.panelBackground[0].img[0].ipadPath;
			if(String(iPadImgPath)!="undefined" && String(iPadImgPath)!=""){
				$('.panelBg').attr('src',iPadImgPath);			
				$('.panelBg').attr("alt", pageXml.panelBackground[0].img[0].Text);	
				isPreload=true;
				preloadImagesArray.push(iPadImgPath);		
			}else if(pageXml.panelBackground[0].img[0].path!=""){
					$('.panelBg').attr("src", pageXml.panelBackground[0].img[0].path);
					$('.panelBg').attr("alt", pageXml.panelBackground[0].img[0].Text);
					isPreload=true;
					preloadImagesArray.push(pageXml.panelBackground[0].img[0].path);			
			}else{
					$('.panelBg').remove();
			}
		}else{
			if(pageXml.panelBackground[0].img[0].path!=""){
				$('.panelBg').attr("src", pageXml.panelBackground[0].img[0].path);
				$('.panelBg').attr("alt", pageXml.panelBackground[0].img[0].Text);
				isPreload=true;
				preloadImagesArray.push(pageXml.panelBackground[0].img[0].path);			
			}else{
				$('.panelBg').remove();
			}
		}
	}else{
		$('.panelBg').remove();
	}
	/*---------------*/
	

    str += '<table border="0" >';
    str += '<tr class="cellGap"></tr>';
    for (var i = 0; i < totalQption; i++) {
        var qStr = pageXml.optionContent[0].option[i].Text;
        userAnsArray.push(0);
		infoArray.push(0);
        //Code Modification for Impact button modification start from here
        if (pageXml.impact[0].isApplicable == "true") {

            var impactStr = pageXml.impact[0].impacttext[i].Text;
            var impID = pageXml.impact[0].impacttext[i].id;
            var impLable = pageXml.Label[0].text[0].Text;
        }
		var mcqBg=null;
		var mcqBgAltText=null;
		if(pageXml.contentBackground[0].img!=null){
			 mcqBg = pageXml.contentBackground[0].img[i].path;
			 mcqBgAltText = pageXml.contentBackground[0].img[i].Text;
		}	
        var rowheight = pageXml.optionContent[0].height;
		if(pageXml.optionContent[0].option[i].height!=null){
			rowheight = pageXml.optionContent[0].option[i].height
		}
		var fontSize = "16px"
		if(pageXml.optionContent[0].option[i].fontSize!=null){
			var fontSize = pageXml.optionContent[0].option[i].fontSize;
		}
		
        if(globalPath.languageDir == 'ltr'){
		str += '<tr class="optionRow" style="padding-left:5px;height:'+rowheight+'">';
		} else{
		str += '<tr class="optionRow" style="padding-right:5px;height:'+rowheight+'">';
			}
		if(mcqBg!=null){	
			str += '<td class="imgHolder" rowspan="2" ><img src="' + mcqBg + '" tabindex="' + tbCnt + '" alt="' + mcqBgAltText + '" /></div></td>';
			tbCnt++;
		}
        str += '<td class="optiontextCell" tabindex="' + tbCnt + '" style="padding-left:10px; padding-right:10px;font-size:'+fontSize+';" onclick = "void(0)" >' + qStr + '</td>';
        str += '<td class="Whitespacer" ></td>';
		
        str += '<td class="spacerContainer" ><div class="uspacer"></div></td>';
        str += '<td class="uAnscontainer" ></td>';
        //addition ends
        str += '<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="' + tbCnt + '" id="op1_' + i + '" val="op_' + (i) + 'Y" style="cursor: pointer;"></a></td>';
        str += '<td class="uAnscontainer" ><div class="uAns" id="op1' + i + '"></div></td>';
        tbCnt++;

        str += '<td class="spacerContainer" ><div class="uspacer"></div></td>';
        str += '<td class="uAnscontainer" ></td>';
        str += '<td class="optionCell" onclick = "void(0)" ><a  href="javascript:void(0)" class="optionButton" tabindex="' + tbCnt + '" id="op2_' + i + '" val="op_' + (i) + 'N" style="cursor: pointer;"></a></td>';
        str += '<td class="uAnscontainer" ><div class="uAns" id="op2' + i + '"></div></td>';
		if(pageXml.Label[0].alignLable!=null){
			str += '<td class="'+pageXml.Label[0].alignLable+'" ><div class="ImpactContainer" id="wy'+ i + '"><a class="ImpactBtn" id="imp' + i + '">' + impLable + '</a></div></td>';
			tbCnt++;
			str += '</tr>';  
			str += '<tr class="cellGap1 rightColGap"><td></td><td></td><td></td> <td></td> </tr>';
		}else{
			tbCnt++;
			str += '</tr>';
			str += '<tr class="cellGap1"><td><div class="ImpactContainer" id="wy'+ i + '"><a class="ImpactBtn" id="imp' + i + '">' + impLable + '</a></div></td><td></td><td></td> <td></td> </tr>';
			tbCnt++;
		}
    }
    str += '</table>'
    navigationEvent.updateGlobleFocus(tbCnt);
    $('.optionContainer').html(str);
    /* if (pageXml.contentBackground[0].img.length > 1) {
       
    } */
    str = '<a href ="#" class="a-button ok disabled" tabindex="' + (tbCnt + 1) + '" ><span class="btntext"></span></a>'

    $(".pageInstruction").attr('tabIndex', tbCnt)
    $('.optionContainer').append(str);
    $('.btntext').html(pageXml.buttonText[0].text[0].Text);
    pageInstruction.updateText(pageXml.instructionText[0].text[0].Text);
    updatePageLayOut();
	setStyle($('.userFeedback'),pageXml.feedback[0] );
    function updatePageLayOut() {

    }
    $('.optionCell').click(function() {
        var opcellBtn = $(this).find('.optionButton');
        var mNae = $(opcellBtn).attr('id').split('_')[1]
        if ($(opcellBtn).hasClass("disabled")) {
            return false;
        }
        $('#op1_' + mNae).removeClass(selectedClass);
        $('#op1_' + mNae).css('cursor', 'pointer');
        $('#op2_' + mNae).removeClass(selectedClass);
        $('#op2_' + mNae).css('cursor', 'pointer');
        $(opcellBtn).css('cursor', 'pointer');
        $(opcellBtn).addClass(selectedClass);
        $(opcellBtn).css('cursor', 'default');
		checkOk();      
    });

   $('.optionCell').hover(function() {
            optRow = $(this).find('.optionButton');
            if ($(optRow).hasClass(selectedClass) || $(optRow).hasClass('disabled') || (!globalSettings.isDesktop())) {
                return false;
            }
            $(optRow).addClass(optionHoverClass);
        },
        function() {
            $(optRow).removeClass(optionHoverClass);
        });

    
	if(pageXml.contentBackground[0].img!=null){
		preloadImagesArray.push(pageXml.contentBackground[0].img[0].path + "");
	} 
    $.imgpreload(preloadImagesArray, {
        each: function() {},
        all: function() {
            try {
                templateMediator.templateLoadComplete();
                $("div[tabindex=1]").focus();
                // templateMediator.pageVisited();
            } catch (err) {}
        }
    });

    function checkOk() {
        for (var i = 0; i < totalQption; i++) {
            userAnsArray[i] = 0;
        }

        var cnt = 0;
        $('.optionCell').find('.optionButton').each(function() {
            if ($(this).hasClass('optionSelect')) {
                userAnsArray[cnt] = $(this).attr('id').split('op')[1];
                cnt++;
            }
        });

        if (totalQption == cnt) {
            enabledButton(okButton)

        } else {


        }
    }
    $(okButton).click(function() {
        if ($(this).hasClass("disabled")) {
            $("div[tabindex=1]").focus();
            return false;
        }
        //$('.userFeedback').attr('tabindex',(tbCnt+1))
        disabledButton('.optionCell');
        disabledButton('.optiontextCell');
        disabledButton(okButton);
        disabledButton(optionButton);
        var corrct = 0;
        var wrong = 0;
        pageInstruction.updateText(pageXml.instructionText[0].text[1].Text);
        if (userAnsArray.toString() == correctAnswerArray.toString()) {
            showFeedback(pageXml.feedback[0].correct[0]);
            for (var i = 0; i < totalQption; i++) {
                var selId = 'op' + userAnsArray[i].split('_')[0] + '' + userAnsArray[i].split('_')[1];
                $("#" + selId).addClass('uAnsTick');
            }
        } else {

            //$(selectedId).closest('.optionRow').addClass('uAnsCross');
            for (var i = 0; i < totalQption; i++) {
                if (correctAnswerArray[i] == userAnsArray[i]) {
                    var selId = 'op' + userAnsArray[i].split('_')[0] + '' + userAnsArray[i].split('_')[1];
                    $("#" + selId).addClass('uAnsTick');
                    corrct++;
                    //$('#op_'+i).closest('.optionRow').addClass('uAnsShow');
                } else {
                    wrong++;
                    var selId = 'op' + userAnsArray[i].split('_')[0] + '' + userAnsArray[i].split('_')[1];
                    $("#" + selId).addClass('uAnsCross');
                }
            }

            showFeedback(pageXml.feedback[0].incorrect[0]);


        }


        // Added by Deepak for Impact Modification and show answer

        ShowAnswer();
        if (pageXml.impact[0].isApplicable == "true") {
			navigationEvent.updateNextPagePopupText();
            $('.ImpactContainer').css('display', 'block');
			setStyle($('.impactFeedback'),pageXml.impact[0] );
        }else{
			templateMediator.pageVisited();	
		}
        // Modification Ends
        return false;
    });


    function ShowAnswer() {
        for (var i = 0; i < totalQption; i++) {

            $("#op" + correctAnswerArray[i]).parent().addClass('showAns')
        }

    }

    function showFeedback(obj) {
        var str = "";
        for (var i = 0; i < obj.text.length; i++) {
            str += "<div class='insertTab'><p>" + obj.text[i].Text + "</p></div>"
        }
        $('.userFeedback .userFeedbackText').html("<div class='fbInsertTabDiv'>"+str+"</div>");
        $('.userFeedback').show();
		var _ht=$('.userFeedback .userFeedbackText').parent().height();
		$('.userFeedback .userFeedbackText').css('height', _ht+'px');
		$('.fbInsertTabDiv').css('height','auto');
		if($('.fbInsertTabDiv').outerHeight() > $('.userFeedbackText').outerHeight()){			
			
			$('.userFeedback .userFeedbackText').fw_Scroll({color: "#0057A6", width: 10 });
		}

        var tId = parseInt(obj.transcriptId);
        var audioUrl = pageXml.transcript[0].text[tId].path;
        navigation.playAudioByURL(audioUrl);
        $.fw_Transcript('updateText', pageXml.transcript[0].text[tId].Text);
       // templateMediator.pageVisited();
        updateTabIndex();
    }

    function enabledButton(_button) {
        $(_button).removeClass('disabled');
        $(_button).css('cursor', 'pointer');
    }

    function disabledButton(_button) {
        $(_button).addClass('disabled');
        $(_button).css('cursor', 'default');
    }

    function updateTabIndex() {
        $('.insertTab').removeAttr('tabindex');
        if ($('.userFeedback').is(':visible')) {
            tbCnt++;
            $('.userFeedback .userFeedbackText').find('.insertTab').each(function() {
                $(this).attr('tabindex', tbCnt);
                tbCnt++;
            })
        }

        navigationEvent.updateGlobleFocus(tbCnt);
    }


    //code added by Deepak for Impact Button 

    var ua = navigator.userAgent,
        event = (ua.match(/iPad/i)) ? "touchstart" : "click";
    $('.ImpactContainer').mouseover(function() {
        $(this).children(".ImpactBtn").addClass('ImpactBtnhover');
        $(this).children(".impactcap").addClass('impactcaphover');
    });

    $('.ImpactContainer').mouseout(function() {
        $(this).children(".ImpactBtn").removeClass('ImpactBtnhover');
        $(this).children(".impactcap").removeClass('impactcaphover');
    });


    $('.ImpactContainer').bind(event, function(e) {
		var id = $(this).attr('id').split('wy')[1];
		
        showImpactFeedback(pageXml.impact[0].impacttext[id]);
        infoArray[id] = 1;
        for (var i = 0; i < totalQption; i++) {
            if ($('#wy' + i).children('.ImpactBtndisable').hasClass('ImpactBtndisable')) {
                $('#wy' + i).children('.ImpactBtndisable').removeClass('ImpactBtndisable').addClass('ImpactBtn');
			}
        }
        if ($('#' + $(this).attr('id')).children('.ImpactBtn').hasClass('ImpactBtnhover') && $('#' + $(this).attr('id')).children('.impactcaphover').hasClass('impactcap')) {

            return false;
        } else {
            showImpactFeedback(pageXml.impact[0].impacttext[id]);
            $('#wy' + id).children('.ImpactBtn').addClass('visited');
			var visited=true;
			$('.ImpactBtn').each(function(){
				if(!$(this).hasClass('visited') && visited){
					//console.log(visited)
					visited=false;
				}
			});
			if(visited && pageXml.instructionText[0].text[2]!=null){
				pageInstruction.updateText(pageXml.instructionText[0].text[2].Text);
			}
			$('#wy' + id).children('.ImpactBtn').removeClass('ImpactBtn').addClass('ImpactBtndisable');

        }
		$('.userFeedback').hide();
		if(pageXml.impact[0].impacttext[id].arrowTopPosition){
			$('.Arrow').css('top',pageXml.impact[0].impacttext[id].arrowTopPosition);			
		}
		$('.Arrow').show();
		if(infoArray.toString().indexOf("0")<0){
			templateMediator.pageVisited();	
		}	
    });


    function showImpactFeedback(obj) {
        offset = 1;
        var str = "";
		
		 for (var i = 0; i < obj.text.length; i++) {
            str += "<div class='insertTab'><p>" + obj.text[i].Text + "</p></div>"
        }
       

        $('.impactFeedback .impactFeedbackText').html("<div class='insertTabDiv'>"+str+"</div>");
        $('.impactFeedback').show();

      
		
		 $('.impactFeedbackText').css('height', pageXml.impact[0].height);
		 
		 
			if(pageXml.impact[0].height!=null){
				$('.impactFeedback .impactFeedbackText').css('height', (parseInt(pageXml.impact[0].height)-20)+'px');
			}
			if(pageXml.impact[0].width!=null){
				$('.impactFeedback .impactFeedbackText').css('width', (parseInt(pageXml.impact[0].width)-10)+'px');
				$('.impactFeedback .impactFeedbackText .insertTabDiv').css('width', (parseInt(pageXml.impact[0].width)-20)+'px');
			}			
			if($('.insertTabDiv').outerHeight() > $('.impactFeedbackText').outerHeight()){			
				$('.impactFeedback .impactFeedbackText .insertTabDiv').css('width', (parseInt(pageXml.impact[0].width)-30)+'px');
				$('.impactFeedback .impactFeedbackText').fw_Scroll({color: "#0057A6", width: 10 });
			}		
		 
        //$('.impactCloseBtn').html(pageXml.closeText[0].text[0].Text);

        $('#' + obj.id).children(".ImpactBtn").removeClass('ImpactBtn ImpactBtnhover').addClass('ImpactBtndisable');
        $('#' + obj.id).children(".impactcap").removeClass('impactcap impactcaphover').addClass('impactcapdisable');
    }


    $('.impactCloseBtn').bind(event, function(e) {
        $('.impactFeedback').hide();
        $('.Arrow').hide();
		 for (var i = 0; i < totalQption; i++) {
            if ($('#wy' + i).children('.ImpactBtndisable').hasClass('ImpactBtndisable')) {
                $('#wy' + i).children('.ImpactBtndisable').removeClass('ImpactBtndisable').addClass('ImpactBtn');
			}
        }
		$('.userFeedback').show();
        for (var i = 0; i < totalQption; i++) {
            if ($('#' + i).children('.impactcapdisable').hasClass('impactcapdisable') && $('#' + i).children('.ImpactBtndisable').hasClass('ImpactBtndisable')) {
                $('#' + i).children('.ImpactBtndisable').removeClass('ImpactBtndisable').addClass('ImpactBtn');
                $('#' + i).children('.impactcapdisable').removeClass('impactcapdisable').addClass('impactcap');
            }
        }

    });

	function setStyle(obj, _xml) {
		var clr = (_xml.color == null ? '#333740' : _xml.color);
		var fts = (_xml.fontSize == null ? '16px' : _xml.fontSize);
		var ftw = (_xml.fontWeight == null ? 'normal' : _xml.fontWeight);
		var txtA = (_xml.textAlign == null ? 'left' : _xml.textAlign);
		var txtB = (_xml.textAlign == null ? 'right' : _xml.textAlign);
		var wd = (_xml.width == null ? 'auto' : _xml.width);
		var ht = (_xml.height == null ? 'auto' : _xml.height);
		var lft = (_xml.left == null ? '' : _xml.left);
		var rit = (_xml.right == null ? '' : _xml.right);
		var tp = (_xml.top == null ? '' : _xml.top);
		var pos = (_xml.position == null ? 'absolute' : _xml.position);
		if(globalPath.languageDir == 'ltr'){
		$(obj).css({
			left: lft,
			top: tp,
			color: clr,
			width: wd,
			height: ht,
			'font-size': fts,
			'font-weight': ftw,
			'text-align': txtA,
			position: pos
		});
		} else{
		$(obj).css({
			right: rit,
			top: tp,
			color: clr,
			width: wd,
			height: ht,
			'font-size': fts,
			'font-weight': ftw,
			'text-align': txtB,
			position: pos
		});
			}
	}

    //code ends
}