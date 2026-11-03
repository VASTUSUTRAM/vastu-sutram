const { readDb, writeDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const db = readDb();
  if (!db.bookings) db.bookings = [];

  // GET: Fetch all bookings (or single booking if id query passed)
  if (req.method === 'GET') {
    const id = req.query ? req.query.id : null;
    if (id) {
      const single = db.bookings.find(b => b.id === id);
      if (single) return res.status(200).json(single);
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.status(200).json(db.bookings);
  }

  // POST: Create new booking
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const refNum = Math.floor(1000 + Math.random() * 9000);
      body.id = body.id || `VS-2026-${refNum}`;
      body.createdAt = new Date().toISOString();
      body.status = body.status || 'Pending Review';

      db.bookings.unshift(body);
      writeDb(db);
      return res.status(201).json({ success: true, booking: body });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // PATCH: Update booking status
  if (req.method === 'PATCH') {
    try {
      const id = (req.query && req.query.id) || (req.body && req.body.id);
      const updates = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const idx = db.bookings.findIndex(b => b.id === id);

      if (idx === -1) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      db.bookings[idx] = { ...db.bookings[idx], ...updates, updatedAt: new Date().toISOString() };
      writeDb(db);
      return res.status(200).json({ success: true, booking: db.bookings[idx] });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // DELETE: Remove booking
  if (req.method === 'DELETE') {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    db.bookings = db.bookings.filter(b => b.id !== id);
    writeDb(db);
    return res.status(200).json({ success: true, message: 'Booking removed' });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
