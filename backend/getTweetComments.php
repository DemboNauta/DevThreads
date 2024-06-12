<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('../../bbdd.php');

$tweet_id = $_GET['tweet_id'];

$query = "SELECT t.*, u.user_name AS username, u.user_image AS user_image, 
              t.num_likes AS likes, t.num_retweets AS retweets, 
              t.created_at AS creacion, t.num_comments AS comments
          FROM tweet_comments tc
          JOIN tweets t ON tc.comment_id = t.tweet_id
          JOIN users u ON t.user_id = u.user_id
          WHERE tc.tweet_id = ?
          GROUP BY t.tweet_id
          ORDER BY t.tweet_id DESC";

$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $tweet_id);
$stmt->execute();

$result = $stmt->get_result();

// Convertimos los resultados a un array asociativo
$tweets = [];
while ($row = $result->fetch_assoc()) {
    $tweets[] = $row;
}

// Devolvemos los tweets en un json
header('Content-Type: application/json');
echo json_encode($tweets);

$stmt->close();
$mysqli->close();
?>
