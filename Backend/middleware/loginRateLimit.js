const Log = require('../models/Log');

/**
 * Simple DB-backed rate limiter for login attempts.
 * Counts failed login attempts (action: 'login_failure') for the given email and IP within a time window.
 * If threshold exceeded, respond 429 and log a 'login_blocked' event.
 *
 * Options:
 *  - windowMs: milliseconds window to count failures (default 15 minutes)
 *  - maxFailures: maximum allowed failures in window (default 5)
 */
function loginRateLimit(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15m
  const maxFailures = options.maxFailures || 5;

  return async (req, res, next) => {
    try {
      const email = (req.body && req.body.email) ? String(req.body.email).toLowerCase() : null;
      const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
      const since = new Date(Date.now() - windowMs);

      // Build query to count recent failures for this email OR this ip
      const query = {
        action: 'login_failure',
        createdAt: { $gte: since }
      };
      if (email && ip) query.$or = [{ email }, { ip }];
      else if (email) query.email = email;
      else if (ip) query.ip = ip;

      const failures = await Log.countDocuments(query);
      if (failures >= maxFailures) {
        // record blocked attempt
        await Log.create({ email, ip, action: 'login_blocked', success: false });
        return res.status(429).json({ message: 'Too many failed login attempts. Try again later.' });
      }

      // Otherwise allow
      next();
    } catch (e) {
      console.error('loginRateLimit error', e);
      // On error, prefer to allow (do not block login due to logging errors)
      next();
    }
  };
}

module.exports = loginRateLimit;
