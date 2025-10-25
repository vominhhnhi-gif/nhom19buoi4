const Log = require('../models/Log');

/**
 * GET /admin/logs
 * Query params: action, email, ip, limit, since (ISO date or ms)
 */
exports.getLogs = async (req, res) => {
  try {
    const { action, email, ip, limit = 100, since } = req.query;
    const q = {};
    if (action) q.action = action;
    if (email) q.email = String(email).toLowerCase();
    if (ip) q.ip = ip;
    if (since) q.createdAt = { $gte: new Date(since) };

    const docs = await Log.find(q).sort({ createdAt: -1 }).limit(Math.min(parseInt(limit, 10) || 100, 1000));
    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
