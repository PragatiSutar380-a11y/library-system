<?php
/**
 * Attendance API for XAMPP PHP + MySQL Backend
 */
require_once __DIR__ . '/../db_connect.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM attendance ORDER BY date DESC, id DESC");
        $records = $stmt->fetchAll();
        $result = array_map(function($a) {
            return [
                'id' => (int)$a['id'],
                'recordId' => $a['record_id'],
                'employeeId' => $a['employee_id'],
                'employeeName' => $a['employee_name'],
                'date' => $a['date'],
                'loginTime' => $a['login_time'],
                'logoutTime' => $a['logout_time'],
                'status' => $a['status'],
            ];
        }, $records);
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? ($data['action'] ?? 'login');

        if ($action === 'login') {
            $recordId = "ATT-" . $data['date'] . "-" . $data['employeeId'];
            $check = $pdo->prepare("SELECT * FROM attendance WHERE record_id = ?");
            $check->execute([$recordId]);
            if ($check->fetch()) {
                echo json_encode(['message' => 'Already logged in today']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO attendance (record_id, employee_id, employee_name, date, login_time, status) VALUES (?, ?, ?, ?, ?, 'Present')");
            $stmt->execute([
                $recordId,
                $data['employeeId'],
                $data['employeeName'],
                $data['date'],
                $data['loginTime']
            ]);
            http_response_code(201);
            echo json_encode(['success' => true, 'recordId' => $recordId]);
        } elseif ($action === 'logout') {
            $recordId = "ATT-" . $data['date'] . "-" . $data['employeeId'];
            $stmt = $pdo->prepare("UPDATE attendance SET logout_time = ?, status = 'Completed' WHERE record_id = ?");
            $stmt->execute([$data['logoutTime'], $recordId]);
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        }
        break;
}
