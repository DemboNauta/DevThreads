<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "u645142794_edgar", "Edgarana1", "u645142794_devthreads");

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
$profileImage = $_POST['profileImage'];

// Preparar la consulta SQL para insertar un nuevo usuario
$query = "INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber, password, user_image) 
          VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("sssssss", $username, $email, $firstName, $lastName, $phoneNumber, $password, $profileImage);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Se insertó el usuario y la imagen correctamente
    $response = array("success" => true, "message" => "Usuario creado correctamente");

    // Llamar a la URL especificada si se agrega correctamente un usuario
    $url = "https://devthreads.es/backend/send-email.php?correo=" . urlencode($email);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    if ($result === false) {
        // Error al llamar a la URL, enviar una respuesta de error
        $response = array("success" => false, "message" => "Error al llamar a la URL de notificación");
    }
    curl_close($ch);
} else {
    // Error en el INSERT del usuario, enviar una respuesta de error
    $response = array("success" => false, "message" => "Error al crear usuario: " . $mysqli->error);
}

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);

$mysqli->close();

