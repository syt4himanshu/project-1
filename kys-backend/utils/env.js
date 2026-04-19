require('dotenv').config();

const requiredEnv = [
  'DATABASE_URL',
  'SECRET_KEY',
  'JWT_SECRET_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const validateEnv = () => {
  requiredEnv.forEach(requireEnv);

  if (!process.env.GROQ_API_KEY) {
    console.warn('GROQ_API_KEY is not set; AI endpoints will be degraded, but auth/API startup will continue.');
    return;
  }

  console.log('GROQ_API_KEY Loaded: YES');
};

const getCorsSettings = () => {
  let allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
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

  if (process.env.NODE_ENV !== 'production') {
    const devOrigins = [
      'http://localhost:3005',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5176',
      'http://127.0.0.1:3005',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5176',
    ];
    allowedOrigins = [...new Set([...allowedOrigins, ...devOrigins])];
  }

  return { allowedOrigins };
};

module.exports = {
  requireEnv,
  validateEnv,
  getCorsSettings,
};
