<?php
$newData = array(
	'SubjectID' => $_POST['SubjectID'],
	'condition' => $_POST['condition'],
	'experimenter' => $_POST['experimenter'],
	'direction' => $_POST['direction'], 
	'proud' => $_POST['proud'], 
	'important' => $_POST['important'], 
	'closeness' => $_POST['closeness']
);
ini_set("auto_detect_line_endings", 1);
$handle = fopen("IGdata.csv", "a");
fputcsv($handle, $newData);
fclose($handle);
ini_set('auto_detect_line_endings', FALSE)
?>
