-- Agregar columna stand a la tabla users
ALTER TABLE `users` 
ADD COLUMN `stand` VARCHAR(100) NULL DEFAULT NULL AFTER `company`;
