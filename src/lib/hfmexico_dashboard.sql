-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 26-11-2025 a las 23:43:59
-- Versión del servidor: 8.0.44
-- Versión de PHP: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hfmexico_dashboard`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias`
--

CREATE TABLE `dias` (
  `id` int NOT NULL,
  `name_esp` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name_eng` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escenarios`
--

CREATE TABLE `escenarios` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escenario_dias`
--

CREATE TABLE `escenario_dias` (
  `id` int NOT NULL,
  `escenario_id` int NOT NULL,
  `dia_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exhibitors`
--

CREATE TABLE `exhibitors` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `impresiones` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exhibitor_payments`
--

CREATE TABLE `exhibitor_payments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount_slots` int NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'MXN',
  `previous_limit` int NOT NULL,
  `new_limit` int DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla para registrar las transacciones de compra de espacios de expositores';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leads`
--

CREATE TABLE `leads` (
  `id` int NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ponentes`
--

CREATE TABLE `ponentes` (
  `id` int NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bio_esp` longtext COLLATE utf8mb4_general_ci,
  `bio_eng` longtext COLLATE utf8mb4_general_ci,
  `photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `impresiones` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programa`
--

CREATE TABLE `programa` (
  `id` int NOT NULL,
  `title_esp` text COLLATE utf8mb4_general_ci NOT NULL,
  `title_eng` text COLLATE utf8mb4_general_ci NOT NULL,
  `description_esp` longtext COLLATE utf8mb4_general_ci,
  `description_eng` longtext COLLATE utf8mb4_general_ci,
  `duration` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `time` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `escenario_id` int NOT NULL,
  `dia_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programa_speakers`
--

CREATE TABLE `programa_speakers` (
  `id` int NOT NULL,
  `programa_id` int NOT NULL,
  `speaker_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `maxsessions` int DEFAULT NULL,
  `maxexhibitors` int NOT NULL,
  `event` varchar(2555) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imprimir_gafete` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `session_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dias`
--
ALTER TABLE `dias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `escenarios`
--
ALTER TABLE `escenarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `escenario_dias`
--
ALTER TABLE `escenario_dias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `escenario_id` (`escenario_id`),
  ADD KEY `dia_id` (`dia_id`);

--
-- Indices de la tabla `exhibitors`
--
ALTER TABLE `exhibitors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `exhibitor_payments`
--
ALTER TABLE `exhibitor_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_id` (`payment_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_payment_id` (`payment_id`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_applied` (`applied`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indices de la tabla `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indices de la tabla `ponentes`
--
ALTER TABLE `ponentes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `programa`
--
ALTER TABLE `programa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `escenario_id` (`escenario_id`),
  ADD KEY `dia_id` (`dia_id`);

--
-- Indices de la tabla `programa_speakers`
--
ALTER TABLE `programa_speakers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `programa_id` (`programa_id`),
  ADD KEY `programa_speakers_ibfk_2` (`speaker_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dias`
--
ALTER TABLE `dias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `escenarios`
--
ALTER TABLE `escenarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `escenario_dias`
--
ALTER TABLE `escenario_dias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `exhibitors`
--
ALTER TABLE `exhibitors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `exhibitor_payments`
--
ALTER TABLE `exhibitor_payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ponentes`
--
ALTER TABLE `ponentes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `programa`
--
ALTER TABLE `programa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `programa_speakers`
--
ALTER TABLE `programa_speakers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `escenario_dias`
--
ALTER TABLE `escenario_dias`
  ADD CONSTRAINT `escenario_dias_ibfk_1` FOREIGN KEY (`escenario_id`) REFERENCES `escenarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `escenario_dias_ibfk_2` FOREIGN KEY (`dia_id`) REFERENCES `dias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `exhibitors`
--
ALTER TABLE `exhibitors`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `exhibitor_payments`
--
ALTER TABLE `exhibitor_payments`
  ADD CONSTRAINT `exhibitor_payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `programa`
--
ALTER TABLE `programa`
  ADD CONSTRAINT `programa_ibfk_1` FOREIGN KEY (`escenario_id`) REFERENCES `escenarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `programa_ibfk_2` FOREIGN KEY (`dia_id`) REFERENCES `dias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `programa_speakers`
--
ALTER TABLE `programa_speakers`
  ADD CONSTRAINT `programa_speakers_ibfk_1` FOREIGN KEY (`programa_id`) REFERENCES `programa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `programa_speakers_ibfk_2` FOREIGN KEY (`speaker_id`) REFERENCES `ponentes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
