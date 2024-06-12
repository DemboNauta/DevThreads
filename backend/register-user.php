<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('../../bbdd.php');

// Obtener los datos del formulario
$username = $_POST['userName'];
$email = $_POST['email'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$phoneNumber = $_POST['phoneNumber'];
$password = md5($_POST['password']);
$profileImage = $_POST['profileImage'];

try {
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
        throw new Exception("Error al crear usuario: " . $stmt->error);
    }
} catch (mysqli_sql_exception $e) {
    // Capturar el código de error específico para "duplicate entry"
    if ($e->getCode() == 1062) {
        // Analizar el mensaje de error para determinar la columna duplicada
        if (strpos($e->getMessage(), 'user_name') !== false) {
            $response = array("success" => false, "message" => "Ese nombre de usuario ya existe");
        } elseif (strpos($e->getMessage(), 'email_address') !== false) {
            $response = array("success" => false, "message" => "Ese correo electrónico ya existe");
        } else {
            $response = array("success" => false, "message" => "entrada duplicada");
        }
    } else {
        // Error en el INSERT del usuario, enviar una respuesta de error genérica
        $response = array("success" => false, "message" => "Error al crear usuario: " . $e->getMessage());
    }
} catch (Exception $e) {
    $response = array("success" => false, "message" => $e->getMessage());
}

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);

$mysqli->close();

