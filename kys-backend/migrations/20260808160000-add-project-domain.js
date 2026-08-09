'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('project');
    if (!tableInfo.domain) {
      await queryInterface.addColumn('project', 'domain', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('project');
    if (tableInfo.domain) {
      await queryInterface.removeColumn('project', 'domain');
    }
  }
};
