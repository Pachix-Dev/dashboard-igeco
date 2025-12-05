-- Agregar columna scanleads_purchased a la tabla users
-- Esta columna controla el acceso al módulo Scan Leads (producto de pago)

ALTER TABLE users 
ADD COLUMN scanleads_purchased TINYINT(1) DEFAULT 0 COMMENT 'Indica si el usuario ha comprado el módulo Scan Leads (0=no, 1=sí)';

-- Crear índice para mejorar las consultas
CREATE INDEX idx_scanleads_purchased ON users(scanleads_purchased);

-- Comentario explicativo
-- scanleads_purchased = 0: Usuario no tiene acceso al módulo (default)
-- scanleads_purchased = 1: Usuario ha comprado el módulo y puede usarlo
