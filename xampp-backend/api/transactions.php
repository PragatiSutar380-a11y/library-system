<?php
/**
 * Transactions API (Issue & Return) for XAMPP PHP + MySQL Backend
 */
require_once __DIR__ . '/../db_connect.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM transactions ORDER BY id DESC");
        $txns = $stmt->fetchAll();
        $result = array_map(function($t) {
            return [
                'id' => (int)$t['id'],
                'transactionId' => $t['transaction_id'],
                'bookId' => $t['book_id'],
                'bookTitle' => $t['book_title'],
                'memberId' => $t['member_id'],
                'memberName' => $t['member_name'],
                'employeeId' => $t['employee_id'],
                'employeeName' => $t['employee_name'],
                'issueDate' => $t['issue_date'],
                'dueDate' => $t['due_date'],
                'returnDate' => $t['return_date'],
                'status' => $t['status'],
                'overdueDays' => (int)$t['overdue_days'],
                'notes' => $t['notes'],
            ];
        }, $txns);
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? ($data['action'] ?? 'issue');

        if ($action === 'issue') {
            $txnId = $data['transactionId'] ?? ('TXN-' . rand(1000, 9999));
            $stmt = $pdo->prepare("INSERT INTO transactions (transaction_id, book_id, book_title, member_id, member_name, employee_id, employee_name, issue_date, due_date, status, overdue_days, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Issued', 0, ?)");
            $stmt->execute([
                $txnId,
                $data['bookId'],
                $data['bookTitle'],
                $data['memberId'],
                $data['memberName'],
                $data['employeeId'],
                $data['employeeName'],
                $data['issueDate'],
                $data['dueDate'],
                $data['notes'] ?? null
            ]);

            // Decrement copies
            $updateCopies = $pdo->prepare("UPDATE books SET available_copies = GREATEST(0, available_copies - 1) WHERE book_id = ?");
            $updateCopies->execute([$data['bookId']]);

            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Book issued successfully', 'transactionId' => $txnId]);
        } elseif ($action === 'return') {
            $txnId = $data['transactionId'];
            $returnDate = $data['returnDate'] ?? date('Y-m-d');

            // Find book_id
            $find = $pdo->prepare("SELECT book_id, due_date FROM transactions WHERE transaction_id = ?");
            $find->execute([$txnId]);
            $row = $find->fetch();

            if (!$row) {
                http_response_code(404);
                echo json_encode(['error' => 'Transaction not found']);
                exit;
            }

            $diffDays = 0;
            $dueTime = strtotime($row['due_date']);
            $retTime = strtotime($returnDate);
            if ($retTime > $dueTime) {
                $diffDays = (int)floor(($retTime - $dueTime) / (60 * 60 * 24));
            }

            $stmt = $pdo->prepare("UPDATE transactions SET return_date = ?, status = 'Returned', overdue_days = ? WHERE transaction_id = ?");
            $stmt->execute([$returnDate, $diffDays, $txnId]);

            // Increment copies
            $updateCopies = $pdo->prepare("UPDATE books SET available_copies = LEAST(total_copies, available_copies + 1) WHERE book_id = ?");
            $updateCopies->execute([$row['book_id']]);

            echo json_encode(['success' => true, 'message' => 'Book returned successfully', 'overdueDays' => $diffDays]);
        }
        break;
}
