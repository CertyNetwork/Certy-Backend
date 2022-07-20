'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_profile_experiences', {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employment_type: {
        type: Sequelize.ENUM('full-time', 'part-time', 'self-employed', 'free-lance', 'internship', 'contract'),
        defaultValue: 'full-time',
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company_urn: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      skills: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.addConstraint('user_profile_experiences', {
      fields: ['user_id'],
      type: 'FOREIGN KEY',
      name: 'user_id_fk',
      references: {
        table: 'users',
        field: 'id',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profile_experiences');
  }
};
