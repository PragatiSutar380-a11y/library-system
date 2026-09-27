-- ==============================================================================
-- Academic B.Sc. Computer Science Field Project: Library Management System
-- Relational Database SQL Dump for MySQL / MariaDB (XAMPP / WampServer / phpMyAdmin)
-- Database Name: library_db
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `library_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `library_db`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uid` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL DEFAULT 'library123',
  `role` ENUM('admin', 'employee', 'member') NOT NULL DEFAULT 'member',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`uid`, `username`, `name`, `email`, `password`, `role`) VALUES
('ADM001', 'admin', 'Chief Librarian (Admin)', 'admin.library@college.edu', 'admin123', 'admin'),
('EMP001', 'suresh', 'Suresh Kumar', 'suresh.staff@college.edu', 'staff123', 'employee'),
('EMP002', 'anita', 'Anita Sharma', 'anita.staff@college.edu', 'staff123', 'employee'),
('MEM001', 'rahul01', 'Rahul Sharma', 'rahul.cs21@college.edu', 'student123', 'member'),
('MEM002', 'priya99', 'Priya Patel', 'priya.it22@college.edu', 'student123', 'member');

-- --------------------------------------------------------
-- Table structure for table `book_categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `book_categories`;
CREATE TABLE `book_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `book_categories` (`category_id`, `name`, `description`) VALUES
('CAT01', 'Computer Science', 'Computing, Algorithms, Databases, Networks'),
('CAT02', 'Mathematics', 'Discrete Math, Calculus, Linear Algebra, Statistics'),
('CAT03', 'Electronics', 'Digital Circuits, Microprocessors, Embedded Systems'),
('CAT04', 'Physics', 'Classical Mechanics, Quantum, Optics'),
('CAT05', 'General & Humanities', 'Communication Skills, Environmental Studies');

-- --------------------------------------------------------
-- Table structure for table `employees`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `joining_date` DATE NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `employees` (`employee_id`, `name`, `email`, `phone`, `address`, `username`, `joining_date`, `role`, `status`) VALUES
('EMP001', 'Suresh Kumar', 'suresh.staff@college.edu', '9876543210', 'Staff Quarters Q-12, College Campus', 'suresh', '2022-08-15', 'Assistant Librarian', 'Active'),
('EMP002', 'Anita Sharma', 'anita.staff@college.edu', '9876543211', 'Flat 402, Shanti Heights, City Road', 'anita', '2023-01-10', 'Cataloger', 'Active'),
('EMP003', 'Ramesh Yadav', 'ramesh.staff@college.edu', '9876543212', '12/B Railway Colony, Station Road', 'ramesh', '2021-11-01', 'Library Attendant', 'Active');

-- --------------------------------------------------------
-- Table structure for table `members`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `member_id` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `category` ENUM('Student', 'Faculty', 'Staff') NOT NULL DEFAULT 'Student',
  `department` VARCHAR(100) DEFAULT 'General',
  `registration_date` DATE NOT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `username` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `members` (`member_id`, `name`, `email`, `phone`, `address`, `category`, `department`, `registration_date`, `status`, `username`) VALUES
('MEM001', 'Rahul Sharma', 'rahul.cs21@college.edu', '9811223344', 'Room 104, Boys Hostel B, Campus', 'Student', 'Computer Science & Engg', '2024-07-20', 'Active', 'rahul01'),
('MEM002', 'Priya Patel', 'priya.it22@college.edu', '9822334455', 'Room 208, Girls Hostel A, Campus', 'Student', 'Information Technology', '2024-07-22', 'Active', 'priya99'),
('MEM003', 'Dr. S. K. Gupta', 'skgupta.faculty@college.edu', '9833445566', 'Faculty Enclave F-03, Campus', 'Faculty', 'Computer Science Department', '2022-01-15', 'Active', 'skgupta'),
('MEM004', 'Amit Verma', 'amit.ec23@college.edu', '9844556677', 'Sector 4, Model Town, City', 'Student', 'Electronics & Comm Engg', '2024-08-01', 'Active', 'amit_v'),
('MEM005', 'Sneha Deshmukh', 'sneha.mech@college.edu', '9855667788', 'Room 312, Girls Hostel B, Campus', 'Student', 'Mechanical Engineering', '2023-08-10', 'Inactive', 'sneha_d');

-- --------------------------------------------------------
-- Table structure for table `books`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `book_id` VARCHAR(30) NOT NULL UNIQUE,
  `isbn` VARCHAR(30) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `publisher` VARCHAR(150) NOT NULL,
  `category_id` VARCHAR(30) DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `edition` VARCHAR(50) NOT NULL,
  `publication_year` INT NOT NULL,
  `shelf_rack_no` VARCHAR(50) NOT NULL,
  `total_copies` INT NOT NULL DEFAULT 1,
  `available_copies` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `books` (`book_id`, `isbn`, `title`, `author`, `publisher`, `category_id`, `category`, `edition`, `publication_year`, `shelf_rack_no`, `total_copies`, `available_copies`) VALUES
('BK101', '978-0131103627', 'The C Programming Language', 'Brian W. Kernighan, Dennis M. Ritchie', 'Prentice Hall', 'CAT01', 'Computer Science', '2nd Edition', 1988, 'Rack A-1', 8, 6),
('BK102', '978-0078022159', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', 'McGraw-Hill Education', 'CAT01', 'Computer Science', '7th Edition', 2019, 'Rack A-2', 10, 7),
('BK103', '978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest', 'MIT Press', 'CAT01', 'Computer Science', '3rd Edition', 2009, 'Rack A-3', 12, 10),
('BK104', '978-0133594140', 'Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne', 'Wiley', 'CAT01', 'Computer Science', '10th Edition', 2018, 'Rack B-1', 7, 5),
('BK105', '978-0132126953', 'Computer Networks', 'Andrew S. Tanenbaum, David J. Wetherall', 'Pearson', 'CAT01', 'Computer Science', '5th Edition', 2010, 'Rack B-2', 6, 5),
('BK106', '978-0070669116', 'Discrete Mathematics and Its Applications', 'Kenneth H. Rosen', 'McGraw-Hill', 'CAT02', 'Mathematics', '8th Edition', 2019, 'Rack C-1', 9, 8),
('BK107', '978-0134682334', 'Digital Design: With an Introduction to the Verilog HDL', 'M. Morris Mano, Michael D. Ciletti', 'Pearson', 'CAT03', 'Electronics', '6th Edition', 2017, 'Rack D-1', 5, 4),
('BK108', '978-1118230725', 'Fundamentals of Physics', 'David Halliday, Robert Resnick, Jearl Walker', 'Wiley', 'CAT04', 'Physics', '10th Edition', 2013, 'Rack E-1', 6, 5);

-- --------------------------------------------------------
-- Table structure for table `transactions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` VARCHAR(30) NOT NULL UNIQUE,
  `book_id` VARCHAR(30) NOT NULL,
  `book_title` VARCHAR(255) DEFAULT NULL,
  `member_id` VARCHAR(30) NOT NULL,
  `member_name` VARCHAR(100) DEFAULT NULL,
  `employee_id` VARCHAR(30) NOT NULL,
  `employee_name` VARCHAR(100) DEFAULT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `return_date` DATE DEFAULT NULL,
  `status` ENUM('Issued', 'Returned') NOT NULL DEFAULT 'Issued',
  `overdue_days` INT DEFAULT 0,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE CASCADE,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`member_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `transactions` (`transaction_id`, `book_id`, `book_title`, `member_id`, `member_name`, `employee_id`, `employee_name`, `issue_date`, `due_date`, `return_date`, `status`, `overdue_days`, `notes`) VALUES
('TXN-9001', 'BK101', 'The C Programming Language', 'MEM001', 'Rahul Sharma', 'EMP001', 'Suresh Kumar', '2026-09-10', '2026-09-24', NULL, 'Issued', 2, 'Late submission pending'),
('TXN-9002', 'BK102', 'Database System Concepts', 'MEM002', 'Priya Patel', 'EMP001', 'Suresh Kumar', '2026-09-15', '2026-09-29', NULL, 'Issued', 0, 'Regular 14-day study loan'),
('TXN-9003', 'BK104', 'Operating System Concepts', 'MEM003', 'Dr. S. K. Gupta', 'EMP002', 'Anita Sharma', '2026-09-01', '2026-09-30', NULL, 'Issued', 0, 'Faculty 30-day course reserve'),
('TXN-9004', 'BK103', 'Introduction to Algorithms', 'MEM001', 'Rahul Sharma', 'EMP001', 'Suresh Kumar', '2026-08-20', '2026-09-03', '2026-09-02', 'Returned', 0, 'Returned in pristine condition');

-- --------------------------------------------------------
-- Table structure for table `attendance`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `record_id` VARCHAR(50) NOT NULL UNIQUE,
  `employee_id` VARCHAR(30) NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL,
  `login_time` VARCHAR(20) NOT NULL,
  `logout_time` VARCHAR(20) DEFAULT NULL,
  `status` ENUM('Present', 'Completed') NOT NULL DEFAULT 'Present',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `attendance` (`record_id`, `employee_id`, `employee_name`, `date`, `login_time`, `logout_time`, `status`) VALUES
('ATT-2026-09-26-EMP001', 'EMP001', 'Suresh Kumar', '2026-09-26', '08:30 AM', NULL, 'Present'),
('ATT-2026-09-26-EMP002', 'EMP002', 'Anita Sharma', '2026-09-26', '08:45 AM', NULL, 'Present'),
('ATT-2026-09-25-EMP001', 'EMP001', 'Suresh Kumar', '2026-09-25', '08:30 AM', '05:00 PM', 'Completed'),
('ATT-2026-09-25-EMP002', 'EMP002', 'Anita Sharma', '2026-09-25', '08:45 AM', '05:15 PM', 'Completed'),
('ATT-2026-09-25-EMP003', 'EMP003', 'Ramesh Yadav', '2026-09-25', '09:00 AM', '05:30 PM', 'Completed');
