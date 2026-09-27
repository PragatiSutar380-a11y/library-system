<?php
/**
 * Books API for XAMPP PHP + MySQL Backend
 */
require_once __DIR__ . '/../db_connect.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM books ORDER BY book_id ASC");
        $books = $stmt->fetchAll();
        // Format to camelCase for frontend compatibility
        $result = array_map(function($b) {
            return [
                'id' => (int)$b['id'],
                'bookId' => $b['book_id'],
                'isbn' => $b['isbn'],
                'title' => $b['title'],
                'author' => $b['author'],
                'publisher' => $b['publisher'],
                'category' => $b['category'],
                'edition' => $b['edition'],
                'publicationYear' => (int)$b['publication_year'],
                'shelfRackNo' => $b['shelf_rack_no'],
                'totalCopies' => (int)$b['total_copies'],
                'availableCopies' => (int)$b['available_copies'],
            ];
        }, $books);
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO books (book_id, isbn, title, author, publisher, category, edition, publication_year, shelf_rack_no, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['bookId'],
            $data['isbn'],
            $data['title'],
            $data['author'],
            $data['publisher'],
            $data['category'],
            $data['edition'],
            $data['publicationYear'],
            $data['shelfRackNo'],
            $data['totalCopies'],
            $data['availableCopies'] ?? $data['totalCopies']
        ]);
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Book added successfully', 'book' => $data]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $bookId = $_GET['bookId'] ?? ($data['bookId'] ?? null);
        if (!$bookId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing bookId']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE books SET isbn = ?, title = ?, author = ?, publisher = ?, category = ?, edition = ?, publication_year = ?, shelf_rack_no = ?, total_copies = ?, available_copies = ? WHERE book_id = ?");
        $stmt->execute([
            $data['isbn'],
            $data['title'],
            $data['author'],
            $data['publisher'],
            $data['category'],
            $data['edition'],
            $data['publicationYear'],
            $data['shelfRackNo'],
            $data['totalCopies'],
            $data['availableCopies'],
            $bookId
        ]);
        echo json_encode(['success' => true, 'message' => 'Book updated successfully']);
        break;

    case 'DELETE':
        $bookId = $_GET['bookId'] ?? null;
        if (!$bookId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing bookId']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM books WHERE book_id = ?");
        $stmt->execute([$bookId]);
        echo json_encode(['success' => true, 'message' => "Book $bookId deleted"]);
        break;
}
