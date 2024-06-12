<?php
    
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    include('../../bbdd.php');
    if (isset($_GET['follower_id']) && isset($_GET['following_id'])) {
        $follower_id = $_GET['follower_id'];
        $following_id = $_GET['following_id'];
    
        // Comprobar si ya existe una relación de seguidor
        $check_query = "SELECT * FROM followers WHERE follower_id = '$follower_id' AND following_id = '$following_id'";
        $check_result = $mysqli->query($check_query);
        if (!$check_result) {
            header('Content-Type: application/json');
            echo json_encode(array("error" => "Error al verificar la relación de seguidor: " . $mysqli->error));
            exit();
        }
    
        if ($check_result->num_rows > 0) {
            // Si ya existe una relación de seguidor, eliminarla
            $delete_query = "DELETE FROM followers WHERE follower_id = '$follower_id' AND following_id = '$following_id'";
            if (!$mysqli->query($delete_query)) {
                header('Content-Type: application/json');
                echo json_encode(array("error" => "Error al eliminar la relación de seguidor: " . $mysqli->error));
                exit();
            }
    
            echo json_encode(array("message" => "Relación de seguidor eliminada con éxito."));
        } else {
            // Si no existe una relación de seguidor, insertarla
            $insert_query = "INSERT INTO followers (follower_id, following_id) VALUES ('$follower_id', '$following_id')";
            if (!$mysqli->query($insert_query)) {
                header('Content-Type: application/json');
                echo json_encode(array("error" => "Error al insertar la relación de seguidor: " . $mysqli->error));
                exit();
            }
            header('Content-Type: application/json');
            echo json_encode(array("message" => "Relación de seguidor insertada con éxito."));
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(array("error" => "Los parámetros 'follower_id' y 'following_id' son necesarios."));
    }

