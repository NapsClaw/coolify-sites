/**
 * server.js — Leva & Traz Fisiot
 * Servidor Node.js que serve arquivos estáticos do site
 * e expõe /gps-api.php para salvar/ler localização GPS do motorista.
 *
 * Padrão idêntico ao tv-fisiot (chamada-api.php).
 * Nenhum token externo é necessário; dados gravados em gps-data.json no servidor.
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT      = process.env.PORT || 3000;
const STATIC    = __dirname;
const GPS_FILE  = path.join(__dirname, 'gps-data.json');
const WRITE_KEY = 'FISIOT2026';  // Mesma chave do PIN do motorista

// ── GPS vazio (sem localização) ───────────────────────────────────────────
const EMPTY_GPS = {
  lat:      null,
  lng:      null,
  acc:      null,
  ts:       null,
  active:   false,
  motorista:'Antonio Carlos',
  veiculo:  'Chevrolet Spin',
  updated:  null
};

// Garante que gps-data.json existe
if (!fs.existsSync(GPS_FILE)) {
  fs.writeFileSync(GPS_FILE, JSON.stringify(EMPTY_GPS), 'utf8');
}

// ── MIME types ────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.php':  'application/json',  // /gps-api.php tratado abaixo como API
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
  '.webmanifest': 'application/manifest+json',
};

function noCache(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
}

function sendJSON(res, status, obj) {
  noCache(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

// ── Lê GPS atual ──────────────────────────────────────────────────────────
function readGPS() {
  try {
    const raw  = fs.readFileSync(GPS_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data || EMPTY_GPS;
  } catch (e) {
    return Object.assign({}, EMPTY_GPS);
  }
}

// ── Sanitiza e valida payload GPS ─────────────────────────────────────────
function sanitizeGPS(payload) {
  const lat = (payload.lat !== undefined && payload.lat !== null && !isNaN(payload.lat))
    ? parseFloat(payload.lat) : null;
  const lng = (payload.lng !== undefined && payload.lng !== null && !isNaN(payload.lng))
    ? parseFloat(payload.lng) : null;
  const acc = (payload.acc !== undefined && !isNaN(payload.acc))
    ? Math.round(parseFloat(payload.acc)) : null;
  const ts = (payload.ts && !isNaN(payload.ts))
    ? parseInt(payload.ts) : Date.now();
  const active = payload.active !== false;

  // Rejeita coordenadas inválidas
  const validLat = lat !== null && lat >= -90  && lat <= 90;
  const validLng = lng !== null && lng >= -180 && lng <= 180;

  return {
    lat:      validLat ? lat : null,
    lng:      validLng ? lng : null,
    acc:      acc,
    ts:       ts,
    active:   active,
    motorista:'Antonio Carlos',
    veiculo:  'Chevrolet Spin',
    updated:  new Date().toISOString()
  };
}

// ── Servidor HTTP ─────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // ── GPS API: /gps-api.php ─────────────────────────────────────────────
  if (pathname === '/gps-api.php' || pathname === '/gps-api') {

    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin':  'https://fisiotlevaetras.com.br',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    // GET: retorna dados GPS atuais
    if (req.method === 'GET') {
      sendJSON(res, 200, readGPS());
      return;
    }

    // POST: salva nova localização
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 4096) req.destroy(); // proteção contra payloads gigantes
      });
      req.on('end', () => {
        let payload;
        try { payload = JSON.parse(body); } catch (e) {
          return sendJSON(res, 400, { error: 'invalid_json' });
        }

        // Valida chave de escrita
        if (!payload || !payload.key || payload.key !== WRITE_KEY) {
          return sendJSON(res, 403, { error: 'Unauthorized' });
        }

        const gps = sanitizeGPS(payload);

        try {
          fs.writeFileSync(GPS_FILE, JSON.stringify(gps), 'utf8');
          sendJSON(res, 200, { ok: true, ts: gps.ts });
        } catch (e) {
          sendJSON(res, 500, { error: 'write_failed' });
        }
      });
      return;
    }

    sendJSON(res, 405, { error: 'Method not allowed' });
    return;
  }

  // ── Arquivos estáticos ────────────────────────────────────────────────
  // Resolve path amigável para /rastrear e /motorista
  let urlPath = pathname;
  // Normaliza URLs sem extensão para diretórios com index.html
  if (urlPath === '/rastrear'  || urlPath === '/rastrear/')  urlPath = '/rastrear/index.html';
  if (urlPath === '/motorista' || urlPath === '/motorista/') urlPath = '/motorista/index.html';
  if (urlPath === '/' || urlPath === '')                     urlPath = '/index.html';

  // Sanitiza path traversal
  const safePath = urlPath.replace(/\.\./g, '');
  let filePath = path.join(STATIC, safePath);

  // Se é um diretório, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
      }
      return;
    }
    // Cache longo para imagens, curto para HTML/JS
    const isAsset = /\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf)$/.test(ext);
    if (isAsset) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Leva & Traz Fisiot server rodando na porta', PORT);
});
