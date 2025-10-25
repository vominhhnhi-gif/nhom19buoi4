// Đổi requireRole để nhận một hoặc nhiều vai trò
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // normalized: req.user.role phải là string
    const userRole = req.user.role;
    if (!userRole) return res.status(403).json({ message: 'Forbidden: no role assigned' });

    // nếu allowedRoles chứa userRole -> OK
    if (allowedRoles.includes(userRole)) return next();

    // nếu muốn support role hierarchy/perm set, mở rộng ở đây
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
};

// Export both names: requireRole (existing) and checkRole (more descriptive API)
module.exports = { requireRole, checkRole: requireRole };