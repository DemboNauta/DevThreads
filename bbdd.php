<?php
$mysqli = new mysqli("localhost", "u645142794_edgar", "Edgarana1", "u645142794_devthreads");

$mysqli = new mysqli("localhost", "u645142794_edgar", "Edgarana1", "u645142794_devthreads");
    if ($mysqli->connect_errno) {
        header('Content-Type: application/json');
        echo json_encode(array("error" => "Error en la conexión a MySQL: " . $mysqli->connect_error));
        exit();
    }
?>