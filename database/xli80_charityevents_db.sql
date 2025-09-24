-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost:3306
-- 生成日期： 2025-09-24 14:24:25
-- 服务器版本： 5.7.44-cll-lve
-- PHP 版本： 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `xli80_charityevents_db`
--

-- --------------------------------------------------------

--
-- 表的结构 `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `description`) VALUES
(1, 'Charity Run', 'A charity fundraising event in the form of running'),
(2, 'Charity Auction', 'An event to raise funds by auctioning items'),
(3, 'Public Welfare Lecture', 'A knowledge-sharing event to spread public welfare concepts and raise funds'),
(4, 'Charity Concert', 'A charity event in the form of a music performance'),
(5, 'Environmental Action', 'A public welfare activity focused on environmental protection');

-- --------------------------------------------------------

--
-- 表的结构 `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  `goal_amount` decimal(10,2) NOT NULL,
  `current_amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `category_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_date`, `location`, `ticket_price`, `goal_amount`, `current_amount`, `status`, `category_id`, `org_id`) VALUES
(1, '2025 Love Charity Marathon', '2025-10-15', 'City Center Stadium', 50.00, 10000.00, 0.00, 'active', 1, 1),
(2, 'Autumn Charity Art Auction', '2025-11-05', 'Art Center Exhibition Hall', 0.00, 8000.00, 0.00, 'active', 2, 4),
(3, 'Environmental Public Welfare Lecture', '2025-10-20', 'City Library Auditorium', 20.00, 5000.00, 0.00, 'active', 3, 3),
(4, 'Winter Charity Concert', '2025-12-10', 'City Concert Hall', 80.00, 15000.00, 0.00, 'active', 4, 2),
(5, 'Community Cleanup Activity', '2025-10-25', 'Community Park', 0.00, 3000.00, 0.00, 'active', 5, 3),
(6, 'Student Aid Charity Run', '2025-11-20', 'Suburban Forest', 40.00, 9000.00, 0.00, 'active', 1, 1),
(7, 'Animal Protection Auction', '2025-12-01', 'Pet Adoption Center', 0.00, 6000.00, 0.00, 'active', 2, 4),
(8, 'Eco-Technology Lecture', '2025-11-10', 'Science Museum', 30.00, 7000.00, 0.00, 'active', 3, 3),
(9, 'Spring Symphony for Charity', '2026-03-20', 'Grand Theater', 100.00, 20000.00, 0.00, 'active', 4, 2);

-- --------------------------------------------------------

--
-- 表的结构 `organizations`
--

CREATE TABLE `organizations` (
  `org_id` int(11) NOT NULL,
  `org_name` varchar(255) NOT NULL,
  `mission` text NOT NULL,
  `contact` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `organizations`
--

INSERT INTO `organizations` (`org_id`, `org_name`, `mission`, `contact`, `created_at`) VALUES
(1, 'Love Public Welfare Foundation', 'Help children in poverty-stricken areas with education and growth', 'lovefund@example.com', '2025-09-24 02:27:36'),
(2, 'Art Charity Association', 'Help vulnerable groups gain development opportunities through art activities', 'artcharity@example.com', '2025-09-24 02:27:36'),
(3, 'Environmental Public Welfare Alliance', 'Promote environmental protection and safeguard natural ecology', 'greenalliance@example.com', '2025-09-24 02:27:36'),
(4, 'Animal Protection Association', 'Care for stray animals and promote harmonious coexistence between humans and animals', 'animalcare@example.com', '2025-09-24 02:27:36');

--
-- 转储表的索引
--

--
-- 表的索引 `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- 表的索引 `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `fk_events_category` (`category_id`),
  ADD KEY `fk_events_org` (`org_id`);

--
-- 表的索引 `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`org_id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用表AUTO_INCREMENT `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用表AUTO_INCREMENT `organizations`
--
ALTER TABLE `organizations`
  MODIFY `org_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 限制导出的表
--

--
-- 限制表 `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_events_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_events_org` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
