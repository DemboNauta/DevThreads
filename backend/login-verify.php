<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('../../bbdd.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Realizamos la consulta para obtener los datos del usuario
    $query = "SELECT users.*
              FROM users
              WHERE users.user_name = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (md5($password) == $user['password']) {
            $response = array("success" => true, "message" => "Inicio de sesión exitoso", "user" => $user);
        } else {
            $response = array("success" => false, "message" => "Contraseña incorrecta");
        }
    } else {
        $response = array("success" => false, "message" => "Usuario no encontrado");
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Método no permitido"));
}

$mysqli->close();

