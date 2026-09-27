/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Database Schema & PHP Architecture Documentation (For Viva & InfinityFree Deployment)
 */

import React, { useState } from 'react';
import { Database, Code2, Server, Download, Copy, Check, FileCode, Layers } from 'lucide-react';

export const DatabaseSchemaDocs: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlSchema = `-- ===================================================================
-- B.Sc. Computer Science Field Project: Library Management System
-- Relational Database Schema (MySQL / MariaDB for InfinityFree/XAMPP)
-- Database Name: library_db
-- ===================================================================

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- 1. ADMIN / USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'employee', 'member') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. BOOK CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS book_categories (
    category_id VARCHAR(20) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. BOOKS TABLE
CREATE TABLE IF NOT EXISTS books (
    book_id VARCHAR(20) PRIMARY KEY,
    isbn VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(150),
    category VARCHAR(100) NOT NULL,
    edition VARCHAR(50),
    publication_year INT,
    shelf_no VARCHAR(50) NOT NULL,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. EMPLOYEES / LIBRARY STAFF TABLE
CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    joining_date DATE NOT NULL,
    role VARCHAR(50) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. MEMBERS (STUDENTS & FACULTY) TABLE
CREATE TABLE IF NOT EXISTS members (
    member_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    category ENUM('Student', 'Faculty', 'Staff') NOT NULL,
    department VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    registration_date DATE NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TRANSACTIONS / ISSUES & RETURNS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(20) PRIMARY KEY,
    book_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('Issued', 'Returned') NOT NULL DEFAULT 'Issued',
    overdue_days INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id VARCHAR(40) PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    login_time VARCHAR(20) NOT NULL,
    logout_time VARCHAR(20) NULL,
    status ENUM('Present', 'Completed') DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const phpDbConnect = `<?php
// db_connect.php
// Academic B.Sc. Library Management System - Database Connection (PDO)
// Host configuration for Localhost (XAMPP) or Shared Hosting (InfinityFree)

$host     = "localhost";
$dbname   = "library_db";
$username = "root";       // Change on InfinityFree: e.g. if0_xxxx_library
$password = "";           // Change to InfinityFree account password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}
?>`;

  const phpIssueBook = `<?php
// issue_book.php
// Processes book issue to member, decrements available_copies, logs employee ID

require_once 'db_connect.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $book_id     = trim($_POST['book_id']);
    $member_id   = trim($_POST['member_id']);
    $employee_id = $_SESSION['employee_id'] ?? 'EMP01';
    $loan_days   = intval($_POST['loan_days'] ?? 14);

    try {
        $pdo->beginTransaction();

        // 1. Verify available copies
        $stmt = $pdo->prepare("SELECT available_copies, title FROM books WHERE book_id = ? FOR UPDATE");
        $stmt->execute([$book_id]);
        $book = $stmt->fetch();

        if (!$book || $book['available_copies'] <= 0) {
            throw new Exception("Book copy not available in stacks.");
        }

        // 2. Generate Transaction ID
        $txn_id = "TXN" . rand(1000, 9999);
        $issue_date = date('Y-m-d');
        $due_date   = date('Y-m-d', strtotime("+$loan_days days"));

        // 3. Insert transaction
        $insertStmt = $pdo->prepare("
            INSERT INTO transactions (transaction_id, book_id, member_id, employee_id, issue_date, due_date, status)
            VALUES (?, ?, ?, ?, ?, ?, 'Issued')
        ");
        $insertStmt->execute([$txn_id, $book_id, $member_id, $employee_id, $issue_date, $due_date]);

        // 4. Decrement available copies
        $updateStmt = $pdo->prepare("UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?");
        $updateStmt->execute([$book_id]);

        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Book successfully issued", "txn_id" => $txn_id]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
?>`;

  const downloadSQL = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'library_db_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Database Design & Academic Project Architecture
              </h2>
              <p className="text-xs text-stone-500">
                Matches the B.Sc. Computer Science Field Project ERD, DFD, Table Specifications, and PHP+MySQL implementation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <a
              href="/api/download-project-zip"
              download="library_management_system_xampp_project.zip"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Download entire project source code, PHP scripts, SQL dump, and assets as ZIP"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Download Complete Project (ZIP)</span>
            </a>

            <button
              onClick={downloadSQL}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>database.sql</span>
            </button>
          </div>
        </div>
      </div>

      {/* XAMPP Local Execution Guide Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Offline / Localhost Ready
            </span>
            <h3 className="text-base font-bold text-stone-900 mt-1">
              Run Locally with XAMPP (Apache + PHP + MySQL)
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Everything needed to run this project permanently on your personal laptop or college lab computer without internet.
            </p>
          </div>

          <a
            href="/api/download-project-zip"
            download="library_management_system_xampp_project.zip"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Download Project ZIP (2.7 MB)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-2xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Extract to htdocs</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Extract the downloaded ZIP into your XAMPP web directory:
              <br />
              <code className="text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[10px] mt-1 inline-block">
                C:\xampp\htdocs\library-system\
              </code>
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-2xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Import database.sql</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Open <code className="text-emerald-800 font-mono text-[10px]">http://localhost/phpmyadmin</code>, create database <code className="text-emerald-800 font-mono text-[10px]">library_db</code>, and click <strong>Import</strong> → select <code className="font-mono text-[10px]">xampp-backend/database.sql</code>.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-2xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Launch & Present</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Open your browser and navigate to:
              <br />
              <code className="text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[10px] mt-1 inline-block">
                http://localhost/library-system/
              </code>
              <br />
              Log in with Admin (<code className="font-mono text-[10px]">admin / admin123</code>) or staff.
            </p>
          </div>
        </div>
      </div>

      {/* Relational Entity Relationships Diagram Overview */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-700" />
          <span>Entity-Relationship (ER) Relational Schema</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 mb-2">employees</div>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li className="font-bold text-purple-700">PK: employee_id</li>
              <li>name</li>
              <li>email</li>
              <li>phone</li>
              <li>username</li>
              <li>password</li>
              <li>joining_date</li>
              <li>role, status</li>
            </ul>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 mb-2">attendance</div>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li className="font-bold text-purple-700">PK: attendance_id</li>
              <li className="text-blue-700 font-semibold">FK: employee_id</li>
              <li>employee_name</li>
              <li>date</li>
              <li>login_time</li>
              <li>logout_time</li>
              <li>status</li>
            </ul>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 mb-2">transactions</div>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li className="font-bold text-purple-700">PK: transaction_id</li>
              <li className="text-blue-700 font-semibold">FK: book_id</li>
              <li className="text-blue-700 font-semibold">FK: member_id</li>
              <li className="text-blue-700 font-semibold">FK: employee_id</li>
              <li>issue_date</li>
              <li>due_date</li>
              <li>return_date</li>
              <li>status, overdue_days</li>
            </ul>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 mb-2">books</div>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li className="font-bold text-purple-700">PK: book_id</li>
              <li>isbn</li>
              <li>title</li>
              <li>author</li>
              <li>category</li>
              <li>edition, year</li>
              <li>shelf_no</li>
              <li>total_copies</li>
              <li className="font-bold text-emerald-700">available_copies</li>
            </ul>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 mb-2">members</div>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li className="font-bold text-purple-700">PK: member_id</li>
              <li>name</li>
              <li>email</li>
              <li>phone</li>
              <li>address</li>
              <li>category (Student/Faculty)</li>
              <li>department</li>
              <li>registration_date</li>
              <li>status</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900">
          <strong>Key Relational Integrity:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>Employee → Attendance (1-to-Many): Attendance records track daily login/logout of staff.</li>
            <li>Member → Transactions (1-to-Many): Member history and active borrows.</li>
            <li>Book → Transactions (1-to-Many): Book loan audit trail.</li>
            <li>Employee → Transactions (1-to-Many): Staff member who authorized checkout.</li>
          </ul>
        </div>
      </div>

      {/* SQL DDL Code Block */}
      <div className="bg-stone-900 rounded-xl border border-stone-800 text-stone-100 p-5 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-semibold text-stone-300">
              MySQL DDL Schema (Import directly to phpMyAdmin on InfinityFree/XAMPP)
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(sqlSchema, 'sql')}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            {copiedSection === 'sql' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied SQL</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="font-mono text-xs text-stone-300 overflow-x-auto max-h-96 p-2 bg-stone-950 rounded leading-relaxed">
          {sqlSchema}
        </pre>
      </div>

      {/* PHP Backend Scripts for Viva & Deployment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* db_connect.php */}
        <div className="bg-stone-900 rounded-xl border border-stone-800 text-stone-100 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
            <span className="font-mono text-xs font-semibold text-amber-300">db_connect.php</span>
            <button
              onClick={() => copyToClipboard(phpDbConnect, 'php_db')}
              className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] flex items-center gap-1 font-mono"
            >
              {copiedSection === 'php_db' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="font-mono text-[11px] text-stone-300 overflow-x-auto max-h-60 p-2 bg-stone-950 rounded">
            {phpDbConnect}
          </pre>
        </div>

        {/* issue_book.php */}
        <div className="bg-stone-900 rounded-xl border border-stone-800 text-stone-100 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
            <span className="font-mono text-xs font-semibold text-amber-300">issue_book.php</span>
            <button
              onClick={() => copyToClipboard(phpIssueBook, 'php_issue')}
              className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] flex items-center gap-1 font-mono"
            >
              {copiedSection === 'php_issue' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="font-mono text-[11px] text-stone-300 overflow-x-auto max-h-60 p-2 bg-stone-950 rounded">
            {phpIssueBook}
          </pre>
        </div>
      </div>
    </div>
  );
};
