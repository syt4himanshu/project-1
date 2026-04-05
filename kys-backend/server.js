const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./models');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const { validateEnv, getCorsSettings } = require('./utils/env');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const facultyRoutes = require('./routes/faculty.routes');
const { studentsRouter, studentRouter, apiStudentsRouter } = require('./routes/student.routes');

validateEnv();

const app = express();
const { allowedOrigins } = getCorsSettings();
const forceHttps = String(process.env.FORCE_HTTPS || 'false').toLowerCase() === 'true';

if (forceHttps) {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    return res.redirect(`https://${req.headers.host}${req.url}`);
  });
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed.includes('\\d+') || allowed.includes('\\.')) {
          return new RegExp(`^${allowed}$`).test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());
app.use(globalRateLimiter);
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', apiStudentsRouter);
app.use('/students', studentsRouter);
app.use('/student', studentRouter);
app.use('/faculty', facultyRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  logger.error({ message: err.message, stack: err.stack });
  return res.status(500).json({ error: 'Internal server error' });
});

const PORT = Number(process.env.PORT || 5002);

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established.');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();
