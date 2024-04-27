<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$user_id = $_GET['user_id'];

$mysqli = new mysqli("localhost", "root", "1234", "devthreads_db");
if ($mysqli->connect_errno) {
    echo "Error en la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

if (isset($_GET['tweet_id'])) {
    $tweet_id = $_GET['tweet_id'];

    $check_query = "SELECT * FROM tweet_likes WHERE tweet_id = '$tweet_id' AND user_id = '$user_id'";
    $check_result = $mysqli->query($check_query);
    if (!$check_result) {
        echo "Error al verificar el like: " . $mysqli->error;
        exit();
    }

    if ($check_result->num_rows > 0) {
        // Si ya existe un like, eliminarlo
        $delete_query = "DELETE FROM tweet_likes WHERE tweet_id = '$tweet_id' AND user_id = '$user_id'";
        if (!$mysqli->query($delete_query)) {
            echo "Error al eliminar el like: " . $mysqli->error;
            exit();
        }

    } else {
        // Si no existe un like, insertarlo
        $insert_query = "INSERT INTO tweet_likes (tweet_id, user_id) VALUES ('$tweet_id', '$user_id')";
        if (!$mysqli->query($insert_query)) {
            echo "Error al insertar el like: " . $mysqli->error;
            exit();
        }

    }
}

$query = "SELECT t.tweet_id
          FROM tweets AS t
          INNER JOIN tweet_likes AS l ON t.tweet_id = l.tweet_id
          WHERE l.user_id = '$user_id';";

$result = $mysqli->query($query);
if (!$result) {
    echo "Error al ejecutar la consulta: " . $mysqli->error;
    exit();
}

$tweet_ids = [];
while ($row = $result->fetch_assoc()) {
    $tweet_ids[] = $row['tweet_id'];
}

header('Content-Type: application/json');
echo json_encode($tweet_ids);

$mysqli->close();
