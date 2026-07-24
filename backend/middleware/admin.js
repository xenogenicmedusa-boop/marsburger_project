module.exports = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: '需要管理員權限。' });
