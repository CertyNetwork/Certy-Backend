'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_certificates', {
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      cert_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      owner_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      issued_at: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_certificates');
  }
};
