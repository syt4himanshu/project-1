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
    await addColumnIfMissing(queryInterface, 'student', 'is_profile_locked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await addColumnIfMissing(queryInterface, 'student', 'profile_locked_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    await addColumnIfMissing(queryInterface, 'student', 'profile_locked_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'faculty',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    try {
      await queryInterface.addIndex('student', ['mentor_id', 'is_profile_locked'], {
        name: 'idx_student_mentor_lock',
      });
    } catch (_err) {
      // Index might already exist
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeIndex('student', 'idx_student_mentor_lock');
    } catch (_err) {
      // Ignore if index already removed
    }
    await removeColumnIfExists(queryInterface, 'student', 'profile_locked_by');
    await removeColumnIfExists(queryInterface, 'student', 'profile_locked_at');
    await removeColumnIfExists(queryInterface, 'student', 'is_profile_locked');
  },
};
