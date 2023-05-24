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


	//var keywords = options.keywords.split(","); //Maybe add predefined Keywords right here
  var keywords = "one,two,best,answer,answers".split(',');
	//delete options.keywords;
	addHighlights(document.body, keywords, options);

}

function runHighlighter(){          
  keywordsHighlighter({foreground: '#000000', background: '#ffff00'}) 
}

setInterval(runHighlighter, 1000) //call function every 1000milliseconds to run it on every new question
