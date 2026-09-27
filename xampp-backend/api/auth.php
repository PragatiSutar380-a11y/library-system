<?php
/**
 * Authentication API for XAMPP PHP + MySQL Backend
 */
require_once __DIR__ . '/../db_connect.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$role = $data['role'] ?? 'member';
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($role === 'admin') {
    if ($username === 'admin' && $password === 'admin123') {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => 'ADM001',
                'username' => 'admin',
                'name' => 'Chief Librarian (Admin)',
                'email' => 'admin.library@college.edu',
                'role' => 'admin'
            ]
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid admin credentials']);
        exit;
    }
}

if ($role === 'employee') {
    $stmt = $pdo->prepare("SELECT * FROM employees WHERE username = ? OR employee_id = ?");
    $stmt->execute([$username, $username]);
    $emp = $stmt->fetch();
    if ($emp) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $emp['employee_id'],
                'username' => $emp['username'],
                'name' => $emp['name'],
                'email' => $emp['email'],
                'role' => 'employee'
            ]
        ]);
        exit;
    }
}

if ($role === 'member') {
    $stmt = $pdo->prepare("SELECT * FROM members WHERE username = ? OR member_id = ?");
    $stmt->execute([$username, $username]);
    $mem = $stmt->fetch();
    if ($mem) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $mem['member_id'],
                'username' => $mem['username'],
                'name' => $mem['name'],
                'email' => $mem['email'],
                'role' => 'member'
            ]
        ]);
        exit;
    }
}

http_response_code(401);
echo json_encode(['error' => 'User not found or invalid credentials']);
