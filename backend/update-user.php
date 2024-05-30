<?php
// update-user.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function is_md5($string) {
    return preg_match('/^[a-f0-9]{32}$/i', $string);
}

// Obtener el cuerpo de la solicitud
$request_body = file_get_contents('php://input');

// Decodificar el JSON recibido
$data = json_decode($request_body, true);

// Comprobar si la decodificación fue exitosa
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid JSON data."
    ]);
    exit;
}

// Acceder a cada campo del objeto JSON
$user_id = $data['user_id'];
$user_name = $data['user_name'];
$email_address = $data['email_address'];
$first_name = $data['first_name'];
$last_name = $data['last_name'];
$phonenumber = $data['phonenumber'];
$follower_count = $data['follower_count'];
$following_count = $data['following_count'];
$created_at = $data['created_at'];
if(is_md5($data['password'])){
    $password = ($data['password']);
}else{
    $password = md5($data['password']);
}
$user_image = $data['user_image'];

// Aquí puedes agregar la lógica para actualizar el usuario en la base de datos
// Ejemplo: actualización en la base de datos

// Conexión a la base de datos


$mysqli = new mysqli("localhost", "u645142794_edgar", "Edgarana1", "u645142794_devthreads");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "UPDATE users SET
    user_name = ?,
    email_address = ?,
    first_name = ?,
    last_name = ?,
    phonenumber = ?,
    follower_count = ?,
    following_count = ?,
    created_at = ?,
    password = ?,
    user_image = ?
    WHERE user_id = ?";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sssssiisssi",
    $user_name,
    $email_address,
    $first_name,
    $last_name,
    $phonenumber,
    $follower_count,
    $following_count,
    $created_at,
    $password,
    $user_image,
    $user_id
);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "User updated successfully."
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Error updating user: " . $stmt->error
    ]);
}

$stmt->close();
$mysqli->close();

