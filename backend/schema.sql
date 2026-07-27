CREATE DATABASE IF NOT EXISTS mars_lab_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mars_lab_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  customer_count TINYINT UNSIGNED NOT NULL DEFAULT 1,
  memo VARCHAR(255) NOT NULL DEFAULT '',
  meals JSON NOT NULL,
  pay_type VARCHAR(50) NOT NULL,
  pickup_type VARCHAR(50) NOT NULL,
  delivery_address VARCHAR(255) NULL,
  selected_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_orders_created_at (created_at),
  INDEX idx_orders_status (status)
);
