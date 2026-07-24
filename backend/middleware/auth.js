const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'change-this-secret-in-production';
function verify(req, res, next, optional) { const header = req.headers.authorization; if (!header?.startsWith('Bearer ')) return optional ? next() : res.status(401).json({ message: '請先登入。' }); try { req.user = jwt.verify(header.slice(7), secret); next(); } catch { res.status(401).json({ message: '登入已失效，請重新登入。' }); } }
module.exports = (req,res,next) => verify(req,res,next,false);
module.exports.optional = (req,res,next) => verify(req,res,next,true);
