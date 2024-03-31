<?php

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "root", "1234", "devthreads_db");

// Verificar la conexión
if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

// Consulta para obtener los tweets
$query = "SELECT tweets.*, users.user_name AS username, tweets.num_likes AS likes, 
          tweets.num_retweets AS retweets, tweets.created_at AS creacion
          FROM tweets
          JOIN users ON tweets.user_id = users.user_id
          GROUP BY tweets.tweet_id
          ORDER BY tweets.tweet_id DESC";

$result = $mysqli->query($query);

// Convertir los resultados a un array asociativo
$tweets = [];
while ($row = $result->fetch_assoc()) {
    $tweets[] = $row;
}

// Devolver los tweets como JSON
header('Content-Type: application/json');
echo json_encode($tweets);

// Cerrar la conexión
$mysqli->close();

?>
