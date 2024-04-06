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

// Obtener los datos del formulario
$username = $_POST['userName'];
$email = $_POST['email'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$phoneNumber = $_POST['phoneNumber'];
$password = md5($_POST['password']); // Recuerda siempre cifrar la contraseña

// Procesar el archivo de imagen de perfil
// $profileImage = $_POST['profileImage'];
// $profileImagePath = ''; // Aquí almacenarás la ruta del archivo de imagen en tu servidor

// Si se cargó un archivo de imagen
// if ($profileImage['error'] === UPLOAD_ERR_OK) {
//     $uploadDir = 'uploads/'; // Directorio donde se guardarán las imágenes
//     $uploadPath = $uploadDir . basename($profileImage['name']);

//     // Mover el archivo al directorio de subida
//     if (move_uploaded_file($profileImage['tmp_name'], $uploadPath)) {
//         $profileImagePath = $uploadPath;
//     } else {
//         // Error al mover el archivo
//         echo "Error al subir el archivo.";
//         exit();
//     }
// } else {
//     // Error al cargar el archivo
//     echo "Error al cargar la imagen.";
//     exit();
// }

// Preparar la consulta SQL para insertar un nuevo usuario
$query = "INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber, password) 
          VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ssssss", $username, $email, $firstName, $lastName, $phoneNumber, $password);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Obtener el user_id del usuario recién registrado
    $userId = $mysqli->insert_id;

    // Preparar la consulta SQL para insertar la imagen en la tabla userImages
    $queryImage = "INSERT INTO userImages (user_id, image) VALUES (?, ?)";
    $stmtImage = $mysqli->prepare($queryImage);
    $null = NULL;
    $stmtImage->bind_param("ib", $userId, $null);
    $stmtImage->send_long_data(1, file_get_contents($profileImagePath));

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

