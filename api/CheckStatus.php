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

require_once 'Encryptor.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

if (stripos($_SERVER["CONTENT_TYPE"], "application/json") === 0) {
    $param_POST = json_decode(file_get_contents("php://input"));
}

// Params token & key
$token  = (empty($_POST['token'])) ? trim($param_POST->token) : trim($_POST['token']);
$key    = (empty($_POST['key'])) ? trim($param_POST->key) : trim($_POST['key']);

// Param RegisterNumber
$registerNumber = (empty($_POST['registerNumber'])) ? trim($param_POST->registerNumber) : trim($_POST['registerNumber']);


$response = array();

$requiredFields = array(
    'registerNumber', 'token', 'key'
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


$url = "https://devapi-molina.imigrasi.go.id/api/visa/application/check-status";

// Headers
$headers = array(
    'Key: ' . $key,
    'Token: ' . $token,
    'Authorization: Bearer ' . $jwtToken,
    'Accept: application/json',
    'Content-Type: application/json',
);

$url .= "?registerNumber=" . urlencode($registerNumber);

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
