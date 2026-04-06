IF DB_ID('petshop_db') IS NULL
BEGIN
    CREATE DATABASE petshop_db;
END;
GO

USE petshop_db;
GO

CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
GO

CREATE TABLE animal_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
GO

CREATE TABLE products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(MAX),
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    stock INT NOT NULL DEFAULT 0,
    category_id INT NOT NULL,
    animal_type_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (animal_type_id) REFERENCES animal_types(id)
);
GO

INSERT INTO categories (name) VALUES
('Hrana'),
('Accesorii'),
('Jucarii');
GO

INSERT INTO animal_types (name) VALUES
('Caine'),
('Pisica'),
('Pasare');
GO

INSERT INTO products (name, description, price, image_url, stock, category_id, animal_type_id)
VALUES
('Hrana uscata Premium Dog', 'Hrana uscata pentru caini adulti.', 49.99, 'dog-food.jpg', 20, 1, 1),
('Minge pentru caini', 'Jucarie rezistenta pentru joaca.', 19.50, 'dog-ball.jpg', 35, 3, 1),
('Ansamblu de joaca pentru pisici', 'Centru de joaca pentru pisici de interior.', 199.99, 'cat-tree.jpg', 10, 2, 2),
('Hrana umeda pentru pisici', 'Plic hrana umeda cu somon.', 7.99, 'cat-food.jpg', 50, 1, 2),
('Colivie pentru pasari', 'Colivie spatioasa pentru pasari mici.', 149.90, 'bird-cage.jpg', 8, 2, 3);
GO