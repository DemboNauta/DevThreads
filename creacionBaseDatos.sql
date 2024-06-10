/* BASE DE DATOS */
CREATE DATABASE IF NOT EXISTS devthreads_db;
USE devthreads_db;

/* TABLAS */
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email_address VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phonenumber CHAR(10),
    follower_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_image BLOB,
    password VARCHAR(255) NOT NULL, 
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS followers (
	follower_id INT NOT NULL, 
    following_id INT NOT NULL, 
    FOREIGN KEY(follower_id) REFERENCES users(user_id),
	FOREIGN KEY(following_id) REFERENCES users(user_id),
    CONSTRAINT check_follower_id CHECK (follower_id != following_id),
	PRIMARY KEY(follower_id, following_id)
);

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

CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* TRIGGERS */

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

/* PROCEDIMIENTO */

CREATE PROCEDURE delete_user_and_related_data(IN user_id_to_delete INT)
BEGIN
    -- Elimina los likes de los tweets del usuario
    DELETE FROM tweet_likes WHERE tweet_id IN (SELECT tweet_id FROM tweets WHERE user_id = user_id_to_delete);

    -- Elimina los retweets del usuario
    DELETE FROM tweet_retweets WHERE tweet_id IN (SELECT tweet_id FROM tweets WHERE user_id = user_id_to_delete);

    -- Elimina los comentarios del usuario
    DELETE FROM tweet_comments WHERE tweet_id IN (SELECT tweet_id FROM tweets WHERE user_id = user_id_to_delete);

    -- Elimina los tweets del usuario
    DELETE FROM tweets WHERE user_id = user_id_to_delete;

    -- Elimina la relación de seguidores y seguidos del usuario
    DELETE FROM followers WHERE follower_id = user_id_to_delete OR following_id = user_id_to_delete;

    -- Elimina los mensajes directos enviados por el usuario
    DELETE FROM direct_messages WHERE sender_id = user_id_to_delete;

    -- Elimina los mensajes directos recibidos por el usuario
    DELETE FROM direct_messages WHERE receiver_id = user_id_to_delete;

    -- Elimina el usuario
    DELETE FROM users WHERE user_id = user_id_to_delete;
END $$

DELIMITER ;








