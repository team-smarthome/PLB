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

// Param 
$startDate = (empty($_POST['startDate'])) ? trim($param_POST->startDate) : trim($_POST['startDate']);
$endDate = (empty($_POST['endDate'])) ? trim($param_POST->endDate) : trim($_POST['endDate']);
$paymentMethod = (empty($_POST['paymentMethod'])) ? [] : $_POST['paymentMethod'];
$username = (empty($_POST['username'])) ? [] : $_POST['username'];
$limit = (empty($_POST['limit'])) ? trim($param_POST->limit) : trim($_POST['limit']);
$page = (empty($_POST['page'])) ? trim($param_POST->page) : trim($_POST['page']);


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
