-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Mar 10, 2026 alle 12:42
-- Versione del server: 10.3.39-MariaDB-log
-- Versione PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pagnanvisuallab_db`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheels`
--

CREATE TABLE `am_wheels` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `customer_supplier` int(11) UNSIGNED NOT NULL,
  `makers_code` varchar(25) NOT NULL,
  `model` int(11) UNSIGNED NOT NULL,
  `wheel_type` varchar(15) NOT NULL DEFAULT '',
  `version` varchar(10) NOT NULL DEFAULT '',
  `diameter` tinyint(3) UNSIGNED NOT NULL,
  `width` decimal(5,2) NOT NULL,
  `rim_type` varchar(22) NOT NULL DEFAULT '',
  `et` decimal(5,2) NOT NULL,
  `pcd` int(11) UNSIGNED NOT NULL,
  `cb` int(11) UNSIGNED NOT NULL,
  `fixing_hole` int(11) UNSIGNED NOT NULL,
  `cap` int(11) UNSIGNED NOT NULL,
  `spoke` varchar(25) NOT NULL DEFAULT '',
  `weight` decimal(7,2) NOT NULL,
  `max_load` decimal(7,2) NOT NULL,
  `max_load_rolling` decimal(7,2) NOT NULL,
  `note` varchar(255) NOT NULL DEFAULT '',
  `status` varchar(25) NOT NULL,
  `homologation_name` varchar(50) NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheels_sandbox`
--

CREATE TABLE `am_wheels_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `customer_supplier` int(11) UNSIGNED NOT NULL,
  `makers_code` varchar(25) NOT NULL,
  `model` int(11) UNSIGNED NOT NULL,
  `wheel_type` varchar(15) NOT NULL DEFAULT '',
  `version` varchar(10) NOT NULL DEFAULT '',
  `diameter` tinyint(3) UNSIGNED NOT NULL,
  `width` decimal(5,2) NOT NULL,
  `rim_type` varchar(15) NOT NULL DEFAULT '',
  `et` decimal(5,2) NOT NULL,
  `pcd` int(11) UNSIGNED NOT NULL,
  `cb` int(11) UNSIGNED NOT NULL,
  `fixing_hole` int(11) UNSIGNED NOT NULL,
  `cap` int(11) UNSIGNED NOT NULL,
  `spoke` varchar(25) NOT NULL DEFAULT '',
  `weight` decimal(7,2) NOT NULL,
  `max_load` decimal(7,2) NOT NULL,
  `max_load_rolling` decimal(7,2) NOT NULL,
  `note` varchar(255) NOT NULL DEFAULT '',
  `status` varchar(25) NOT NULL,
  `homologation_name` varchar(50) NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheel_lines`
--

CREATE TABLE `am_wheel_lines` (
  `id` int(11) UNSIGNED NOT NULL,
  `line` varchar(100) NOT NULL DEFAULT '',
  `logo` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheel_lines_sandbox`
--

CREATE TABLE `am_wheel_lines_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `line` varchar(100) NOT NULL DEFAULT '',
  `logo` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheel_models`
--

CREATE TABLE `am_wheel_models` (
  `id` int(11) UNSIGNED NOT NULL,
  `line` int(11) UNSIGNED NOT NULL,
  `code` varchar(15) NOT NULL DEFAULT '',
  `model` varchar(100) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheel_models_sandbox`
--

CREATE TABLE `am_wheel_models_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `line` int(11) UNSIGNED NOT NULL,
  `code` varchar(15) NOT NULL DEFAULT '',
  `model` varchar(100) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheel_versions`
--

CREATE TABLE `am_wheel_versions` (
  `id` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `finish` varchar(50) NOT NULL DEFAULT '',
  `status` varchar(25) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `am_wheel_versions_sandbox`
--

CREATE TABLE `am_wheel_versions_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `finish` varchar(50) NOT NULL DEFAULT '',
  `status` varchar(25) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `api_applications`
--

CREATE TABLE `api_applications` (
  `id` int(11) UNSIGNED NOT NULL,
  `car_manufacturer` varchar(100) NOT NULL DEFAULT '',
  `car_model` varchar(255) NOT NULL DEFAULT '',
  `year` varchar(10) NOT NULL DEFAULT '',
  `code` varchar(25) NOT NULL DEFAULT '',
  `line` varchar(100) NOT NULL DEFAULT '',
  `model` varchar(100) NOT NULL DEFAULT '',
  `diameter` tinyint(3) UNSIGNED NOT NULL,
  `width` decimal(5,2) NOT NULL,
  `et` decimal(5,2) NOT NULL,
  `homologation` varchar(100) NOT NULL DEFAULT '',
  `limitation` varchar(50) NOT NULL DEFAULT '',
  `fitment_advice` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications`
--

CREATE TABLE `applications` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `centering_ring` int(11) UNSIGNED NOT NULL,
  `bolt_nut` int(11) UNSIGNED NOT NULL,
  `homologation_tuv` varchar(25) NOT NULL DEFAULT '',
  `homologation_tuv_doc` varchar(255) NOT NULL,
  `note_tuv` varchar(250) DEFAULT NULL,
  `homologation_kba` varchar(25) NOT NULL DEFAULT '',
  `homologation_kba_doc` varchar(255) NOT NULL,
  `note_kba` varchar(255) DEFAULT NULL,
  `homologation_ece` varchar(25) NOT NULL DEFAULT '',
  `homologation_ece_doc` varchar(255) NOT NULL,
  `note_ece` varchar(255) DEFAULT NULL,
  `homologation_jwl` varchar(25) NOT NULL DEFAULT '',
  `homologation_jwl_doc` varchar(255) NOT NULL,
  `homologation_ita` varchar(25) NOT NULL DEFAULT '',
  `homologation_ita_doc` varchar(255) NOT NULL,
  `note_ita` varchar(255) DEFAULT NULL,
  `limitation` varchar(250) NOT NULL DEFAULT '',
  `limitation_IT` varchar(250) NOT NULL,
  `fitment_type` varchar(3) NOT NULL,
  `fitment_advice` varchar(100) NOT NULL DEFAULT '',
  `plug_play` tinyint(1) UNSIGNED NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications_BK`
--

CREATE TABLE `applications_BK` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `centering_ring` int(11) UNSIGNED NOT NULL,
  `bolt_nut` int(11) UNSIGNED NOT NULL,
  `homologation_tuv` varchar(25) NOT NULL DEFAULT '',
  `homologation_tuv_doc` varchar(255) NOT NULL,
  `note_tuv` varchar(250) DEFAULT NULL,
  `homologation_kba` varchar(25) NOT NULL DEFAULT '',
  `homologation_kba_doc` varchar(255) NOT NULL,
  `note_kba` varchar(255) DEFAULT NULL,
  `homologation_ece` varchar(25) NOT NULL DEFAULT '',
  `homologation_ece_doc` varchar(255) NOT NULL,
  `note_ece` varchar(255) DEFAULT NULL,
  `homologation_jwl` varchar(25) NOT NULL DEFAULT '',
  `homologation_jwl_doc` varchar(255) NOT NULL,
  `homologation_ita` varchar(25) NOT NULL DEFAULT '',
  `homologation_ita_doc` varchar(255) NOT NULL,
  `note_ita` varchar(255) DEFAULT NULL,
  `limitation` varchar(250) NOT NULL DEFAULT '',
  `limitation_IT` varchar(250) NOT NULL,
  `fitment_type` varchar(3) NOT NULL,
  `fitment_advice` varchar(100) NOT NULL DEFAULT '',
  `plug_play` tinyint(1) UNSIGNED NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications_BK2103`
--

CREATE TABLE `applications_BK2103` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `centering_ring` int(11) UNSIGNED NOT NULL,
  `bolt_nut` int(11) UNSIGNED NOT NULL,
  `homologation_tuv` varchar(25) NOT NULL DEFAULT '',
  `homologation_tuv_doc` varchar(255) NOT NULL,
  `note_tuv` varchar(250) DEFAULT NULL,
  `homologation_kba` varchar(25) NOT NULL DEFAULT '',
  `homologation_kba_doc` varchar(255) NOT NULL,
  `note_kba` varchar(255) DEFAULT NULL,
  `homologation_ece` varchar(25) NOT NULL DEFAULT '',
  `homologation_ece_doc` varchar(255) NOT NULL,
  `note_ece` varchar(255) DEFAULT NULL,
  `homologation_jwl` varchar(25) NOT NULL DEFAULT '',
  `homologation_jwl_doc` varchar(255) NOT NULL,
  `homologation_ita` varchar(25) NOT NULL DEFAULT '',
  `homologation_ita_doc` varchar(255) NOT NULL,
  `note_ita` varchar(255) DEFAULT NULL,
  `limitation` varchar(250) NOT NULL DEFAULT '',
  `limitation_IT` varchar(250) NOT NULL,
  `fitment_type` varchar(3) NOT NULL,
  `fitment_advice` varchar(100) NOT NULL DEFAULT '',
  `plug_play` tinyint(1) UNSIGNED NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications_brakes`
--

CREATE TABLE `applications_brakes` (
  `id` int(11) UNSIGNED NOT NULL,
  `application` int(11) UNSIGNED NOT NULL,
  `brake` int(11) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications_test`
--

CREATE TABLE `applications_test` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `centering_ring` int(11) UNSIGNED NOT NULL,
  `bolt_nut` int(11) UNSIGNED NOT NULL,
  `homologation_tuv` varchar(25) NOT NULL DEFAULT '',
  `homologation_tuv_doc` varchar(255) NOT NULL,
  `note_tuv` varchar(250) DEFAULT NULL,
  `homologation_kba` varchar(25) NOT NULL DEFAULT '',
  `homologation_kba_doc` varchar(255) NOT NULL,
  `note_kba` varchar(255) DEFAULT NULL,
  `homologation_ece` varchar(25) NOT NULL DEFAULT '',
  `homologation_ece_doc` varchar(255) NOT NULL,
  `note_ece` varchar(255) DEFAULT NULL,
  `homologation_jwl` varchar(25) NOT NULL DEFAULT '',
  `homologation_jwl_doc` varchar(255) NOT NULL,
  `homologation_ita` varchar(25) NOT NULL DEFAULT '',
  `homologation_ita_doc` varchar(255) NOT NULL,
  `note_ita` varchar(255) DEFAULT NULL,
  `limitation` varchar(250) NOT NULL DEFAULT '',
  `limitation_IT` varchar(250) NOT NULL,
  `fitment_type` varchar(3) NOT NULL,
  `fitment_advice` varchar(100) NOT NULL DEFAULT '',
  `plug_play` tinyint(1) UNSIGNED NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications_tpms`
--

CREATE TABLE `applications_tpms` (
  `id` int(11) UNSIGNED NOT NULL,
  `application` int(11) UNSIGNED NOT NULL,
  `tpms` int(11) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `applications_tyres`
--

CREATE TABLE `applications_tyres` (
  `id` int(11) UNSIGNED NOT NULL,
  `application` int(11) UNSIGNED NOT NULL,
  `tyre` int(11) UNSIGNED NOT NULL,
  `note` varchar(80) NOT NULL DEFAULT '',
  `load_speed_index` varchar(30) NOT NULL DEFAULT '',
  `type` varchar(25) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `BK_load_cases`
--

CREATE TABLE `BK_load_cases` (
  `id` int(11) NOT NULL,
  `rlcode` varchar(55) NOT NULL,
  `lc_max_load` decimal(7,2) DEFAULT NULL,
  `lc_max_load_rolling` decimal(7,2) DEFAULT NULL,
  `lc_et` decimal(5,2) DEFAULT NULL,
  `ece_rolling_tire` varchar(55) NOT NULL,
  `ece_impact_tire` varchar(55) NOT NULL,
  `sae_rolling_tire` varchar(55) NOT NULL,
  `sae_impact_tire` varchar(55) NOT NULL,
  `dynamic_radius` decimal(10,2) DEFAULT NULL,
  `m_max_100` decimal(10,2) DEFAULT NULL,
  `short_test_75` decimal(10,2) DEFAULT NULL,
  `long_test_50` decimal(10,2) DEFAULT NULL,
  `load_lc` decimal(10,2) DEFAULT NULL,
  `impact_mass_ece` decimal(10,2) DEFAULT NULL,
  `s_2_corner` decimal(10,2) DEFAULT NULL,
  `s_1_6_corner` decimal(10,2) DEFAULT NULL,
  `s_1_35_corner` decimal(10,2) DEFAULT NULL,
  `s_2_5_radial` decimal(10,2) DEFAULT NULL,
  `s_2_radial` decimal(10,2) DEFAULT NULL,
  `impact_mass_sae` decimal(10,2) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `bolt_nuts`
--

CREATE TABLE `bolt_nuts` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `line` varchar(25) NOT NULL DEFAULT '',
  `type` varchar(10) NOT NULL DEFAULT '',
  `size` int(11) NOT NULL,
  `length` varchar(11) NOT NULL DEFAULT '',
  `connection` int(11) UNSIGNED NOT NULL,
  `key` varchar(10) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `bolt_nut_connections`
--

CREATE TABLE `bolt_nut_connections` (
  `id` int(11) UNSIGNED NOT NULL,
  `connection` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `bolt_nut_connections_sandbox`
--

CREATE TABLE `bolt_nut_connections_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `connection` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `bolt_nut_sizes`
--

CREATE TABLE `bolt_nut_sizes` (
  `id` int(11) UNSIGNED NOT NULL,
  `thread_diameter` varchar(25) NOT NULL DEFAULT '',
  `thread_pitch` varchar(25) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `brakes`
--

CREATE TABLE `brakes` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(15) NOT NULL DEFAULT '',
  `source` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `version` varchar(80) NOT NULL DEFAULT '',
  `kw` varchar(20) NOT NULL,
  `year` varchar(4) NOT NULL DEFAULT '',
  `min_oe_size` tinyint(5) UNSIGNED NOT NULL,
  `front_diameter` varchar(7) NOT NULL DEFAULT '',
  `front_width` decimal(7,0) NOT NULL,
  `rear_diameter` varchar(7) NOT NULL DEFAULT '',
  `rear_width` decimal(7,0) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `brake_sources`
--

CREATE TABLE `brake_sources` (
  `id` int(11) UNSIGNED NOT NULL,
  `source` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `caps`
--

CREATE TABLE `caps` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(10) NOT NULL DEFAULT '',
  `cap` varchar(150) NOT NULL DEFAULT '',
  `capseatdescr` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `caps_sandbox`
--

CREATE TABLE `caps_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(5) NOT NULL DEFAULT '',
  `cap` varchar(150) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cars`
--

CREATE TABLE `cars` (
  `id` int(11) UNSIGNED NOT NULL,
  `car_model` int(11) UNSIGNED NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  `production_time_start` varchar(10) NOT NULL DEFAULT '',
  `production_time_stop` varchar(10) NOT NULL DEFAULT '',
  `type` varchar(200) NOT NULL DEFAULT '',
  `eu_homologation` varchar(400) NOT NULL DEFAULT '',
  `pcd` int(11) UNSIGNED NOT NULL,
  `cb` int(11) UNSIGNED NOT NULL,
  `wheel_track_front` varchar(15) NOT NULL DEFAULT '',
  `wheel_track_rear` varchar(15) NOT NULL DEFAULT '',
  `wheel_base` text NOT NULL,
  `hide` tinyint(1) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cars_fenders`
--

CREATE TABLE `cars_fenders` (
  `id` int(11) UNSIGNED NOT NULL,
  `oe_combined_fitments` int(11) UNSIGNED NOT NULL,
  `wheel_front_sx` smallint(5) UNSIGNED NOT NULL,
  `tyre_front_sx` smallint(5) UNSIGNED NOT NULL,
  `wheel_front_dx` smallint(5) UNSIGNED NOT NULL,
  `tyre_front_dx` smallint(5) UNSIGNED NOT NULL,
  `wheel_rear_sx` smallint(5) UNSIGNED NOT NULL,
  `tyre_rear_sx` smallint(5) UNSIGNED NOT NULL,
  `wheel_rear_dx` smallint(5) UNSIGNED NOT NULL,
  `tyre_rear_dx` smallint(5) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `car_manufacturers`
--

CREATE TABLE `car_manufacturers` (
  `id` int(11) UNSIGNED NOT NULL,
  `manufacturer` varchar(100) NOT NULL DEFAULT '',
  `logo` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `car_max_loads`
--

CREATE TABLE `car_max_loads` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `max_load` decimal(7,2) NOT NULL,
  `version` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `car_models`
--

CREATE TABLE `car_models` (
  `id` int(11) UNSIGNED NOT NULL,
  `manufacturer` int(11) UNSIGNED NOT NULL,
  `model` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `car_versions`
--

CREATE TABLE `car_versions` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `brakes` int(11) UNSIGNED NOT NULL,
  `version` varchar(100) NOT NULL DEFAULT '',
  `power` smallint(5) UNSIGNED NOT NULL,
  `min_size_oe` varchar(25) NOT NULL DEFAULT '',
  `eu_homologation` varchar(50) NOT NULL DEFAULT '',
  `tvv_manufacturer` varchar(50) NOT NULL DEFAULT '',
  `TecDoc` varchar(50) DEFAULT NULL,
  `KBA` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `car_versions_BK1107`
--

CREATE TABLE `car_versions_BK1107` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `brakes` int(11) UNSIGNED NOT NULL,
  `version` varchar(100) NOT NULL DEFAULT '',
  `power` smallint(5) UNSIGNED NOT NULL,
  `min_size_oe` varchar(25) NOT NULL DEFAULT '',
  `eu_homologation` varchar(50) NOT NULL DEFAULT '',
  `tvv_manufacturer` varchar(50) NOT NULL DEFAULT '',
  `TecDoc` varchar(50) DEFAULT NULL,
  `KBA` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cbs`
--

CREATE TABLE `cbs` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(16) NOT NULL DEFAULT '',
  `cb` varchar(24) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `centering_rings`
--

CREATE TABLE `centering_rings` (
  `id` int(11) UNSIGNED NOT NULL,
  `line` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `internal_diameter` decimal(5,2) NOT NULL,
  `external_diameter` decimal(5,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `combined_applications`
--

CREATE TABLE `combined_applications` (
  `id` int(11) NOT NULL,
  `front_axle_applications` int(11) NOT NULL,
  `front_axle_note` varchar(250) DEFAULT NULL,
  `rear_axle_applications` int(11) NOT NULL,
  `rear_axle_note` varchar(250) DEFAULT NULL,
  `kit` varchar(250) DEFAULT NULL,
  `limitations` varchar(250) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `car_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `combined_applications_BK`
--

CREATE TABLE `combined_applications_BK` (
  `id` int(11) NOT NULL,
  `front_axle_applications` int(11) NOT NULL,
  `front_axle_note` varchar(250) DEFAULT NULL,
  `rear_axle_applications` int(11) NOT NULL,
  `rear_axle_note` varchar(250) DEFAULT NULL,
  `kit` varchar(250) DEFAULT NULL,
  `limitations` varchar(250) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `car_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `combined_applications_BK0210`
--

CREATE TABLE `combined_applications_BK0210` (
  `id` int(11) NOT NULL,
  `front_axle_applications` int(11) NOT NULL,
  `front_axle_note` varchar(250) DEFAULT NULL,
  `rear_axle_applications` int(11) NOT NULL,
  `rear_axle_note` varchar(250) DEFAULT NULL,
  `kit` varchar(250) DEFAULT NULL,
  `limitations` varchar(250) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `car_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `customer_suppliers`
--

CREATE TABLE `customer_suppliers` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(1) NOT NULL DEFAULT '',
  `customer` varchar(50) NOT NULL DEFAULT '',
  `supplier` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `customer_suppliers_sandbox`
--

CREATE TABLE `customer_suppliers_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(1) NOT NULL DEFAULT '',
  `customer` varchar(50) NOT NULL DEFAULT '',
  `supplier` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `document_log`
--

CREATE TABLE `document_log` (
  `id` int(11) UNSIGNED NOT NULL,
  `document` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `document_parameter` varchar(255) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `efs`
--

CREATE TABLE `efs` (
  `Id` int(11) NOT NULL,
  `type` varchar(5) NOT NULL DEFAULT '',
  `bcd` int(11) NOT NULL DEFAULT 0,
  `holes` int(11) NOT NULL DEFAULT 0,
  `pcd` float NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `fender`
--

CREATE TABLE `fender` (
  `id` int(11) UNSIGNED NOT NULL,
  `oe_application` int(11) UNSIGNED NOT NULL,
  `wheel_front_sx` smallint(5) UNSIGNED NOT NULL,
  `tyre_front_sx` smallint(5) UNSIGNED NOT NULL,
  `wheel_front_dx` smallint(5) UNSIGNED NOT NULL,
  `tyre_front_dx` smallint(5) UNSIGNED NOT NULL,
  `wheel_rear_sx` smallint(5) UNSIGNED NOT NULL,
  `tyre_rear_sx` smallint(5) UNSIGNED NOT NULL,
  `wheel_rear_dx` smallint(5) UNSIGNED NOT NULL,
  `tyre_rear_dx` smallint(5) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `finishes`
--

CREATE TABLE `finishes` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(1) NOT NULL DEFAULT '',
  `paint_code` varchar(15) NOT NULL DEFAULT '',
  `description` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `finishes_sandbox`
--

CREATE TABLE `finishes_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(1) NOT NULL DEFAULT '',
  `paint_code` varchar(15) NOT NULL DEFAULT '',
  `description` varchar(80) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `fixing_holes`
--

CREATE TABLE `fixing_holes` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(15) NOT NULL DEFAULT '',
  `cylinder_h` decimal(7,2) NOT NULL,
  `d` decimal(7,2) NOT NULL,
  `d_` decimal(7,2) NOT NULL,
  `bolt_nut_connection` int(11) UNSIGNED NOT NULL,
  `connection_h` decimal(7,2) UNSIGNED NOT NULL,
  `notes` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `fixing_holes_sandbox`
--

CREATE TABLE `fixing_holes_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(15) NOT NULL DEFAULT '',
  `cylinder_h` decimal(7,2) NOT NULL,
  `d` decimal(7,2) NOT NULL,
  `d_` decimal(7,2) NOT NULL,
  `bolt_nut_connection` int(11) UNSIGNED NOT NULL,
  `connection_h` decimal(7,2) UNSIGNED NOT NULL,
  `notes` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `kit`
--

CREATE TABLE `kit` (
  `id` int(11) NOT NULL,
  `kit_code` varchar(20) DEFAULT NULL,
  `old_code` varchar(20) DEFAULT NULL,
  `front_ring_id` int(11) DEFAULT NULL,
  `front_ring_qty` int(11) DEFAULT NULL,
  `rear_ring_id` int(11) DEFAULT NULL,
  `rear_ring_qty` int(11) DEFAULT NULL,
  `front_bolt_nut_id` int(11) DEFAULT NULL,
  `front_bolt_nut_qty` int(11) DEFAULT NULL,
  `rear_bolt_nut_id` int(11) DEFAULT NULL,
  `rear_bolt_nut_qty` int(11) DEFAULT NULL,
  `note` varchar(100) DEFAULT NULL,
  `created_at` varchar(10) NOT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `load_cases`
--

CREATE TABLE `load_cases` (
  `id` int(11) NOT NULL,
  `rlcode` varchar(55) NOT NULL,
  `lc_max_load` decimal(7,2) DEFAULT NULL,
  `lc_max_load_rolling` decimal(7,2) DEFAULT NULL,
  `lc_et` decimal(5,2) DEFAULT NULL,
  `ece_rolling_tire` varchar(55) NOT NULL,
  `ece_impact_tire` varchar(55) NOT NULL,
  `sae_rolling_tire` varchar(55) NOT NULL,
  `sae_impact_tire` varchar(55) NOT NULL,
  `dynamic_radius` decimal(10,2) DEFAULT NULL,
  `m_max_100` decimal(10,2) DEFAULT NULL,
  `short_test_75` decimal(10,2) DEFAULT NULL,
  `long_test_50` decimal(10,2) DEFAULT NULL,
  `load_lc` decimal(10,2) DEFAULT NULL,
  `impact_mass_ece` decimal(10,2) DEFAULT NULL,
  `s_2_corner` decimal(10,2) DEFAULT NULL,
  `s_1_6_corner` decimal(10,2) DEFAULT NULL,
  `s_1_35_corner` decimal(10,2) DEFAULT NULL,
  `s_2_5_radial` decimal(10,2) DEFAULT NULL,
  `s_2_radial` decimal(10,2) DEFAULT NULL,
  `impact_mass_sae` decimal(10,2) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `load_cases_BK`
--

CREATE TABLE `load_cases_BK` (
  `id` int(11) NOT NULL,
  `rlcode` varchar(55) NOT NULL,
  `lc_max_load` decimal(7,2) DEFAULT NULL,
  `lc_max_load_rolling` decimal(7,2) DEFAULT NULL,
  `lc_et` decimal(5,2) DEFAULT NULL,
  `ece_rolling_tire` varchar(55) NOT NULL,
  `ece_impact_tire` varchar(55) NOT NULL,
  `sae_rolling_tire` varchar(55) NOT NULL,
  `sae_impact_tire` varchar(55) NOT NULL,
  `dynamic_radius` decimal(10,2) DEFAULT NULL,
  `m_max_100` decimal(10,2) DEFAULT NULL,
  `short_test_75` decimal(10,2) DEFAULT NULL,
  `long_test_50` decimal(10,2) DEFAULT NULL,
  `load_lc` decimal(10,2) DEFAULT NULL,
  `impact_mass_ece` decimal(10,2) DEFAULT NULL,
  `s_2_corner` decimal(10,2) DEFAULT NULL,
  `s_1_6_corner` decimal(10,2) DEFAULT NULL,
  `s_1_35_corner` decimal(10,2) DEFAULT NULL,
  `s_2_5_radial` decimal(10,2) DEFAULT NULL,
  `s_2_radial` decimal(10,2) DEFAULT NULL,
  `impact_mass_sae` decimal(10,2) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura stand-in per le viste `mod_combined_full_7`
-- (Vedi sotto per la vista effettiva)
--
CREATE TABLE `mod_combined_full_7` (
`combined_applications_id` int(11)
,`combined_applications_car_id` int(11)
,`front_axle_applications` int(11)
,`rear_axle_applications` int(11)
,`combined_applications_kit` varchar(250)
,`combined_applications_limitations` varchar(250)
,`cars_id` int(11) unsigned
,`cars_production_time_start` varchar(10)
,`cars_production_time_stop` varchar(10)
,`car_models_id` int(11) unsigned
,`car_models_model` varchar(255)
,`car_manufacturers_id` int(11) unsigned
,`car_manufacturers_manufacturer` varchar(100)
,`pcd` int(11) unsigned
,`cars_pcd` varchar(16)
,`cb` int(11) unsigned
,`cars_cb` varchar(24)
,`car_max_loads_max_load` decimal(7,2)
,`am_wheels_id` int(11) unsigned
,`am_wheels_status` varchar(25)
,`am_wheel_models_id` int(11) unsigned
,`am_wheel_models_model` varchar(100)
,`am_wheel_lines_id` int(11) unsigned
,`am_wheel_lines_line` varchar(100)
,`am_wheels_code` varchar(25)
,`am_wheels_makers_code` varchar(25)
,`am_wheels_wheel_type` varchar(15)
,`am_wheels_version` varchar(10)
,`am_wheels_diameter` tinyint(3) unsigned
,`am_wheels_width` decimal(5,2)
,`am_wheels_rim_type` varchar(22)
,`am_wheels_et` decimal(5,2)
,`applications_id` int(11) unsigned
,`applications_car` int(11) unsigned
,`centering_ring` int(11) unsigned
,`bolt_nut` int(11) unsigned
,`homologation_tuv` varchar(25)
,`homologation_kba` varchar(25)
,`note_kba` varchar(255)
,`homologation_ece` varchar(25)
,`note_ece` varchar(255)
,`homologation_ita` varchar(25)
,`note_ita` varchar(255)
,`limitation` varchar(250)
,`fitment_advice` varchar(100)
,`capseatdescr` varchar(50)
,`strength_certificates_id` int(11) unsigned
,`strength_certificates_max_load` decimal(7,2) unsigned
,`strength_certificates_rolling_circumference` decimal(7,2) unsigned
,`strength_certificates_certificate_document` varchar(255)
,`oe_applications_tyres_design_overall_diameter` smallint(5) unsigned
,`oe_applications_diameter` smallint(3) unsigned
,`oe_applications_width` decimal(5,2)
,`oe_applications_et` decimal(5,2)
,`am_wheels_rear_id` int(11) unsigned
,`am_wheels_rear_status` varchar(25)
,`am_wheel_models_rear_id` int(11) unsigned
,`am_wheel_models_rear_model` varchar(100)
,`am_wheel_lines_rear_id` int(11) unsigned
,`am_wheel_lines_rear_line` varchar(100)
,`am_wheels_rear_code` varchar(25)
,`am_wheels_rear_makers_code` varchar(25)
,`am_wheels_rear_wheel_type` varchar(15)
,`am_wheels_rear_version` varchar(10)
,`am_wheels_rear_diameter` tinyint(3) unsigned
,`am_wheels_rear_width` decimal(5,2)
,`am_wheels_rear_rim_type` varchar(22)
,`am_wheels_rear_et` decimal(5,2)
,`applications_rear_id` int(11) unsigned
,`applications_rear_car` int(11) unsigned
,`applications_rear_centering_ring` int(11) unsigned
,`applications_rear_bolt_nut` int(11) unsigned
,`applications_rear_homologation_tuv` varchar(25)
,`applications_rear_homologation_kba` varchar(25)
,`applications_rear_note_kba` varchar(255)
,`applications_rear_homologation_ece` varchar(25)
,`applications_rear_note_ece` varchar(255)
,`applications_rear_homologation_ita` varchar(25)
,`applications_rear_note_ita` varchar(255)
,`applications_rear_limitation` varchar(250)
,`applications_rear_fitment_type` varchar(3)
,`applications_rear_fitment_advice` varchar(100)
,`caps_rear_capseatdescr` varchar(50)
,`strength_certificates_rear_id` int(11) unsigned
,`strength_certificates_rear_max_load` decimal(7,2) unsigned
,`strength_certificates_rear_rolling_circumference` decimal(7,2) unsigned
,`strength_certificates_rear_certificate_document` varchar(255)
,`oe_applications_tyres_rear_design_overall_diameter` smallint(5) unsigned
,`oe_applications_rear_diameter` smallint(3)
,`oe_applications_rear_width` decimal(5,2)
,`oe_applications_rear_et` decimal(5,2)
);

-- --------------------------------------------------------

--
-- Struttura stand-in per le viste `mod_combined_full_8`
-- (Vedi sotto per la vista effettiva)
--
CREATE TABLE `mod_combined_full_8` (
`combined_applications_id` int(11)
,`combined_applications_car_id` int(11)
,`front_axle_applications` int(11)
,`rear_axle_applications` int(11)
,`combined_applications_kit` varchar(250)
,`combined_applications_limitations` varchar(250)
,`cars_id` int(11) unsigned
,`cars_production_time_start` varchar(10)
,`cars_production_time_stop` varchar(10)
,`car_models_id` int(11) unsigned
,`car_models_model` varchar(255)
,`car_manufacturers_id` int(11) unsigned
,`car_manufacturers_manufacturer` varchar(100)
,`pcd` int(11) unsigned
,`cars_pcd` varchar(16)
,`cb` int(11) unsigned
,`cars_cb` varchar(24)
,`car_max_loads_max_load` decimal(7,2)
,`am_wheels_id` int(11) unsigned
,`am_wheels_status` varchar(25)
,`am_wheel_models_id` int(11) unsigned
,`am_wheel_models_model` varchar(100)
,`am_wheel_lines_id` int(11) unsigned
,`am_wheel_lines_line` varchar(100)
,`am_wheels_code` varchar(25)
,`am_wheels_makers_code` varchar(25)
,`am_wheels_wheel_type` varchar(15)
,`am_wheels_version` varchar(10)
,`am_wheels_diameter` tinyint(3) unsigned
,`am_wheels_width` decimal(5,2)
,`am_wheels_rim_type` varchar(22)
,`am_wheels_et` decimal(5,2)
,`applications_id` int(11) unsigned
,`applications_car` int(11) unsigned
,`centering_ring` int(11) unsigned
,`bolt_nut` int(11) unsigned
,`homologation_tuv` varchar(25)
,`homologation_kba` varchar(25)
,`note_kba` varchar(255)
,`homologation_ece` varchar(25)
,`note_ece` varchar(255)
,`homologation_ita` varchar(25)
,`note_ita` varchar(255)
,`limitation` varchar(250)
,`fitment_advice` varchar(100)
,`capseatdescr` varchar(50)
,`strength_certificates_id` int(11) unsigned
,`strength_certificates_max_load` decimal(7,2) unsigned
,`strength_certificates_rolling_circumference` decimal(7,2) unsigned
,`strength_certificates_certificate_document` varchar(255)
,`oe_applications_tyres_design_overall_diameter` smallint(5) unsigned
,`oe_applications_diameter` smallint(3) unsigned
,`oe_applications_width` decimal(5,2)
,`oe_applications_et` decimal(5,2)
,`am_wheels_rear_id` int(11) unsigned
,`am_wheels_rear_status` varchar(25)
,`am_wheel_models_rear_id` int(11) unsigned
,`am_wheel_models_rear_model` varchar(100)
,`am_wheel_lines_rear_id` int(11) unsigned
,`am_wheel_lines_rear_line` varchar(100)
,`am_wheels_rear_code` varchar(25)
,`am_wheels_rear_makers_code` varchar(25)
,`am_wheels_rear_wheel_type` varchar(15)
,`am_wheels_rear_version` varchar(10)
,`am_wheels_rear_diameter` tinyint(3) unsigned
,`am_wheels_rear_width` decimal(5,2)
,`am_wheels_rear_rim_type` varchar(22)
,`am_wheels_rear_et` decimal(5,2)
,`applications_rear_id` int(11) unsigned
,`applications_rear_car` int(11) unsigned
,`applications_rear_centering_ring` int(11) unsigned
,`applications_rear_bolt_nut` int(11) unsigned
,`applications_rear_homologation_tuv` varchar(25)
,`applications_rear_homologation_kba` varchar(25)
,`applications_rear_note_kba` varchar(255)
,`applications_rear_homologation_ece` varchar(25)
,`applications_rear_note_ece` varchar(255)
,`applications_rear_homologation_ita` varchar(25)
,`applications_rear_note_ita` varchar(255)
,`applications_rear_limitation` varchar(250)
,`applications_rear_fitment_type` varchar(3)
,`applications_rear_fitment_advice` varchar(100)
,`caps_rear_capseatdescr` varchar(50)
,`strength_certificates_rear_id` int(11) unsigned
,`strength_certificates_rear_max_load` decimal(7,2) unsigned
,`strength_certificates_rear_rolling_circumference` decimal(7,2) unsigned
,`strength_certificates_rear_certificate_document` varchar(255)
,`oe_applications_tyres_rear_design_overall_diameter` smallint(5) unsigned
,`oe_applications_rear_diameter` smallint(3)
,`oe_applications_rear_width` decimal(5,2)
,`oe_applications_rear_et` decimal(5,2)
);

-- --------------------------------------------------------

--
-- Struttura stand-in per le viste `mod_combined_full_9`
-- (Vedi sotto per la vista effettiva)
--
CREATE TABLE `mod_combined_full_9` (
`combined_applications_id` int(11)
,`combined_applications_car_id` int(11)
,`front_axle_applications` int(11)
,`rear_axle_applications` int(11)
,`combined_applications_kit` varchar(250)
,`combined_applications_limitations` varchar(250)
,`cars_id` int(11) unsigned
,`cars_production_time_start` varchar(10)
,`cars_production_time_stop` varchar(10)
,`car_models_id` int(11) unsigned
,`car_models_model` varchar(255)
,`car_manufacturers_id` int(11) unsigned
,`car_manufacturers_manufacturer` varchar(100)
,`cb` int(11) unsigned
,`cars_cb` varchar(24)
,`pcd` int(11) unsigned
,`cars_pcd` varchar(16)
,`car_max_loads_max_load` decimal(7,2)
,`am_wheels_id` int(11) unsigned
,`am_wheels_status` varchar(25)
,`am_wheel_models_id` int(11) unsigned
,`am_wheel_models_model` varchar(100)
,`am_wheel_lines_id` int(11) unsigned
,`am_wheel_lines_line` varchar(100)
,`am_wheels_code` varchar(25)
,`am_wheels_makers_code` varchar(25)
,`am_wheels_wheel_type` varchar(15)
,`am_wheels_version` varchar(10)
,`am_wheels_diameter` tinyint(3) unsigned
,`am_wheels_width` decimal(5,2)
,`am_wheels_et` decimal(5,2)
,`applications_id` int(11) unsigned
,`applications_car` int(11) unsigned
,`applications_centering_ring_id` int(11) unsigned
,`c_ring_front_code` varchar(25)
,`applications_bolt_nut` int(11) unsigned
,`b_nuts_front_code` varchar(25)
,`limitation` varchar(250)
,`fitment_advice` varchar(100)
,`capseatdescr` varchar(50)
,`am_wheels_rear_id` int(11) unsigned
,`am_wheels_rear_status` varchar(25)
,`am_wheel_models_rear_id` int(11) unsigned
,`am_wheel_models_rear_model` varchar(100)
,`am_wheel_lines_rear_id` int(11) unsigned
,`am_wheel_lines_rear_line` varchar(100)
,`am_wheels_rear_code` varchar(25)
,`am_wheels_rear_makers_code` varchar(25)
,`am_wheels_rear_wheel_type` varchar(15)
,`am_wheels_rear_version` varchar(10)
,`am_wheels_rear_diameter` tinyint(3) unsigned
,`am_wheels_rear_width` decimal(5,2)
,`am_wheels_rear_rim_type` varchar(22)
,`am_wheels_rear_et` decimal(5,2)
,`applications_rear_id` int(11) unsigned
,`applications_rear_car` int(11) unsigned
,`applications_rear_centering_ring_id` int(11) unsigned
,`c_ring_rear_code` varchar(25)
,`applications_rear_bolt_nut` int(11) unsigned
,`b_nuts_rear_code` varchar(25)
,`applications_rear_limitation` varchar(250)
,`applications_rear_fitment_advice` varchar(100)
,`caps_rear_capseatdescr` varchar(50)
);

-- --------------------------------------------------------

--
-- Struttura stand-in per le viste `mod_combined_full_10`
-- (Vedi sotto per la vista effettiva)
--
CREATE TABLE `mod_combined_full_10` (
`combined_applications_id` int(11)
,`combined_applications_car_id` int(11)
,`front_axle_applications` int(11)
,`rear_axle_applications` int(11)
,`combined_applications_kit` varchar(250)
,`combined_applications_limitations` varchar(250)
,`cars_id` int(11) unsigned
,`car_manufacturers_id` int(11) unsigned
,`car_manufacturers_manufacturer` varchar(100)
,`car_models_id` int(11) unsigned
,`car_models_model` varchar(255)
,`cars_production_time_start` varchar(10)
,`cars_production_time_stop` varchar(10)
,`cb` int(11) unsigned
,`cars_cb` varchar(24)
,`pcd` int(11) unsigned
,`cars_pcd` varchar(16)
,`car_max_loads_max_load` decimal(7,2)
,`am_wheels_id` int(11) unsigned
,`am_wheel_lines_id` int(11) unsigned
,`am_wheel_lines_line` varchar(100)
,`am_wheels_status` varchar(25)
,`am_wheel_models_id` int(11) unsigned
,`am_wheel_models_model` varchar(100)
,`am_wheels_diameter` tinyint(3) unsigned
,`am_wheels_width` decimal(5,2)
,`am_wheels_et` decimal(5,2)
,`am_wheels_wheel_type` varchar(15)
,`am_wheels_version` varchar(10)
,`am_wheels_code` varchar(25)
,`am_wheels_makers_code` varchar(25)
,`applications_id` int(11) unsigned
,`applications_car` int(11) unsigned
,`applications_centering_ring_id` int(11) unsigned
,`c_ring_front_code` varchar(25)
,`applications_bolt_nut` int(11) unsigned
,`b_nuts_front_code` varchar(25)
,`limitation` varchar(250)
,`fitment_advice` varchar(100)
,`capseatdescr` varchar(50)
,`am_wheels_rear_id` int(11) unsigned
,`am_wheels_rear_status` varchar(25)
,`am_wheel_lines_rear_id` int(11) unsigned
,`am_wheel_lines_rear_line` varchar(100)
,`am_wheel_models_rear_id` int(11) unsigned
,`am_wheel_models_rear_model` varchar(100)
,`am_wheels_rear_diameter` tinyint(3) unsigned
,`am_wheels_rear_width` decimal(5,2)
,`am_wheels_rear_et` decimal(5,2)
,`am_wheels_rear_wheel_type` varchar(15)
,`am_wheels_rear_version` varchar(10)
,`am_wheels_rear_code` varchar(25)
,`am_wheels_rear_makers_code` varchar(25)
,`applications_rear_id` int(11) unsigned
,`applications_rear_car` int(11) unsigned
,`applications_rear_centering_ring_id` int(11) unsigned
,`c_ring_rear_code` varchar(25)
,`applications_rear_bolt_nut` int(11) unsigned
,`b_nuts_rear_code` varchar(25)
,`applications_rear_limitation` varchar(250)
,`applications_rear_fitment_advice` varchar(100)
,`caps_rear_capseatdescr` varchar(50)
);

-- --------------------------------------------------------

--
-- Struttura della tabella `oe_applications`
--

CREATE TABLE `oe_applications` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `diameter` smallint(3) UNSIGNED NOT NULL,
  `width` decimal(5,2) NOT NULL,
  `rim_type` varchar(20) NOT NULL DEFAULT '',
  `et` decimal(5,2) NOT NULL,
  `bolt_nut` int(10) UNSIGNED NOT NULL,
  `tightening_torque` smallint(5) UNSIGNED NOT NULL,
  `tyre` int(11) UNSIGNED NOT NULL,
  `load_index` text NOT NULL,
  `speed_index` varchar(10) NOT NULL DEFAULT '',
  `type` varchar(100) NOT NULL DEFAULT '',
  `fitment_type` varchar(3) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `oe_combined_fitments`
--

CREATE TABLE `oe_combined_fitments` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `front_axle_diameter` smallint(3) UNSIGNED NOT NULL,
  `front_axle_width` decimal(5,2) NOT NULL,
  `front_axle_rim_type` varchar(20) NOT NULL DEFAULT '',
  `front_axle_et` decimal(5,2) NOT NULL,
  `front_axle_tyre` int(11) UNSIGNED NOT NULL,
  `front_axle_load_index` text NOT NULL,
  `front_axle_speed_symbol` varchar(10) NOT NULL,
  `rear_axle_diameter` smallint(3) NOT NULL,
  `rear_axle_width` decimal(5,2) NOT NULL,
  `rear_axle_rim_type` varchar(20) NOT NULL,
  `rear_axle_et` decimal(5,2) NOT NULL,
  `rear_axle_tyre` int(11) NOT NULL,
  `rear_axle_load_index` text NOT NULL,
  `rear_axle_speed_symbol` varchar(10) NOT NULL,
  `bolt_nut` int(10) UNSIGNED NOT NULL,
  `tightening_torque` smallint(5) UNSIGNED NOT NULL,
  `note` varchar(100) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `oe_combined_fitments_BK021023`
--

CREATE TABLE `oe_combined_fitments_BK021023` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `front_axle_diameter` smallint(3) UNSIGNED NOT NULL,
  `front_axle_width` decimal(5,2) NOT NULL,
  `front_axle_rim_type` varchar(20) NOT NULL DEFAULT '',
  `front_axle_et` decimal(5,2) NOT NULL,
  `front_axle_tyre` int(11) UNSIGNED NOT NULL,
  `front_axle_load_index` text NOT NULL,
  `front_axle_speed_symbol` varchar(10) NOT NULL,
  `rear_axle_diameter` smallint(3) NOT NULL,
  `rear_axle_width` decimal(5,2) NOT NULL,
  `rear_axle_rim_type` varchar(20) NOT NULL,
  `rear_axle_et` decimal(5,2) NOT NULL,
  `rear_axle_tyre` int(11) NOT NULL,
  `rear_axle_load_index` text NOT NULL,
  `rear_axle_speed_symbol` varchar(10) NOT NULL,
  `bolt_nut` int(10) UNSIGNED NOT NULL,
  `tightening_torque` smallint(5) UNSIGNED NOT NULL,
  `note` varchar(100) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `oe_combined_fitments_OLD`
--

CREATE TABLE `oe_combined_fitments_OLD` (
  `id` int(11) UNSIGNED NOT NULL,
  `car` int(11) UNSIGNED NOT NULL,
  `front_axle_diameter` smallint(3) UNSIGNED NOT NULL,
  `front_axle_width` decimal(5,2) NOT NULL,
  `front_axle_rim_type` varchar(20) NOT NULL DEFAULT '',
  `front_axle_et` decimal(5,2) NOT NULL,
  `front_axle_tyre` int(11) UNSIGNED NOT NULL,
  `front_axle_load_index` text NOT NULL,
  `front_axle_speed_symbol` varchar(10) NOT NULL DEFAULT '',
  `rear_axle_diameter` smallint(3) NOT NULL,
  `rear_axle_width` decimal(5,2) NOT NULL,
  `rear_axle_rim_type` varchar(20) NOT NULL,
  `rear_axle_et` decimal(5,2) NOT NULL,
  `rear_axle_tyre` int(11) NOT NULL,
  `rear_axle_load_index` text NOT NULL,
  `rear_axle_speed_symbol` varchar(10) NOT NULL DEFAULT '',
  `bolt_nut` int(10) UNSIGNED NOT NULL,
  `tightening_torque` smallint(5) UNSIGNED NOT NULL,
  `note` varchar(100) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `orders`
--

CREATE TABLE `orders` (
  `id` int(11) UNSIGNED NOT NULL,
  `user` varchar(255) NOT NULL,
  `orderinfo` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pcds`
--

CREATE TABLE `pcds` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(16) NOT NULL DEFAULT '',
  `pcd` varchar(16) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `holes` int(11) DEFAULT NULL,
  `diameter` decimal(10,2) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pcds_sandbox`
--

CREATE TABLE `pcds_sandbox` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(16) NOT NULL DEFAULT '',
  `pcd` varchar(16) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `holes` int(11) DEFAULT NULL,
  `diameter` decimal(10,2) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(16) NOT NULL DEFAULT '0',
  `user_agent` varchar(120) NOT NULL,
  `last_activity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `user_data` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `strength_certificates`
--

CREATE TABLE `strength_certificates` (
  `id` int(11) UNSIGNED NOT NULL,
  `am_wheel` int(11) UNSIGNED NOT NULL,
  `max_load` decimal(7,2) UNSIGNED NOT NULL,
  `rolling_circumference` decimal(7,2) UNSIGNED NOT NULL,
  `impact_tyre` int(11) UNSIGNED NOT NULL,
  `certificate_document` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tpms`
--

CREATE TABLE `tpms` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(30) NOT NULL DEFAULT '',
  `manufacturer` int(11) UNSIGNED NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT '',
  `car` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tpms_manufacturers`
--

CREATE TABLE `tpms_manufacturers` (
  `id` int(11) UNSIGNED NOT NULL,
  `manufacturer` varchar(100) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tyres`
--

CREATE TABLE `tyres` (
  `id` int(11) UNSIGNED NOT NULL,
  `width` text NOT NULL,
  `height` text NOT NULL,
  `diameter` smallint(3) UNSIGNED NOT NULL,
  `design_overall_diameter` smallint(5) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL DEFAULT '',
  `password_hash` varchar(150) NOT NULL DEFAULT '',
  `password_salt` varchar(32) NOT NULL DEFAULT '',
  `auth_code` varchar(32) NOT NULL DEFAULT '',
  `usertype` tinyint(1) NOT NULL,
  `is_suspended` tinyint(1) NOT NULL,
  `api_key` varchar(32) NOT NULL DEFAULT '',
  `hide_car_report` tinyint(1) NOT NULL,
  `show_hidden_cars` tinyint(1) NOT NULL,
  `manufacturer_declaration` tinyint(1) NOT NULL,
  `theme` varchar(15) NOT NULL,
  `am_wheel_lines` text NOT NULL,
  `suppliers` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `version_def`
--

CREATE TABLE `version_def` (
  `id` int(11) UNSIGNED NOT NULL,
  `code` varchar(25) NOT NULL DEFAULT '',
  `pcd` int(11) UNSIGNED NOT NULL,
  `cb` int(11) UNSIGNED NOT NULL,
  `fixing_hole` int(11) UNSIGNED NOT NULL,
  `cap` int(11) UNSIGNED NOT NULL,
  `created_at` varchar(10) NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `am_wheels`
--
ALTER TABLE `am_wheels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `model` (`model`);

--
-- Indici per le tabelle `am_wheels_sandbox`
--
ALTER TABLE `am_wheels_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `model` (`model`),
  ADD KEY `code` (`code`);

--
-- Indici per le tabelle `am_wheel_lines`
--
ALTER TABLE `am_wheel_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `line` (`line`);

--
-- Indici per le tabelle `am_wheel_lines_sandbox`
--
ALTER TABLE `am_wheel_lines_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `line` (`line`);

--
-- Indici per le tabelle `am_wheel_models`
--
ALTER TABLE `am_wheel_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `line` (`line`);

--
-- Indici per le tabelle `am_wheel_models_sandbox`
--
ALTER TABLE `am_wheel_models_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `line` (`line`),
  ADD KEY `line_2` (`line`,`code`);

--
-- Indici per le tabelle `am_wheel_versions`
--
ALTER TABLE `am_wheel_versions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `am_wheel` (`am_wheel`);

--
-- Indici per le tabelle `am_wheel_versions_sandbox`
--
ALTER TABLE `am_wheel_versions_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `am_wheel` (`am_wheel`),
  ADD KEY `code` (`code`);

--
-- Indici per le tabelle `api_applications`
--
ALTER TABLE `api_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `am_wheel` (`am_wheel`);

--
-- Indici per le tabelle `applications_BK`
--
ALTER TABLE `applications_BK`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `am_wheel` (`am_wheel`);

--
-- Indici per le tabelle `applications_BK2103`
--
ALTER TABLE `applications_BK2103`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `am_wheel` (`am_wheel`);

--
-- Indici per le tabelle `applications_brakes`
--
ALTER TABLE `applications_brakes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application` (`application`),
  ADD KEY `brake` (`brake`);

--
-- Indici per le tabelle `applications_test`
--
ALTER TABLE `applications_test`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `am_wheel` (`am_wheel`);

--
-- Indici per le tabelle `applications_tpms`
--
ALTER TABLE `applications_tpms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application` (`application`),
  ADD KEY `tpms` (`tpms`);

--
-- Indici per le tabelle `applications_tyres`
--
ALTER TABLE `applications_tyres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application` (`application`),
  ADD KEY `tyre` (`tyre`);

--
-- Indici per le tabelle `BK_load_cases`
--
ALTER TABLE `BK_load_cases`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `bolt_nuts`
--
ALTER TABLE `bolt_nuts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `size` (`size`),
  ADD KEY `connection` (`connection`);

--
-- Indici per le tabelle `bolt_nut_connections`
--
ALTER TABLE `bolt_nut_connections`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `bolt_nut_connections_sandbox`
--
ALTER TABLE `bolt_nut_connections_sandbox`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `bolt_nut_sizes`
--
ALTER TABLE `bolt_nut_sizes`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `brakes`
--
ALTER TABLE `brakes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `source` (`source`),
  ADD KEY `source_2` (`source`);

--
-- Indici per le tabelle `brake_sources`
--
ALTER TABLE `brake_sources`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `caps`
--
ALTER TABLE `caps`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `caps_sandbox`
--
ALTER TABLE `caps_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `code` (`code`);

--
-- Indici per le tabelle `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_model` (`car_model`),
  ADD KEY `pcd` (`pcd`),
  ADD KEY `cb` (`cb`);

--
-- Indici per le tabelle `cars_fenders`
--
ALTER TABLE `cars_fenders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oe_application` (`oe_combined_fitments`);

--
-- Indici per le tabelle `car_manufacturers`
--
ALTER TABLE `car_manufacturers`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `car_max_loads`
--
ALTER TABLE `car_max_loads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`);

--
-- Indici per le tabelle `car_models`
--
ALTER TABLE `car_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manufacturer` (`manufacturer`);

--
-- Indici per le tabelle `car_versions`
--
ALTER TABLE `car_versions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `brakes` (`brakes`);

--
-- Indici per le tabelle `car_versions_BK1107`
--
ALTER TABLE `car_versions_BK1107`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `brakes` (`brakes`);

--
-- Indici per le tabelle `cbs`
--
ALTER TABLE `cbs`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `centering_rings`
--
ALTER TABLE `centering_rings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `line` (`line`);

--
-- Indici per le tabelle `combined_applications`
--
ALTER TABLE `combined_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `combined_applications_BK`
--
ALTER TABLE `combined_applications_BK`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `combined_applications_BK0210`
--
ALTER TABLE `combined_applications_BK0210`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `customer_suppliers`
--
ALTER TABLE `customer_suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `customer_suppliers_sandbox`
--
ALTER TABLE `customer_suppliers_sandbox`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `document_log`
--
ALTER TABLE `document_log`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `efs`
--
ALTER TABLE `efs`
  ADD PRIMARY KEY (`Id`);

--
-- Indici per le tabelle `fender`
--
ALTER TABLE `fender`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oe_application` (`oe_application`);

--
-- Indici per le tabelle `finishes`
--
ALTER TABLE `finishes`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `finishes_sandbox`
--
ALTER TABLE `finishes_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paint_code` (`paint_code`);

--
-- Indici per le tabelle `fixing_holes`
--
ALTER TABLE `fixing_holes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bolt_nut_connection` (`bolt_nut_connection`),
  ADD KEY `code` (`code`);

--
-- Indici per le tabelle `fixing_holes_sandbox`
--
ALTER TABLE `fixing_holes_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bolt_nut_connection` (`bolt_nut_connection`);

--
-- Indici per le tabelle `kit`
--
ALTER TABLE `kit`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `load_cases`
--
ALTER TABLE `load_cases`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `load_cases_BK`
--
ALTER TABLE `load_cases_BK`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `oe_applications`
--
ALTER TABLE `oe_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `bolt_nut` (`bolt_nut`),
  ADD KEY `tyre` (`tyre`),
  ADD KEY `carANDdimension` (`car`,`diameter`,`width`);

--
-- Indici per le tabelle `oe_combined_fitments`
--
ALTER TABLE `oe_combined_fitments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `bolt_nut` (`bolt_nut`),
  ADD KEY `tyre` (`front_axle_tyre`),
  ADD KEY `carANDdimension` (`car`,`front_axle_diameter`,`front_axle_width`);

--
-- Indici per le tabelle `oe_combined_fitments_BK021023`
--
ALTER TABLE `oe_combined_fitments_BK021023`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `bolt_nut` (`bolt_nut`),
  ADD KEY `tyre` (`front_axle_tyre`),
  ADD KEY `carANDdimension` (`car`,`front_axle_diameter`,`front_axle_width`);

--
-- Indici per le tabelle `oe_combined_fitments_OLD`
--
ALTER TABLE `oe_combined_fitments_OLD`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `bolt_nut` (`bolt_nut`),
  ADD KEY `tyre` (`front_axle_tyre`),
  ADD KEY `carANDdimension` (`car`,`front_axle_diameter`,`front_axle_width`);

--
-- Indici per le tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `pcds`
--
ALTER TABLE `pcds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `holes` (`holes`);

--
-- Indici per le tabelle `pcds_sandbox`
--
ALTER TABLE `pcds_sandbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `holes` (`holes`);

--
-- Indici per le tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `last_activity_idx` (`last_activity`);

--
-- Indici per le tabelle `strength_certificates`
--
ALTER TABLE `strength_certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `am_wheel` (`am_wheel`),
  ADD KEY `impact_tyre` (`impact_tyre`);

--
-- Indici per le tabelle `tpms`
--
ALTER TABLE `tpms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manufacturer` (`manufacturer`);

--
-- Indici per le tabelle `tpms_manufacturers`
--
ALTER TABLE `tpms_manufacturers`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `tyres`
--
ALTER TABLE `tyres`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `version_def`
--
ALTER TABLE `version_def`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `am_wheels`
--
ALTER TABLE `am_wheels`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheels_sandbox`
--
ALTER TABLE `am_wheels_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheel_lines`
--
ALTER TABLE `am_wheel_lines`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheel_lines_sandbox`
--
ALTER TABLE `am_wheel_lines_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheel_models`
--
ALTER TABLE `am_wheel_models`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheel_models_sandbox`
--
ALTER TABLE `am_wheel_models_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheel_versions`
--
ALTER TABLE `am_wheel_versions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `am_wheel_versions_sandbox`
--
ALTER TABLE `am_wheel_versions_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `api_applications`
--
ALTER TABLE `api_applications`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications_BK`
--
ALTER TABLE `applications_BK`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications_BK2103`
--
ALTER TABLE `applications_BK2103`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications_brakes`
--
ALTER TABLE `applications_brakes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications_test`
--
ALTER TABLE `applications_test`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications_tpms`
--
ALTER TABLE `applications_tpms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `applications_tyres`
--
ALTER TABLE `applications_tyres`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `BK_load_cases`
--
ALTER TABLE `BK_load_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `bolt_nuts`
--
ALTER TABLE `bolt_nuts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `bolt_nut_connections`
--
ALTER TABLE `bolt_nut_connections`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `bolt_nut_connections_sandbox`
--
ALTER TABLE `bolt_nut_connections_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `bolt_nut_sizes`
--
ALTER TABLE `bolt_nut_sizes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `brakes`
--
ALTER TABLE `brakes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `brake_sources`
--
ALTER TABLE `brake_sources`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `caps`
--
ALTER TABLE `caps`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `caps_sandbox`
--
ALTER TABLE `caps_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `cars_fenders`
--
ALTER TABLE `cars_fenders`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `car_manufacturers`
--
ALTER TABLE `car_manufacturers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `car_max_loads`
--
ALTER TABLE `car_max_loads`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `car_models`
--
ALTER TABLE `car_models`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `car_versions`
--
ALTER TABLE `car_versions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `car_versions_BK1107`
--
ALTER TABLE `car_versions_BK1107`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `cbs`
--
ALTER TABLE `cbs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `centering_rings`
--
ALTER TABLE `centering_rings`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `combined_applications`
--
ALTER TABLE `combined_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `combined_applications_BK`
--
ALTER TABLE `combined_applications_BK`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `combined_applications_BK0210`
--
ALTER TABLE `combined_applications_BK0210`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `customer_suppliers`
--
ALTER TABLE `customer_suppliers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `customer_suppliers_sandbox`
--
ALTER TABLE `customer_suppliers_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `document_log`
--
ALTER TABLE `document_log`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `efs`
--
ALTER TABLE `efs`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `fender`
--
ALTER TABLE `fender`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `finishes`
--
ALTER TABLE `finishes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `finishes_sandbox`
--
ALTER TABLE `finishes_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `fixing_holes`
--
ALTER TABLE `fixing_holes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `fixing_holes_sandbox`
--
ALTER TABLE `fixing_holes_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `kit`
--
ALTER TABLE `kit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `load_cases`
--
ALTER TABLE `load_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `load_cases_BK`
--
ALTER TABLE `load_cases_BK`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `oe_applications`
--
ALTER TABLE `oe_applications`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `oe_combined_fitments`
--
ALTER TABLE `oe_combined_fitments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `oe_combined_fitments_BK021023`
--
ALTER TABLE `oe_combined_fitments_BK021023`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `oe_combined_fitments_OLD`
--
ALTER TABLE `oe_combined_fitments_OLD`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `pcds`
--
ALTER TABLE `pcds`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `pcds_sandbox`
--
ALTER TABLE `pcds_sandbox`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `strength_certificates`
--
ALTER TABLE `strength_certificates`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `tpms`
--
ALTER TABLE `tpms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `tpms_manufacturers`
--
ALTER TABLE `tpms_manufacturers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `tyres`
--
ALTER TABLE `tyres`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `version_def`
--
ALTER TABLE `version_def`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

--
-- Struttura per vista `mod_combined_full_7`
--
DROP TABLE IF EXISTS `mod_combined_full_7`;

CREATE ALGORITHM=UNDEFINED DEFINER=`pagnanvisuallab`@`localhost` SQL SECURITY DEFINER VIEW `mod_combined_full_7`  AS SELECT `combined_applications`.`id` AS `combined_applications_id`, `combined_applications`.`car_id` AS `combined_applications_car_id`, `combined_applications`.`front_axle_applications` AS `front_axle_applications`, `combined_applications`.`rear_axle_applications` AS `rear_axle_applications`, `combined_applications`.`kit` AS `combined_applications_kit`, `combined_applications`.`limitations` AS `combined_applications_limitations`, `cars`.`id` AS `cars_id`, `cars`.`production_time_start` AS `cars_production_time_start`, `cars`.`production_time_stop` AS `cars_production_time_stop`, `car_models`.`id` AS `car_models_id`, `car_models`.`model` AS `car_models_model`, `car_manufacturers`.`id` AS `car_manufacturers_id`, `car_manufacturers`.`manufacturer` AS `car_manufacturers_manufacturer`, `cars`.`pcd` AS `pcd`, `pcds`.`pcd` AS `cars_pcd`, `cars`.`cb` AS `cb`, `cbs`.`cb` AS `cars_cb`, `car_max_loads`.`max_load` AS `car_max_loads_max_load`, `am_wheels`.`id` AS `am_wheels_id`, `am_wheels`.`status` AS `am_wheels_status`, `am_wheel_models`.`id` AS `am_wheel_models_id`, `am_wheel_models`.`model` AS `am_wheel_models_model`, `am_wheel_lines`.`id` AS `am_wheel_lines_id`, `am_wheel_lines`.`line` AS `am_wheel_lines_line`, `am_wheels`.`code` AS `am_wheels_code`, `am_wheels`.`makers_code` AS `am_wheels_makers_code`, `am_wheels`.`wheel_type` AS `am_wheels_wheel_type`, `am_wheels`.`version` AS `am_wheels_version`, `am_wheels`.`diameter` AS `am_wheels_diameter`, `am_wheels`.`width` AS `am_wheels_width`, `am_wheels`.`rim_type` AS `am_wheels_rim_type`, `am_wheels`.`et` AS `am_wheels_et`, `applications`.`id` AS `applications_id`, `applications`.`car` AS `applications_car`, `applications`.`centering_ring` AS `centering_ring`, `applications`.`bolt_nut` AS `bolt_nut`, `applications`.`homologation_tuv` AS `homologation_tuv`, `applications`.`homologation_kba` AS `homologation_kba`, `applications`.`note_kba` AS `note_kba`, `applications`.`homologation_ece` AS `homologation_ece`, `applications`.`note_ece` AS `note_ece`, `applications`.`homologation_ita` AS `homologation_ita`, `applications`.`note_ita` AS `note_ita`, `applications`.`limitation` AS `limitation`, `applications`.`fitment_advice` AS `fitment_advice`, `caps`.`capseatdescr` AS `capseatdescr`, `strength_certificates`.`id` AS `strength_certificates_id`, `strength_certificates`.`max_load` AS `strength_certificates_max_load`, `strength_certificates`.`rolling_circumference` AS `strength_certificates_rolling_circumference`, `strength_certificates`.`certificate_document` AS `strength_certificates_certificate_document`, `tyres`.`design_overall_diameter` AS `oe_applications_tyres_design_overall_diameter`, `oe_combined_fitments`.`front_axle_diameter` AS `oe_applications_diameter`, `oe_combined_fitments`.`front_axle_width` AS `oe_applications_width`, `oe_combined_fitments`.`front_axle_et` AS `oe_applications_et`, `am_wheels_rear`.`id` AS `am_wheels_rear_id`, `am_wheels_rear`.`status` AS `am_wheels_rear_status`, `am_wheel_models_rear`.`id` AS `am_wheel_models_rear_id`, `am_wheel_models_rear`.`model` AS `am_wheel_models_rear_model`, `am_wheel_lines_rear`.`id` AS `am_wheel_lines_rear_id`, `am_wheel_lines_rear`.`line` AS `am_wheel_lines_rear_line`, `am_wheels_rear`.`code` AS `am_wheels_rear_code`, `am_wheels_rear`.`makers_code` AS `am_wheels_rear_makers_code`, `am_wheels_rear`.`wheel_type` AS `am_wheels_rear_wheel_type`, `am_wheels_rear`.`version` AS `am_wheels_rear_version`, `am_wheels_rear`.`diameter` AS `am_wheels_rear_diameter`, `am_wheels_rear`.`width` AS `am_wheels_rear_width`, `am_wheels_rear`.`rim_type` AS `am_wheels_rear_rim_type`, `am_wheels_rear`.`et` AS `am_wheels_rear_et`, `applications_rear`.`id` AS `applications_rear_id`, `applications_rear`.`car` AS `applications_rear_car`, `applications_rear`.`centering_ring` AS `applications_rear_centering_ring`, `applications_rear`.`bolt_nut` AS `applications_rear_bolt_nut`, `applications_rear`.`homologation_tuv` AS `applications_rear_homologation_tuv`, `applications_rear`.`homologation_kba` AS `applications_rear_homologation_kba`, `applications_rear`.`note_kba` AS `applications_rear_note_kba`, `applications_rear`.`homologation_ece` AS `applications_rear_homologation_ece`, `applications_rear`.`note_ece` AS `applications_rear_note_ece`, `applications_rear`.`homologation_ita` AS `applications_rear_homologation_ita`, `applications_rear`.`note_ita` AS `applications_rear_note_ita`, `applications_rear`.`limitation` AS `applications_rear_limitation`, `applications_rear`.`fitment_type` AS `applications_rear_fitment_type`, `applications_rear`.`fitment_advice` AS `applications_rear_fitment_advice`, `caps_rear`.`capseatdescr` AS `caps_rear_capseatdescr`, `strength_certificates_rear`.`id` AS `strength_certificates_rear_id`, `strength_certificates_rear`.`max_load` AS `strength_certificates_rear_max_load`, `strength_certificates_rear`.`rolling_circumference` AS `strength_certificates_rear_rolling_circumference`, `strength_certificates_rear`.`certificate_document` AS `strength_certificates_rear_certificate_document`, `tyres_rear`.`design_overall_diameter` AS `oe_applications_tyres_rear_design_overall_diameter`, `oe_combined_fitments_rear`.`rear_axle_diameter` AS `oe_applications_rear_diameter`, `oe_combined_fitments_rear`.`rear_axle_width` AS `oe_applications_rear_width`, `oe_combined_fitments_rear`.`rear_axle_et` AS `oe_applications_rear_et` FROM ((((((((((((((((((((((`combined_applications` left join `cars` on(`combined_applications`.`car_id` = `cars`.`id`)) left join `car_models` on(`cars`.`car_model` = `car_models`.`id`)) left join `car_manufacturers` on(`car_models`.`manufacturer` = `car_manufacturers`.`id`)) left join `car_max_loads` on(`combined_applications`.`car_id` = `car_max_loads`.`car`)) left join `pcds` on(`cars`.`pcd` = `pcds`.`id`)) left join `cbs` on(`cars`.`cb` = `cbs`.`id`)) left join `applications` on(`applications`.`id` = `combined_applications`.`front_axle_applications`)) left join `am_wheels` on(`applications`.`am_wheel` = `am_wheels`.`id`)) left join `am_wheel_models` on(`am_wheels`.`model` = `am_wheel_models`.`id`)) left join `am_wheel_lines` on(`am_wheel_models`.`line` = `am_wheel_lines`.`id`)) left join `caps` on(`am_wheels`.`cap` = `caps`.`id`)) left join `strength_certificates` on(`applications`.`am_wheel` = `strength_certificates`.`am_wheel`)) left join `oe_combined_fitments` on(`oe_combined_fitments`.`car` = `applications`.`car` and `oe_combined_fitments`.`front_axle_diameter` = `am_wheels`.`diameter` and `oe_combined_fitments`.`front_axle_width` = `am_wheels`.`width`)) left join `tyres` on(`oe_combined_fitments`.`front_axle_tyre` = `tyres`.`id`)) left join `applications` `applications_rear` on(`applications_rear`.`id` = `combined_applications`.`rear_axle_applications`)) left join `am_wheels` `am_wheels_rear` on(`applications_rear`.`am_wheel` = `am_wheels_rear`.`id`)) left join `am_wheel_models` `am_wheel_models_rear` on(`am_wheels_rear`.`model` = `am_wheel_models_rear`.`id`)) left join `am_wheel_lines` `am_wheel_lines_rear` on(`am_wheel_models_rear`.`line` = `am_wheel_lines_rear`.`id`)) left join `caps` `caps_rear` on(`am_wheels_rear`.`cap` = `caps_rear`.`id`)) left join `strength_certificates` `strength_certificates_rear` on(`applications_rear`.`am_wheel` = `strength_certificates_rear`.`am_wheel`)) left join `oe_combined_fitments` `oe_combined_fitments_rear` on(`oe_combined_fitments_rear`.`car` = `applications_rear`.`car` and `oe_combined_fitments_rear`.`rear_axle_diameter` = `am_wheels_rear`.`diameter` and `oe_combined_fitments_rear`.`rear_axle_width` = `am_wheels_rear`.`width`)) left join `tyres` `tyres_rear` on(`oe_combined_fitments_rear`.`rear_axle_tyre` = `tyres_rear`.`id`)) ;

-- --------------------------------------------------------

--
-- Struttura per vista `mod_combined_full_8`
--
DROP TABLE IF EXISTS `mod_combined_full_8`;

CREATE ALGORITHM=UNDEFINED DEFINER=`pagnanvisuallab`@`localhost` SQL SECURITY DEFINER VIEW `mod_combined_full_8`  AS SELECT `combined_applications`.`id` AS `combined_applications_id`, `combined_applications`.`car_id` AS `combined_applications_car_id`, `combined_applications`.`front_axle_applications` AS `front_axle_applications`, `combined_applications`.`rear_axle_applications` AS `rear_axle_applications`, `combined_applications`.`kit` AS `combined_applications_kit`, `combined_applications`.`limitations` AS `combined_applications_limitations`, `cars`.`id` AS `cars_id`, `cars`.`production_time_start` AS `cars_production_time_start`, `cars`.`production_time_stop` AS `cars_production_time_stop`, `car_models`.`id` AS `car_models_id`, `car_models`.`model` AS `car_models_model`, `car_manufacturers`.`id` AS `car_manufacturers_id`, `car_manufacturers`.`manufacturer` AS `car_manufacturers_manufacturer`, `cars`.`pcd` AS `pcd`, `pcds`.`pcd` AS `cars_pcd`, `cars`.`cb` AS `cb`, `cbs`.`cb` AS `cars_cb`, (select max(`car_max_loads`.`max_load`) from `car_max_loads` where `car_max_loads`.`car` = `combined_applications`.`car_id`) AS `car_max_loads_max_load`, `am_wheels`.`id` AS `am_wheels_id`, `am_wheels`.`status` AS `am_wheels_status`, `am_wheel_models`.`id` AS `am_wheel_models_id`, `am_wheel_models`.`model` AS `am_wheel_models_model`, `am_wheel_lines`.`id` AS `am_wheel_lines_id`, `am_wheel_lines`.`line` AS `am_wheel_lines_line`, `am_wheels`.`code` AS `am_wheels_code`, `am_wheels`.`makers_code` AS `am_wheels_makers_code`, `am_wheels`.`wheel_type` AS `am_wheels_wheel_type`, `am_wheels`.`version` AS `am_wheels_version`, `am_wheels`.`diameter` AS `am_wheels_diameter`, `am_wheels`.`width` AS `am_wheels_width`, `am_wheels`.`rim_type` AS `am_wheels_rim_type`, `am_wheels`.`et` AS `am_wheels_et`, `applications`.`id` AS `applications_id`, `applications`.`car` AS `applications_car`, `applications`.`centering_ring` AS `centering_ring`, `applications`.`bolt_nut` AS `bolt_nut`, `applications`.`homologation_tuv` AS `homologation_tuv`, `applications`.`homologation_kba` AS `homologation_kba`, `applications`.`note_kba` AS `note_kba`, `applications`.`homologation_ece` AS `homologation_ece`, `applications`.`note_ece` AS `note_ece`, `applications`.`homologation_ita` AS `homologation_ita`, `applications`.`note_ita` AS `note_ita`, `applications`.`limitation` AS `limitation`, `applications`.`fitment_advice` AS `fitment_advice`, `caps`.`capseatdescr` AS `capseatdescr`, `strength_certificates`.`id` AS `strength_certificates_id`, `strength_certificates`.`max_load` AS `strength_certificates_max_load`, `strength_certificates`.`rolling_circumference` AS `strength_certificates_rolling_circumference`, `strength_certificates`.`certificate_document` AS `strength_certificates_certificate_document`, (select max(`tyres`.`design_overall_diameter`) from (`tyres` join `oe_combined_fitments` on(`oe_combined_fitments`.`front_axle_tyre` = `tyres`.`id`)) where `oe_combined_fitments`.`car` = `applications`.`car` and `oe_combined_fitments`.`front_axle_diameter` = `am_wheels`.`diameter` and `oe_combined_fitments`.`front_axle_width` = `am_wheels`.`width`) AS `oe_applications_tyres_design_overall_diameter`, `oe_combined_fitments`.`front_axle_diameter` AS `oe_applications_diameter`, `oe_combined_fitments`.`front_axle_width` AS `oe_applications_width`, `oe_combined_fitments`.`front_axle_et` AS `oe_applications_et`, `am_wheels_rear`.`id` AS `am_wheels_rear_id`, `am_wheels_rear`.`status` AS `am_wheels_rear_status`, `am_wheel_models_rear`.`id` AS `am_wheel_models_rear_id`, `am_wheel_models_rear`.`model` AS `am_wheel_models_rear_model`, `am_wheel_lines_rear`.`id` AS `am_wheel_lines_rear_id`, `am_wheel_lines_rear`.`line` AS `am_wheel_lines_rear_line`, `am_wheels_rear`.`code` AS `am_wheels_rear_code`, `am_wheels_rear`.`makers_code` AS `am_wheels_rear_makers_code`, `am_wheels_rear`.`wheel_type` AS `am_wheels_rear_wheel_type`, `am_wheels_rear`.`version` AS `am_wheels_rear_version`, `am_wheels_rear`.`diameter` AS `am_wheels_rear_diameter`, `am_wheels_rear`.`width` AS `am_wheels_rear_width`, `am_wheels_rear`.`rim_type` AS `am_wheels_rear_rim_type`, `am_wheels_rear`.`et` AS `am_wheels_rear_et`, `applications_rear`.`id` AS `applications_rear_id`, `applications_rear`.`car` AS `applications_rear_car`, `applications_rear`.`centering_ring` AS `applications_rear_centering_ring`, `applications_rear`.`bolt_nut` AS `applications_rear_bolt_nut`, `applications_rear`.`homologation_tuv` AS `applications_rear_homologation_tuv`, `applications_rear`.`homologation_kba` AS `applications_rear_homologation_kba`, `applications_rear`.`note_kba` AS `applications_rear_note_kba`, `applications_rear`.`homologation_ece` AS `applications_rear_homologation_ece`, `applications_rear`.`note_ece` AS `applications_rear_note_ece`, `applications_rear`.`homologation_ita` AS `applications_rear_homologation_ita`, `applications_rear`.`note_ita` AS `applications_rear_note_ita`, `applications_rear`.`limitation` AS `applications_rear_limitation`, `applications_rear`.`fitment_type` AS `applications_rear_fitment_type`, `applications_rear`.`fitment_advice` AS `applications_rear_fitment_advice`, `caps_rear`.`capseatdescr` AS `caps_rear_capseatdescr`, `strength_certificates_rear`.`id` AS `strength_certificates_rear_id`, `strength_certificates_rear`.`max_load` AS `strength_certificates_rear_max_load`, `strength_certificates_rear`.`rolling_circumference` AS `strength_certificates_rear_rolling_circumference`, `strength_certificates_rear`.`certificate_document` AS `strength_certificates_rear_certificate_document`, (select max(`tyres`.`design_overall_diameter`) from (`tyres` `tyres_rear` join `oe_combined_fitments` `oe_combined_fitments_rear` on(`oe_combined_fitments_rear`.`rear_axle_tyre` = `tyres_rear`.`id`)) where `oe_combined_fitments_rear`.`car` = `applications_rear`.`car` and `oe_combined_fitments_rear`.`rear_axle_diameter` = `am_wheels_rear`.`diameter` and `oe_combined_fitments_rear`.`rear_axle_width` = `am_wheels_rear`.`width`) AS `oe_applications_tyres_rear_design_overall_diameter`, `oe_combined_fitments_rear`.`rear_axle_diameter` AS `oe_applications_rear_diameter`, `oe_combined_fitments_rear`.`rear_axle_width` AS `oe_applications_rear_width`, `oe_combined_fitments_rear`.`rear_axle_et` AS `oe_applications_rear_et` FROM (((((((((((((((((((((((`combined_applications` join `cars` on(`combined_applications`.`car_id` = `cars`.`id`)) join `car_models` on(`cars`.`car_model` = `car_models`.`id`)) join `car_manufacturers` on(`car_models`.`manufacturer` = `car_manufacturers`.`id`)) left join `car_max_loads` on(`combined_applications`.`car_id` = `car_max_loads`.`car`)) join `pcds` on(`cars`.`pcd` = `pcds`.`id`)) join `cbs` on(`cars`.`cb` = `cbs`.`id`)) join `applications` on(`applications`.`id` = `combined_applications`.`front_axle_applications`)) join `am_wheels` on(`applications`.`am_wheel` = `am_wheels`.`id`)) join `am_wheel_models` on(`am_wheels`.`model` = `am_wheel_models`.`id`)) join `am_wheel_lines` on(`am_wheel_models`.`line` = `am_wheel_lines`.`id`)) left join `am_wheel_versions` on(`am_wheels`.`id` = `am_wheel_versions`.`am_wheel`)) left join `caps` on(`am_wheels`.`cap` = `caps`.`id`)) left join `strength_certificates` on(`applications`.`am_wheel` = `strength_certificates`.`am_wheel`)) left join `oe_combined_fitments` on(`oe_combined_fitments`.`car` = `applications`.`car` and `oe_combined_fitments`.`front_axle_diameter` = `am_wheels`.`diameter` and `oe_combined_fitments`.`front_axle_width` = `am_wheels`.`width`)) left join `tyres` on(`oe_combined_fitments`.`front_axle_tyre` = `tyres`.`id`)) join `applications` `applications_rear` on(`applications_rear`.`id` = `combined_applications`.`rear_axle_applications`)) join `am_wheels` `am_wheels_rear` on(`applications_rear`.`am_wheel` = `am_wheels_rear`.`id`)) join `am_wheel_models` `am_wheel_models_rear` on(`am_wheels_rear`.`model` = `am_wheel_models_rear`.`id`)) join `am_wheel_lines` `am_wheel_lines_rear` on(`am_wheel_models_rear`.`line` = `am_wheel_lines_rear`.`id`)) left join `caps` `caps_rear` on(`am_wheels_rear`.`cap` = `caps_rear`.`id`)) left join `strength_certificates` `strength_certificates_rear` on(`applications_rear`.`am_wheel` = `strength_certificates_rear`.`am_wheel`)) left join `oe_combined_fitments` `oe_combined_fitments_rear` on(`oe_combined_fitments_rear`.`car` = `applications_rear`.`car` and `oe_combined_fitments_rear`.`rear_axle_diameter` = `am_wheels_rear`.`diameter` and `oe_combined_fitments_rear`.`rear_axle_width` = `am_wheels_rear`.`width`)) left join `tyres` `tyres_rear` on(`oe_combined_fitments_rear`.`rear_axle_tyre` = `tyres_rear`.`id`)) ;

-- --------------------------------------------------------

--
-- Struttura per vista `mod_combined_full_9`
--
DROP TABLE IF EXISTS `mod_combined_full_9`;

CREATE ALGORITHM=UNDEFINED DEFINER=`pagnanvisuallab`@`localhost` SQL SECURITY DEFINER VIEW `mod_combined_full_9`  AS SELECT `combined_applications`.`id` AS `combined_applications_id`, `combined_applications`.`car_id` AS `combined_applications_car_id`, `combined_applications`.`front_axle_applications` AS `front_axle_applications`, `combined_applications`.`rear_axle_applications` AS `rear_axle_applications`, `combined_applications`.`kit` AS `combined_applications_kit`, `combined_applications`.`limitations` AS `combined_applications_limitations`, `cars`.`id` AS `cars_id`, `cars`.`production_time_start` AS `cars_production_time_start`, `cars`.`production_time_stop` AS `cars_production_time_stop`, `car_models`.`id` AS `car_models_id`, `car_models`.`model` AS `car_models_model`, `car_manufacturers`.`id` AS `car_manufacturers_id`, `car_manufacturers`.`manufacturer` AS `car_manufacturers_manufacturer`, `cars`.`cb` AS `cb`, `cbs`.`cb` AS `cars_cb`, `cars`.`pcd` AS `pcd`, `pcds`.`pcd` AS `cars_pcd`, `car_max_loads`.`max_load` AS `car_max_loads_max_load`, `am_wheels`.`id` AS `am_wheels_id`, `am_wheels`.`status` AS `am_wheels_status`, `am_wheel_models`.`id` AS `am_wheel_models_id`, `am_wheel_models`.`model` AS `am_wheel_models_model`, `am_wheel_lines`.`id` AS `am_wheel_lines_id`, `am_wheel_lines`.`line` AS `am_wheel_lines_line`, `am_wheels`.`code` AS `am_wheels_code`, `am_wheels`.`makers_code` AS `am_wheels_makers_code`, `am_wheels`.`wheel_type` AS `am_wheels_wheel_type`, `am_wheels`.`version` AS `am_wheels_version`, `am_wheels`.`diameter` AS `am_wheels_diameter`, `am_wheels`.`width` AS `am_wheels_width`, `am_wheels`.`et` AS `am_wheels_et`, `applications`.`id` AS `applications_id`, `applications`.`car` AS `applications_car`, `applications`.`centering_ring` AS `applications_centering_ring_id`, `centering_rings_front`.`code` AS `c_ring_front_code`, `applications`.`bolt_nut` AS `applications_bolt_nut`, `bolt_nuts_front`.`code` AS `b_nuts_front_code`, `applications`.`limitation` AS `limitation`, `applications`.`fitment_advice` AS `fitment_advice`, `caps`.`capseatdescr` AS `capseatdescr`, `am_wheels_rear`.`id` AS `am_wheels_rear_id`, `am_wheels_rear`.`status` AS `am_wheels_rear_status`, `am_wheel_models_rear`.`id` AS `am_wheel_models_rear_id`, `am_wheel_models_rear`.`model` AS `am_wheel_models_rear_model`, `am_wheel_lines_rear`.`id` AS `am_wheel_lines_rear_id`, `am_wheel_lines_rear`.`line` AS `am_wheel_lines_rear_line`, `am_wheels_rear`.`code` AS `am_wheels_rear_code`, `am_wheels_rear`.`makers_code` AS `am_wheels_rear_makers_code`, `am_wheels_rear`.`wheel_type` AS `am_wheels_rear_wheel_type`, `am_wheels_rear`.`version` AS `am_wheels_rear_version`, `am_wheels_rear`.`diameter` AS `am_wheels_rear_diameter`, `am_wheels_rear`.`width` AS `am_wheels_rear_width`, `am_wheels_rear`.`rim_type` AS `am_wheels_rear_rim_type`, `am_wheels_rear`.`et` AS `am_wheels_rear_et`, `applications_rear`.`id` AS `applications_rear_id`, `applications_rear`.`car` AS `applications_rear_car`, `applications_rear`.`centering_ring` AS `applications_rear_centering_ring_id`, `centering_rings_rear`.`code` AS `c_ring_rear_code`, `applications_rear`.`bolt_nut` AS `applications_rear_bolt_nut`, `bolt_nuts_rear`.`code` AS `b_nuts_rear_code`, `applications_rear`.`limitation` AS `applications_rear_limitation`, `applications_rear`.`fitment_advice` AS `applications_rear_fitment_advice`, `caps_rear`.`capseatdescr` AS `caps_rear_capseatdescr` FROM ((((((((((((((((((((`combined_applications` left join `cars` on(`combined_applications`.`car_id` = `cars`.`id`)) left join `car_models` on(`cars`.`car_model` = `car_models`.`id`)) left join `car_manufacturers` on(`car_models`.`manufacturer` = `car_manufacturers`.`id`)) left join `car_max_loads` on(`combined_applications`.`car_id` = `car_max_loads`.`car`)) left join `pcds` on(`cars`.`pcd` = `pcds`.`id`)) left join `cbs` on(`cars`.`cb` = `cbs`.`id`)) left join `applications` on(`applications`.`id` = `combined_applications`.`front_axle_applications`)) left join `am_wheels` on(`applications`.`am_wheel` = `am_wheels`.`id`)) left join `am_wheel_models` on(`am_wheels`.`model` = `am_wheel_models`.`id`)) left join `am_wheel_lines` on(`am_wheel_models`.`line` = `am_wheel_lines`.`id`)) left join `caps` on(`am_wheels`.`cap` = `caps`.`id`)) left join `centering_rings` `centering_rings_front` on(`applications`.`centering_ring` = `centering_rings_front`.`id`)) left join `bolt_nuts` `bolt_nuts_front` on(`applications`.`bolt_nut` = `bolt_nuts_front`.`id`)) left join `applications` `applications_rear` on(`applications_rear`.`id` = `combined_applications`.`rear_axle_applications`)) left join `am_wheels` `am_wheels_rear` on(`applications_rear`.`am_wheel` = `am_wheels_rear`.`id`)) left join `am_wheel_models` `am_wheel_models_rear` on(`am_wheels_rear`.`model` = `am_wheel_models_rear`.`id`)) left join `am_wheel_lines` `am_wheel_lines_rear` on(`am_wheel_models_rear`.`line` = `am_wheel_lines_rear`.`id`)) left join `caps` `caps_rear` on(`am_wheels_rear`.`cap` = `caps_rear`.`id`)) left join `centering_rings` `centering_rings_rear` on(`applications_rear`.`centering_ring` = `centering_rings_rear`.`id`)) left join `bolt_nuts` `bolt_nuts_rear` on(`applications_rear`.`bolt_nut` = `bolt_nuts_rear`.`id`)) ;

-- --------------------------------------------------------

--
-- Struttura per vista `mod_combined_full_10`
--
DROP TABLE IF EXISTS `mod_combined_full_10`;

CREATE ALGORITHM=UNDEFINED DEFINER=`pagnanvisuallab`@`localhost` SQL SECURITY DEFINER VIEW `mod_combined_full_10`  AS SELECT `combined_applications`.`id` AS `combined_applications_id`, `combined_applications`.`car_id` AS `combined_applications_car_id`, `combined_applications`.`front_axle_applications` AS `front_axle_applications`, `combined_applications`.`rear_axle_applications` AS `rear_axle_applications`, `combined_applications`.`kit` AS `combined_applications_kit`, `combined_applications`.`limitations` AS `combined_applications_limitations`, `cars`.`id` AS `cars_id`, `car_manufacturers`.`id` AS `car_manufacturers_id`, `car_manufacturers`.`manufacturer` AS `car_manufacturers_manufacturer`, `car_models`.`id` AS `car_models_id`, `car_models`.`model` AS `car_models_model`, `cars`.`production_time_start` AS `cars_production_time_start`, `cars`.`production_time_stop` AS `cars_production_time_stop`, `cars`.`cb` AS `cb`, `cbs`.`cb` AS `cars_cb`, `cars`.`pcd` AS `pcd`, `pcds`.`pcd` AS `cars_pcd`, `car_max_loads`.`max_load` AS `car_max_loads_max_load`, `am_wheels`.`id` AS `am_wheels_id`, `am_wheel_lines`.`id` AS `am_wheel_lines_id`, `am_wheel_lines`.`line` AS `am_wheel_lines_line`, `am_wheels`.`status` AS `am_wheels_status`, `am_wheel_models`.`id` AS `am_wheel_models_id`, `am_wheel_models`.`model` AS `am_wheel_models_model`, `am_wheels`.`diameter` AS `am_wheels_diameter`, `am_wheels`.`width` AS `am_wheels_width`, `am_wheels`.`et` AS `am_wheels_et`, `am_wheels`.`wheel_type` AS `am_wheels_wheel_type`, `am_wheels`.`version` AS `am_wheels_version`, `am_wheels`.`code` AS `am_wheels_code`, `am_wheels`.`makers_code` AS `am_wheels_makers_code`, `applications`.`id` AS `applications_id`, `applications`.`car` AS `applications_car`, `applications`.`centering_ring` AS `applications_centering_ring_id`, `centering_rings_front`.`code` AS `c_ring_front_code`, `applications`.`bolt_nut` AS `applications_bolt_nut`, `bolt_nuts_front`.`code` AS `b_nuts_front_code`, `applications`.`limitation` AS `limitation`, `applications`.`fitment_advice` AS `fitment_advice`, `caps`.`capseatdescr` AS `capseatdescr`, `am_wheels_rear`.`id` AS `am_wheels_rear_id`, `am_wheels_rear`.`status` AS `am_wheels_rear_status`, `am_wheel_lines_rear`.`id` AS `am_wheel_lines_rear_id`, `am_wheel_lines_rear`.`line` AS `am_wheel_lines_rear_line`, `am_wheel_models_rear`.`id` AS `am_wheel_models_rear_id`, `am_wheel_models_rear`.`model` AS `am_wheel_models_rear_model`, `am_wheels_rear`.`diameter` AS `am_wheels_rear_diameter`, `am_wheels_rear`.`width` AS `am_wheels_rear_width`, `am_wheels_rear`.`et` AS `am_wheels_rear_et`, `am_wheels_rear`.`wheel_type` AS `am_wheels_rear_wheel_type`, `am_wheels_rear`.`version` AS `am_wheels_rear_version`, `am_wheels_rear`.`code` AS `am_wheels_rear_code`, `am_wheels_rear`.`makers_code` AS `am_wheels_rear_makers_code`, `applications_rear`.`id` AS `applications_rear_id`, `applications_rear`.`car` AS `applications_rear_car`, `applications_rear`.`centering_ring` AS `applications_rear_centering_ring_id`, `centering_rings_rear`.`code` AS `c_ring_rear_code`, `applications_rear`.`bolt_nut` AS `applications_rear_bolt_nut`, `bolt_nuts_rear`.`code` AS `b_nuts_rear_code`, `applications_rear`.`limitation` AS `applications_rear_limitation`, `applications_rear`.`fitment_advice` AS `applications_rear_fitment_advice`, `caps_rear`.`capseatdescr` AS `caps_rear_capseatdescr` FROM ((((((((((((((((((((`combined_applications` left join `cars` on(`combined_applications`.`car_id` = `cars`.`id`)) left join `car_models` on(`cars`.`car_model` = `car_models`.`id`)) left join `car_manufacturers` on(`car_models`.`manufacturer` = `car_manufacturers`.`id`)) left join `car_max_loads` on(`combined_applications`.`car_id` = `car_max_loads`.`car`)) left join `pcds` on(`cars`.`pcd` = `pcds`.`id`)) left join `cbs` on(`cars`.`cb` = `cbs`.`id`)) left join `applications` on(`applications`.`id` = `combined_applications`.`front_axle_applications`)) left join `am_wheels` on(`applications`.`am_wheel` = `am_wheels`.`id`)) left join `am_wheel_models` on(`am_wheels`.`model` = `am_wheel_models`.`id`)) left join `am_wheel_lines` on(`am_wheel_models`.`line` = `am_wheel_lines`.`id`)) left join `caps` on(`am_wheels`.`cap` = `caps`.`id`)) left join `centering_rings` `centering_rings_front` on(`applications`.`centering_ring` = `centering_rings_front`.`id`)) left join `bolt_nuts` `bolt_nuts_front` on(`applications`.`bolt_nut` = `bolt_nuts_front`.`id`)) left join `applications` `applications_rear` on(`applications_rear`.`id` = `combined_applications`.`rear_axle_applications`)) left join `am_wheels` `am_wheels_rear` on(`applications_rear`.`am_wheel` = `am_wheels_rear`.`id`)) left join `am_wheel_models` `am_wheel_models_rear` on(`am_wheels_rear`.`model` = `am_wheel_models_rear`.`id`)) left join `am_wheel_lines` `am_wheel_lines_rear` on(`am_wheel_models_rear`.`line` = `am_wheel_lines_rear`.`id`)) left join `caps` `caps_rear` on(`am_wheels_rear`.`cap` = `caps_rear`.`id`)) left join `centering_rings` `centering_rings_rear` on(`applications_rear`.`centering_ring` = `centering_rings_rear`.`id`)) left join `bolt_nuts` `bolt_nuts_rear` on(`applications_rear`.`bolt_nut` = `bolt_nuts_rear`.`id`)) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
