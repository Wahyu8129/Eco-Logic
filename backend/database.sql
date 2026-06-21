CREATE DATABASE IF NOT EXISTS eco_logic_db;

USE eco_logic_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
        'Bank Sampah Melati',
        'Jl. Melati No. 12, Jakarta',
        -6.2088,
        106.8456,
        '["Plastik", "Kertas"]'
    ),
    (
        'Pusat Daur Ulang Jakarta',
        'Jl. Sudirman No. 45, Jakarta',
        -6.1950,
        106.8200,
        '["Elektronik"]'
    ),
    (
        'Drop Box Botol Kaca',
        'Jl. Thamrin No. 10, Jakarta',
        -6.2150,
        106.8300,
        '["Kaca"]'
    );