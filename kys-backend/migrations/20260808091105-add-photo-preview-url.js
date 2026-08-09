'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('student_personal_info');
    if (!tableDesc.photo_preview_url) {
      await queryInterface.addColumn('student_personal_info', 'photo_preview_url', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDesc = await queryInterface.describeTable('student_personal_info');
    if (tableDesc.photo_preview_url) {
      await queryInterface.removeColumn('student_personal_info', 'photo_preview_url');
    }
  }
};
