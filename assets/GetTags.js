 var SelectedXpath = "";
//Change the output_code to show the XPath
function change_me(id){
	SelectedXpath = createXPathFromElement(id);
	$('#selected_xpath').html(SelectedXpath);
}

//Generate XPath code:
function createXPathFromElement(elm) {
	var allNodes = document.getElementsByTagName('*');
	for (segs = []; elm && elm.nodeType == 1; elm = elm.parentNode)
	{
		if (elm.hasAttribute('id')) {
			segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]');
			return segs.join("/");
		} else if (elm.hasAttribute('class')) {
			segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]');
		} else {
			for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
				if (sib.localName == elm.localName)  i++; }
			segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
		}
	}
	return segs.length ? '/' + segs.join('/') : null;
}

$(document).ready(function(){
	var DataToDB = {};
	var pageType = "thread";
	var threadQuest = [
		'site_link',
		'page_link',
		'htmlelement_that_wraps_a_post1',
		'htmlelement_that_wraps_a_post2', // Don't touch the first 4 items!
		'forum_name',
		'forum_version',
		'post_title',
		'post_data',
		'poster_username',
		'thread_title',
		'page_number'
	];
	var forumQuest = [
		'site_link',
		'forum_name',
		'htmlelement_that_wraps_a_thread1',
		'htmlelement_that_wraps_a_thread2', // Don't touch the first 4 items!
		'thread_titles',
		'thread_link',
		'thread_replies',
		'thread_views',
		'thread_Starter',
		'thread_last_post_date',
		'page_number',
		'thread_ratings'
	];
	var quest_counter = 0;
	var currentQuest = [];

	//init the type of the page:
	if(pageType == "thread") {
		currentQuest = threadQuest;
	} else if (pageType == "forum") {
		currentQuest = forumQuest;
	}

	//init the output_code:
	$("#quest").text(currentQuest[quest_counter]);

	//draggable by UI Jquery lib!
	$("#output_code").draggable();

	//AJAX sending request to getHTML.py
	$.ajax({
		type: "POST",
		url: "getHTML.py",
		success: function(response)
		{
			$('body').append(response);
		}
	});

	//ENTER event handle, change the quest
	$(document).keypress(function(e) {
		if(e.which == 13) {
			DataToDB[currentQuest[quest_counter]] = SelectedXpath;
			quest_counter++;
			//$("body").append(DataToDB[quest[quest_counter]]);
			$("#quest").text(currentQuest[quest_counter]);
			if(quest_counter == 4) {
				var id_diff = DataToDB[currentQuest[3]] + "||" + DataToDB[currentQuest[4]];
				$('#output_view').append(id_diff);
			}
		}
	});

	//scrolling the output_code div to my view
	$(window).scroll(function () {
		var set1 = $(document).scrollTop();
		var p = $("#output_code").position();
		if((set1 - p.top > 150)||(set1 - p.top < -700)){
			$('#output_code').animate({top:set1 + "px"},{duration:500,queue:false});
		}
	});


});