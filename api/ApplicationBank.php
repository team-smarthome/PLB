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

// Params body
$passportNumber = (empty($_POST['passportNumber'])) ? trim($param_POST->passportNumber) : trim($_POST['passportNumber']);
$expiredDate = (empty($_POST['expiredDate'])) ? trim($param_POST->expiredDate) : trim($_POST['expiredDate']);
$fullName = (empty($_POST['fullName'])) ? trim($param_POST->fullName) : trim($_POST['fullName']);
$dateOfBirth = (empty($_POST['dateOfBirth'])) ? trim($param_POST->dateOfBirth) : trim($_POST['dateOfBirth']);
$nationalityCode = (empty($_POST['nationalityCode'])) ? trim($param_POST->nationalityCode) : trim($_POST['nationalityCode']);
$sex = (empty($_POST['sex'])) ? trim($param_POST->sex) : trim($_POST['sex']);
$issuingCountry = (empty($_POST['issuingCountry'])) ? trim($param_POST->issuingCountry) : trim($_POST['issuingCountry']);
$photoPassport = (empty($_POST['photoPassport'])) ? trim($param_POST->photoPassport) : trim($_POST['photoPassport']);
$photoFace = (empty($_POST['photoFace'])) ? trim($param_POST->photoFace) : trim($_POST['photoFace']);
$email = (empty($_POST['email'])) ? trim($param_POST->email) : trim($_POST['email']);
$paymentMethod = (empty($_POST['paymentMethod'])) ? trim($param_POST->paymentMethod) : trim($_POST['paymentMethod']);
$postalCode = (empty($_POST['postalCode'])) ? trim($param_POST->postalCode) : trim($_POST['postalCode']);

// Params body for cc
$cc_no = (empty($_POST['cc_no'])) ? trim($param_POST->cc_no) : trim($_POST['cc_no']);
$cc_exp = (empty($_POST['cc_exp'])) ? trim($param_POST->cc_exp) : trim($_POST['cc_exp']);
$cvv = (empty($_POST['cvv'])) ? trim($param_POST->cvv) : trim($_POST['cvv']);
$type = (empty($_POST['type'])) ? trim($param_POST->type) : trim($_POST['type']);

// Params token & key
$token = (empty($_POST['token'])) ? trim($param_POST->token) : trim($_POST['token']);
$key = (empty($_POST['key'])) ? trim($param_POST->key) : trim($_POST['key']);


// Params deviceID
$deviceId = (empty($_POST['deviceId'])) ? trim($param_POST->deviceId) : trim($_POST['deviceId']);
$airportId = (empty($_POST['airportId'])) ? trim($param_POST->airportId) : trim($_POST['airportId']);
$jenisDeviceId = (empty($_POST['jenisDeviceId'])) ? trim($param_POST->jenisDeviceId) : trim($_POST['jenisDeviceId']);

$response = array();

$requiredFields = array(
    'passportNumber', 'expiredDate', 'fullName', 'dateOfBirth', 'nationalityCode',
    'sex', 'issuingCountry', 'photoPassport', 'photoFace', 'email', 'paymentMethod',
    'token', 'key', 'cc_no', 'cc_exp', 'cvv'
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

$config = [
    "base_key" => $token,
];
$secretKey = $config['base_key'];

// echo $secretKey;

switch ($paymentMethod) {
    case 'KIOSK':
        $dataCard = [
            "card_data" => [
                "cc_no" => $cc_no,
                "cc_exp" => $cc_exp,
                "cvv" => $cvv,
                "type" => $type
            ]
        ];
        break;

    case 'KICASH':
        $dataCard = [
            "card_data" => [
                "cc_no" => $cc_no,
                "cc_exp" => $cc_exp,
                "cvv" => $cvv,
                "type" => $type
            ]
        ];
        break;

    default:
        $dataCard = [];
        break;
}

// echo json_encode($dataCard);

$encryptedCard = Encryptor::encryptJsonToBase64(json_encode($dataCard), $secretKey);

// echo $encryptedCard;

// echo "\n";

$decryptedCard = Encryptor::decryptBase64ToJson($encryptedCard, $secretKey);

$cardData = json_decode($decryptedCard, true);

// echo json_encode($cardData);

// echo "\n";

$url = "http://10.20.75.36:8088/api/visa/application/bank";
// $url = "https://devapi-molina.imigrasi.go.id/api/visa/application/bank";
// $url = "https://api-molina.imigrasi.go.id/visa/application/bank";

// print_r($url);

// Headers
$headers = array(
    'Key: ' . $key,
    'Token: ' . $token,
    'Authorization: Bearer ' . $jwtToken,
    'Accept: application/json',
    'Content-Type: application/json',
    'X-Device-Id: ' . $airportId . $jenisDeviceId . $deviceId
);

// echo 'Headers for cURL: ';
// print_r($headers);

// Body data
$bodyData = array(
    'passportNumber' => $passportNumber,
    'expiredDate' => $expiredDate,
    'fullName' => $fullName,
    'dateOfBirth' => $dateOfBirth,
    'nationalityCode' => $nationalityCode,
    'sex' => $sex,
    'issuingCountry' => $issuingCountry,
    'photoPassport' => $photoPassport,
    'photoFace' => $photoFace,
    'email' => $email,
    'paymentMethod' => $paymentMethod,
    'payment' => $encryptedCard,
    'postalCode' => $postalCode
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
    // Success
    $response['status'] = "success";
    $response['message'] = "Data submitted successfully";
    $response['data'] = json_decode($result, true);
    $response = json_decode($result, true);
} else {
    // Error
    $response['status'] = "error";
    $response['message'] = "Error submitting data";
    $response['data'] = json_decode($result, true);
    $response = json_decode($result, true);
}

echo $result;
