const { sequelize } = require('../models');

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.query('ALTER TABLE past_education ADD COLUMN IF NOT EXISTS board VARCHAR(100);');
    await sequelize.query('ALTER TABLE past_education ADD COLUMN IF NOT EXISTS exam_type VARCHAR(100);');
    await sequelize.query('ALTER TABLE past_education ALTER COLUMN percentage DROP NOT NULL;');
    await sequelize.query('ALTER TABLE past_education ALTER COLUMN year_of_passing DROP NOT NULL;');
    console.log('Database altered successfully');
  } catch (err) {
    console.error('Error altering database:', err);
  } finally {
    process.exit();
  }
}

main();
