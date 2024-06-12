<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('../../bbdd.php');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['nuevoTweet']) && isset($data['userID']) && isset($data['tweet_id'])) {
    
    $tweetText = $data['nuevoTweet'];
    $userID = $data['userID'];
    $parentTweetID = $data['tweet_id'];

    $mysqli->begin_transaction();

    try {
        // Insertar el nuevo tweet en la tabla 'tweets' con is_comment = 1
        $stmt = $mysqli->prepare("INSERT INTO tweets (user_id, tweet_text, is_comment) VALUES (?, ?, 1)");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta SQL: " . $mysqli->error);
        }
        $stmt->bind_param('is', $userID, $tweetText);
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta SQL: " . $stmt->error);
        }

        // Obtener el ID del nuevo tweet insertado
        $newTweetID = $stmt->insert_id;
        $stmt->close();

        // Insertar la relación en la tabla 'tweet_comments'
        $stmt = $mysqli->prepare("INSERT INTO tweet_comments (tweet_id, comment_id) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta SQL para tweet_comments: " . $mysqli->error);
        }
        $stmt->bind_param('ii', $parentTweetID, $newTweetID);
        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta SQL para tweet_comments: " . $stmt->error);
        }
        $stmt->close();

        // Confirmar la transacción
        $mysqli->commit();

        // Responder con el nuevo tweet ID
        echo json_encode(["success" => true, "newTweetID" => $newTweetID]);

    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $mysqli->rollback();
        error_log("Error en la inserción del tweet de respuesta: " . $e->getMessage());
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}

$mysqli->close();

