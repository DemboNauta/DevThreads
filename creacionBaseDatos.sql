CREATE DATABASE IF NOT EXISTS devthreads_db;
USE devthreads_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email_address VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phonenumber CHAR(10) UNIQUE,
    follower_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_image BLOB,
    password VARCHAR(255) NOT NULL, 
    PRIMARY KEY(user_id)
);

/*
INSERT INTO users (user_name, email_address, first_name, last_name, phonenumber, password)
VALUES 
    ('edgarKNG', 'edgarmila_10@outlook.com', 'Edgar', 'Milá', '677127402',  MD5('1234')),
    ('mariaL', 'marialopez@gmail.com', 'Maria', 'Lopez', '555123456', MD5('password456')),
    ('juanP', 'juanperez@yahoo.com', 'Juan', 'Perez', '555987654', MD5('password789')),
    ('lauraM', 'lauramartinez@hotmail.com', 'Laura', 'Martinez', '555246813', MD5('passwordabc')),
    ('carlaroyuela21', 'carlacruzz03@hotmail.com', 'Carla', 'de la Cruz', '6193245781', MD5('1234')),
    ('anaS', 'anasanchez@outlook.com', 'Ana', 'Sanchez', '555135790', MD5('passwordghi')),
    ('joseA', 'josealvarez@gmail.com', 'Jose', 'Alvarez', '555777888', MD5('passwordjkl')),
    ('luisG', 'luisgarcia@yahoo.com', 'Luis', 'Garcia', '555666999', MD5('passwordmno'));
*/




CREATE TABLE IF NOT EXISTS followers (
	follower_id INT NOT NULL, -- ID DEL QUE SIGUE
    following_id INT NOT NULL, -- ID DE A QUIÉN SIGUE
    FOREIGN KEY(follower_id) REFERENCES users(user_id),
	FOREIGN KEY(following_id) REFERENCES users(user_id),
    CONSTRAINT check_follower_id CHECK (follower_id != following_id),
	PRIMARY KEY(follower_id, following_id)
);


/*
SELECT follower_id, following_id FROM followers;
SELECT COUNT(follower_id) FROM followers WHERE following_id = (SELECT user_id  FROM users WHERE user_name= 'edgarKNG');

SELECT following_id, COUNT(follower_id) AS followers
FROM followers
GROUP BY following_id
ORDER BY followers DESC
LIMIT 3;

SELECT users.user_id, users.user_name, users.first_name, following_id, COUNT(follower_id) AS followers
FROM followers
JOIN users ON users.user_id = followers.following_id
GROUP BY following_id
ORDER BY followers DESC;
*/

CREATE TABLE IF NOT EXISTS tweets(
	tweet_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_text VARCHAR(220) NOT NULL,
    num_likes INT DEFAULT 0,
    num_retweets INT DEFAULT 0,
    num_comments INT DEFAULT 0,
    is_comment INT DEFAULT 0,
	created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY(tweet_id)
);

/*
INSERT INTO tweets (user_id, tweet_text)
VALUES
(5, '¡Estoy hypeado por aprender un nuevo lenguaje de programación este mes! #coding'),
(2, 'Compartiendo unos tips bacanes para mejorar la eficiencia del código.'),
(3, '¡Por fin resolví ese bug que me estaba sacando canas! #codinglife'),
(7, 'Explorando las últimas tendencias en desarrollo web y diseño UX, ¡todo muy guay!'),
(4, '¡La hackathon del fin de semana fue la raja! #hackathon'),
(1, 'Reflexionando sobre los dramas de la programación concurrente.'),
(6, '¡Subí mi primer repo en GitHub! #opensource'),
(8, 'Investigando sobre IA y machine learning, ¡cómo mola!'),
(2, 'Compartiendo algunos trucos para optimizar las consultas SQL, ¡a darle caña!'),
(7, '¡La conferencia de ciberseguridad estuvo de lujo! #infosec'),
(3, '¡Estoy flipando con mi nuevo proyecto de desarrollo de apps móviles! #appdev'),
(5, 'Echando un vistazo a las últimas novedades de JavaScript y frameworks como React y Angular.'),
(1, 'Compartiendo algunos links útiles para aprender nuevos trucos de programación.'),
(8, '¿Alguien más se vuelve loco con los retos de los algoritmos? #programming'),
(6, '¡Dándole duro al desarrollo de una app web desde cero! #webdev'),
(4, 'Charlando sobre las buenas prácticas de código en el team.'),
(2, '¡Acabo de lanzar mi primera app en la tienda! #indiedev'),
(5, 'Investigando sobre blockchain y crypto, ¡la movida del futuro!'),
(3, 'Contando algunas anécdotas sobre el trabajo remoto en la industria tech. #remotework');
*/
/*
-- CUANTOS TWEETS HA HECHO UN USUARIO
SELECT user_id, COUNT(*) AS tweet_count
FROM tweets
GROUP BY user_id;

-- Obtener los tweets de los usuarios con más de 2 seguidores
SELECT * FROM tweets
WHERE user_id IN (SELECT following_id FROM followers GROUP BY following_id
HAVING COUNT(follower_id) >2 );

-- Obtener los tweets de un usuario en concreto por su nombre de usuario
SELECT * FROM tweets
WHERE user_id = (SELECT user_id FROM users WHERE user_name = 'edgarKNG');

*/

CREATE TABLE IF NOT EXISTS tweet_likes(
	user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    PRIMARY KEY (user_id, tweet_id)
);

CREATE TABLE IF NOT EXISTS tweet_retweets(
	user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    PRIMARY KEY (user_id, tweet_id)
);

CREATE TABLE IF NOT EXISTS tweet_comments(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    tweet_id INT, 
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);



/*
-- Obtener el número de likes para cada tuit
SELECT tweets.tweet_id, tweets.tweet_text, COUNT(*) as like_count
FROM tweet_likes JOIN tweets ON tweets.tweet_id = tweet_likes.tweet_id
GROUP BY tweet_id
*/
/* TRIGGERS */
/*
DELIMITER $$
CREATE TRIGGER  aumentar_numero_seguidores
	AFTER INSERT ON followers
    FOR EACH ROW
    BEGIN
		UPDATE users SET follower_count = follower_count + 1
        WHERE user_id = NEW.following_id;
        
        UPDATE users SET following_count = following_count + 1
        WHERE user_id = NEW.follower_id;
    END $$

CREATE TRIGGER disminuir_numero_seguidores
AFTER DELETE ON followers
FOR EACH ROW
BEGIN
    UPDATE users SET follower_count = follower_count - 1 WHERE user_id = OLD.following_id;
    UPDATE users SET following_count = following_count - 1 WHERE user_id = OLD.follower_id;
END $$
    
DELIMITER ;
DELIMITER $$
CREATE TRIGGER aumentar_likes
AFTER INSERT ON tweet_likes
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_likes = num_likes + 1 
    WHERE 
        tweet_id = NEW.tweet_id;

END $$

CREATE TRIGGER disminuir_likes
AFTER DELETE ON tweet_likes
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_likes = num_likes - 1 
    WHERE 
        tweet_id = OLD.tweet_id;

END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER aumentar_retweets
AFTER INSERT ON tweet_retweets
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_retweets = num_retweets + 1 
    WHERE 
        tweet_id = NEW.tweet_id;
END $$

CREATE TRIGGER disminuir_retweets
AFTER DELETE ON tweet_retweets
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_retweets = num_retweets - 1 
    WHERE 
        tweet_id = OLD.tweet_id;
END $$

CREATE TRIGGER aumentar_comments
AFTER INSERT ON tweet_comments
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_comments = num_comments + 1 
    WHERE 
        tweet_id = NEW.tweet_id;
END $$

CREATE TRIGGER disminuir_comments
AFTER DELETE ON tweet_comments
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_comments = num_comments - 1 
    WHERE 
        tweet_id = OLD.tweet_id;
END $$
DELIMITER ;
/*
INSERT INTO tweet_likes(user_id, tweet_id)
VALUES
(1,1),
(2,1),
(7,1),
(5,2),
(4,3),
(3, 2),
(6, 2),
(1, 3),
(2, 4),
(7, 4),
(5, 5),
(3, 6),
(4, 7),
(2, 8),
(1, 9),
(1, 19),
(2,19),
(4,18),
(1,18),
(7,18),
(8,18),
(3,18),
(2,17),
(5,15),
(4,17);

INSERT INTO followers(follower_id, following_id)
VALUES
(1,2),
(2,1),
(2,3),
(4,1),
(1,5),
(3,5),
(4,2),
(5,3),
(6,1),
(6,2);

INSERT INTO tweet_retweets(user_id, tweet_id)
VALUES
(3, 1),  
(4, 1),  
(2, 2),
(6, 3), 
(1, 4),  
(5, 5), 
(7, 6), 
(3, 7), 
(4, 8), 
(2, 9), 
(1,19),
(2,18),
(3,18),
(2,17),
(5,15);
*/
CREATE TABLE IF NOT EXISTS direct_messages (
    message_id INT AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id),
    PRIMARY KEY (message_id)
);

CREATE TABLE IF NOT EXISTS retweet_relationships (
    retweet_id INT AUTO_INCREMENT,
    original_tweet_id INT NOT NULL,
    retweeter_id INT NOT NULL,
    FOREIGN KEY (original_tweet_id) REFERENCES tweets(tweet_id),
    FOREIGN KEY (retweeter_id) REFERENCES users(user_id),
    PRIMARY KEY (retweet_id)
);

CREATE TABLE IF NOT EXISTS tweet_reports (
    report_id INT AUTO_INCREMENT,
    tweet_id INT NOT NULL,
    reporter_id INT NOT NULL,
    report_reason VARCHAR(255) NOT NULL,
    reported_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    PRIMARY KEY (report_id)
);

-- Eliminar un usuario y todos sus datos asociados
/*
DELIMITER $$
CREATE PROCEDURE delete_user_and_related_data(IN user_id_to_delete INT)
BEGIN
    -- Eliminar los likes de los tweets del usuario
    DELETE FROM tweet_likes WHERE tweet_id IN (SELECT tweet_id FROM tweets WHERE user_id = user_id_to_delete);

    -- Eliminar los retweets del usuario
    DELETE FROM tweet_retweets WHERE tweet_id IN (SELECT tweet_id FROM tweets WHERE user_id = user_id_to_delete);

    -- Eliminar los comentarios del usuario
    DELETE FROM tweet_comments WHERE tweet_id IN (SELECT tweet_id FROM tweets WHERE user_id = user_id_to_delete);

    -- Eliminar los tweets del usuario
    DELETE FROM tweets WHERE user_id = user_id_to_delete;

    -- Eliminar la relación de seguidores y seguidos del usuario
    DELETE FROM followers WHERE follower_id = user_id_to_delete OR following_id = user_id_to_delete;

    -- Eliminar la imagen de perfil del usuario
    DELETE FROM userImages WHERE user_id = user_id_to_delete;

    -- Eliminar los mensajes directos enviados por el usuario
    DELETE FROM direct_messages WHERE sender_id = user_id_to_delete;

    -- Eliminar los mensajes directos recibidos por el usuario
    DELETE FROM direct_messages WHERE receiver_id = user_id_to_delete;

    -- Eliminar el usuario
    DELETE FROM users WHERE user_id = user_id_to_delete;
END $$

DELIMITER ;
*/
DELIMITER $$
CREATE TRIGGER aumentar_comments
AFTER INSERT ON tweet_comments
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_comments = num_comments + 1 
    WHERE 
        tweet_id = NEW.tweet_id;
END $$

CREATE TRIGGER disminuir_comments
AFTER DELETE ON tweet_comments
FOR EACH ROW
BEGIN
    UPDATE tweets SET 
        num_comments = num_comments - 1 
    WHERE 
        tweet_id = OLD.tweet_id;
END $$
DELIMITER ;


SET SQL_SAFE_UPDATES = 0;
CALL delete_user_and_related_data(17);




