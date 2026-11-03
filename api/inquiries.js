const { readDb, writeDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const db = readDb();
  if (!db.inquiries) db.inquiries = [];

  if (req.method === 'GET') {
    return res.status(200).json(db.inquiries);
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      body.id = `INQ-${Date.now()}`;
      body.createdAt = new Date().toISOString();

      db.inquiries.unshift(body);
      writeDb(db);
      return res.status(201).json({ success: true, inquiry: body });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
