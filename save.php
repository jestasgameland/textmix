
<!-- This file gets data from ajax, and writes it to the file data.json -->

<?php
   $json = $_POST['json'];

     $file = fopen('data.json','w+');  
     fwrite($file, $json);
     fclose($file);

?>