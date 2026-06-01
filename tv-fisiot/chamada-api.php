<?php
/**
 * chamada-api.php — TV Fisiot
 * Endpoint para sincronização cross-device de chamadas de pacientes.
 * POST: salva a chamada (JSON body com { texto, ginasio, profissional, horario, timestamp })
 * GET:  retorna a última chamada salva
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/chamada-data.json';

// ── POST: salvar chamada ─────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data  = json_decode($input, true);

    if (!$data || !isset($data['timestamp'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'invalid_data']);
        exit;
    }

    // Rejeita dados com mais de 10 minutos (evita replay antigo)
    $ageSec = abs(time() - intval($data['timestamp'] / 1000));
    if ($ageSec > 600) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'timestamp_expired']);
        exit;
    }

    // Sanitizar campos de texto
    $clean = [
        'timestamp'    => intval($data['timestamp']),
        'texto'        => mb_substr(strip_tags($data['texto']        ?? ''), 0, 300),
        'ginasio'      => mb_substr(strip_tags($data['ginasio']      ?? ''), 0, 60),
        'profissional' => mb_substr(strip_tags($data['profissional'] ?? ''), 0, 100),
        'horario'      => mb_substr(strip_tags($data['horario']      ?? ''), 0, 10),
    ];

    $fp = fopen($dataFile, 'c');
    if ($fp && flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($clean, JSON_UNESCAPED_UNICODE));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        echo json_encode(['ok' => true, 'ts' => $clean['timestamp']]);
    } else {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'write_failed']);
    }
    exit;
}

// ── GET: retornar última chamada + server_ts para evitar clock-skew ──
$serverTs = (int)(microtime(true) * 1000); // milissegundos, igual ao Date.now() do JS

if (file_exists($dataFile)) {
    $json = @file_get_contents($dataFile);
    $data = $json ? json_decode($json, true) : null;
    if ($data && isset($data['timestamp'])) {
        // Injeta server_ts sem alterar o arquivo
        $data['server_ts'] = $serverTs;
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['timestamp' => 0, 'server_ts' => $serverTs]);
    }
} else {
    echo json_encode(['timestamp' => 0, 'server_ts' => $serverTs]);
}
