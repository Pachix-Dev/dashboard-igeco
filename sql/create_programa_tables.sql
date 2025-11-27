-- =====================================================
-- SISTEMA DE GESTIÓN DE PROGRAMA DE CONFERENCIAS
-- =====================================================
-- Estructura: Escenarios -> Días -> Conferencias -> Ponentes
-- Acceso: admin y editor
-- =====================================================

-- Tabla: Escenarios (Stages/Venues)
-- Representa los diferentes espacios donde se realizan las conferencias
CREATE TABLE IF NOT EXISTS escenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    capacity INT,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (active),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Días del programa
-- Representa los días en que hay actividades en cada escenario
CREATE TABLE IF NOT EXISTS programa_dias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escenario_id INT NOT NULL,
    date DATE NOT NULL,
    name VARCHAR(255),
    description TEXT,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (escenario_id) REFERENCES escenarios(id) ON DELETE CASCADE,
    INDEX idx_escenario_date (escenario_id, date),
    INDEX idx_active (active),
    UNIQUE KEY unique_escenario_date (escenario_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Conferencias/Sesiones
-- Representa las conferencias individuales dentro de cada día
CREATE TABLE IF NOT EXISTS programa_conferencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(255),
    type ENUM('keynote', 'panel', 'workshop', 'presentation', 'networking', 'other') DEFAULT 'presentation',
    capacity INT,
    tags JSON,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dia_id) REFERENCES programa_dias(id) ON DELETE CASCADE,
    INDEX idx_dia_time (dia_id, start_time),
    INDEX idx_active (active),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Relación Conferencias-Ponentes (Muchos a Muchos)
-- Conecta las conferencias con los ponentes que participan
CREATE TABLE IF NOT EXISTS programa_conferencia_ponentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conferencia_id INT NOT NULL,
    ponente_id INT NOT NULL,
    role ENUM('speaker', 'moderator', 'panelist', 'guest') DEFAULT 'speaker',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conferencia_id) REFERENCES programa_conferencias(id) ON DELETE CASCADE,
    FOREIGN KEY (ponente_id) REFERENCES ponentes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conferencia_ponente (conferencia_id, ponente_id),
    INDEX idx_conferencia (conferencia_id),
    INDEX idx_ponente (ponente_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Programa completo con todas las relaciones
CREATE OR REPLACE VIEW v_programa_completo AS
SELECT 
    e.id AS escenario_id,
    e.name AS escenario_name,
    e.location AS escenario_location,
    pd.id AS dia_id,
    pd.date AS dia_date,
    pd.name AS dia_name,
    pc.id AS conferencia_id,
    pc.title AS conferencia_title,
    pc.description AS conferencia_description,
    pc.start_time,
    pc.end_time,
    pc.room,
    pc.type AS conferencia_type,
    pc.capacity,
    GROUP_CONCAT(
        CONCAT(p.name, '|', p.position, '|', p.company, '|', pcp.role)
        ORDER BY pcp.order_index
        SEPARATOR '||'
    ) AS ponentes_info
FROM escenarios e
LEFT JOIN programa_dias pd ON e.id = pd.escenario_id
LEFT JOIN programa_conferencias pc ON pd.id = pc.dia_id
LEFT JOIN programa_conferencia_ponentes pcp ON pc.id = pcp.conferencia_id
LEFT JOIN ponentes p ON pcp.ponente_id = p.id
WHERE e.active = 1 AND (pd.active IS NULL OR pd.active = 1) AND (pc.active IS NULL OR pc.active = 1)
GROUP BY e.id, pd.id, pc.id
ORDER BY pd.date, pc.start_time;

-- Vista: Resumen de conferencias por día
CREATE OR REPLACE VIEW v_conferencias_por_dia AS
SELECT 
    pd.id AS dia_id,
    pd.date,
    pd.name AS dia_name,
    e.name AS escenario_name,
    COUNT(pc.id) AS total_conferencias,
    COUNT(DISTINCT pcp.ponente_id) AS total_ponentes,
    MIN(pc.start_time) AS primera_sesion,
    MAX(pc.end_time) AS ultima_sesion
FROM programa_dias pd
LEFT JOIN escenarios e ON pd.escenario_id = e.id
LEFT JOIN programa_conferencias pc ON pd.id = pc.dia_id AND pc.active = 1
LEFT JOIN programa_conferencia_ponentes pcp ON pc.id = pcp.conferencia_id
WHERE pd.active = 1 AND e.active = 1
GROUP BY pd.id, pd.date, pd.name, e.name
ORDER BY pd.date;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTADO)
-- =====================================================

/*
-- Insertar escenarios de ejemplo
INSERT INTO escenarios (name, description, location, capacity) VALUES
('Sala Principal', 'Auditorio principal para conferencias magistrales', 'Piso 1', 500),
('Sala Técnica', 'Sala para presentaciones técnicas y talleres', 'Piso 2', 150),
('Sala Networking', 'Espacio para networking y paneles', 'Piso 1', 200);

-- Insertar días de ejemplo
INSERT INTO programa_dias (escenario_id, date, name) VALUES
(1, '2026-03-15', 'Día 1 - Apertura'),
(1, '2026-03-16', 'Día 2 - Innovación'),
(2, '2026-03-15', 'Día 1 - Talleres'),
(2, '2026-03-16', 'Día 2 - Talleres');
*/

-- =====================================================
-- NOTAS DE USO
-- =====================================================
-- 1. Los usuarios con role='admin' o role='editor' pueden gestionar el programa
-- 2. Usar transacciones al crear conferencias con múltiples ponentes
-- 3. Las vistas proporcionan consultas optimizadas para el frontend
-- 4. Los índices mejoran el rendimiento en búsquedas y filtros
-- 5. Las claves foráneas con ON DELETE CASCADE mantienen la integridad
