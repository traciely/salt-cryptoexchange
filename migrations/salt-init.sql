/*
 * if you need to re-create the db
 *  DROP DATABASE IF EXISTS salt;
 * CREATE DATABASE IF NOT EXISTS salt;
 */

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_name` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SHOW WARNINGS;

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `from_currency_id` int(10) NOT NULL,
  `to_currency_id` int(10) NOT NULL,
  `amount` int(10) NOT NULL,
  `order_price` decimal(65, 10) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SHOW WARNINGS;

DROP TABLE IF EXISTS currencies;
CREATE TABLE currencies (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fsym` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_name` (`name`),
  UNIQUE KEY `ux_fsym` (`fsym`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SHOW WARNINGS;

DROP TABLE IF EXISTS user_currency_totals;
CREATE TABLE user_currency_totals (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `currency_id` int(10) NOT NULL,
  `amount` decimal(65, 10) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_currency` (`user_id`, `currency_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SHOW WARNINGS;

INSERT INTO currencies (`name`,`fsym`) VALUES ("US Dollar", "USD");
INSERT INTO currencies (`name`, `fsym`) VALUES ("Bitcoin", "BTC");
INSERT INTO currencies (`name`, `fsym`) VALUES ("Litecoin", "LTC");
INSERT INTO currencies (`name`, `fsym`) VALUES ("Dogecoin", "DOGE");
INSERT INTO currencies (`name`, `fsym`) VALUES ("Monero", "XMR");
SHOW WARNINGS;