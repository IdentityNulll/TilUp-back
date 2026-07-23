// Gate a route to specific roles. Use after `protect`.
// e.g. requireRole('admin')  or  requireRole('admin', 'teacher')
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Ruxsat yoʻq' });
    }
    next();
  };
