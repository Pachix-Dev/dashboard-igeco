-- Tabla opcional para registrar las transacciones de compra de expositores
-- Ejecuta este script si deseas llevar un historial de pagos

CREATE TABLE IF NOT EXISTS exhibitor_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  payment_id VARCHAR(100) NOT NULL UNIQUE,
  amount_slots INT NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MXN',
  previous_limit INT NOT NULL,
  new_limit INT NULL, -- NULL si está PENDING
  payment_status VARCHAR(50) NOT NULL, -- PENDING, COMPLETED, FAILED, REFUNDED
  applied BOOLEAN DEFAULT FALSE, -- TRUE si ya se aplicó el límite
  user_locale VARCHAR(2) DEFAULT 'es', -- Idioma del usuario (es, en, it)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL, -- Cuando se completó realmente
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_payment_id (payment_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_applied (applied),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios de la tabla
ALTER TABLE exhibitor_payments 
  COMMENT = 'Tabla para registrar las transacciones de compra de espacios de expositores';
