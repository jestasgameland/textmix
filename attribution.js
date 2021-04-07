// This function displays the Creative Commons attribution of texts


var attributions = {
	'beg': [
		"<a href='https://www.oercommons.org/courses/bc-reads-adult-literacy-fundamental-english-reader-1/view'>BC Reads: Adult Literacy Fundamental English Readers</a> by Shantel Ivits, Vancouver Community College, licensed under a <a href='http://creativecommons.org/licenses/by/4.0/'>Creative Commons Attribution 4.0 International License</a>."
	],

	'hi_beg': [
		"<a href='https://www.oercommons.org/courses/bc-reads-adult-literacy-fundamental-english-reader-3/view'>BC Reads: Adult Literacy Fundamental English Readers</a> by Shantel Ivits, Vancouver Community College, licensed under a <a href='http://creativecommons.org/licenses/by/4.0/'>Creative Commons Attribution 4.0 International License</a>.",
		"Wikipedia",
		"Brendon Albertson's own texts for an Adult ESOL Class at the Boston Chinatown Neighborhood Center"
	],

	'int': [
		"<a href='https://oer.galileo.usg.edu/english-textbooks/8/'>Successful College Composition (3rd Edition)</a> by Weaver et al., Georgia State University, licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-Noncommercial-Share Alike 4.0 License.</a>."
	],

	'hi_int': [
		"<a href='https://chem.libretexts.org/@go/page/21526'> ' The Emotional Lives of Animals (Bekoff)' </a> by <a href='https://libretexts.org/'>LibreTexts</a> is licensed under <a href='https://creativecommons.org/licenses/by-nc-nd/4.0/'> CC BY-NC-ND </a>.",
		"<a href='https://chem.libretexts.org/@go/page/21527'> ' Must the President Be a Moral Leader? (Blake)' </a> by <a href='https://libretexts.org/'>LibreTexts</a> is licensed under <a href=’https://creativecommons.org/licenses/by-nd/4.0/'> CC BY-ND </a>."  ,
		"<a href= 'https://chem.libretexts.org/@go/page/21530'> ' Public Beats Private: Six Reasons Why (Buchheit) ' </a> by <a href='https://libretexts.org/'>LibreTexts</a> is licensed under <a href='https://creativecommons.org/licenses/by-sa/4.0/'> CC BY-SA </a>."  ,
		"<a href='https://chem.libretexts.org/@go/page/21524'> ' Is Burning Trash a Good Way to Handle It? Waste Incineration in 5 Charts (Baptista)'</a> by <a href='https://libretexts.org/'>LibreTexts</a> is licensed under <a href='https://creativecommons.org/licenses/by-nd/4.0/'> CC BY-ND </a>."  ,
		"<a href='https://chem.libretexts.org/@go/page/21519'> ' Mushrooms: 'Nature’s Greatest Decomposers' (Anderson) ' </a> by <a href='https://libretexts.org/'>LibreTexts</a> is licensed under <a href='https://creativecommons.org/licenses/by-nc-nd/4.0/'> CC BY-NC-ND </a>."
		],

	'adv': [
		"<a href = 'https://encompass.eku.edu/ekuopen/1/'>Slavery to Liberation: The African American Experience</a> by Farrington et al., Under license <a href='https://creativecommons.org/licenses/by-nc/4.0/'>CC BY-NC 4.0</a>"
	]
};

var attributionText;


function showAttribution() {

	attributionText = "These activities use texts adapted from the following sources: <br><ul>";

	for (i in attributions[level]) {
		attributionText += "<li>" + attributions[level][i] + "</li>";
	};

	attributionText += "</ul>";
	
	document.getElementById('attribution').innerHTML = attributionText;
}