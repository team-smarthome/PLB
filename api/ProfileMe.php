<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

$authorizationHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : null;
// echo $authorizationHeader;

if ($authorizationHeader) {
    if (strpos($authorizationHeader, 'Bearer') === 0) {
        $jwtToken = substr($authorizationHeader, 7);

        // echo $jwtToken;
    } else {
        // Handle invalid Authorization header
        http_response_code(401);
        echo json_encode(["error" => "Invalid Authorization header"]);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// $url = "http://10.20.75.36:8088/api/me";
// $url = "https://devapi-molina.imigrasi.go.id/api/me";
$url = "https://api-molina.imigrasi.go.id/api/me";

// print_r($url);

// Headers
$headers = array(
    'Authorization: Bearer ' . $jwtToken,
    'Accept: application/json',
    'Content-Type: application/json',
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $response = json_decode($result, true);
} else {
    $response = json_decode($result, true);
}

echo json_encode($response);
