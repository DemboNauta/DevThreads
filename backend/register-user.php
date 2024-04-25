<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "edgar", "1234", "devthreads_db");

// Verificar la conexión
if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

// Obtener los datos del formulario
$username = $_POST['userName'];
$email = $_POST['email'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$phoneNumber = $_POST['phoneNumber'];
$password = md5($_POST['password']);



// Preparar la consulta SQL para insertar un nuevo usuario
$query = "INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber, password) 
          VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ssssss", $username, $email, $firstName, $lastName, $phoneNumber, $password);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Obtener el user_id del usuario recién registrado
    $userId = $mysqli->insert_id;
    $profileImage = $_POST['profileImage'];
    // Preparar la consulta SQL para insertar la imagen en la tabla userImages
    $queryImage = "INSERT INTO userImages (user_id, image) VALUES (?, ?)";
    $stmtImage = $mysqli->prepare($queryImage);
    $stmtImage->bind_param("is", $userId, $profileImage);

    // Ejecutar la consulta para insertar la imagen
    if ($stmtImage->execute()) {
        // INSERT exitoso, enviar una respuesta de éxito
        $response = array("success" => true, "message" => "Usuario creado correctamente");
    } else {
        // Error en el INSERT de la imagen, enviar una respuesta de error
        $response = array("success" => false, "message" => "Error al crear usuario: " . $mysqli->error);
    }
} else {
    // Error en el INSERT del usuario, enviar una respuesta de error
    $response = array("success" => false, "message" => "Error al crear usuario: " . $mysqli->error);
}

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);

