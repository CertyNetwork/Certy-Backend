'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_profile_educations', {
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
      school: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      degree: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      field_of_study: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      media: {
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
    await queryInterface.addConstraint('user_profile_educations', {
      fields: ['user_id'],
      type: 'FOREIGN KEY',
      name: 'fk_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profile_educations');
  }
};
