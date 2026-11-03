const fs = require('fs');
const path = require('path');

let initialSeed = { bookings: [], inquiries: [], settings: {}, slots: [] };
try {
  initialSeed = require('../data/db.json');
} catch (e) {
  // Bundled fallback
}

const TMP_FILE = path.join('/tmp', 'vastu_db.json');

function getDbPath() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_FILE)) {
      try {
        fs.writeFileSync(TMP_FILE, JSON.stringify(initialSeed, null, 2), 'utf8');
      } catch (e) {
        // Safe in memory fallback
      }
    }
    return fs.existsSync(TMP_FILE) ? TMP_FILE : null;
  }
  const localFile = path.join(__dirname, '..', 'data', 'db.json');
  return fs.existsSync(localFile) ? localFile : null;
}

function readDb() {
  try {
    const dbPath = getDbPath();
    if (dbPath && fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }
  return initialSeed;
}

function writeDb(data) {
  try {
    const target = process.env.VERCEL ? TMP_FILE : path.join(__dirname, '..', 'data', 'db.json');
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

module.exports = { readDb, writeDb };
