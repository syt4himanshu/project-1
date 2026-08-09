'use strict';

const { QueryTypes } = require('sequelize');

async function resolveMentoringTable(queryInterface) {
  const sequelize = queryInterface.sequelize;
  const candidates = ['mentoring_minute', 'MentoringMinute'];

  for (const table of candidates) {
    const rows = await sequelize.query(
      `SELECT to_regclass(:tableName) AS regclass`,
      { replacements: { tableName: table }, type: QueryTypes.SELECT },
    );
    if (rows?.[0]?.regclass) return table;
  }

  throw new Error('Mentoring minute table not found.');
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = await resolveMentoringTable(queryInterface);

    await queryInterface.changeColumn(tableName, 'faculty_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'faculty', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    const tableDesc = await queryInterface.describeTable(tableName);

    if (!tableDesc.faculty_name_snapshot) {
      await queryInterface.addColumn(tableName, 'faculty_name_snapshot', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
      console.log(`Added faculty_name_snapshot to ${tableName}`);
    } else {
      console.log(`faculty_name_snapshot already exists on ${tableName}, skipping.`);
    }

    if (!tableDesc.faculty_email_snapshot) {
      await queryInterface.addColumn(tableName, 'faculty_email_snapshot', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
      console.log(`Added faculty_email_snapshot to ${tableName}`);
    } else {
      console.log(`faculty_email_snapshot already exists on ${tableName}, skipping.`);
    }

    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" m
       SET faculty_name_snapshot = TRIM(CONCAT(COALESCE(f.first_name, ''), ' ', COALESCE(f.last_name, ''))),
           faculty_email_snapshot = f.email
       FROM faculty f
       WHERE m.faculty_id = f.id
         AND (m.faculty_name_snapshot IS NULL OR m.faculty_email_snapshot IS NULL)`,
    );
  },

  async down(queryInterface, Sequelize) {
    const tableName = await resolveMentoringTable(queryInterface);

    const tableDesc = await queryInterface.describeTable(tableName);
    
    if (tableDesc.faculty_email_snapshot) {
      await queryInterface.removeColumn(tableName, 'faculty_email_snapshot');
      console.log(`Removed faculty_email_snapshot from ${tableName}`);
    }

    if (tableDesc.faculty_name_snapshot) {
      await queryInterface.removeColumn(tableName, 'faculty_name_snapshot');
      console.log(`Removed faculty_name_snapshot from ${tableName}`);
    }

    await queryInterface.changeColumn(tableName, 'faculty_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'faculty', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};