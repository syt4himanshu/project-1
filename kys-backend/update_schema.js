const { sequelize } = require('./models');
async function run() {
  try {
    await sequelize.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS frontend_technologies_frameworks TEXT');
    await sequelize.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS backend_technologies_databases TEXT');
    console.log('Columns added successfully');
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
run();
