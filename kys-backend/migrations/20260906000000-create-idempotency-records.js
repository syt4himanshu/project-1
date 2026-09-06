'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop old table if exists
    await queryInterface.dropTable('idempotency_records').catch(() => {});

    await queryInterface.createTable('idempotency_keys', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      operation_type: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      request_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'processing',
      },
      response_status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      response_body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('idempotency_keys', ['faculty_id', 'key'], {
      name: 'idx_idempotency_faculty_key',
    });

    await queryInterface.addIndex('idempotency_keys', ['created_at'], {
      name: 'idx_idempotency_created_at',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('idempotency_keys');
  },
};
