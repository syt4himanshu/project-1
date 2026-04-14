'use strict';

async function addColumnIfMissing(queryInterface, tableName, columnName, definition) {
  const table = await queryInterface.describeTable(tableName);
  if (!table[columnName]) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
}

async function removeColumnIfExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  if (table[columnName]) {
    await queryInterface.removeColumn(tableName, columnName);
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumnIfMissing(queryInterface, 'student', 'admission_type', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'past_education', 'board', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'past_education', 'exam_type', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'post_admission_academic_record', 'season', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'post_admission_academic_record', 'year_of_passing', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'post_admission_academic_record', 'college_rank', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'post_admission_academic_record', 'academic_awards', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'career_objective', 'non_technical_areas', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'career_objective', 'student_mentor_interest', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'career_objective', 'expectations_from_institute', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'skills', 'technical_soft_skills_overall', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'skills', 'additional_technical_skills', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'skills', 'additional_soft_skills', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    const tableNames = await queryInterface.showAllTables();
    const normalized = tableNames.map((name) => (typeof name === 'string' ? name : name.tableName));
    if (!normalized.includes('skill_program')) {
      await queryInterface.createTable('skill_program', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'student', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        course_title: { type: Sequelize.STRING(255), allowNull: true },
        platform: { type: Sequelize.STRING(255), allowNull: true },
        duration_hours: { type: Sequelize.FLOAT, allowNull: true },
        date_from: { type: Sequelize.DATEONLY, allowNull: true },
        date_to: { type: Sequelize.DATEONLY, allowNull: true },
      });
    }
  },

  async down(queryInterface) {
    await removeColumnIfExists(queryInterface, 'student', 'admission_type');

    await removeColumnIfExists(queryInterface, 'past_education', 'board');
    await removeColumnIfExists(queryInterface, 'past_education', 'exam_type');

    await removeColumnIfExists(queryInterface, 'post_admission_academic_record', 'season');
    await removeColumnIfExists(queryInterface, 'post_admission_academic_record', 'year_of_passing');
    await removeColumnIfExists(queryInterface, 'post_admission_academic_record', 'college_rank');
    await removeColumnIfExists(queryInterface, 'post_admission_academic_record', 'academic_awards');

    await removeColumnIfExists(queryInterface, 'career_objective', 'non_technical_areas');
    await removeColumnIfExists(queryInterface, 'career_objective', 'student_mentor_interest');
    await removeColumnIfExists(queryInterface, 'career_objective', 'expectations_from_institute');

    await removeColumnIfExists(queryInterface, 'skills', 'technical_soft_skills_overall');
    await removeColumnIfExists(queryInterface, 'skills', 'additional_technical_skills');
    await removeColumnIfExists(queryInterface, 'skills', 'additional_soft_skills');

    const tableNames = await queryInterface.showAllTables();
    const normalized = tableNames.map((name) => (typeof name === 'string' ? name : name.tableName));
    if (normalized.includes('skill_program')) {
      await queryInterface.dropTable('skill_program');
    }
  },
};
