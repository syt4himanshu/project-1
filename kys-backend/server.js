const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./models');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const { validateEnv } = require('./utils/env');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const facultyRoutes = require('./routes/faculty.routes');
const { studentsRouter, studentRouter, apiStudentsRouter } = require('./routes/student.routes');

validateEnv();

const app = express();
app.set('trust proxy', 1);
const corsOptions = {
  origin: [
    'https://kys.stvincentngp.edu.in',
    /http:\/\/localhost:\d+$/,
    /http:\/\/127\.0\.0\.1:\d+$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
const forceHttps = String(process.env.FORCE_HTTPS || 'false').toLowerCase() === 'true';

if (forceHttps) {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    return res.redirect(`https://${req.headers.host}${req.url}`);
  });
}

app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "50kb" }));
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

app.get('/api/health/live', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentsRouter);
app.use('/api/students', apiStudentsRouter);
app.use('/api/student', studentRouter);
app.use('/api/faculty', facultyRoutes);

app.get('/api/health/faculty', async (req, res) => {
  try {
    const { AI_CONFIG, FALLBACK_MODELS } = require('./config/ai.config');
    const Groq = require('groq-sdk');
    const apiKey = process.env.GROQ_API_KEY;
    
    // Check DB silently as per specs
    let dbStatus = "connected";
    try {
      await sequelize.authenticate();
    } catch(e) {
      dbStatus = "error";
    }

    if (!apiKey) {
      return res.status(500).json({ status: "error", db: dbStatus, groq: "error", model: AI_CONFIG.model, latency_ms: 0, key_loaded: false });
    }

    const groq = new Groq({ apiKey: String(apiKey).trim() });
    
    let currentModel = AI_CONFIG.model;
    let fallbackIndex = 0;

    while (true) {
      const start = Date.now();
      try {
        await groq.chat.completions.create({
          model: currentModel,
          messages: [{ role: 'user', content: "health check" }],
          max_tokens: 10
        });

        const latency = Date.now() - start;
        return res.json({ status: "ok", db: dbStatus, groq: "ok", model: currentModel, latency_ms: latency, key_loaded: true });
      } catch (error) {
        if (error.status === 401 || error.response?.status === 401) {
          return res.status(500).json({ status: "error", db: dbStatus, groq: "error", model: currentModel, latency_ms: Date.now() - start, key_loaded: true, error: "Invalid GROQ_API_KEY" });
        }

        const isModelError = error.error?.error?.code === "model_decommissioned" || 
                             error.error?.error?.code === "invalid_request_error" ||
                             /decommissioned|not found|does not exist/.test(error.message);

        if (isModelError && fallbackIndex < FALLBACK_MODELS.length) {
          currentModel = FALLBACK_MODELS[fallbackIndex++];
          continue;
        }
        
        return res.status(500).json({ status: "error", db: dbStatus, groq: "error", model: currentModel, latency_ms: Date.now() - start, key_loaded: true, error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, error: 'Not found' });
});

app.use((err, req, res, next) => {
  logger.error({ reqId: req.id, message: err.message, stack: err.stack });

  if (req.path.includes('/faculty')) {
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }

  return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
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
