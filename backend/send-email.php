<?php
// Permitir solicitudes desde cualquier origen

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './includes/Exception.php';
require './includes/PHPMailer.php';
require './includes/SMTP.php';

header("Access-Control-Allow-Origin: *");
// Permitir los métodos POST desde cualquier origen
header("Access-Control-Allow-Methods: POST");
// Permitir el contenido de la solicitud en el cuerpo (incluido el correo electrónico)
header("Access-Control-Allow-Headers: Content-Type");

//Incluimos la clase phpmailer para poder instanciar
//un objeto de la misma

// Creamos un objeto de la clase phpmailer
$email = new PHPMailer();
$correo = '';

// Verificamos si se ha enviado un correo
if (isset($_GET['correo'])) {
    $correo = $_GET['correo'];
    $email->CharSet = 'UTF-8';


    $email->isSMTP();

    // Asignamos a Host el nombre de nuestro servidor smtp estableciendo protocolo y puerto
    $email->Host = "smtp.hostinger.com";
    $email->Port = 465; // Puerto SMTP de Hostinger para SSL

    // Usamos SSL como método de encriptación
    $email->SMTPSecure = "ssl";

    // Le indicamos que el servidor smtp requiere autenticación
    $email->SMTPAuth = true;

    // Le decimos cual es nuestro nombre de usuario y password
    $email->Username = "info@devthreads.es"; // Reemplaza con tu dirección de correo electrónico
    $email->Password = "*K@=L53GhdJmZMf"; // Reemplaza con tu contraseña de correo electrónico

    // Indicamos cual es nuestra dirección de correo y el nombre que queremos que vea el usuario que lee nuestro correo
    $email->setFrom("info@devthreads.es", "Devthreads");

    // Siguiendo recomendaciones del servidor lo establecemos a 5 minutos
    $email->Timeout = 300;

    // Indicamos cual es la dirección de destino del correo
    $email->addAddress($correo);

    // Asignamos asunto y cuerpo del mensaje
    // El cuerpo del mensaje lo ponemos en formato html, haciendo que se vea en negrita
    $email->isHTML(true);
    $email->Subject = "¡Bienvenido a DevThreads!";
    $email->Body = "
    <div style='background-color: #f9f9f9; border-radius: 10px; padding: 30px; max-width: 50%; margin: auto; text-align: center;'>
        <h3 style='color: #333; font-family: Arial, sans-serif; margin-bottom: 10px;'>¡Gracias por unirte a <a href='https://www.devthreads.es' style='text-decoration: none; color: #ee0606f2;'><b>DevThreads</b></a>, la nueva red social donde podrás aprender!</h3>
        <p style='color: #666; font-family: Arial, sans-serif; margin-bottom: 10px;'>En DevThreads, podrás compartir tus ideas, proyectos y descubrimientos con una comunidad de programadores y desarrolladores.</p>
        <p style='text-align: center; margin-bottom: 10px;'><a href='https://www.devthreads.es'><img src='https://raw.githubusercontent.com/DemboNauta/DevThreads/main/backend/img/DevThreadsLogo.jpg' width='300px' height='300px' style='border-radius: 10px;'></a></p>
    </div>
    ";




    // Definimos AltBody por si el destinatario del correo no admite email con formato html

    // Enviamos el mensaje
    if (!$email->send()) {
        $mensaje = "Problemas enviando correo electrónico" . "<br/>" . $email->ErrorInfo;
        echo json_encode(["mensaje" => $mensaje]);
    } else {
        $mensaje = "Mensaje enviado correctamente a $correo";
        echo("Mensaje enviado correctamente a $correo");
    }
} else {
    $mensaje = "No has introducido ningun correo";
    echo json_encode(["mensaje" => "200"]);
}

// Retornamos el mensaje como un string en formato JSON
