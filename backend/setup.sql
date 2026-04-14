-- Database: Montclair

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) DEFAULT 'Montclair',
    price DECIMAL(10, 2) NOT NULL,
    originalPrice DECIMAL(10, 2),
    image VARCHAR(255),
    images JSON, -- To store array of image URLs
    category ENUM('classic', 'sport', 'premium') NOT NULL,
    collection ENUM('chronograph', 'heritage', 'diver', 'aviator') NOT NULL,
    strapType ENUM('leather', 'metal', 'silicone') NOT NULL,
    dialColor VARCHAR(50),
    inStock BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    reviewCount INT DEFAULT 0,
    reference VARCHAR(50) UNIQUE,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    -- Specs stored as individual columns for easier filtering
    caseSize VARCHAR(50),
    movement VARCHAR(100),
    waterResistance VARCHAR(50),
    powerReserve VARCHAR(50),
    caseMaterial VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, product_id)
);

-- Add isAdmin and role to users
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('processing', 'shipped', 'delivered', 'refunded') DEFAULT 'processing',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
