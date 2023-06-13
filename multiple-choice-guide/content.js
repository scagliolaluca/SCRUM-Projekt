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

setInterval(runHighlighter, 1000) //call function every 1000milliseconds to run it on every new question


function showPopup(crossedQuestions) {

	// set size of popupWindow
	var screenWidth = window.screen.availWidth;
	var screenHeight = window.screen.availHeight;
	var popupWidth = screenWidth/3;
	var popupHeight = screenHeight/3;
	var popupLeft = (screenWidth - popupWidth) / 2;
	var popupTop = (screenHeight - popupHeight) / 2;

	var popup = window.open("", "_blank", `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`);

	// Create the popup window
	var popupContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Popup Window</title>
      <style>
        body {
          	text-align: center;
        }
		h2 {
			font-size: 5vw;
		}
		p  {
			font-size: 3vw;
		}
		button {
			font-size: 3vw;
		}
      </style>
    </head>
    <body>
      <h2>Wrong amount of Questions crossed!</h2>
      <p> ${crossedQuestions} </p>
	  <button id="okButton">OK</button>
    </body>
    </html>
  `;
 
  popupContent = popupContent.replace("${crossedQuestions}", crossedQuestions);
  
  popup.document.open();
  popup.document.write(popupContent);
  popup.document.close();

  // destroy popupWindow when okButton is clicked
  var okButton = popup.document.getElementById("okButton");
  okButton.addEventListener("click", function() {
	popup.close();
  });
}
  
function checkForPopup(){ // check if Popup is needed or not

	//call function to get number of currently crossed questions
	//get number of wanted crossed questions
	//compare them, if unequal-->write string and showPopup
	// write string to be printed out in popup-window here
	crossedQuestions = "Multiple-choice-guide detected, that you crossed 3";
	
	showPopup(crossedQuestions)
}

function loadCheck() { //highlights page after clicking, but not the new page
  if (document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-right button-next").length != 0){
    button = document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-right button-next");
    button[0].addEventListener("click", checkForPopup);
  }
  else{
    setTimeout(loadCheck, 15);
  }
}

loadCheck();
