<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "u645142794_edgar", "Edgarana1", "u645142794_devthreads");

if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

if (isset($_GET['username'])) {
    $username = $mysqli->real_escape_string($_GET['username']);
    $query = "SELECT users.user_id, users.user_name, users.user_image, 
              users.follower_count, users.following_count, users.created_at 
              FROM users 
              WHERE users.user_name = '$username'";
    $result = $mysqli->query($query);

    if ($result) {
        $user = $result->fetch_assoc();
        header('Content-Type: application/json');
        echo json_encode($user);
    } else {
        echo "Error al obtener datos del usuario.";
    }
} else if (isset($_GET['shortUsername'])) {
    $username = $mysqli->real_escape_string($_GET['shortUsername']);
    $query = "SELECT users.user_id, users.user_name, users.user_image
              FROM users 
              WHERE users.user_name LIKE '%$username%'";
    $result = $mysqli->query($query);

    if ($result) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        header('Content-Type: application/json');
        echo json_encode($users);
    } else {
        echo "Error al obtener datos del usuario.";
    }
}

$mysqli->close();

