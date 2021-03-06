

	function cleanText(txt) {
		try {	//if there aren't any periods or newlines to replace, this prevents an error 
			txt = txt.replace(".  ",". "); //standardize # of spaces after period to one
			txt = txt.replace(".\n",". "); 
			txt = txt.replace( "/[\r\n]+/gm", "" ); //replace all carriage returns, etc.
		} catch{}; 

		return txt;
	}


	function newsSearch(divId, doThisNext) {  //gets news headlines

		//divId is div where you want the results displayed
		//doThisNext is the function that should run only after this AJAX is complete

		var req = new XMLHttpRequest();
		var url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=4d1262ee50524d939219e08e02a6ff3a";
		req.open("GET", url, true);
		req.send();

		req.onreadystatechange = function() {
			if(this.readyState==4 && this.status==200) {

				var data = JSON.parse(this.response);  //data is in string form so convert to json object

				var headlinesList = [];
				for (i=0; i<data.articles.length; i++) {
					if (data.articles[i].description != null || data.articles[i].description == '') { 
						headline = cleanText(data.articles[i].description);
						headline = headline.split(/(?<!Mr|Mrs|Dr|Prof)\.\s|\."\s|\?\s/)[0];  //check if there are multiple sentences and only get the first one (usually the 2nd is cut off)
						headlinesList.push(headline) ;
					};
				}

				console.log(headlinesList.join(". "));
				listOfSentences = headlinesList;

				//just in case:
				document.getElementById(divId).innerHTML = headlinesList.join(". ");

				doThisNext();
			};
		};
	}




