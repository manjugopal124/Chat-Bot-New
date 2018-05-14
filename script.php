<?php
    ini_set('display_errors', '1');

    use League\Csv\Reader;
    use League\Csv\Statement;

    require 'csv-9.1.0/autoload.php';


    $csv = Reader::createFromPath('data/dummy.csv', 'r');
    $csv->setHeaderOffset(0); //set the CSV header offset

    $stmt = (new Statement())
    ->offset(0)
    ;

    $fields = $stmt->process($csv);
    foreach ($fields as $field) {
        if ($field['intent'] == $_GET['intent'] && $field['target'] == $_GET['target']) {
            echo $field['answer'];
        }
    }
?> 