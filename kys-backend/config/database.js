const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: Number(process.env.DB_POOL_SIZE || 5),
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: Number(process.env.DB_MAX_OVERFLOW || 2) * 1000,
  },
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
  },
});

module.exports = sequelize;
