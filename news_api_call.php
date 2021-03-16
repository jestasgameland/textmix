

<?php
//This code sends an API request to the News API on the backend, in order to hide the API key (users can only see my HTML, JS, and CSS files

$data = file_get_contents('http://newsapi.org/v2/top-headlines?country=us&apiKey=[YOUR_API_KEY HERE]');
// MY API KEY IS SAFELY HIDDEN ON BACKEND HERE!  NICE!

print $data;  //"print" sends something back to the ajax request to use in JS.



?>