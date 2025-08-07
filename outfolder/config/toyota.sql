-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2025 at 07:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toyota`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Service','Product') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `type`) VALUES
(1, 'Maintenance & Repair', 'Service'),
(2, 'Body & Collision', 'Service'),
(3, 'Parts & Installation', 'Service'),
(4, 'Car Care & Detailing', 'Service'),
(5, 'Administrative Services', 'Service'),
(6, 'Vehicle Services', 'Service'),
(7, 'Vehicles', 'Product'),
(8, 'Parts & Components', 'Product'),
(9, 'Accessories', 'Product');

-- --------------------------------------------------------

--
-- Table structure for table `dbchecker`
--

CREATE TABLE `dbchecker` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dbchecker`
--

INSERT INTO `dbchecker` (`id`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `category_id`, `name`, `price`, `points`) VALUES
(1, 1, 'Oil Change', 2500.00, 25),
(2, 1, 'Brake Service', 4000.00, 40),
(3, 1, 'Battery Testing & Replacement', 3000.00, 30),
(4, 1, 'Tire Services', 5000.00, 50),
(5, 1, 'Air Conditioning Service', 3500.00, 35),
(6, 1, 'Transmission Service', 6000.00, 60),
(7, 1, 'Engine Diagnostics & Repair', 7500.00, 75),
(8, 1, 'Suspension & Steering Repairs', 5500.00, 55),
(9, 1, 'Emissions Testing', 1500.00, 15),
(10, 1, 'Vehicle Inspection', 2000.00, 20),
(11, 2, 'Dent & Scratch Repair', 8000.00, 80),
(12, 2, 'Body Painting', 10000.00, 100),
(13, 2, 'Collision Repair', 15000.00, 150),
(14, 2, 'Windshield & Glass Replacement', 6500.00, 65),
(15, 3, 'OEM/Genuine Parts Installation', 3000.00, 30),
(16, 3, 'Accessory Installation', 4000.00, 40),
(17, 3, 'Tire & Wheel Replacement', 8000.00, 80),
(18, 3, 'Lighting Replacement', 2500.00, 25),
(19, 4, 'Interior & Exterior Cleaning', 2000.00, 20),
(20, 4, 'Vacuuming & Shampooing', 1500.00, 15),
(21, 4, 'Paint Protection / Ceramic Coating', 5000.00, 50),
(22, 4, 'Undercoating & Rustproofing', 4000.00, 40),
(23, 5, 'Vehicle Registration Assistance', 1000.00, 10),
(24, 5, 'Insurance Processing', 1500.00, 15),
(25, 5, 'LTO Renewal Assistance', 1200.00, 12),
(26, 6, 'New Car Delivery & Orientation', 2000.00, 20),
(27, 6, 'Test Drives', 500.00, 5),
(28, 6, 'Trade-in Appraisals', 1000.00, 10),
(29, 6, 'Vehicle Pickup & Drop-off', 1500.00, 15),
(30, 6, 'Roadside Assistance', 2000.00, 20),
(31, 6, 'Towing Services', 3000.00, 30),
(32, 6, 'Courtesy Car / Loaner Vehicle', 2500.00, 25),
(33, 7, 'Brand-New Cars', 1500000.00, 15000),
(34, 7, 'Used Cars / Certified Pre-Owned', 800000.00, 8000),
(35, 7, 'Electric Vehicles', 2000000.00, 20000),
(36, 7, 'Hybrid Vehicles', 1800000.00, 18000),
(37, 7, 'Commercial Vehicles', 1200000.00, 12000),
(38, 7, 'Fleet Vehicles', 1000000.00, 10000),
(39, 8, 'Engine Parts', 1000.00, 10),
(40, 8, 'Brake Components', 2000.00, 20),
(41, 8, 'Batteries', 5000.00, 50),
(42, 8, 'Tires & Rims', 10000.00, 100),
(43, 8, 'Lighting', 1500.00, 15),
(44, 8, 'Windshields & Wipers', 3000.00, 30),
(45, 8, 'Air Conditioning Parts', 2500.00, 25),
(46, 8, 'Suspension Parts', 4000.00, 40),
(47, 9, 'Floor Mats & Seat Covers', 2000.00, 20),
(48, 9, 'GPS Navigation Units', 5000.00, 50),
(49, 9, 'Dashcams / Rearview Cameras', 3000.00, 30),
(50, 9, 'Car Alarms & Security Systems', 4000.00, 40),
(51, 9, 'Roof Racks & Bike Carriers', 3500.00, 35),
(52, 9, 'Spoilers, Body Kits, Side Steps', 6000.00, 60),
(53, 9, 'Audio & Infotainment Systems', 8000.00, 80),
(54, 9, 'Car Care Products', 500.00, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `dbchecker`
--
ALTER TABLE `dbchecker`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `dbchecker`
--
ALTER TABLE `dbchecker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
