<?php

    $files = array(
        'qcm' => 'dataQCM.json',
        'stns' => 'dataStns.json'
    );

    if (!empty($_GET['qt']) && !empty($_GET['rep']) && !empty($_GET['type'])) {

        $jsonstring = file_get_contents($files[$_GET['type']]);
        $jsonData = json_decode($jsonstring, true);

        if (!array_key_exists($_GET['qt'], $jsonData)) {
            $jsonData[$_GET['qt']] = $_GET['rep'];
            file_put_contents($files[$_GET['type']], json_encode($jsonData));
        }
    }

    

/*
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($jsonData);
*/