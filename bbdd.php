<?php
$mysqli = new mysqli("localhost", "usuario", "constraseña", "base_datos");
    if ($mysqli->connect_errno) {
        header('Content-Type: application/json');
        echo json_encode(array("error" => "Error en la conexión a MySQL: " . $mysqli->connect_error));
        exit();
    }
?>
