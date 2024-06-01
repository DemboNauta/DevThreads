<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Configuración de la base de datos
$mysqli = new mysqli("localhost", "u645142794_edgar", "Edgarana1", "u645142794_devthreads");

// Verificar la conexión
if ($mysqli->connect_errno) {
    http_response_code(500);
    die(json_encode(["message" => "Falló la conexión a MySQL: " . $mysqli->connect_error]));
}

// Obtener datos del POST
$token = $_POST['token'] ?? null;
$newPassword = $_POST['newPassword'] ?? null;

if ($token && $newPassword) {
    // Verificar si el token es válido y no ha expirado
    $query = "SELECT email FROM password_resets WHERE token = ? AND created_at > NOW() - INTERVAL 1 HOUR";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        $email = $user['email'];

        // Actualizar la contraseña en la tabla de usuarios
        $hashedPassword = md5($newPassword);
        $updateQuery = "UPDATE users SET password = ? WHERE email_address = ?";
        $stmt = $mysqli->prepare($updateQuery);
        $stmt->bind_param("ss", $hashedPassword, $email);

        if ($stmt->execute()) {
            // Eliminar el token de la tabla password_resets
            $deleteQuery = "DELETE FROM password_resets WHERE token = ?";
            $stmt = $mysqli->prepare($deleteQuery);
            $stmt->bind_param("s", $token);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(["message" => "Contraseña restablecida correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error al actualizar la contraseña."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "El token no es válido o ha expirado."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Token o nueva contraseña no proporcionados."]);
}

$mysqli->close();

