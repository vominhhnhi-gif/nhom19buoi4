const Log = require('../models/Log');

/**
 * Middleware factory that logs an action when the response finishes.
 * It inspects req.user and req.body.email to populate the log entry.
 * Usage: app.post('/x', logActivity('some_action'), handler)
 */
function logActivity(action) {
  return (req, res, next) => {
    // on finish, write a log entry
    res.on('finish', async () => {
      try {
        const entry = {
          userId: req.user?.id,
          email: req.body?.email || req.user?.email,
          action,
          ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
          userAgent: req.get ? req.get('User-Agent') : req.headers['user-agent'],
          success: res.statusCode >= 200 && res.statusCode < 400,
          meta: {
            statusCode: res.statusCode,
          },
        };
        await Log.create(entry);
      } catch (e) {
        // don't break the response flow on logging errors; just print
        console.error('logActivity error', e);
      }
    });
    next();
  };
}

/**
 * Helper to log immediately from controllers when outcome is known.
 */
async function logNow({ userId, email, action, ip, userAgent, success = false, meta = {} }) {
  try {
    await Log.create({ userId, email, action, ip, userAgent, success, meta });
  } catch (e) {
    console.error('logNow error', e);
  }
}

module.exports = { logActivity, logNow };
