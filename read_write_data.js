	//First, make sure ajax doesn't load the old json data from the cache:
jQuery.ajaxSetup({
	cache: false
});

function readOrWriteData(saveId, readOrWrite, randMode, chunkSize, text, fileName) {
//The arguments of this getdata() function must be named differently from the variables saveCode, randomMode, etc.
	//Step 1: get the existing data
	$.ajax({
	    type : "GET",
	    url : fileName,
	    async : true,  //need this so it waits for writeData() to update the json data file
	    dataType : 'json',
	    success : function(response) {
	    	console.log("Read data successfully.");
	    	existingData = response;  //existingData (JSON file) is an array of objects
	//    	console.log("existingData = " + existingData);

	    	if (readOrWrite == 'write') { //if this function is used to write

	    		var newObj = Object.create(null);  //Creating a new object w/ an array of sentences to add to the JSON file - null means no prototype for the object; not basing it off any other bject
	    		newObj.saveCode = saveId;
	    		newObj.randomMode = randMode;
	    		newObj.wordChunkSize = chunkSize;	
	    		newObj.textArray = text;
	    		newObj.level = levelName;
	    		if (scraperMode) {newObj.title = newTitle}
	    		else             {newObj.title = text[0].substr(0,20) + "..."}; //just set the title to first 20 characters
	    		existingData.push(newObj);  //Step 2: push new data:
	    		writeData(fileName);  //only run this once the getData() AJAX is finished

	    		if (scraperMode) {
	    			document.getElementById("scraper-message").innerHTML = "<br><br>This file now contains " + existingData.length + " texts";
	    		}
	    	}
	    	else if (readOrWrite == 'read one text') {  //if this function is used only to read

	    		//find the text with the right savecode:
		    	for (i=0; i<existingData.length; i++) {
				    if (existingData[i].saveCode == saveCode) {
				    	//load up the settings:
				    	listOfSentences = existingData[i].textArray;  //index is which array in the array of arrays in the JSON file.  This array will get set as listOfSentences
	    				wordChunkSize = existingData[i].wordChunkSize;
				        randomMode = existingData[i].randomMode;
						console.log("Success! listOfSentences = " + listOfSentences);
				    };
				};
				ready();  //start the game (makes the word divs, etc.)
				runApp(); // shove the load screen in front of everything until user is ready to press "START"
	    	}
	    	else if (readOrWrite == 'get all texts') {  //If we're just loading the texts to populate the preset challenges divs
	    		presetTexts = [];  //reset these    

	    		if (researchMode) {  // (researchMode json files (from BreakingNewsEnglish) have a different structure, so need separate directions for iterating)
	    			for (i=0; i<existingData.listOfTexts.length; i++) {
	    				presetTexts.push(existingData.listOfTexts[i].text);
	    			}
	    		}
	    		else { 
		    		for (i=0; i<existingData.length; i++) {
		    			presetTexts.push(existingData[i].textArray);
		    		}
		    	}

	    		makePresetTextDivs();  //need to include this here instead of index.html as callback function, can only be run once the presetTexts have been laoded
	    	}
	    	else{};
	    }
	});
}

	
function writeData(fileName) {	

	//Step 3: post the newly updated existingData back to public_saved_texts.json:
	$.ajax({
	    type : "POST",
	    url : "save.php",
	    async : true,  //haven't checked if I actually need this
	    data : {
	    	json : JSON.stringify(existingData),  //When sending data to a web server, the data has to be a string (serialized).
	    	filename: fileName  //I just set these 2 data variables (json & filename) to send to PHP as arguments
	    }  
	});

	console.log("Wrote data successfully.");
};




//For research mode:

function recordForResearch(user, correctSentence, failedSentence, totalTime) {
	$.ajax({
	    type : "GET",
	    url : 'research_data.json',
	    async : true,
	    dataType : 'json',
	    success : function(response) {

	    	existingData = response;  //existingData (JSON file) is an array of user objects

	    	var userFound = false;
	    	var totalSentences;

	    	//see if the user already exists:
	    	for (i=0; i<existingData.length; i++) {
	    		if (existingData[i].username == user) { 
	    			userFound = true;
	    			console.log("User found");
					if (correctSentence != null) { existingData[i].correctSentences.push(correctSentence) };
	    			if (failedSentence != null) { existingData[i].failedSentences.push(failedSentence) };
	    			existingData[i].noOfCorrectSentences = existingData[i].correctSentences.length;
	    			existingData[i].noOfFailedSentences = existingData[i].failedSentences.length;
	    			totalSentences = existingData[i].noOfCorrectSentences + existingData[i].noOfFailedSentences;
	    			existingData[i].playTimeMinutes += (totalTime/60);
	    			existingData[i].avgSecondsPerSentence = (existingData[i].playTimeMinutes*60) / totalSentences;
	    		}
	    	}
			//if user doesn't exist, make new object for this user:
	    	if (!userFound) {
	    		console.log("User not found");
	    		var newObj = Object.create(null);
	    		newObj.username = username;  //This is from the username global variable in main textmix.js file
	    		newObj.correctSentences = [];
	    		newObj.failedSentences = [];

				if (correctSentence != null) { newObj.correctSentences.push(correctSentence) };
    			if (failedSentence != null) { newObj.failedSentences.push(failedSentence) };	
    			newObj.noOfCorrectSentences = newObj.correctSentences.length;
    			newObj.noOfFailedSentences = newObj.failedSentences.length;
    			totalSentences = newObj.noOfCorrectSentences + newObj.noOfFailedSentences;
    			newObj.playTimeMinutes += (totalTime/60);
    			newObj.avgSecondsPerSentence = (newObj.playTimeMinutes*60) / totalSentences;	

	    		existingData.push(newObj); 
	    	}

	   		writeData('research_data.json'); 
	    }
	});
};
