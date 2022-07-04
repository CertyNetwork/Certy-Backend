'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_storage', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      root_cid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      files: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING, 
        allowNull: true,
      },
      meta_data: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.addIndex('user_storage', ['user_id']);
    await queryInterface.addIndex('user_storage', ['root_cid']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_storage');
  }
};
