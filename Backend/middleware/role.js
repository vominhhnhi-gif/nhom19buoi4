const requireRole = (required) => {
    // required can be a string (single role) or an array of allowed roles
    const allowed = Array.isArray(required) ? required : [required];
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
        next();
    };
};

module.exports = { requireRole };