const { readDb, writeDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const db = readDb();

  if (req.method === 'GET') {
    return res.status(200).json(db.settings || {});
  }

  if (req.method === 'POST') {
    try {
      const updates = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      db.settings = { ...(db.settings || {}), ...updates };
      writeDb(db);
      return res.status(200).json({ success: true, settings: db.settings });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
