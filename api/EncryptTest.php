<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
require_once 'Encryptor.php';


$config = [
    "base_key" => 'd91d141f50c59afd7bf81d014958e95443f68b4f6e6603c39f6985e5d773330c', // secretkey from api client
];
$secretKey = "d91d141f50c59afd7bf81d014958e95443f68b4f6e6603c39f6985e5d773330c";

$dataCard = [
    "card_data" => [
        "cc_no" => "4000000000001091",
        "cc_exp" => "1225",
        "cvv" => "123"
    ]
];

// $encryptedCard = Encryptor::encryptJsonToBase64(json_encode($dataCard), $secretKey);

// echo $encryptedCard . "\n";

$decryptedCard = Encryptor::decryptBase64ToJson("xgyflGtf6OTv4wSApufikff3akJF5iZaeoOHSz0+B2Gb1kbAGciFwhsFrt1aZGvQOwTeB8K0fu3Cgkri8ceB9WLA9Gb8Ep7utWDod5zCpsPDQAyfORGBoP4qClEiizjb", $secretKey);

$cardData = json_decode($decryptedCard, true);

echo json_encode($cardData);
