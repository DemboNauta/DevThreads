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


    $user_id = $_GET['user_id'];


    //Realizamos la consulta para obtener los datos del usuario

    $query = "SELECT followers.following_id
              FROM followers 
              JOIN users ON users.user_id = followers.follower_id 
              WHERE users.user_id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row['following_id'];
    }

    header('Content-Type: application/json');
    echo json_encode($users);


