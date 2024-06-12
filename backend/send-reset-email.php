<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './includes/Exception.php';
require './includes/PHPMailer.php';
require './includes/SMTP.php';

include('../../bbdd.php');
$query = "DELETE FROM password_resets WHERE created_at <= NOW() - INTERVAL 1 HOUR";
if ($mysqli->query($query) === TRUE) {
} else {
    echo "Error al eliminar los tokens expirados: " . $mysqli->error;
}
// Obtener el correo electrónico del POST
$email = $_POST['email'] ?? null;

if ($email) {
    // Verificar si el correo existe en la base de datos de usuarios
    $query = "SELECT * FROM users WHERE email_address = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        // Generar un token único
        $token = bin2hex(random_bytes(3));

        // Insertar el token en la tabla password_resets
        $insertQuery = "INSERT INTO password_resets (email, token, created_at) VALUES (?, ?, NOW())";
        $stmt = $mysqli->prepare($insertQuery);
        $stmt->bind_param("ss", $email, $token);

        if ($stmt->execute()) {
            // Enviar el correo con el token
            $mail = new PHPMailer(true);
            try {
                $mail->CharSet = 'UTF-8';
                $mail->isSMTP();
                $mail->Host = "smtp.hostinger.com";
                $mail->Port = 465; // Puerto SMTP de Hostinger para SSL
                $mail->SMTPSecure = "ssl";
                $mail->SMTPAuth = true;
                $mail->Username = "info@devthreads.es"; // Reemplaza con tu dirección de correo electrónico
                $mail->Password = "*K@=L53GhdJmZMf"; // Reemplaza con tu contraseña de correo electrónico

                // Remitente y destinatario
                $mail->setFrom('info@devthreads.es', 'Devthreads');
                $mail->addAddress($email);

                // Contenido del correo
                $mail->isHTML(true);
                $mail->Subject = 'Restablecer tu contraseña';

                $mail->Body = "
                <div style='background-color: #f9f9f9; border-radius: 10px; padding: 30px; max-width: 800px; margin: auto; text-align: center; font-family: Arial, sans-serif;'>
                    <h2 style='color: #333;'>Solicitud de restablecimiento de contraseña</h2>
                    <p style='color: #666;'>Hola,</p>
                    <p style='color: #666;'>Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para restablecer tu contraseña</p>
                    <p style='background-color: #998b8bf2; color: #fff; padding: 20px; border-radius: 5px; display: inline-block; font-size: 18px; font-weight: bold;'>{$token}</p>
                    <p style='color: #666;'>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo.</p>
                    <p style='text-align: center; margin-top: 20px;'><a href='https://www.devthreads.es'><img src='https://raw.githubusercontent.com/DemboNauta/DevThreads/main/backend/img/DevThreadsLogo.jpg' width='50%' height='50%' style='border-radius: 10px;'></a></p>
                    <p style='color: #666;'>Gracias,<br><strong>El equipo de DevThreads</strong></p>
                </div>
            ";

                $mail->send();
                http_response_code(200);
                echo json_encode(["message" => "Correo de restablecimiento enviado."]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["message" => "No se pudo enviar el correo. Error: {$mail->ErrorInfo}"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error al generar el token de restablecimiento."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "El correo electrónico no existe en nuestra base de datos."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Correo electrónico no proporcionado."]);
}

$mysqli->close();

