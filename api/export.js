const { readDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Vastu_Sutram_Bookings.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
