CREATE DATABASE IF NOT EXISTS eco_logic_db;

USE eco_logic_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    points INT DEFAULT 0,
    exp INT DEFAULT 0,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin Account (password: admin123)
-- Hash generated using bcrypt for 'admin123'
INSERT INTO users (name, email, password_hash, role) 
VALUES ('AdminEco', 'AdminEco@gmail.com', '$2b$10$XWmtHd9HXNTOUTbpPLWCxebCa6GnWNo/cBT9FUT.vRUn3zZl1P9ve', 'admin')
ON DUPLICATE KEY UPDATE role='admin';

CREATE TABLE IF NOT EXISTS waste_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    handling_sop TEXT,
    danger_level ENUM ('Rendah', 'Sedang', 'Tinggi') DEFAULT 'Rendah',
    reward_points INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disposal_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accepted_waste_types JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    waste_category_id INT,
    action_type ENUM ('Identify', 'Dispose') NOT NULL,
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (waste_category_id) REFERENCES waste_categories (id) ON DELETE SET NULL
);

-- Insert dummy categories
INSERT INTO
    waste_categories (
        name,
        description,
        handling_sop,
        danger_level,
        reward_points
    )
VALUES
    (
        'Plastik',
        'Botol plastik, kemasan, dll.',
        'Bersihkan dan keringkan sebelum dibuang ke bank sampah.',
        'Rendah',
        20
    ),
    (
        'Baterai Bekas',
        'Baterai AA, AAA, aki, dll.',
        'Kumpulkan dalam wadah kedap air dan bawa ke lokasi e-waste terdekat.',
        'Tinggi',
        50
    );

-- Insert dummy disposal locations
INSERT INTO
    disposal_locations (
        name,
        address,
        latitude,
        longitude,
        accepted_waste_types
    )
VALUES
    (
        'Bank Sampah RW 03 Sarijadi',
        'Sarijadi, Kec. Sukasari, Kota Bandung',
        -6.87602000,
        107.58405000,
        '["Plastik", "Kertas", "Logam"]'
    ),
    (
        'Bank Sampah RW 10 Cijerokaso',
        'Jl. Cijerokaso, Sarijadi, Bandung',
        -6.87951000,
        107.58253000,
        '["Plastik", "Organik"]'
    ),
    (
        'TPS Sarimadu (Sukarasa)',
        'Jl. Sarimadu, Sukarasa, Sukasari, Bandung',
        -6.87453000,
        107.58801000,
        '["Organik", "Kaca", "Residu"]'
    ),
    (
        'TPS Gegerkalong Hilir',
        'Jl. Gegerkalong Hilir, Sukasari, Bandung',
        -6.86601000,
        107.59005000,
        '["Organik", "Plastik"]'
    ),
    (
        'Bank Sampah Induk Gedebage',
        'Kawasan Gedebage, Bandung',
        -6.93502000,
        107.68801000,
        '["Plastik", "Kertas", "Elektronik"]'
    ),
    (
        'TPS Tegallega',
        'Kawasan Taman Tegallega, Bandung',
        -6.93805000,
        107.60305000,
        '["Organik", "Residu"]'
    ),
    (
        'Bank Sampah Ciumbuleuit',
        'Jl. Ciumbuleuit, Cidadap, Bandung',
        -6.87701000,
        107.60405000,
        '["Plastik", "Kertas"]'
    );