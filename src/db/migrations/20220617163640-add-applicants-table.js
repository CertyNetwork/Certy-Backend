'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('applicants', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      applicant_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      recruiter_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      job_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resume_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cover_letter: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('un_reviewed', 'reviewed'),
        allowNull: true,
        defaultValue: 'un_reviewed'
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
    await queryInterface.addConstraint('applicants', {
      fields: ['applicant_id'],
      type: 'FOREIGN KEY',
      name: 'fk_applicant_id',
      references: {
        table: 'users',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('applicants', {
      fields: ['recruiter_id'],
      type: 'FOREIGN KEY',
      name: 'fk_recruiter_id',
      references: {
        table: 'users',
        field: 'id',
      },
    });
    await queryInterface.addIndex('applicants', ['job_id']);
    await queryInterface.addConstraint('applicants', {
      fields: ['applicant_id', 'job_id'],
      type: 'unique',
      name: 'idx_applicants_unique_applicant-id_job-id',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('applicants');
  }
};
