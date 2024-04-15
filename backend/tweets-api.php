<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$mysqli = new mysqli("localhost", "root", "1234", "devthreads_db");

if ($mysqli->connect_errno) {
    echo "Falló la conexión a MySQL: " . $mysqli->connect_error;
    exit();
}

// Verificamos si se pasó una ID de usuario en la solicitud
if (isset($_GET['username'])) {
    $user_name = $mysqli->real_escape_string($_GET['username']);
    $user_id_query = "SELECT user_id FROM users WHERE user_name = '$user_name'";
    $user_id_result = $mysqli->query($user_id_query);

    if ($user_id_result) {
        $row = $user_id_result->fetch_assoc();
        $user_id = $row['user_id'];

        // Consulta para obtener los tweets y los datos de los usuarios
        $query = "SELECT tweets.*, users.user_name AS username, userImages.image AS user_image, 
                  tweets.num_likes AS likes, tweets.num_retweets AS retweets, 
                  tweets.created_at AS creacion, tweets.num_comments as comments
                  FROM tweets
                  JOIN users ON tweets.user_id = users.user_id
                  LEFT JOIN userImages ON users.user_id = userImages.user_id
                  WHERE users.user_id = '$user_id'
                  GROUP BY tweets.tweet_id
                  ORDER BY tweets.tweet_id DESC";
    }
} else {
    // Consulta original para obtener todos los tweets
    $query = "SELECT tweets.*, users.user_name AS username, userImages.image AS user_image, 
              tweets.num_likes AS likes, tweets.num_retweets AS retweets, 
              tweets.created_at AS creacion, tweets.num_comments as comments
              FROM tweets
              JOIN users ON tweets.user_id = users.user_id
              LEFT JOIN userImages ON users.user_id = userImages.user_id
              GROUP BY tweets.tweet_id
              ORDER BY tweets.tweet_id DESC";
}

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

