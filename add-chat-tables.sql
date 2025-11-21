-- Add Messages and Notifications tables for Chat functionality
-- Run this file in MySQL/MariaDB to enable chat features

USE vcet_alumni_hub;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) unsigned NOT NULL,
  `receiver_id` int(10) unsigned NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sender_receiver` (`sender_id`, `receiver_id`),
  KEY `idx_receiver_read` (`receiver_id`, `is_read`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Sample messages data
--

INSERT INTO `messages` VALUES 
(1, 2, 7, 'Hi Anil! How are your studies going?', 1, '2025-11-20 10:30:00', '2025-11-20 11:00:00'),
(2, 7, 2, 'Hi Rajesh! Going great! Learning a lot from your posts.', 1, '2025-11-20 10:35:00', '2025-11-20 11:00:00'),
(3, 2, 7, 'That\'s wonderful! Let me know if you need any career guidance.', 1, '2025-11-20 10:40:00', '2025-11-20 11:00:00'),
(4, 3, 8, 'Hey Pooja! Saw your post about the hackathon. Great work!', 1, '2025-11-20 11:00:00', '2025-11-20 11:30:00'),
(5, 8, 3, 'Thank you so much Priya! Your mentorship means a lot.', 1, '2025-11-20 11:05:00', '2025-11-20 11:30:00'),
(6, 4, 7, 'Hi Anil! I have an internship opportunity at Tesla. Interested?', 0, '2025-11-21 09:00:00', '2025-11-21 09:00:00'),
(7, 5, 8, 'Hey! Would you like to collaborate on a React project?', 0, '2025-11-21 10:00:00', '2025-11-21 10:00:00');

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `from_user_id` int(10) unsigned NOT NULL,
  `post_id` int(10) unsigned DEFAULT NULL,
  `type` enum('like','comment','share','follow','message') NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_read` (`user_id`, `is_read`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_from_user` (`from_user_id`),
  KEY `idx_post` (`post_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Sample notifications data
--

INSERT INTO `notifications` VALUES 
(1, 2, 7, NULL, 'follow', 'Anil Kumar started following you', 1, '2025-11-20 09:00:00'),
(2, 3, 8, NULL, 'follow', 'Pooja Mehta started following you', 1, '2025-11-20 09:30:00'),
(3, 7, 2, NULL, 'message', 'Rajesh Kumar sent you a message', 0, '2025-11-21 09:00:00'),
(4, 8, 5, NULL, 'message', 'Sneha Reddy sent you a message', 0, '2025-11-21 10:00:00');

SELECT 'Chat tables created successfully!' AS message;
