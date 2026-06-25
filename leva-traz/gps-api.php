<?php
/**
 * Leva & Traz Fisiot — GPS API Endpoint
 * Endpoint seguro server-side para salvar/ler localização do motorista.
 * Substitui acesso direto à GitHub API com token exposto no front-end.
 *
 * GET  /gps-api.php  → retorna JSON com última localização
 * POST /gps-api.php  → salva nova localização (requer chave de escrita)
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Access-Control-Allow-Origin: https://fisiotlevaetras.com.br');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── CONFIGURAÇÃO ──────────────────────────────────────────────────────────────
// Chave de escrita: conhecida apenas pelo painel do motorista.
// Pior caso de exposição: alguém pode enviar coordenadas GPS falsas.
// NÃO concede acesso a nenhum repositório, servidor ou serviço externo.
define('WRITE_KEY', 'FISIOT2026');
define('GPS_FILE', __DIR__ . '/gps-data.json');
define('EMPTY_GPS', json_encode([
    'lat'      => null,
    'lng'      => null,
    'acc'      => null,
    'ts'       => null,
    'active'   => false,
    'motorista'=> 'Antonio Carlos',
    'veiculo'  => 'Chevrolet Spin',
    'updated'  => null
]));

// ── GET: retorna dados GPS atuais ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists(GPS_FILE)) {
        $raw  = file_get_contents(GPS_FILE);
        $data = json_decode($raw, true);
        if ($data === null) {
            $data = json_decode(EMPTY_GPS, true);
        }
    } else {
        $data = json_decode(EMPTY_GPS, true);
    }
    echo json_encode($data);
    exit;
}

// ── POST: salva nova localização ──────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body    = file_get_contents('php://input');
    $payload = json_decode($body, true);

    // Valida chave de escrita
    if (!$payload || !isset($payload['key']) || $payload['key'] !== WRITE_KEY) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    // Sanitiza e valida campos de GPS
    $lat = isset($payload['lat']) && is_numeric($payload['lat']) ? (float)$payload['lat'] : null;
    $lng = isset($payload['lng']) && is_numeric($payload['lng']) ? (float)$payload['lng'] : null;
    $acc = isset($payload['acc']) && is_numeric($payload['acc']) ? (int)$payload['acc']  : null;
    $ts  = isset($payload['ts'])  && is_numeric($payload['ts'])  ? (int)$payload['ts']   : (int)(microtime(true) * 1000);
    $act = isset($payload['active']) ? (bool)$payload['active'] : true;

    // Rejeita coordenadas claramente inválidas
    if ($lat !== null && ($lat < -90 || $lat > 90))   { $lat = null; }
    if ($lng !== null && ($lng < -180 || $lng > 180)) { $lng = null; }

    $gps = [
        'lat'      => $lat,
        'lng'      => $lng,
        'acc'      => $acc,
        'ts'       => $ts,
        'active'   => $act,
        'motorista'=> 'Antonio Carlos',
        'veiculo'  => 'Chevrolet Spin',
        'updated'  => date('c')
    ];

    $written = file_put_contents(GPS_FILE, json_encode($gps), LOCK_EX);

    if ($written !== false) {
        echo json_encode(['ok' => true, 'ts' => $ts]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao gravar arquivo de localização']);
    }
    exit;
}

// Método não permitido
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
