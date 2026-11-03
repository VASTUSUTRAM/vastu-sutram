/**
 * VASTU SUTRAM – Web & API Server
 * Lightweight, zero-dependency Node.js HTTP server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const TMP_DB = path.join('/tmp', 'vastu_db.json');
const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'assets', 'uploads');

// Ensure uploads directory exists
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem safe
}

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Database helper functions
function getDbPath() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_DB) && fs.existsSync(DB_FILE)) {
      try {
        fs.writeFileSync(TMP_DB, fs.readFileSync(DB_FILE, 'utf8'), 'utf8');
      } catch (e) {
        // Fallback
      }
    }
    return fs.existsSync(TMP_DB) ? TMP_DB : DB_FILE;
  }
  return DB_FILE;
}

function readDb() {
  try {
    const target = getDbPath();
    if (fs.existsSync(target)) {
      const raw = fs.readFileSync(target, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }
  return { bookings: [], inquiries: [], settings: {} };
}

function writeDb(data) {
  try {
    const target = process.env.VERCEL ? TMP_DB : DB_FILE;
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

// Helper to parse JSON body (safe for both local streams & pre-parsed serverless bodies)
function getJsonBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return Promise.resolve(JSON.parse(req.body));
      } catch (e) {
        return Promise.resolve({});
      }
    }
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Request Handler
const requestHandler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Set standard CORS headers for local APIs
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // REST API ENDPOINTS
  // -------------------------------------------------------------
  
  // Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', brand: 'VASTU SUTRAM', timestamp: new Date().toISOString() }));
    return;
  }

  // Entire Database
  if (pathname === '/api/db' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // Save/Replace Entire Database (for Admin import or state sync)
  if (pathname === '/api/db' && req.method === 'POST') {
    try {
      const data = await getJsonBody(req);
      writeDb(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Database updated' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: GET
  if (pathname === '/api/bookings' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.bookings || []));
    return;
  }

  // Bookings: POST (Create New Booking)
  if (pathname === '/api/bookings' && req.method === 'POST') {
    try {
      const newBooking = await getJsonBody(req);
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      // Generate Reference Code: VS-2026-XXXX
      const refNum = Math.floor(1000 + Math.random() * 9000);
      newBooking.id = newBooking.id || `VS-2026-${refNum}`;
      newBooking.createdAt = new Date().toISOString();
      newBooking.status = newBooking.status || 'Pending Review';

      data.bookings.unshift(newBooking);
      writeDb(data);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, booking: newBooking }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: PATCH (Update Status / Notes)
  if (pathname.startsWith('/api/bookings/') && req.method === 'PATCH') {
    try {
      const bookingId = pathname.replace('/api/bookings/', '');
      const updates = await getJsonBody(req);
      const data = readDb();
      const index = (data.bookings || []).findIndex(b => b.id === bookingId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Booking not found' }));
        return;
      }

      data.bookings[index] = { ...data.bookings[index], ...updates, updatedAt: new Date().toISOString() };
      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, booking: data.bookings[index] }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: DELETE
  if (pathname.startsWith('/api/bookings/') && req.method === 'DELETE') {
    const bookingId = pathname.replace('/api/bookings/', '');
    const data = readDb();
    data.bookings = (data.bookings || []).filter(b => b.id !== bookingId);
    writeDb(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Booking removed' }));
    return;
  }

  // Export Bookings as CSV
  if (pathname === '/api/export/bookings.csv' && req.method === 'GET') {
    const data = readDb();
    const bookings = data.bookings || [];
    const headers = ['Booking ID', 'Created At', 'Name', 'Phone', 'Email', 'City', 'Service', 'Package', 'Date', 'Time Slot', 'Mode', 'Status'];
    const rows = bookings.map(b => [
      `"${b.id || ''}"`,
      `"${b.createdAt ? b.createdAt.substring(0, 10) : ''}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.email || '').replace(/"/g, '""')}"`,
      `"${(b.city || '').replace(/"/g, '""')}"`,
      `"${(b.serviceName || b.service || '').replace(/"/g, '""')}"`,
      `"${(b.packageName || b.package || '').replace(/"/g, '""')}"`,
      `"${b.appointmentDate || ''}"`,
      `"${b.appointmentTime || ''}"`,
      `"${b.consultationMode || ''}"`,
      `"${b.status || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Vastu_Sutram_Bookings.csv"'
    });
    res.end(csvContent);
    return;
  }

  // Inquiries: GET & POST
  if (pathname === '/api/inquiries') {
    const data = readDb();
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.inquiries || []));
      return;
    }
    if (req.method === 'POST') {
      try {
        const inquiry = await getJsonBody(req);
        if (!data.inquiries) data.inquiries = [];
        inquiry.id = `INQ-${Date.now()}`;
        inquiry.createdAt = new Date().toISOString();
        data.inquiries.unshift(inquiry);
        writeDb(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, inquiry }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // Settings: GET & POST
  if (pathname === '/api/settings') {
    const data = readDb();
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.settings || {}));
      return;
    }
    if (req.method === 'POST') {
      try {
        const newSettings = await getJsonBody(req);
        data.settings = { ...data.settings, ...newSettings };
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, settings: data.settings }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // File Upload (Floor Plans, Drawings, Photographs)
  if (pathname === '/api/upload' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const { fileName, fileData } = payload; // fileData is base64 string
      if (!fileName || !fileData) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing fileName or fileData' }));
        return;
      }

      const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(UPLOADS_DIR, cleanFileName);
      
      // Strip base64 header if present (e.g. data:image/png;base64,...)
      const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        filePath: `/assets/uploads/${cleanFileName}`,
        fileName: cleanFileName
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: avoid directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, try index.html for client-side routing, or return 404
      const ext = path.extname(pathname);
      if (!ext || ext === '.html') {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (readErr, content) => {
          if (readErr) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1>');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
};

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  VASTU SUTRAM – THE PRINCIPLES OF VASTU`);
    console.log(`  Live Platform Running at: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

// Export callable function for Vercel Serverless Function runtime
module.exports = (req, res) => {
  return requestHandler(req, res);
};
module.exports.default = (req, res) => {
  return requestHandler(req, res);
};
