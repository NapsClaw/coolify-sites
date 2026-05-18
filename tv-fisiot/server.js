/**
 * server.js — TV Fisiot
 * Servidor Node.js que serve os arquivos estáticos
 * E expõe /chamada-api.php para sync cross-device entre painel e TV.
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT      = process.env.PORT || 3000;
const STATIC    = __dirname;
const DATA_FILE = path.join(__dirname, 'chamada-data.json');

// ── Garante que o arquivo de dados existe ────────────────────
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ timestamp: 0 }), 'utf8');
}

// ── MIME types básicos ───────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.mp4':  'video/mp4',
  '.ico':  'image/x-icon',
  '.php':  'application/json', // chamada-api.php tratada abaixo
};

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
}

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const parsed  = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // ── API: /chamada-api.php ─────────────────────────────────
  if (pathname === '/chamada-api.php' || pathname === '/chamada-api') {

    corsHeaders(res);

    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; if (body.length > 4096) req.destroy(); });
      req.on('end', () => {
        let data;
        try { data = JSON.parse(body); } catch(e) {
          return sendJSON(res, 400, { ok: false, error: 'invalid_json' });
        }
        if (!data || !data.timestamp) {
          return sendJSON(res, 400, { ok: false, error: 'invalid_data' });
        }
        const ageSec = Math.abs(Date.now() / 1000 - data.timestamp / 1000);
        if (ageSec > 600) {
          return sendJSON(res, 400, { ok: false, error: 'timestamp_expired' });
        }
        const clean = {
          timestamp:    parseInt(data.timestamp)          || 0,
          texto:        String(data.texto        || '').substring(0, 300).replace(/<[^>]*>/g, ''),
          ginasio:      String(data.ginasio      || '').substring(0, 60).replace(/<[^>]*>/g, ''),
          profissional: String(data.profissional || '').substring(0, 100).replace(/<[^>]*>/g, ''),
          horario:      String(data.horario      || '').substring(0, 10).replace(/<[^>]*>/g, ''),
        };
        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(clean), 'utf8');
          sendJSON(res, 200, { ok: true, ts: clean.timestamp });
        } catch(e) {
          sendJSON(res, 500, { ok: false, error: 'write_failed' });
        }
      });
      return;
    }

    // GET
    try {
      const raw  = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data && data.timestamp !== undefined) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8',
                             'Cache-Control': 'no-cache' });
        res.end(raw);
      } else {
        sendJSON(res, 200, { timestamp: 0 });
      }
    } catch(e) {
      sendJSON(res, 200, { timestamp: 0 });
    }
    return;
  }

  // ── Arquivos estáticos ────────────────────────────────────
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(STATIC, filePath.replace(/\.\./g, '')); // Sanitiza path traversal

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback: tenta servir como index.html apenas para raiz
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('TV Fisiot server rodando na porta', PORT);
});
