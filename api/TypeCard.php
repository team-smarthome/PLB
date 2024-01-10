<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$responseData = [
    "status" => 200,
    "message" => "success",
    "data" => [
        ["value" => "VISA", "label" => "VISA"],
        ["value" => "MASTERCARD", "label" => "MASTERCARD"],
        ["value" => "JCB", "label" => "JCB"],
        ["value" => "AMEX", "label" => "AMEX"]
    ]
];

echo json_encode($responseData);
