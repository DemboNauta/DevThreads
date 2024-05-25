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

$query = "SELECT tweets.*, users.user_name AS username, 
          users.user_image AS user_image, tweets.num_likes AS likes, 
          tweets.num_retweets AS retweets, tweets.created_at AS creacion, 
          tweets.num_comments as comments
          FROM tweets
          JOIN users ON tweets.user_id = users.user_id
          WHERE tweets.user_id IN (
              SELECT followers.following_id
              FROM followers 
              JOIN users ON users.user_id = followers.follower_id 
              WHERE users.user_id = ?
          )
          GROUP BY tweets.tweet_id
          ORDER BY tweets.tweet_id DESC";
          
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$tweets = [];
while ($row = $result->fetch_assoc()) {
    $tweets[] = $row;
}

header('Content-Type: application/json');
echo json_encode($tweets);

// Cerrar la conexión con la base de datos
$mysqli->close();

