<?php
/**
 * Members API for XAMPP PHP + MySQL Backend
 */
require_once __DIR__ . '/../db_connect.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM members ORDER BY member_id ASC");
        $members = $stmt->fetchAll();
        $result = array_map(function($m) {
            return [
                'id' => (int)$m['id'],
                'memberId' => $m['member_id'],
                'name' => $m['name'],
                'email' => $m['email'],
                'phone' => $m['phone'],
                'address' => $m['address'],
                'category' => $m['category'],
                'department' => $m['department'],
                'registrationDate' => $m['registration_date'],
                'status' => $m['status'],
                'username' => $m['username'],
            ];
        }, $members);
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO members (member_id, name, email, phone, address, category, department, registration_date, status, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['memberId'],
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['address'],
            $data['category'] ?? 'Student',
            $data['department'] ?? 'General',
            $data['registrationDate'] ?? date('Y-m-d'),
            $data['status'] ?? 'Active',
            $data['username'] ?? strtolower($data['memberId'])
        ]);
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Member added successfully']);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $memberId = $_GET['memberId'] ?? ($data['memberId'] ?? null);
        $stmt = $pdo->prepare("UPDATE members SET name = ?, email = ?, phone = ?, address = ?, category = ?, department = ?, status = ? WHERE member_id = ?");
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['address'],
            $data['category'],
            $data['department'],
            $data['status'],
            $memberId
        ]);
        echo json_encode(['success' => true, 'message' => 'Member updated successfully']);
        break;

    case 'DELETE':
        $memberId = $_GET['memberId'] ?? null;
        $stmt = $pdo->prepare("DELETE FROM members WHERE member_id = ?");
        $stmt->execute([$memberId]);
        echo json_encode(['success' => true, 'message' => "Member $memberId deleted"]);
        break;
}
