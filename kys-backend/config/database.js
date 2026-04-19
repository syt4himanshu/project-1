const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: (sql, timing) => {
    // Log slow queries (>1s)
    if (timing && timing > 1000) {
      const logger = require('../utils/logger');
      logger.warn({
        message: 'Slow query detected',
        durationMs: timing,
        sql: sql.substring(0, 200), // Truncate for safety
      });
    }
  },
  benchmark: true, // Enable query timing
  pool: {
    max: Number(process.env.DB_POOL_SIZE || 5),
    min: 0,
    acquire: 30000, // Max time to acquire connection
    idle: 10000,    // Max time connection can be idle
    evict: Number(process.env.DB_MAX_OVERFLOW || 2) * 1000,
  },
  dialectOptions: {
    statement_timeout: 10000, // 10s query timeout
    idle_in_transaction_session_timeout: 30000, // 30s transaction timeout
  },
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
  },
  retry: {
    max: 3, // Retry failed connections
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
    ],
  },
});

module.exports = sequelize;
