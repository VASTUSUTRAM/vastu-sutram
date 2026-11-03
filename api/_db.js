const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'db.json');
const TMP_FILE = path.join('/tmp', 'vastu_db.json');

// In local server, uses data/db.json; in Vercel serverless, uses /tmp/vastu_db.json
function getDbPath() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_FILE) && fs.existsSync(SEED_FILE)) {
      try {
        fs.writeFileSync(TMP_FILE, fs.readFileSync(SEED_FILE, 'utf8'), 'utf8');
      } catch (e) {
        // Fallback
      }
    }
    return fs.existsSync(TMP_FILE) ? TMP_FILE : SEED_FILE;
  }
  return SEED_FILE;
}

function readDb() {
  try {
    const dbPath = getDbPath();
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }
  return { bookings: [], inquiries: [], settings: {} };
}

function writeDb(data) {
  try {
    const target = process.env.VERCEL ? TMP_FILE : SEED_FILE;
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

module.exports = { readDb, writeDb };
