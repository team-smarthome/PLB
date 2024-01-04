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

session_start();

if (stripos($_SERVER["CONTENT_TYPE"], "application/json") === 0) {
    $param_POST = json_decode(file_get_contents("php://input"));
}

$postData = file_get_contents("php://input");

$jsonData = json_decode($postData, true);


// Param 
$startDate = (empty($jsonData['startDate'])) ? trim($param_POST->startDate) : trim($jsonData['startDate']);
$endDate = (empty($jsonData['endDate'])) ? trim($param_POST->endDate) : trim($jsonData['endDate']);
$paymentMethod = (empty($jsonData['paymentMethod'])) ? [] : $jsonData['paymentMethod'];
$username = (empty($jsonData['username'])) ? [] : $jsonData['username'];
$limit = (empty($jsonData['limit'])) ? trim($param_POST->limit) : trim($jsonData['limit']);
$page = (empty($jsonData['page'])) ? trim($param_POST->page) : trim($jsonData['page']);

// var_dump($param_POST);

// echo "nanana";
// echo $username;
$response = array();

$requiredFields = array(
    'startDate', 'endDate', 'limit', 'page'
);

// Required fields
foreach ($requiredFields as $field) {
    if (empty($_POST[$field]) && empty($param_POST->$field)) {
        $response['status'] = "error";
        $response['message'] = "Required field '{$field}' is missing";
        http_response_code(400);
        echo json_encode($response);
        exit();
    }
}


$url = "https://devapi-molina.imigrasi.go.id/api/visa/application/transaction-history";

// Headers
$headers = array(
    'Authorization: Bearer ' . $jwtToken,
    'Accept: application/json',
    'Content-Type: application/json',
);

$bodyData = array(
    'startDate' => $startDate,
    'endDate' => $endDate,
    'paymentMethod' => $paymentMethod,
    'username' => $username,
    'limit' => $limit,
    'page' => $page,
);

// print_r($bodyData);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bodyData));
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
