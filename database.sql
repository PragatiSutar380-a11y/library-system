-- ===================================================================
-- Academic B.Sc. Computer Science Field Project: Library Management System
-- Relational Database SQL Script (MySQL / MariaDB / phpMyAdmin / InfinityFree)
-- Database Name: library_db
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `library_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `library_db`;

-- --------------------------------------------------------
-- Table structure for table `users` (System Administrators)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('admin', 'employee', 'member') NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`username`, `password`, `name`, `email`, `role`) VALUES
('admin', 'admin123', 'College Chief Librarian', 'admin.library@college.edu', 'admin');

-- --------------------------------------------------------
-- Table structure for table `book_categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `book_categories` (
  `category_id` VARCHAR(20) PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `book_categories` (`category_id`, `category_name`, `description`) VALUES
('CAT01', 'Computer Science', 'Algorithms, Data Structures, Software Engineering, Networks'),
('CAT02', 'Mathematics', 'Discrete Math, Calculus, Linear Algebra, Probability'),
('CAT03', 'Electronics', 'Digital Systems, Microcontrollers, VLSI'),
('CAT04', 'Physics', 'Mechanics, Electromagnetism, Quantum Theory'),
('CAT05', 'General & Humanities', 'Communication, Environmental Science, Ethics');

-- --------------------------------------------------------
-- Table structure for table `books`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `books` (
  `book_id` VARCHAR(20) PRIMARY KEY,
  `isbn` VARCHAR(30) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `publisher` VARCHAR(150),
  `category` VARCHAR(100) NOT NULL,
  `edition` VARCHAR(50),
  `publication_year` INT,
  `shelf_no` VARCHAR(50) NOT NULL,
  `total_copies` INT NOT NULL DEFAULT 1,
  `available_copies` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `books` (`book_id`, `isbn`, `title`, `author`, `publisher`, `category`, `edition`, `publication_year`, `shelf_no`, `total_copies`, `available_copies`) VALUES
('BK101', '978-0131103627', 'The C Programming Language', 'Brian W. Kernighan, Dennis M. Ritchie', 'Prentice Hall', 'Computer Science', '2nd Edition', 1988, 'Rack A-1', 8, 6),
('BK102', '978-0078022159', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', 'McGraw-Hill Education', 'Computer Science', '7th Edition', 2019, 'Rack A-2', 10, 7),
('BK103', '978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest', 'MIT Press', 'Computer Science', '3rd Edition', 2009, 'Rack A-3', 6, 3),
('BK104', '978-0132126953', 'Computer Networks', 'Andrew S. Tanenbaum, David J. Wetherall', 'Pearson Education', 'Computer Science', '5th Edition', 2011, 'Rack B-1', 7, 5),
('BK105', '978-0133591620', 'Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne', 'Wiley', 'Computer Science', '10th Edition', 2018, 'Rack B-2', 8, 6),
('BK106', '978-0073383095', 'Discrete Mathematics and Its Applications', 'Kenneth H. Rosen', 'McGraw-Hill', 'Mathematics', '8th Edition', 2018, 'Rack C-1', 5, 4),
('BK107', '978-0134444246', 'Digital Design: With an Introduction to Verilog HDL', 'M. Morris Mano, Michael D. Ciletti', 'Pearson', 'Electronics', '6th Edition', 2017, 'Rack D-1', 4, 3),
('BK108', '978-0134092669', 'Software Engineering: A Practitioner\'s Approach', 'Roger S. Pressman, Bruce R. Maxim', 'McGraw-Hill', 'Computer Science', '8th Edition', 2015, 'Rack B-3', 6, 5);

-- --------------------------------------------------------
-- Table structure for table `employees` (Library Staff)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employees` (
  `employee_id` VARCHAR(20) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `joining_date` DATE NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `employees` (`employee_id`, `name`, `email`, `phone`, `address`, `username`, `password`, `joining_date`, `role`, `status`) VALUES
('EMP01', 'Suresh Kumar', 'suresh.kumar@college.edu', '9876543210', 'Faculty Quarters Q-12, College Campus', 'suresh', 'password123', '2023-06-15', 'Assistant Librarian', 'Active'),
('EMP02', 'Pooja Verma', 'pooja.verma@college.edu', '9845123456', 'Flat 304, Green Avenue, City Center', 'pooja', 'password123', '2024-01-10', 'Library Attendant', 'Active'),
('EMP03', 'Ramesh Patil', 'ramesh.patil@college.edu', '9765432109', 'Near Old Bus Stand, North Wing', 'ramesh', 'password123', '2023-11-01', 'Cataloger', 'Active');

-- --------------------------------------------------------
-- Table structure for table `members` (Students & Faculty)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `members` (
  `member_id` VARCHAR(20) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT,
  `category` ENUM('Student', 'Faculty', 'Staff') NOT NULL,
  `department` VARCHAR(100),
  `username` VARCHAR(50) UNIQUE,
  `password` VARCHAR(255),
  `registration_date` DATE NOT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `members` (`member_id`, `name`, `email`, `phone`, `address`, `category`, `department`, `username`, `password`, `registration_date`, `status`) VALUES
('MEM001', 'Rahul Sharma', 'rahul.s@student.college.edu', '9123456780', 'Room 204, Boys Hostel B', 'Student', 'B.Sc. Computer Science - Year 3', 'rahul01', 'password123', '2024-07-15', 'Active'),
('MEM002', 'Dr. Anita Joshi', 'anita.joshi@faculty.college.edu', '9890123456', 'Sector 5, Academic Enclave', 'Faculty', 'Department of Computer Science', 'anita.j', 'password123', '2022-08-01', 'Active'),
('MEM003', 'Sneha Deshmukh', 'sneha.d@student.college.edu', '9234567891', 'Plot 45, Vidya Nagar', 'Student', 'B.Sc. Computer Science - Year 2', 'snehad', 'password123', '2024-08-20', 'Active'),
('MEM004', 'Prof. Rajesh Kulkarni', 'rajesh.k@faculty.college.edu', '9789012345', '402 Sunrise Heights', 'Faculty', 'Mathematics Department', 'rkulkarni', 'password123', '2021-01-10', 'Active'),
('MEM005', 'Amit Jadhav', 'amit.j@student.college.edu', '9345678902', 'Room 112, Boys Hostel A', 'Student', 'B.Sc. Information Technology - Year 1', 'amitj', 'password123', '2024-09-01', 'Active');

-- --------------------------------------------------------
-- Table structure for table `transactions` (Issues & Returns)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` VARCHAR(20) PRIMARY KEY,
  `book_id` VARCHAR(20) NOT NULL,
  `member_id` VARCHAR(20) NOT NULL,
  `employee_id` VARCHAR(20) NOT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `return_date` DATE NULL,
  `status` ENUM('Issued', 'Returned') NOT NULL DEFAULT 'Issued',
  `overdue_days` INT DEFAULT 0,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON UPDATE CASCADE,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`member_id`) ON UPDATE CASCADE,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `transactions` (`transaction_id`, `book_id`, `member_id`, `employee_id`, `issue_date`, `due_date`, `return_date`, `status`, `overdue_days`, `notes`) VALUES
('TXN1001', 'BK103', 'MEM001', 'EMP01', '2026-09-10', '2026-09-24', NULL, 'Issued', 2, 'Standard 14-day student issue'),
('TXN1002', 'BK102', 'MEM002', 'EMP01', '2026-09-18', '2026-10-18', NULL, 'Issued', 0, 'Faculty research issue (30 days)'),
('TXN1003', 'BK101', 'MEM003', 'EMP02', '2026-09-20', '2026-10-04', NULL, 'Issued', 0, 'Semester lab reference'),
('TXN1004', 'BK104', 'MEM001', 'EMP01', '2026-08-15', '2026-08-29', '2026-08-28', 'Returned', 0, 'Returned in good condition on time'),
('TXN1005', 'BK105', 'MEM005', 'EMP02', '2026-08-01', '2026-08-15', '2026-08-15', 'Returned', 0, 'Returned before due date');

-- --------------------------------------------------------
-- Table structure for table `attendance` (Staff Duty Logs)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendance` (
  `attendance_id` VARCHAR(40) PRIMARY KEY,
  `employee_id` VARCHAR(20) NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL,
  `login_time` VARCHAR(20) NOT NULL,
  `logout_time` VARCHAR(20) NULL,
  `status` ENUM('Present', 'Completed') DEFAULT 'Present',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `attendance` (`attendance_id`, `employee_id`, `employee_name`, `date`, `login_time`, `logout_time`, `status`) VALUES
('ATT-2026-09-26-01', 'EMP01', 'Suresh Kumar', '2026-09-26', '08:45 AM', NULL, 'Present'),
('ATT-2026-09-26-02', 'EMP02', 'Pooja Verma', '2026-09-26', '09:05 AM', NULL, 'Present'),
('ATT-2026-09-25-01', 'EMP01', 'Suresh Kumar', '2026-09-25', '08:50 AM', '05:00 PM', 'Completed'),
('ATT-2026-09-25-02', 'EMP02', 'Pooja Verma', '2026-09-25', '09:00 AM', '05:15 PM', 'Completed'),
('ATT-2026-09-25-03', 'EMP03', 'Ramesh Patil', '2026-09-25', '09:30 AM', '05:30 PM', 'Completed');
