<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$mysqli = new mysqli("localhost", "root", "1234", "devthreads_db");


if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

$query = "SELECT tweets.*, users.user_name AS username, userImages.image AS user_image, 
          tweets.num_likes AS likes, tweets.num_retweets AS retweets, 
          tweets.created_at AS creacion, tweets.num_comments as comments
          FROM tweets
          JOIN users ON tweets.user_id = users.user_id
          LEFT JOIN userImages ON users.user_id = userImages.user_id
          GROUP BY tweets.tweet_id
          ORDER BY tweets.tweet_id DESC";

$result = $mysqli->query($query);

// Convertimos los resultados a un array asociativo
$tweets = [];
while ($row = $result->fetch_assoc()) {
    $tweets[] = $row;
}

// Devolvemos los tweets en un json
header('Content-Type: application/json');
echo json_encode($tweets);


$mysqli->close();


