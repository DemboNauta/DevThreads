<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "root", "1234", "devthreads_db");


if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

if (isset($_GET['username'])) {
    $username = $mysqli->real_escape_string($_GET['username']);
    $query = "SELECT users.user_id, users.user_name, userImages.image AS user_image, 
          users.follower_count, users.following_count, users.created_at 
          FROM users 
          LEFT JOIN userImages ON users.user_id = userImages.user_id
          WHERE users.user_name = '$username'";

    
    $result = $mysqli->query($query);

    if ($result) {
        $user = $result->fetch_assoc();
        header('Content-Type: application/json');
        echo json_encode($user);
    } else {
        echo "Error al obtener datos del usuario.";
    }
} else {
    echo "Se requiere un nombre de usuario.";
}

$mysqli->close();

