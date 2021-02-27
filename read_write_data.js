//First, make sure ajax doesn't load the old json data from the cache:
jQuery.ajaxSetup({
	cache: false
});

function readOrWriteData(saveId, readOrWrite, randMode, groupSize, text, fileName) {
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
		    	console.log("existingData = " + existingData);

		    	if (readOrWrite == 'write') { //if this function is used to write

		    		var newObj = Object.create(null);  //Creating a new object w/ an array of sentences to add to the JSON file - null means no prototype for the object; not basing it off any other bject
		    		newObj.saveCode = saveId;
		    		newObj.randomMode = randMode;
		    		newObj.wordGroupSize = groupSize;	
		    		newObj.textArray = text;
		    		existingData.push(newObj);  //Step 2: push new data:
		    		writeData(fileName);  //only run this once the getData() AJAX is finished
		    	}
		    	else if (readOrWrite == 'read one text') {  //if this function is used only to read

		    		//find the text with the right savecode:
			    	for (i=0; i<existingData.length; i++) {
					    if (existingData[i].saveCode == saveCode) {
					    	//load up the settings:
					    	listOfSentences = existingData[i].textArray;  //index is which array in the array of arrays in the JSON file.  This array will get set as listOfSentences
		    				wordGroupSize = existingData[i].wordGroupSize;
					        randomMode = existingData[i].randomMode;
							console.log("Success! listOfSentences = " + listOfSentences);
					    };
					};
					ready();  //start the game (makes the word divs, etc.)
					runApp(); // shove the load screen in front of everything until user is ready to press "START"
		    	}
		    	else if (readOrWrite == 'get all texts') {  //If we're just loading the texts to populate the preset challenges divs
		    		presetTexts = [];  //reset it
		    		for (i=0; i<existingData.length; i++) {
		    			presetTexts.push(existingData[i].textArray);
		    		}
		    		makePresetTextDivs();  //need to include this here instead of index.html as callback function, can only be run once the presetTexts have been laoded
		    	}
		    	else{};
		    }
		});
}

	
function writeData(fileName) {	
	//Step 3: post the newly updated existingData back to data.json:

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
	dataToWrite = []; //reset this for next time
};

function clearData(fileName) {  //erases everything from JSON file!

	$.ajax({
	    type : "POST",
	    url : "save.php",
	    async : false,  //haven't checked if I actually need this
	    data : {
	    	json : "[]",
	   		filename: fileName 
	    }
	});

	console.log("Data successfully cleared.");
}


