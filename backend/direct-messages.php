<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "edgar", "1234", "devthreads_db");

$user_id = $_GET['user_id'];


if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

// Consulta para obtener los mensajes directos recibidos por el usuario logueado
if(isset($_GET['sender_id'])){
    $sender_id = $_GET['sender_id'];
    $query = "SELECT dm.message_id, dm.sender_id, u.user_name AS sender_name, ui.image AS sender_image, dm.sent_at, dm.message_text
          FROM direct_messages AS dm
          INNER JOIN users AS u ON dm.sender_id = u.user_id
          LEFT JOIN userImages AS ui ON dm.sender_id = ui.user_id
          WHERE (dm.sender_id = '$user_id' AND dm.receiver_id = '$sender_id')
          OR (dm.sender_id = '$sender_id' AND dm.receiver_id = '$user_id')
          ORDER BY dm.sent_at ASC";

        $result = $mysqli->query($query);

        // Convertir los resultados a un array asociativo
        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = $row;
        }

        // Devolver los mensajes en formato JSON
        header('Content-Type: application/json');
        echo json_encode($messages);
    
}else if(isset($_GET['receiver_id'])){
    $message = file_get_contents('php://input');
    $receiver_id=$_GET['receiver_id'];
    $sender_id=$_GET['user_id'];

    $query = "INSERT INTO direct_messages (sender_id, receiver_id, message_text) VALUES ('$sender_id', '$receiver_id', '$message')";

    $result = $mysqli->query($query);

}else{
    
    $query = "SELECT DISTINCT dm.sender_id, u.user_name AS sender_name, ui.image AS sender_image, MAX(dm.sent_at) AS sent_at
        FROM direct_messages AS dm
        INNER JOIN users AS u ON dm.sender_id = u.user_id
        LEFT JOIN userImages AS ui ON dm.sender_id = ui.user_id
        WHERE dm.receiver_id = '$user_id' 
        GROUP BY dm.sender_id
        ORDER BY MAX(dm.sent_at) DESC;
        ";

    $result = $mysqli->query($query);

    // Convertir los resultados a un array asociativo
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    // Devolver los mensajes en formato JSON
    header('Content-Type: application/json');
    echo json_encode($messages);
}




// Cerrar la conexión con la base de datos
$mysqli->close();

