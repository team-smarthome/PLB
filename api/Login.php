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

session_start();

if (stripos($_SERVER["CONTENT_TYPE"], "application/json") === 0) {
    $param_POST = json_decode(file_get_contents("php://input"));
}

$username = (empty($_POST['username'])) ? trim($param_POST->username) : trim($_POST['username']);
$password = (empty($_POST['password'])) ? trim($param_POST->password) : trim($_POST['password']);

$response = array();

if (empty($username) || empty($password)) {
    // Error if empty username & password
    $response['status'] = "error";
    $response['message'] = "Username or password not provided";
    http_response_code(400);
} else {
    // Hit Api Login
    $urlLogin = "https://devapi-molina.imigrasi.go.id/api/login";
    $dataLogin = array(
        'username' => $username,
        'password' => $password
    );

    $chLogin = curl_init($urlLogin);
    curl_setopt($chLogin, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chLogin, CURLOPT_POST, true);
    curl_setopt($chLogin, CURLOPT_POSTFIELDS, json_encode($dataLogin));
    curl_setopt($chLogin, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

    $resultLogin = curl_exec($chLogin);
    $httpCodeLogin = curl_getinfo($chLogin, CURLINFO_HTTP_CODE);
    curl_close($chLogin);

    if ($httpCodeLogin === 200) {
        // Success
        $response['status'] = "success";
        $response['message'] = "Login successful";
        $loginData = json_decode($resultLogin, true);
        $response['JwtToken'] = $loginData;

        // Token From Login
        $token = $loginData['token'];

        $urlMe = "https://devapi-molina.imigrasi.go.id/api/me";
        $chMe = curl_init($urlMe);
        curl_setopt($chMe, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($chMe, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token));

        $resultMe = curl_exec($chMe);
        $httpCodeMe = curl_getinfo($chMe, CURLINFO_HTTP_CODE);
        curl_close($chMe);

        if ($httpCodeMe === 200) {
            $response['profile'] = json_decode($resultMe, true);
        } else {
            $response['profile'] = "Error fetching 'me' data";
        }
    } else {
        //Error
        $response['status'] = "error";
        $response['message'] = "Login failed";
        $response['api_response'] = json_decode($resultLogin, true);
        http_response_code(401);
    }
}

echo json_encode($response);
