CREATE DATABASE IF NOT EXISTS pos;
USE pos;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    description TEXT NOT NULL,
    brand VARCHAR(100),
    img TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO products (name, price, stock, description, brand, img, active) VALUES
    ('Laptop Pro 14', 21999.00, 12, 'Laptop de 14 pulgadas para trabajo y estudio.', 'Nova', 'laptop-pro-14.jpg', TRUE),
    ('Mouse Inalambrico', 399.00, 45, 'Mouse inalambrico con conexion Bluetooth.', 'Nova', 'mouse-inalambrico.jpg', TRUE),
    ('Teclado Mecanico', 1299.00, 20, 'Teclado mecanico con retroiluminacion.', 'Keycraft', 'teclado-mecanico.jpg', TRUE),
    ('Monitor 24 Pulgadas', 3299.00, 18, 'Monitor Full HD de 24 pulgadas.', 'Vision', 'monitor-24.jpg', TRUE),
    ('Audifonos Bluetooth Inactivo', 899.00, 35, 'Audifonos Bluetooth inactivos para pruebas.', 'Soundix', 'audifonos-bluetooth.jpg', FALSE);

