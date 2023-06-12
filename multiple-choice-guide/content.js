function keywordsHighlighter(options) {
	var occurrences = 0;

	function highlight(node, pos, keyword, options) {
		var span = document.createElement("span");
		span.className = "highlighted";
		span.style.color = options.foreground;
		span.style.backgroundColor = options.background;

		var highlighted = node.splitText(pos);
		highlighted.splitText(keyword.length);
		var highlightedClone = highlighted.cloneNode(true);

		span.appendChild(highlightedClone);
		highlighted.parentNode.replaceChild(span, highlighted);

		occurrences++;
	}

	function addHighlights(node, keywords, options) {
		var skip = 0;

		var i;
		if (3 == node.nodeType) {
			for (i = 0; i < keywords.length; i++) {
				var keyword = keywords[i].toLowerCase();
				var pos = node.data.toLowerCase().indexOf(keyword);
				if (0 <= pos) {
					highlight(node, pos, keyword, options);
					skip = 1;
				}
			}
		}
		else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
			for (i = 0; i < node.childNodes.length; i++) {
				i += addHighlights(node.childNodes[i], keywords, options);
			}
		}

		return skip;
	}

  function addHighlightsTest(node, keywords, options){
    
    var i;
    for (i = 0; i < keywords.length; i++) {
      var keyword = keywords[i].toLowerCase();
      const regex = new RegExp('\\b${keyword}\\b', 'gi');
      const highlightedText = `<span style="background-color: yellow">${keyword}</span>`;
      const highlightedPageText = node.replace(regex, highlightedText);
      document.body.innerHTML = highlightedPageText;
    }
  }


	//var keywords = options.keywords.split(","); //Maybe add predefined Keywords right here
  var keywords = "minimum,maximum,team,developers,developer,master,daily,best answers,best answer,increment,valuable,true,false".split(',');
	//delete options.keywords;
	addHighlights(document.body, keywords, options);
  //addHighlightsTest(document.body.innerText, keywords, options);

}

//var buttonKnopf = document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-right button-next");
//if (buttonKnopf.length != 0){
//  buttonKnopf.addEventListener("click", runHighlighter, false);
//}
function runHighlighter(){          
  //setTimeout(keywordsHighlighter({foreground: '#000000', background: '#ffff00'}), 10000);
  keywordsHighlighter({foreground: '#000000', background: '#ffff00'}) 

}

//setInterval(runHighlighter, 1000) //call function every 1000milliseconds to run it on every new question



function loadCheck() { //highlights page after clicking, but not the new page
  if (document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-right button-next").length != 0){
    button = document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-right button-next");
    button[0].addEventListener("click", runHighlighter);
  }
  else{
    setTimeout(loadCheck, 15);
  }
}

loadCheck();
