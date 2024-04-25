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

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['nuevoTweet'])) {
    
    $tweetText = $data['nuevoTweet'];
    $userID = $data['userID']; 

    try {
        $stmt = $mysqli->prepare("INSERT INTO tweets (user_id, tweet_text) VALUES (?, ?)");
        if (!$stmt) {
            echo("Error al preparar la consulta SQL: " . $mysqli->error);
        }
        $stmt->bind_param('is', $userID, $tweetText);
        if (!$stmt->execute()) {
            error_log("Error al ejecutar la consulta SQL: " . $stmt->error);
        }
    } catch (Exception $e) {
        error_log("Error en la inserción del tweet: " . $e->getMessage());
        echo "Error al insertar el tweet";
    }
}

$mysqli->close();

