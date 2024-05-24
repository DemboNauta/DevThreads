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
    // Obtener el correo enviado desde Angular
    $correo = $_GET['correo'];
    
    // Generar un código aleatorio de 6 dígitos
    $codigo = rand(100000, 999999);

    // Con la propiedad isSMTP() le indicamos que vamos a usar un servidor smtp
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
    $email->setFrom("info@devthreads.es", "noreply");

    // Siguiendo recomendaciones del servidor lo establecemos a 5 minutos
    $email->Timeout = 300;

    // Indicamos cual es la dirección de destino del correo
    $email->addAddress($correo);

    // Asignamos asunto y cuerpo del mensaje
    // El cuerpo del mensaje lo ponemos en formato html, haciendo que se vea en negrita
    $email->Subject = "Código de verificación";
    $email->Body = "<b>Introduce el código de verificación</b><h1>" . $codigo . "</h1>";

    // Definimos AltBody por si el destinatario del correo no admite email con formato html
    $email->AltBody = "Introduce el código de verificación" . $codigo;

    // Enviamos el mensaje
    if (!$email->send()) {
        $mensaje = "Problemas enviando correo electrónico" . "<br/>" . $email->ErrorInfo;
        echo json_encode(["mensaje" => $mensaje]);
    } else {
        $mensaje = "Mensaje enviado correctamente";
        echo json_encode(["mensaje" => $mensaje, "codigo" => $codigo]);
    }
} else {
    $mensaje = "No has introducido ningun correo";
    echo json_encode(["mensaje" => "200"]);
}

// Retornamos el mensaje como un string en formato JSON
