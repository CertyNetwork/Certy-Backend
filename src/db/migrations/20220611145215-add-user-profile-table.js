'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
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
        type: Sequelize.TEXT,
        allowNull: true,
      },
      skills: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      mobile_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      linkedIn_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      github_link: {
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
    await queryInterface.dropTable('user_profiles');
  }
};
