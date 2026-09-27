<?php
/**
 * Employees API for XAMPP PHP + MySQL Backend
 */
require_once __DIR__ . '/../db_connect.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM employees ORDER BY employee_id ASC");
        $employees = $stmt->fetchAll();
        $result = array_map(function($e) {
            return [
                'id' => (int)$e['id'],
                'employeeId' => $e['employee_id'],
                'name' => $e['name'],
                'email' => $e['email'],
                'phone' => $e['phone'],
                'address' => $e['address'],
                'username' => $e['username'],
                'joiningDate' => $e['joining_date'],
                'role' => $e['role'],
                'status' => $e['status'],
            ];
        }, $employees);
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO employees (employee_id, name, email, phone, address, username, joining_date, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['employeeId'],
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['address'],
            $data['username'],
            $data['joiningDate'] ?? date('Y-m-d'),
            $data['role'] ?? 'Assistant Librarian',
            $data['status'] ?? 'Active'
        ]);
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Employee added successfully']);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $employeeId = $_GET['employeeId'] ?? ($data['employeeId'] ?? null);
        $stmt = $pdo->prepare("UPDATE employees SET name = ?, email = ?, phone = ?, address = ?, role = ?, status = ? WHERE employee_id = ?");
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['address'],
            $data['role'],
            $data['status'],
            $employeeId
        ]);
        echo json_encode(['success' => true, 'message' => 'Employee updated successfully']);
        break;

    case 'DELETE':
        $employeeId = $_GET['employeeId'] ?? null;
        $stmt = $pdo->prepare("DELETE FROM employees WHERE employee_id = ?");
        $stmt->execute([$employeeId]);
        echo json_encode(['success' => true, 'message' => "Employee $employeeId deleted"]);
        break;
}
