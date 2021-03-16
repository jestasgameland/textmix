

	function cleanText(txt) {
		try {	//if there aren't any periods or newlines to replace, this prevents an error 
			txt = txt.replace(".  ",". "); //standardize # of spaces after period to one
			txt = txt.replace(".\n",". "); 
			txt = txt.replace( "/[\r\n]+/gm", "" ); //replace all carriage returns, etc.
		} catch{}; 

		return txt;
	}


function newsSearch(doThisNext) {	

	$.ajax({
	    type : "GET",
	    url : "news_api_call.php",
	    async : true,  
	    dataType : 'json',
	    success : function(response) {

			var headline;
			var headlinesList = [];
			for (i=0; i<response.articles.length; i++) {
				//skip it if there's no description:
				if (response.articles[i].description != null || response.articles[i].description != '') {i++};

				headline = cleanText(response.articles[i].description);
				try {headline = headline.split(/(?<!Mr|Mrs|Dr|Prof)\.\s|\."\s|\?\s/)[0]} catch{};  //check if there are multiple sentences and only get the first one (usually the 2nd is cut off)
				headlinesList.push(headline) ;
			}

			console.log(headlinesList.join(". "));
			listOfSentences = headlinesList;

			doThisNext();

	    }
	});

};