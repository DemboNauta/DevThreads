<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "root", "1234", "devthreads_db");

// Verificar la conexión
if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}


    // Datos de ejemplo para insertar
    $username = "edgarKNG2";
    $email = "edgarmila_102@outlook.com";
    $firstName = "Edgar";
    $lastName = "Milá";
    $phoneNumber = "677127403";
    $password = md5("password123"); // Cifrar la contraseña

    // Preparar la consulta SQL para insertar un nuevo usuario
    $query = "INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber, password) 
              VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("ssssss", $username, $email, $firstName, $lastName, $phoneNumber, $password);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        // INSERT exitoso, enviar una respuesta de éxito
        $response = array("success" => true, "message" => "Usuario creado correctamente");
    } else {
        // Error en el INSERT, enviar una respuesta de error
        $response = array("success" => false, "message" => "Error al crear usuario: " . $mysqli->error);
    }

    // Enviar la respuesta como JSON
    header('Content-Type: application/json');
    echo json_encode($response);


