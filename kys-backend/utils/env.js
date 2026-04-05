require('dotenv').config();

const requiredEnv = ['DATABASE_URL', 'SECRET_KEY', 'JWT_SECRET_KEY'];

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const validateEnv = () => {
  requiredEnv.forEach(requireEnv);
};

const getCorsSettings = () => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((origin) => !origin.includes('your-frontend-domain.com'));

  const legacyOrigin = (process.env.ALLOWED_ORIGIN || '').trim();
  if (legacyOrigin) allowedOrigins.push(legacyOrigin);

  const allowLocalDev = String(process.env.ALLOW_LOCAL_DEV_ORIGINS || 'true').toLowerCase() === 'true';
  if (allowLocalDev) {
    allowedOrigins.push('http://localhost:\\d+', 'http://127\\.0\\.0\\.1:\\d+');
  }

  if (!allowedOrigins.length) {
    allowedOrigins.push('http://localhost:\\d+', 'http://127\\.0\\.0\\.1:\\d+');
  }

  return { allowedOrigins, allowLocalDev };
};

module.exports = {
  requireEnv,
  validateEnv,
  getCorsSettings,
};
