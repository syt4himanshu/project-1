const sequelize = require('./config/database');

async function alterDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await sequelize.query('ALTER TABLE mentoring_minute ADD COLUMN issues TEXT;');
    console.log('Added issues column successfully.');
    
    process.exit(0);
  } catch (error) {
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log('Column issues already exists. Skipping.');
      process.exit(0);
    }
    console.error('Unable to connect to the database or alter table:', error);
    process.exit(1);
  }
}

alterDB();
