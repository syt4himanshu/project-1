const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { hasJti } = require('../utils/jwtBlacklist');

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  const [prefix, token] = authHeader.split(' ');
  if (prefix !== 'Bearer' || !token) return null;
  return token;
};

const parseCurrentUserId = (payload) => {
  const id = Number(payload?.sub);
  return Number.isFinite(id) ? id : null;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (hasJti(payload.jti)) return res.status(401).json({ error: 'Token has been revoked' });

    req.token = token;
    req.jwtPayload = payload;
    req.currentUserId = parseCurrentUserId(payload);

    if (req.currentUserId) {
      req.currentUser = await User.findByPk(req.currentUserId);
    } else {
      req.currentUser = null;
    }

    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const verifyTokenOptional = async (req, _res, next) => {
  const token = extractBearerToken(req);
  if (!token) {
    req.currentUser = null;
    req.jwtPayload = null;
    req.currentUserId = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (hasJti(payload.jti)) {
      req.currentUser = null;
      req.jwtPayload = null;
      req.currentUserId = null;
      return next();
    }

    req.token = token;
    req.jwtPayload = payload;
    req.currentUserId = parseCurrentUserId(payload);
    req.currentUser = req.currentUserId ? await User.findByPk(req.currentUserId) : null;
    return next();
  } catch (_error) {
    req.currentUser = null;
    req.jwtPayload = null;
    req.currentUserId = null;
    return next();
  }
};

const roleRequired = (roles) => async (req, res, next) => {
  if (!req.currentUserId) return res.status(401).json({ error: 'Invalid token identity' });
  if (!req.currentUser) return res.status(404).json({ error: 'User not found' });
  if (!roles.includes(req.currentUser.role)) {
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }
  return next();
};

module.exports = {
  verifyToken,
  verifyTokenOptional,
  roleRequired,
};
