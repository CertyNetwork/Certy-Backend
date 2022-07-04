'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('organization_profiles', {
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: false,
        unique: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      about: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      organization_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      working_hours: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      organization_size: {
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('organization_profiles');
  }
};
