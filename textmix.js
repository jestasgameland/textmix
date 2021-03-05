
const urlParams = new URLSearchParams(window.location.search); //get everything after the ?
var needToLoadSaved = urlParams.get('loadsavedtext');
var saveCode = urlParams.get('savecode');  //(null if there's no saveCode specified)
var researchMode = urlParams.get('researchmode');
if (researchMode == 'true') { researchMode = true } //convert string to boolean
else {researchMode = false};  
	
var scraperMode = urlParams.get('scrapermode');
if (scraperMode == 'true') { //convert string to boolean
	scraperMode = true;
} else {scraperMode = false;}
var level = urlParams.get('level');  //which level JSON file to save the scraped text in

var mobile = false;
if (window.innerWidth<800) {
	mobile = true;
}


//display or hide the language setting for wikipedia and the box to paste text if these settings are selected:
function languagePopup(yes) {
	var opacity;
	var clickable;
	if (yes) {
		opacity = '100%';
		clickable = "auto";
		getSettings();

		if (mobile) {
			document.getElementById('language-settings').style.display = "block"; 
		}
	} else {
		opacity = '50%';
		clickable = "none";
		if (mobile) {
			document.getElementById('language-settings').style.display = "none"; //hide it completely if mobile
		}
	};
	document.getElementById('language-settings').style.opacity = opacity;
	document.getElementById('language-settings').style.pointerEvents = clickable;
}

function pastePopup(yes) {
	var display;
	if (yes) {
		display = 'block';
		getSettings();
	} else {
		display = 'none';
	};
	document.getElementById('paste-div').style.display = display;
	
}

function challengesPopup(yes, textFile) {
	var display;
	if (yes) {
		display = 'block';
		if (!studentMode) { getSettings() };  
		loadPresetTexts(textFile);
		document.getElementById('start-button').style.display = "none";
		document.getElementById('quickstart-button').style.display = "none";
		document.getElementById('save-button').style.display = "none";
	} else {
		display = 'none';
		loadPresetTexts(textFile);
		document.getElementById('start-button').style.display = "inline-block";
		if (!mobile){document.getElementById('quickstart-button').style.display = "inline-block"};
		document.getElementById('save-button').style.display = "inline-block";
	};
	document.getElementById('challenges-container').style.display = display;
}

function disappear(thing) {
	thing.style.display = "none";
}

var studentMode = false;
var time;
var timer = document.getElementById('timer');
var score = 0;
var count = 0;
var rawText;
var listOfSentences = [];
var rand;
var rainbowMode = false;
var wordsArray = [];
var wordChunksArray = [];
var jumbledSentence = [];
var sentenceString = '';
var answerBox = document.getElementById('answerbox');
var answerSentence = document.getElementById('answersentence');
var answer;
var previousSentences = document.getElementById("previous-sentences-div");
var wordsToUndo =[];
var undoHistory =[];
var indexOfBlank;
var wordsEntered = 0;   //number of words that have been clicked so far
var strikes = 3;
var wordChunkSize = 5; 
var clozeSentence = [];
var clozeWords = [];
var randomMode = false;
var readingMode = false; //mode to keep sentences on the screen after they've been completed
var articleList = ['a','an','the'];
var prepList = ['in','at','on','for','of','with','out','to','from'];
var grammarList = [];
var clickedDivs = [];
var undoCount = 0;
var skip = false;
var dataSource = "wikipedia";
var searchTerm;
var language = "simple";
var learningMode;
var foundArticle = false;
var progress = 0;
var progressBoxOuter = document.getElementById('progress-box-outer');	
var progressBoxInner = document.getElementById('progress-box-inner');
var windowWidth = window.innerWidth;
var imageDiv;
var imageContainer;
var imageVisible = false;
var finishedSentences = 0;
var needToCheckRadios = true;
var needToLoadPresetText = true; //not loaded yet
var winScreen;
var reviewScreen;
var youWon;
var tryAgain;
var saved;
var existingData;
var presetTexts = [];
var printingWorksheet = false;

//for research mode:
var correctSentences = [];
var failedSentences = [];
var username;
// (no game over or strikes in research mode)



var loadScreen;
var undoButton = document.getElementById("undo-button");
var skipButton = document.getElementById("skip-button");
var quitButton = document.getElementById("quit-button");
var statusBar = document.getElementById("status-bar");
var saveScreen = document.getElementById("save-screen");

	//set up stuff:
	undoButton.addEventListener("click", undo);
	skipButton.addEventListener("click", ready);
	quitButton.addEventListener("click", resetApp);
	if (researchMode) {
		var txt = "Save & Quit";
		quitButton.innerHTML = txt;
		document.getElementById("main-menu-button").innerHTML = txt;
	};
	document.getElementById("main-menu-button").addEventListener("click", resetApp);
	document.getElementById("try-again-button").addEventListener("click", function() {
		tryAgain = true;
		resetApp();
	});
	document.getElementById("back").addEventListener("click", goToStartScreen);
	document.getElementById('start-button').addEventListener("click", runApp);
	document.getElementById('quickstart-button').addEventListener("click", function() {
		needToCheckRadios = false;
		document.getElementById('search-term').value = "tea";
		runApp();
	});
	document.getElementById('save-button').addEventListener("click", saveAndShare);

	document.getElementById("skip-button").style.display = "none";  
	statusBar.style.display = "none";

loadTxtFile("100commonwords.txt");  //load the grammarList


//figure out where to write the data for scraper mode:
var textFile;
if (!scraperMode) {textFile = 'data.json'} //usual main JSON file
else {
	textFile = 'studentmode_texts/' + level + '.json';  // beg.json, hi_beg.json, etc.
};



//Set up start screen:
function goToStartScreen() {
	$('.settings-box').css("display","none");
	$('.startscreen-box').css("display","block");
	document.querySelector('footer').style.visibility = "visible"; 
	disappear(document.getElementById('start-button'));
	disappear(document.getElementById('quickstart-button'));
	disappear(document.getElementById('save-button'));
	disappear(document.getElementById('back'));
}

goToStartScreen()

if (researchMode) { 
	disappear(document.getElementById('settings-area'));
	document.getElementById('start-text').innerHTML += "Please choose a text to start:"
	username = prompt("Please enter your username:");
	setTeacherStudent(true);  //skip the teacher/student select screen
} 


function setTeacherStudent(student) {

	//STUDENT MODE IS LIKE "CAMPAIGN MODE" - everything (except level and learning mode) is preset and ready to go 
	if (student) {
		studentMode = true;
		dataSource = "preset text";
		challengesPopup(true, 'studentmode_texts/int.json');  //start with this set of challenges
		if (!researchMode) {document.getElementById('studentmode-level-settings').style.display = "block"};
		if (!researchMode) {document.getElementById('learning-mode-settings').style.display = "block" }; //researchMode is only for sentence jumble activities (no cloze)
	}
	else {
		$('#settings-screen').css("display","block");
		$('.settings-box').css("display","block");
		disappear(document.getElementById('studentmode-level-settings'));
		disappear(document.getElementById('paste-div'));
		disappear(document.getElementById('challenges-container'));
		document.getElementById('start-button').style.display = "inline-block";
		if (!mobile){document.getElementById('quickstart-button').style.display = "inline-block"};
		document.getElementById('save-button').style.display = "inline-block";
	};

	//Once the user has chosen either student or teacher mode:
	$('.startscreen-box').css("display","none");
	disappear(saveScreen);
	disappear(document.getElementById('select-teacher-student'));
	document.querySelector('footer').style.visibility = "hidden"; 
	if (!researchMode) {document.getElementById("back").style.display = "block" };
}





//create popup explanations:

function createPopupExplanations(thingToHoverOver, textToPopup) {
	thingToHoverOver.addEventListener("mouseover", function() {
		document.getElementById('popup-explanation').style.visibility = "visible";
		document.getElementById('popup-explanation').innerHTML = textToPopup;
	});
	thingToHoverOver.addEventListener("mouseout", function() {
		document.getElementById('popup-explanation').style.visibility = "hidden";
	})
}

createPopupExplanations(document.getElementById('start-button'), "Start the game with the above settings.");
createPopupExplanations(document.getElementById('quickstart-button'), "Start the game with a random text and default settings.");
createPopupExplanations(document.getElementById('save-button'), "Create a game with the above settings and get a unique URL to share with students.");

createPopupExplanations(document.getElementById('wordchunk-settings'), "Choose how each sentence is split. '1' means a traditional word jumble where each word must be unscrambled.");
createPopupExplanations(document.getElementById('game-mode-settings'), "Preset sentences randomly or in order.  In 'reading mode', completed sentences stay on the screen so you can ready the next sentence in context.");
createPopupExplanations(document.getElementById('learning-mode-settings'), "Choose what kind of practice the activity should provide.");
createPopupExplanations(document.getElementById('text-source-settings'), "Select the source of text. If 'Wikipedia', also select language and search term.");
createPopupExplanations(document.getElementById('language-settings'), "(For Wikipedia text) Choose the language and search term to get an article exerpt. Case sensitive - must capitalize proper nouns!");

createPopupExplanations(document.getElementById('studentmode-button'), "Practice your English with fun sentence scramble and fill-in-the-blank games!");
createPopupExplanations(document.getElementById('teachermode-button'), "Create a customized cloze or sentence scramble activity for your students.  Choose the text, format, and more.");


//set up challenges
function loadPresetTexts(jsonFileName) {
	readOrWriteData(null, 'get all texts', null, null, null, jsonFileName);  //This will set up presetTexts array
}

function makePresetTextDivs() {  //This function gets run by readOrWriteData after presetTexts have been loaded

	if (needToLoadPresetText) {  // ifnot yet loaded
		var challengesContainer = document.getElementById('challenges-container');

			//first clear the challenges-container:
		    while (challengesContainer.firstChild) {
					challengesContainer.removeChild(challengesContainer.firstChild);
				}

			//make the preset text (challenge) divs:
		for (i=0; i<presetTexts.length; i++) {
			var challengeDiv = document.createElement('div');
			challengeDiv.setAttribute("class", "challenge");
			challengeDiv.setAttribute("id", "challenge-"+i);
			challengesContainer.appendChild(challengeDiv);

			challengeDiv.innerHTML = "<b>"+presetTexts[i][0].substr(0,40)+"...</b><br><br>( "+presetTexts[i].length+" sentences )";  //shows first 36 characters and length of text

		};

		//Once all the divs have been made, add the event listeners (must do this separately so it doesn't keep looping the creation of event listeners over just the variable challengeDiv):
		for (i=0; i<presetTexts.length; i++) {
			document.getElementById("challenge-"+i).addEventListener("click", function() {
				var index = parseInt(this.id.substr(10));  //get the number of the challenge div (same as i, but can't use i here because i is part of this FOR loop, which can't be seen by the function later on)
				rawText = presetTexts[index].join(". ");
				listOfSentences = presetTexts[index];
				runApp();
			});
		}
	};

	if (!studentMode) {needToLoadPresetText = false;} //prevent it from loading again if this radio button is unclicked and then clicked again
}



// CHECK IF SAVECODE IS SPECIFIED --------------------------

function loadSavedText() {
//If loading from saved URL, ignore all the setup stuff below; just load the text and readOrWriteData() will handle the rest
	if(needToLoadSaved == 'yes') {
		dataSource = "load";
		learningMode = 'jumble';
		needToCheckRadios = false;
		statusBar.style.display = "inline-block";
		//load up the text:
		readOrWriteData(saveCode, 'read one text', null, null, null, textFile); //this sets existingData.  saveCode tells which array in the array of arrays in the JSON file.  This array will be set as listOfSentences.
		console.log("Loaded text from JSON file.");
	} else{
		console.log("Didn't load text; settings must be chosen.");
	};
}

loadSavedText();
// ----------------------------------------------------


//Set up the "save & share" option:
//pass parameters through the URL like this: ?name=brendon&hair=brown

function saveAndShare() {  //save the text you chose and spit out a URL to share with others
	
	saved = true;  //Let's it know that it's been saved, so savedScreen can be removed later

	saveCode = randomColor().split("#")[1];  //get random string without the #
	var urlToShare = location.protocol + '//' + location.host + location.pathname + "?loadsavedtext=yes" + "&savecode=" + saveCode;
	var urlField = document.getElementById('saved-url-field');
//	urlField.type = "text";
//	urlField.size = 60;
//	urlField.style.fontSize = "26px";
//	urlField.id = "saved-url-field";
	urlField.value = urlToShare;

//	var saveScreen = createScreen("<br><br><br><h2>Share this link to your saved TextMix:</h2><br><br>");
	$('#settings-screen').css('display','none');
	$('#save-screen').css('display','block');
//	document.body.appendChild(saveScreen);

	urlField.onclick = function() {
		this.select();
		document.execCommand('copy');
		var p = document.createElement('p');
		p.innerHTML = "<h2>Copied to clipboard</h2>";
		saveScreen.appendChild(p); 
	}

	console.log("new saveCode = " + saveCode);
	console.log("URL = " + urlToShare);

	getSettings();


	function writeWikiText() { //after wikiSearch is complete, run this as callback function.
		rawText = document.getElementById("hidden-text-div").textContent;
		listOfSentences = document.getElementById("hidden-text-div").textContent.split('. ');
		readOrWriteData(saveCode, "write", randomMode, wordChunkSize, listOfSentences, textFile);
	}


	if(dataSource == "wikipedia"){
		searchTerm = document.getElementById('search-term').value;
		wikiSearch(searchTerm, language, "hidden-text-div",	writeWikiText);
	} 
	else {
		getText();  //run everything except getOneSentence() and makeDivs().  This will set up listOfSentences.
		//finally, write the listOfSentences array to JSON file:  saveCode tells which array in the array of arrays in the JSON file.  This array will be set as listOfSentences.
		readOrWriteData(saveCode, "write", randomMode, wordChunkSize, listOfSentences, textFile);
	};


	document.getElementById('play-now').addEventListener("click", function() {
		window.location.href = urlToShare;   // go to the link just created
	});

	$("#back-button-container").appendChild(playNowButton);
}



function printWorksheet() {

	printingWorksheet = true;

	var worksheetData;

	if (learningMode == 'jumble') {worksheetData = "<h3>Name: _______________________</h3><h3><b>Directions:&nbsp;</b>Reorder the words to make a sentence.</h3>"}
	else {worksheetData = "<h3>Name: _______________________</h3><h3><b>Directions:&nbsp;</b>Write the correct word in each blank.</h3>"};

	

	for (j=0; j<listOfSentences.length; j++) {

		prepareSentence();  // this sets up jumbledSentence!

		//for jumble mode:
		if (learningMode == 'jumble') {

			var wordChunk;
			var item ='';
			var wordBank = '';

			for(i=0; i<jumbledSentence.length; i++) {
				wordChunk = jumbledSentence[i].join(" ");  
				item += wordChunk + "  /  ";
			};

			worksheetData += (j+1) + ".  " + item + "<br><br>________________________________________________________<br><br>";
		}
		//for cloze mode:
		else {
			item = clozeSentence.join(" ");
			
			if (jumbledSentence != undefined) {  //as long as there are articles in the sentence
				for(i=0; i<jumbledSentence.length; i++) {
					wordBank += jumbledSentence[i] + "&nbsp;&nbsp;&nbsp;&nbsp;";
				}
			}
			worksheetData += (j+1) + ".  " + item + "<br><br>" + wordBank + "<br><br>";
		}

		count ++ ;  // loop through listOfSentences
	}

	var newWindow = window.open();
	newWindow.document.write(worksheetData);
}



function goToLoadScreen() {

	loadScreen = createScreen("<br><br><br><h2>Are you ready?</h2><br><br>");
	loadScreen.id = "load-screen";
	document.body.appendChild(loadScreen);
	var loadStartButton = document.createElement('div');
	loadStartButton.className = "launcher-button";
	loadStartButton.innerHTML = "START";
	loadStartButton.addEventListener("click", function() {

		disappear(document.getElementById("settings-screen"));

		$("#load-screen").fadeOut(500, function () {
			disappear(document.getElementById("load-screen"));
		});  

		setInterval(incrementTime, 1000);
	});
	
	loadScreen.appendChild(loadStartButton);

}



function getSettings() {
	//check the radio button settings:
	if(needToCheckRadios) {
		if (studentMode) {
			checkRadio('studentmode-level')
			checkRadio('learning');
		}
		else {
			checkRadio('randomize');
			checkRadio('wordchunk-size');
			checkRadio('datasource');
			checkRadio('language');
			checkRadio('learning');
		}
	};

	if(document.getElementById("timer-checkbox").checked == false || studentMode) {
		timer.style.display = "none";
	}
}

//set game settings based on radio buttons:
//set the corresponding setting variable
//this is 'DRY' CODING RIGHT HERE!!!
//can easily add new radio game settings here!
function checkRadio(radioName) {
	var choices = document.getElementsByName(radioName);
	for (i=0; i<choices.length; i++) {
		if (choices[i].checked == true) {  //if radio button selected


			if(radioName == "randomize") { 
				if (choices[i].value == 'yes') {
					randomMode = true;
				}
				else if (choices[i].value == 'no') {
					randomMode = false;
				}
				else { //if reading mode is checked
					readingMode = true;
				}
			}	
			else if (radioName == "wordchunk-size") {
				wordChunkSize = parseInt(choices[i].value); //radio btn values can only be strings
			}
			else if (radioName == "studentmode-level") {
				randomMode = false;
				wordChunkSize = parseInt(choices[i].value) + 1;
				switch(parseInt(choices[i].value)) {
					case 5:
						challengesPopup(true, 'studentmode_texts/beg.json');
					break;
					case 4:
						challengesPopup(true, 'studentmode_texts/hi_beg.json');
					break;
					case 3:
						challengesPopup(true, 'studentmode_texts/int.json');
					break;
					case 2:
						challengesPopup(true, 'studentmode_texts/hi_int.json');
					break;
					case 1:
						challengesPopup(true, 'studentmode_texts/adv.json');
					break;
					default: alert("error");
				}
			}
			else if (radioName == "datasource") {
				dataSource = choices[i].value;
			}
			else if (radioName == "learning") {
				learningMode = choices[i].value;
				if (choices[i].value != 'jumble') {
					wordChunkSize = 1; //if articles or prepositions, set the word group size to 1
				}

			}
			else {
				language = choices[i].value;
			};
		} ;
	};
};


function runApp() {

		searchTerm = document.getElementById('search-term').value;
		if (dataSource=='wikipedia' && searchTerm == ''){
			alert('Please enter a search term!');
			return;
		}

		if (needToLoadSaved == "yes") {  //if ready() and getText() have already been run via  make_text_file.js
			goToLoadScreen()
		} 
		else {  //need to get text via getText() below
			$("#settings-screen").fadeOut(500, function () {
				disappear(document.getElementById("settings-screen"));
			});

			if (timer.style.display != "none" || researchMode) {  //as long as the timer is turned on, or secretly time them in researchMode
				setInterval(incrementTime, 1000);
			};

			statusBar.style.display = "inline-block";

			getText();
		}		
}
									
                                         
function cleanSentence(sentence) {        
	try {	//if there aren't any periods or newlines to replace, this prevents an error 
		if (finishedSentences == listOfSentences.length - 1) { //if the last sentence is coming up
			sentence = sentence.replace(".",""); //remove any period at the end of the sentence (if it's the last sentence, this period won't have been removed by split('.'))
		}
		sentence = sentence.replace(".\n",".");
		sentence = sentence.replace( /[\r\n]+/gm, ""); //replace all carriage returns, etc.
	} catch{};        //Note: double spaces after period are already removed via cleanText() in wikipedia_fetcher.js

	return sentence;
}


function getOneSentence() {

	if(dataSource == "wikipedia" && needToLoadSaved != "yes"){  //a.k.a. if we still need to send a request to wikipedia API
		//hidden-text-div is where wikiSearch put the text
		listOfSentences = document.getElementById("hidden-text-div").textContent.split('. ');
	};

	//if source is not wikipedia, listOfSentences was already set by getText()

	if(randomMode) {
		rand = Math.floor(Math.random() * listOfSentences.length);
		sentenceString = listOfSentences[rand];
	} else {
		sentenceString = listOfSentences[count];

	};
	cleanSentence(sentenceString);
	return sentenceString;
}

function prepareSentence() {  //what to do with the sentence once it done been got!

	try{
		wordChunksArray = getOneSentence().split(' ');
	} catch{};

	wordsArray = wordChunksArray;  //get the list of words before they're chunked, for setting font size on mobile later

	if (learningMode!= 'jumble') { makeClozeSentence() }  //if cloze mode

	else {  //if normal word jumble (jumble) learning mode
		console.log('Run as normal word jumble, no need to make cloze sentence.');  

		wordChunksArray = chunkArray(wordChunksArray, wordChunkSize);  // Split up into word groups/chunks.  This is an array of arrays (chunks of words) in CORRECT ORDER.  Each array has a number of words equal to wordChunkSize.
		jumbledSentence = shuffle(wordChunksArray);   //mix up the arrays within the array
	}
};


function makeClozeSentence() {
	foundArticle = false;
	wordChunksArray[wordChunksArray.length-1] += '.';  //add period to last word

	if (!printingWorksheet && count < listOfSentences.length-2) {  //as long as there are still 2 sentences left to get
		count++;  //get 2 sentences instead of 1 (better for articles, prepositions, etc)
		finishedSentences++;
		wordChunksArray = wordChunksArray.concat(getOneSentence().split(' '));
		wordChunksArray[wordChunksArray.length-1] += '.';
	};

	clozeSentence = [];  //reset it after completing a sentence
	clozeWords = [];

	for (i=0; i<wordChunksArray.length; i++) {

		if (learningMode=='articles' && articleList.includes(wordChunksArray[i]) || learningMode=='prepositions' && prepList.includes(wordChunksArray[i]) || learningMode=='grammar' && grammarList.includes(wordChunksArray[i])) {  //if the word is an article/preposition
			clozeWords.push(wordChunksArray[i]); //these will be the word divs to click
			clozeSentence.push("_____"); //add a blank to the new clozeSentence array
			//this will be the sentence with blanks, added to the answerbox later
			foundArticle = true;
		} else{  //if not an article
			clozeSentence.push(wordChunksArray[i]) //add the word to the new clozeSentence array
		}
	}

	jumbledSentence = shuffle(clozeWords);
}


//must wait until Ajax is done getting Wikipedia text to run the following:
//(it's the callback function of wikiSearch)
function ready() {
	if (skip) {
		count++; 
		// do these things no matter which learning mode:
		skipButton.style.display = "none";
		undoButton.style.display = "inline-block";  //put back undo button (was removed by addSkipButton())
		wordsEntered ++;
		checkAnswer();
		skip = false;
	};
	prepareSentence();
	makeDivs();
}



function loadTxtFile(filename) {
//If loading from a txt file on computer
	var req = new XMLHttpRequest();
	req.open("GET", filename, true);
	req.send();
	var list;
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
			console.log('Loaded ' + filename);
			grammarList = this.responseText.split(' ');
		};
	};		
}



function getText() {

	getSettings();

	switch(dataSource) {

		case "preset text":
			//Do nothing - listOfSentences was already set up via loadPresetTexts()
			ready();
			break;

		case "wikipedia":
			var searchTerm = document.getElementById('search-term').value;
			wikiSearch(searchTerm, language, "hidden-text-div", ready);
			break;

		case "paste":
			rawText = document.getElementById('paste-input').value.replace(/.  /g, ". ");  //remove double spaces
			listOfSentences = rawText.split(/(?<!Mr|Mrs|Dr|Prof)\.\s|\."\s/);  //regex negative lookbehind
			ready();
			break;

		default:   //if user chose to use the preset string of sentences
			rawText = preMadeList;
			listOfSentences = preMadeList.split(". ");
			ready();
	};	
};

	/*JAPANESE VERSION (DOESN'T WORK):
		listOfSentences = document.getElementById("hidden-text-div").textContent.split("。");
		//split again by Japanese comma
		for (i=0; i<listOfSentences.length; i++) {

			var furtherSplit = listOfSentences[i].split("、");
			listOfSentences.splice(i);  //take out original sentence

			for (w=0; w<furtherSplit.length; w++) {
				listOfSentences.push(furtherSplit[w]);   //add back in newly split sentences
			};

		};
	};  */

function undo() {

	if (undoCount>0) {

		answerSentence.innerHTML = undoHistory[undoCount-1];  // undo by returning to the last answerSentence
		undoHistory.splice(undoHistory.length-1, 1);  //remove the last entry from undoHistory

		clickedDivs.splice(clickedDivs.length-1, 1);  //erase the undone word(s) from clickedDivs
		document.getElementById(wordsToUndo[wordsToUndo.length-1]).style.visibility = "visible";   //bring the last clicked word div back (its ID will be the last item in the wordsToUndo array)
		wordsToUndo.splice(wordsToUndo.length-1, 1);  //delete the undone word from wordsToUndo array

		wordsEntered --;
		undoCount --;
		console.log("undoCount = " + undoCount)	;
	}	else {console.log("Nothing to undo.")};
}


function addSkipButton() {
	skipButton.style.display = "inline-block"
	undoButton.style.display = "none";
	skip = true;
}




function makeDivs() {

	if (!researchMode) { time = 60 }
	else {time = 0};

	//reset stuff:
	answerBox.style.backgroundColor = 'white';
	answerSentence.style.backgroundColor = 'white';
	answerSentence.style.color = '#4286f4';
	undoHistory = [];
	if(wordChunksArray.length>1) {  //no need for undo button if only one word-div to click
		undoButton.style.display = "inline-block";
	}
	undoCount = 0;
	clickedDivs = [];

	//for mobile, make font smaller if many words
	if(mobile && wordsArray.length > 20) {  
		answerBox.style.fontSize = "26px"; 
	} else if(mobile && wordsArray.length > 30) {
		answerBox.style.fontSize = "20px"; 
	} else {
		answerBox.style.fontSize = "32px"; 
	};


	if (imageVisible) {
		answerBox.removeChild(imageContainer);
		imageVisible = false;
	};

	if (readingMode) {  //move the just-completed sentence to Previous Sentences before deleting answerSentence.innerHTML
		previousSentences.style.display = "block";
		previousSentences.innerHTML += " " + answerSentence.innerHTML;
	};
	
	answerSentence.innerHTML = '';
	
	$('.word-div').remove();   //clear all the word divs from the last round (also could do w/o JQuery)

	// If the sentence has no articles/prepositions/grammar words, create skip button (cloze modes only):
	if(learningMode != 'jumble' && !foundArticle) { addSkipButton() };


	wordsEntered = 0;

	// Display the cloze sentence:
	if (learningMode != 'jumble') {  // If cloze mode
		for(i=0; i<clozeSentence.length; i++) {  //clozeSentence is an array - must loop through to put each word in answer box as a string (or else it will show up with commas if set to innerHTML)
			answerSentence.innerHTML += clozeSentence[i] + ' ';
		};
		answerSentence.innerHTML = answerSentence.innerHTML.slice(0,answerSentence.innerHTML.length-1);//remove space at end
	}

	var wordChunkString = '';
	var noOfChars;  //for counting the letters in a word div, to shrink font size if needed


	//create the word divs:
	for(i=0; i<jumbledSentence.length; i++) {

		var div = document.createElement('div');

		var wordChunk = jumbledSentence[i];  //if cloze mode, then jumbledSentence is actually word bank to fill in blanks.  Instead of making divs from the words IN the sentence, only use the words REMOVED from the sentence (Articles, prepositions, etc.)

			
		//Find how many characters long the wordchunk is (not how many words)
		wordChunkString = '';
		for (c=0; c<wordChunk.length; c++) { wordChunkString += wordChunk[c] };
		noOfChars = wordChunkString.length;

		 //Shrink font size on mobile if many word divs OR many letters in a particular div
		if(mobile && learningMode=='jumble' && jumbledSentence.length > 5 || noOfChars > 22) { 
			div.setAttribute('class','word-div small-word-div');  
		} else {
			div.setAttribute('class', 'word-div');
		};
		
		div.setAttribute('id', 'word-' + i);

		 
		for (j=0; j<wordChunk.length; j++) {     
			if (learningMode == 'jumble') { 
				div.innerHTML += wordChunk[j] + " "; //add spaces between groups of words (not needed in cloze mode)
			} else { 
				div.innerHTML += wordChunk[j];
			}
		};
		
		div.addEventListener('click', clickedWord); 

		document.getElementById('word-div-container').appendChild(div);
	};

	
};


function clickedWord() {   //When you click a word/words

	answerSentence = document.getElementById('answersentence');  //get the current status of the answer

	wordsToUndo.push(this.id);
	undoHistory.push(answerSentence.innerHTML);  // save the sentence BEFORE blank is filled
	undoCount ++;  
	console.log("undoCount = " + undoCount)	;				
	clickedDivs.push(this.innerHTML);  //puts the clicked word(s) into an array
	

	if (learningMode != 'jumble') {  //if cloze mode:
		answerSentence.innerHTML = answerSentence.innerHTML.replace('_____', this.innerHTML);  //replace the FIRST blank with the clicked word
	}
	else {  //if normal word jumble (jumble) mode:
		answerSentence.innerHTML += clickedDivs[undoCount-1];  //add the word(s) to answerSentence
	}

	// do these things no matter which learning mode:
	if (mobile && jumbledSentence.length>7) {  //on mobile, make words reposition to fit after disappearing
		$(this).css('display', 'none');
	} else {
		$(this).css('visibility', 'hidden');
	}
	

	wordsEntered ++;

	if(wordsEntered == jumbledSentence.length) {   //if all the words in the senetence have been entered
		checkAnswer();
	}
};


function checkAnswer() {

		answer = answerSentence.textContent;  //must use innerText, not innerHTML because &nbsp characters sometimes come up in wikipedia - innerText just renders them as normal spaces

		// IF CORRECT   (cloze modes do not add an extra space at the end)
		if(answer == sentenceString + ' ' || answer == wordChunksArray.join(" ") && learningMode!='jumble' || skip==true) {  //if you're skipping this last sentence, automatically win, don't even check for correctness
			correctAnswer();
		}
		else { wrongAnswer() }; 
	};

function correctAnswer() {

	if (!skip) {
		answerSentence.innerHTML = answer.substr(answer[0],answer.length-1) + '.'; //add period to the end.  Skip will have already added one.
	}

	//Inrease score:
	if (!researchMode) {score += wordChunksArray.length * time}
	else {score += wordChunksArray.length * 100};
	finishedSentences ++;
	correctSentences.push(answer);
	document.getElementById('score-box').innerHTML = "Score: " + score;	

	//Record if research mode:
	if (researchMode) { recordForResearch(username, sentenceString, null, time) };
	
	//Increase progress meter:
	var totalSentences = listOfSentences.length;
	progress = Math.floor(100*(finishedSentences / totalSentences));
	document.getElementById('progress-box-outer').innerHTML = "Progress: " + progress + "% <div id='progress-box-inner'></div>";
	var width = document.getElementById('progress-box-outer').offsetWidth;
	document.getElementById('progress-box-inner').style.width = (progress/100)*width + "px";

	if (progress == 100) {   // all sentences are finished - YOU WIN!
		win();
		return;  //stop reading this block of code (stuff below is for if you've not yet won the game)
	};

	if (rainbowMode) {
		changeScreenColor();				
	};

	// if not won yet, get the next sentence(s):
	if (randomMode) {
		listOfSentences.splice(listOfSentences.indexOf(sentenceString), 1);  //remove the sentence so it doesn't come up again
	} else {
		count ++   //move to the next sentence in listOfSentences (only if randomMode is off)
	};

	prepareSentence();
	displayCharacter();
	setTimeout(makeDivs, 1000);  //Wait a sec before you get the next sentence
}


function wrongAnswer() {

	if (!researchMode) {strikes -- };

	//Record if research mode:
	if (researchMode) { recordForResearch(username, null, sentenceString, time) };

	failedSentences.push(answer);
	answerBox.style.backgroundColor = 'red';
	answerSentence.style.backgroundColor = 'red';
	answerSentence.style.color = 'white';
	answerSentence.innerHTML = "Sorry, try again!<br><br>";
	
	if (!researchMode){
		if (strikes>1) {answerSentence.innerHTML += strikes + " tries left"}
		else {answerSentence.innerHTML += strikes + " try left"};
	}

	score = 0;  //score gets reset if wrong answer
	document.getElementById('score-box').innerHTML = "Score: " + score;	

	if (!researchMode && strikes == 0) {  // 3 strikes and you're out!
		gameOver();
	} else {
		setTimeout(makeDivs, 1500);  //try the sentence again)
	};
}



function showCorrectAnswer() {
	if (learningMode !='jumble') {
		answerSentence.innerHTML = wordChunksArray.join(" ");
	} else {
	answerSentence.innerHTML = sentenceString;
	}
}


function gameOver() {
	showCorrectAnswer();
	disappear(undoButton);
	disappear(statusBar);
	$("#game-over-bar").css("display", "block");
	$("#game-over-message").css("display", "block");
	$(".reset-button").css("display", "inline-block");
}


function resetApp() {
	// reset research Mode variables:
	correctSentences = [];
	failedSentences = [];

	//reset variables:
	saved = false;
	score = 0;
	strikes = 3;
 	count = 0;
 	skip = false;
 	wordsEntered = 0;
 	undoCount = 0;
 	finishedSentences = 0;
 	needToCheckRadios = true;
	sentenceString = '';
    wordsToUndo =[];
    clickedDivs = [];
	progress = 0;
	previousSentences.style.display = "none";
	statusBar.style.display = "none";
	answerBox.style.backgroundColor = 'white';
	answerSentence.style.backgroundColor = 'white';
	answerSentence.style.color = '#4286f4';

	progressBoxOuter.innerHTML = "Progress: 0% <div id='progress-box-inner'></div>";
	progressBoxInner.style.width = 0;
	
    document.getElementById('answersentence').innerHTML = '';
    skipButton.style.display = "none";
    undoButton.style.display = "inline-block";

	if (youWon) {
		document.body.removeChild(winScreen);
		document.body.removeChild(reviewScreen);
		youWon = false;
	} else {
		$("#game-over-bar").css("display", "none");
		$("#game-over-message").css("display", "none");
		$(".reset-button").css("display", "none");
	};

	if (tryAgain) {
		tryAgain = false; //reset it
		statusBar.style.display = "inline-block";
		ready();
		return; //don't do any of the below stuff
	};

	if (dataSource == 'load'){
		disappear(loadScreen); //document.body.removeChild(loadScreen);
	};

	if (saved){
		disappear(saveScreen); //document.body.removeChild(saveScreen);
	};
	
	document.getElementById('paste-input').value = "";
	document.getElementById('search-term').value = "";  
	document.getElementById('settings-screen').style.display = "block";
	timer.style.display = "inline-block";
	
}


function createScreen(innerHtml) {
	var screen = document.createElement("div");
	screen.className="screen";
	screen.innerHTML = innerHtml;
	return screen;
}


function win() {
	youWon = true;

	statusBar.style.display = "none";

	var victoryImageFile = "images/victory" + Math.floor(Math.random()*5+1) +".gif";
	var victoryImageDiv = document.createElement("div");
	
	victoryImageDiv.className = "victory-image-div";
	//victoryImageDiv.style.height = "400px";
	victoryImageDiv.style.background = "url('" + victoryImageFile + "')";
	victoryImageDiv.style.backgroundSize = "contain";
	victoryImageDiv.style.backgroundRepeat = "no-repeat";

	var winScreenHtml = "<img src='images/congrats.png' height=200px/><br><h2>You completed</h2><h1>" + listOfSentences.length + "</h1><h3>sentences.</h3><br>";
	winScreen = createScreen(winScreenHtml);
	winScreen.addEventListener("click", goToReviewScreen);
	document.body.appendChild(winScreen);

	var victoryImageContainer = document.createElement("div");
	victoryImageContainer.className = "victory-image-container";
	victoryImageContainer.appendChild(victoryImageDiv);
	winScreen.appendChild(victoryImageContainer);

}


function goToReviewScreen() {
	answerSentence.innerHTML = sentenceString;
	disappear(winScreen);
	reviewScreen = createScreen("<h2>Here is the text you read:</h2>");
	reviewScreen.addEventListener("click", resetApp);
	reviewScreen.id = "review-screen";
	document.body.appendChild(reviewScreen);

	reviewScreen.innerHTML += rawText;
//	for (i=0; i<listOfSentences.length; i++) {
//		reviewScreen.innerHTML += listOfSentences[i] + ". ";
//	};

	reviewScreen.addEventListener("click", resetApp);
}


addEventListener('keydown', function(event) {   //Press Enter to start
	if (event.keyCode == 13) {
		runApp();
	};
});


//Generate random background colors:

function randomColor() {
        var alphabet = "a b c d e f 0 1 2 3 4 5 6 7 8 9".split(" ");
        var hex1 = alphabet[Math.floor(Math.random()*alphabet.length)];
        var hex2 = alphabet[Math.floor(Math.random()*alphabet.length)];
        var hex3 = alphabet[Math.floor(Math.random()*alphabet.length)];
        var hex4 = alphabet[Math.floor(Math.random()*alphabet.length)];
        var hex5 = alphabet[Math.floor(Math.random()*alphabet.length)];
        var hex6 = alphabet[Math.floor(Math.random()*alphabet.length)];
        var colorHex = "#" + hex1 + hex2 + hex3 + hex4 + hex5 + hex6;
        return colorHex;
}

function changeScreenColor() {
	var color = randomColor();
	document.body.style.backgroundColor = color;
	document.getElementById('word-div-container').style.backgroundColor = color;
}

function incrementTime() {
//Game over if time runs out:
	if (researchMode) {time ++}
	else {
		if (time == 0) {
		//stop decreasing time
		//$("#game-over-bar").css("display", "block");
		//setTimeout(resetApp, 2000);
		}	
		else {
			time --;
			timer.innerHTML = "Time: " + time; 
		}
	}
}	

function displayCharacter() {
	var imageFile = "images/playing" + Math.floor(Math.random()*6+1) +".gif";
	imageDiv = document.createElement("div");
	imageContainer = document.createElement("div");
	var message = document.createElement("div");

	message.innerHTML = "GREAT!";
	message.id = "message";

	imageContainer.className = "image-container float-right";
	
	imageDiv.className = "character-div";
	imageDiv.style.height = "200px";
	imageDiv.style.background = "url('" + imageFile + "')";
	imageDiv.style.backgroundSize = "contain";
	imageDiv.style.backgroundRepeat = "no-repeat";

	imageContainer.appendChild(imageDiv);
	imageContainer.appendChild(message);

	answerBox.appendChild(imageContainer);

	if (!mobile) {  //desktop
		$(imageContainer).animate({left: '1000px'}, 300);
	}
	else { //mobile
		$(imageContainer).animate({left: '100px'}, 300);
	}

	imageVisible = true;
}



//a premade string for testing:
const preMadeList = "A library is a great blessing. A library is said to be the storehouse of culture. The various books by the different authors and poets form a library. A society is known by the number of good libraries it has. Man\'s craving for knowledge is eternal. Libraries preserve various types of old and new books. There are also periodicals and daily papers to meet the demands of the people. In all ages, libraries have been considered the best medium of public instructions. An academic library is an essential part of an educational institution. It plays an important role in schools, colleges and universities. The books are issued to the students in term of weekly, fortnightly or monthly basis. Generally a reading-room is attached to this library for reading. In a library we get books on different subjects. There are books on literature, on history, hygiene, science and arts. A library is essential to the cultural progress of a country. It helps the country to fight illiteracy. It is an aid to research work and teaching. It satisfies a thirst for education. It is a boon to the poor and the middle class people. A civilized man cannot do without the library. Circulating libraries should be established in rural areas to fight illiteracy. As libraries spread education, every village and town should have one.";



//JQuery version of AJAX request::

/*
const getText = function() {

	$.get('sentences.txt', function(data){})

    .then(data => {	  // use this format to run function only after json get is done (since it's async)
    				  // "data" is the contents of the text file
		listOfSentences = data.split('\n');
		console.log('Made sentence array');
		prepareSentence();
		makeDivs();

 	});

	makeDivs();

};
*/

//To use a list of senences in Excel:
//first convert list of sentences to JSON with this website: http://www.convertcsv.com/csv-to-json.htm
//make sure to choose "CSV to JSON Array" at the bottom

