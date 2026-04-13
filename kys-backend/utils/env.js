require('dotenv').config();

const requiredEnv = ['DATABASE_URL', 'SECRET_KEY', 'JWT_SECRET_KEY', 'GROQ_API_KEY'];

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const validateEnv = () => {
  requiredEnv.forEach(requireEnv);
  console.log("GROQ_API_KEY Loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");
};

const getCorsSettings = () => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .filter((origin) => !origin.includes('your-frontend-domain.com'));

  const legacyOrigin = (process.env.ALLOWED_ORIGIN || '').trim();
  if (legacyOrigin) allowedOrigins.push(legacyOrigin);

  if (!allowedOrigins.length) {
    if (String(process.env.NODE_ENV).toLowerCase() === 'production') {
      allowedOrigins.push(
        'http://117.239.42.27:8080',
        'http://117.239.42.27:8081',
        'http://117.239.42.27:8082',

      );
    } else {
      allowedOrigins.push('http://localhost:3005');
    }
  }

  return { allowedOrigins };
};

module.exports = {
  requireEnv,
  validateEnv,
  getCorsSettings,
};
