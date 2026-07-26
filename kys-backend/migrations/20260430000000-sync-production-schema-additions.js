'use strict';

// Brings local dev schema up to parity with columns/tables that already
// exist on production but were never captured in a migration.
// Purely additive — nothing here removes or alters existing data.

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

async function tableExists(queryInterface, tableName) {
  const tableNames = await queryInterface.showAllTables();
  const normalized = tableNames.map((n) => (typeof n === 'string' ? n : n.tableName));
  return normalized.includes(tableName);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // ---- existing tables: new columns seen on production ----
    await addColumnIfMissing(queryInterface, 'user', 'email', {
      type: Sequelize.STRING(120),
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'student', 'current_year', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'student', 'passout_year', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'past_education', 'exam_score', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'past_education', 'exam_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'post_admission_academic_record', 'backlog_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'project', 'project_guide', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'internship', 'designation', {
      type: Sequelize.STRING(120),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'internship', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await addColumnIfMissing(queryInterface, 'career_objective', 'placement_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'career_objective', 'higher_studies_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await addColumnIfMissing(queryInterface, 'career_objective', 'higher_studies_location', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    // ---- whole tables that exist on production but have no migration ----
    if (!(await tableExists(queryInterface, 'career_activity'))) {
      await queryInterface.createTable('career_activity', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'student', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        activity_name: { type: Sequelize.STRING(255), allowNull: false },
        score_rank: { type: Sequelize.STRING(50), allowNull: false },
        exam_date: { type: Sequelize.DATEONLY, allowNull: true },
      });
    }

    if (!(await tableExists(queryInterface, 'career_dev_activity'))) {
      await queryInterface.createTable('career_dev_activity', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'student', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        activity: { type: Sequelize.STRING(100), allowNull: false },
        score: { type: Sequelize.STRING(50), allowNull: true },
        test_date: { type: Sequelize.DATEONLY, allowNull: true },
      });
      await queryInterface.addIndex('career_dev_activity', ['student_id'], {
        name: 'idx_career_dev_activity_student_id',
      });
    }

    if (!(await tableExists(queryInterface, 'password_reset_token'))) {
      await queryInterface.createTable('password_reset_token', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'user', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        token: { type: Sequelize.STRING(255), allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        expires_at: { type: Sequelize.DATE, allowNull: false },
        used: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      });
    }
  },

  async down(queryInterface) {
    await removeColumnIfExists(queryInterface, 'user', 'email');
    await removeColumnIfExists(queryInterface, 'student', 'current_year');
    await removeColumnIfExists(queryInterface, 'student', 'passout_year');
    await removeColumnIfExists(queryInterface, 'past_education', 'exam_score');
    await removeColumnIfExists(queryInterface, 'past_education', 'exam_date');
    await removeColumnIfExists(queryInterface, 'post_admission_academic_record', 'backlog_count');
    await removeColumnIfExists(queryInterface, 'project', 'project_guide');
    await removeColumnIfExists(queryInterface, 'internship', 'designation');
    await removeColumnIfExists(queryInterface, 'internship', 'description');
    await removeColumnIfExists(queryInterface, 'career_objective', 'placement_type');
    await removeColumnIfExists(queryInterface, 'career_objective', 'higher_studies_type');
    await removeColumnIfExists(queryInterface, 'career_objective', 'higher_studies_location');

    if (await tableExists(queryInterface, 'career_activity')) {
      await queryInterface.dropTable('career_activity');
    }
    if (await tableExists(queryInterface, 'career_dev_activity')) {
      await queryInterface.dropTable('career_dev_activity');
    }
    if (await tableExists(queryInterface, 'password_reset_token')) {
      await queryInterface.dropTable('password_reset_token');
    }
  },
};
