-- Script para agregar el campo 'company' a la tabla 'exhibitors'
-- Ejecuta este script en tu base de datos MySQL

-- Primero verificamos si la columna ya existe antes de agregarla
-- Para evitar errores si ya fue ejecutado

ALTER TABLE exhibitors 
ADD COLUMN IF NOT EXISTS company VARCHAR(200) NULL AFTER nationality;

-- Nota: Si tu versión de MySQL no soporta 'IF NOT EXISTS', usa este script alternativo:
-- 
-- SET @dbname = DATABASE();
-- SET @tablename = "exhibitors";
-- SET @columnname = "company";
-- SET @preparedStatement = (SELECT IF(
--   (
--     SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
--     WHERE
--       (table_name = @tablename)
--       AND (table_schema = @dbname)
--       AND (column_name = @columnname)
--   ) > 0,
--   "SELECT 1",
--   CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(200) NULL AFTER nationality;")
-- ));
-- PREPARE alterIfNotExists FROM @preparedStatement;
-- EXECUTE alterIfNotExists;
-- DEALLOCATE PREPARE alterIfNotExists;

-- Verificar que la columna se agregó correctamente
DESCRIBE exhibitors;
