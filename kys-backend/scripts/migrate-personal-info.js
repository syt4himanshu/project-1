require('dotenv').config();
const { sequelize } = require('../models');

async function main() {
  try {
    await sequelize.authenticate();
    
    // Add columns if they don't exist
    await sequelize.query(`ALTER TABLE student_personal_info ADD COLUMN IF NOT EXISTS city VARCHAR(120);`);
    await sequelize.query(`ALTER TABLE student_personal_info ADD COLUMN IF NOT EXISTS state VARCHAR(120);`);
    await sequelize.query(`ALTER TABLE student_personal_info ADD COLUMN IF NOT EXISTS pincode VARCHAR(6);`);
    await sequelize.query(`ALTER TABLE student_personal_info ADD COLUMN IF NOT EXISTS digipin VARCHAR(10);`);
    
    // Modify category length
    await sequelize.query(`ALTER TABLE student_personal_info ALTER COLUMN category TYPE VARCHAR(100);`);
    
    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

main();
