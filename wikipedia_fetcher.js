

	function wikiSearch(searchTerm, language, divId, doThisNext) {

		//divId is div where you want the results displayed
		//doThisNext is the function that should run only after this AJAX is complete

		searchTerm = searchTerm.replace(/ /g,"%20");   //replace any spaces with "%20"

		var req = new XMLHttpRequest();
		var url = "http://" + language + ".wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + searchTerm + "&origin=*";
		req.open("GET", url, true);
		req.send();

		req.onreadystatechange = function() {
			if(this.readyState==4 && this.status==200) {
				var data = JSON.parse(this.response);
				var key = Object.keys(data.query.pages)[0];
				var text = data.query.pages[key].extract;
				if (text == undefined) {
					text = "<br><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sorry, nothing found.</p>";
				};

				document.getElementById(divId).innerHTML = text;

				doThisNext();
			};
		};
	}




