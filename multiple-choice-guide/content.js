var count_of_answers_to_tick = 0;

function GetCrossedQuestions() {
    var crossed_questions = 0;
    if (document.getElementsByClassName("ion-color ion-color-secondary md in-item interactive hydrated").length != 0){
        button = document.getElementsByClassName("ion-color ion-color-secondary md in-item interactive hydrated");
        console.log(button);

        for(var i = 0; i < button.length; i++) {
            if(button[i].getAttribute("aria-checked") === "true") {
               crossed_questions += 1;
        }
        }
        console.log("Crossed Questions ", crossed_questions);
        return crossed_questions;
    }
    else{
        setTimeout(GetCrossedQuestions, 15);
        console.log("No buttons yet");
      }
 }

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

		switch (highlighted.data){
			case "best answer": count_of_answers_to_tick = 1;
				break;
			case "False":count_of_answers_to_tick = 1;
				break;
			case "best two": count_of_answers_to_tick = 2;
				break;
			case "best three": count_of_answers_to_tick = 3;
				break;
			case "best four": count_of_answers_to_tick = 4;
				break;
			case "best five": count_of_answers_to_tick = 5;
				break;
			case "best six": count_of_answers_to_tick = 6;
				break;
			case "all that apply": count_of_answers_to_tick = -1;
				break;
			default: break;
		}
		occurrences++;
	}

	function addHighlights(node, keywords, numberKeywords, options) {
		var skip = 0;

		var i;
		if (3 == node.nodeType) {
			for (i = 0; i < keywords.length; i++) {
				var keyword = keywords[i].toLowerCase();
				var pos = node.data.toLowerCase().indexOf(keyword);
				if (0 <= pos) {
					highlight(node, pos, keyword, options[0]);
					skip = 1;
				}
			}
			for (i = 0; i < numberKeywords.length; i++) {
				var keyword = numberKeywords[i].toLowerCase();
				var pos = node.data.toLowerCase().indexOf(keyword);
				if (0 <= pos) {
					highlight(node, pos, keyword, options[1]);
					skip = 1;
				}
			}
		}
		else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
			for (i = 0; i < node.childNodes.length; i++) {
				i += addHighlights(node.childNodes[i], keywords, numberKeywords, options);
			}
		}

		return skip;
	}

    var numberKeywords = "best answers,best answer,best two,best three,best four,best five,best six,all that apply".split(','); 
	var keywords = "minimum,maximum,team,developers,developer,master,daily,increment,valuable,untrue,incorrect,misleading,true,false".split(',');

	addHighlights(document.body, keywords, numberKeywords, options);

}

function runHighlighter(){          
  keywordsHighlighter([{foreground: '#000000', background: '#ffff00'}, {foreground: '#000000', background: '#ff8000'}]) 

}

setInterval(runHighlighter, 1000) //call function every 1000milliseconds to run it on every new question


function showPopup(crossedQuestions) {
	// set size of popupWindow
	var screenWidth = window.screen.availWidth;
	var screenHeight = window.screen.availHeight;
	var popupWidth = screenWidth / 3;
	var popupHeight = screenHeight / 3;
	var popupLeft = (screenWidth - popupWidth) / 2;
	var popupTop = (screenHeight - popupHeight) / 2;

	var popup = window.open("", "Multiple Choice Guide", `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`);

	// Create the popup window content
	var popupContent = `
  <!doctype html>
  <html>
  <head>
    <title>Mulitple Choice Guide</title>
    <style>
      /* Your styles here */
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
      }
      .popup-content {
        text-align: center;
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
      h2 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
       }
      .button-container {
		position: relative;
	  }
	  button {
		position: relative;
		z-index: 1;
		font-size: 16px;
		border-radius: 20px;
		padding: 10px 20px;
		color: #fff;
		border: none;
		cursor: pointer;
		transition: background-color 0.5s ease;
		/* Apply a linear gradient for the background */
		background-image: linear-gradient(to right, #45a049, #4caf50);
	  }
	  button:hover {
		/* Change the background color of the button */
		background-image: linear-gradient(to right, #4caf50, #45a049);
		color: #404040;
	  }
    </style>
    
  </head>
  <body>
    <div class="popup-content">
      <h2>Detected problem</h2>
      <p>${crossedQuestions}</p>
      <div class="button-container">
        <button id="okButton">OK</button>
      </div>
    </div>
  </body>
  </html>
`;

	popupContent = popupContent.replace("${crossedQuestions}", crossedQuestions);

	popup.document.open();
	popup.document.write(popupContent);
	popup.document.close();

	// destroy popupWindow when okButton is clicked
	var okButton = popup.document.getElementById("okButton");
	okButton.addEventListener("click", function () {
		popup.close();
	});
}

function getPrevButton() {
     if(document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-left button-previous").length != 0) {
        var previous_button = document.getElementsByClassName("md button button-solid ion-activatable ion-focusable hydrated ion-float-left button-previous");
        return previous_button;
    }
    else {
        setTimeout(getPrevButton,15);
    }
}

  
function checkForPopup(){ // check if Popup is needed or not
	//get previous-button
	var previous_button = getPrevButton();
	//call function to get number of currently crossed questions
	curr_crossed_questions = GetCrossedQuestions();
	if(curr_crossed_questions == count_of_answers_to_tick){
		return 0;
	}

	// No popup when only one answer has to be crossed (Scrum has its own for that)
	if(count_of_answers_to_tick == 1) {
		return 0;
	}
	// No popup when you havent crossed a question yet (Scrum has its own for that)
	if(curr_crossed_questions == 0) {
		return 0;
	}
	// Popup for "all that apply" questions
	if(count_of_answers_to_tick == -1){
		crossedQuestions = "Please decide on yourself we can't find a rule!";
		showPopup(crossedQuestions);
	}
	// Popup for all other questions
	else {
		crossedQuestions = "Multiple-choice-guide detected, that you crossed " + curr_crossed_questions + " but " + count_of_answers_to_tick + " are requested";
	showPopup(crossedQuestions);
	previous_button[0].click();
	}
	
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

