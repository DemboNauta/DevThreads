DROP DATABASE IF EXISTS devthreads_db;
CREATE DATABASE devthreads_db;
USE devthreads_db;

CREATE TABLE IF NOT EXISTS users (
	user_id INT AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email_address VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phonenumber CHAR(10) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    PRIMARY KEY(user_id)
);
INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber)
VALUES
('edgarKNG', 'edgarmila_10@outlook.com', 'Edgar', 'Milá', '677127402'),
('mariaL', 'marialopez@gmail.com', 'Maria', 'Lopez', '555123456'),
('juanP', 'juanperez@yahoo.com', 'Juan', 'Perez', '555987654'),
('lauraM', 'lauramartinez@hotmail.com', 'Laura', 'Martinez', '555246813'),
('carlosR', 'carlosrodriguez@live.com', 'Carlos', 'Rodriguez', '555369258'),
('anaS', 'anasanchez@outlook.com', 'Ana', 'Sanchez', '555135790');
