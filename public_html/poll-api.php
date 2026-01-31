<?php
// Poll API for Hostinger Database
// This handles voting and retrieving poll results

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration - UPDATE THESE WITH YOUR HOSTINGER DETAILS
$host = 'localhost'; // Usually 'localhost' on Hostinger
$dbname = 'u819283710_Storage'; // Your database name from Hostinger
$username = 'u819283710_pt907'; // Your database username
$password = 'Silky@07t'; // Your database password

// Create connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit();
}

// Create table if it doesn't exist
$createTable = "CREATE TABLE IF NOT EXISTS poll_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_name VARCHAR(100) NOT NULL,
    option_name VARCHAR(50) NOT NULL,
    vote_count INT DEFAULT 0,
    UNIQUE KEY unique_poll_option (poll_name, option_name)
)";
$pdo->exec($createTable);

// Initialize poll if it doesn't exist
$initPoll = "INSERT IGNORE INTO poll_votes (poll_name, option_name, vote_count) VALUES 
    ('charley-vs-garry', 'charley', 0),
    ('charley-vs-garry', 'garry', 0)";
$pdo->exec($initPoll);

// Handle request
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get current vote counts
    $poll = isset($_GET['poll']) ? $_GET['poll'] : 'charley-vs-garry';
    
    $stmt = $pdo->prepare("SELECT option_name, vote_count FROM poll_votes WHERE poll_name = ?");
    $stmt->execute([$poll]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $votes = [];
    foreach ($results as $row) {
        $votes[$row['option_name']] = (int)$row['vote_count'];
    }
    
    echo json_encode($votes);
    
} elseif ($method === 'POST') {
    // Cast a vote
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['poll']) || !isset($data['option'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing poll or option']);
        exit();
    }
    
    $poll = $data['poll'];
    $option = $data['option'];
    
    // Validate option
    if (!in_array($option, ['charley', 'garry'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid option']);
        exit();
    }
    
    // Increment vote count
    $stmt = $pdo->prepare("UPDATE poll_votes SET vote_count = vote_count + 1 WHERE poll_name = ? AND option_name = ?");
    $stmt->execute([$poll, $option]);
    
    // Get updated counts
    $stmt = $pdo->prepare("SELECT option_name, vote_count FROM poll_votes WHERE poll_name = ?");
    $stmt->execute([$poll]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $votes = [];
    foreach ($results as $row) {
        $votes[$row['option_name']] = (int)$row['vote_count'];
    }
    
    echo json_encode([
        'success' => true,
        'votes' => $votes
    ]);
}
?>
