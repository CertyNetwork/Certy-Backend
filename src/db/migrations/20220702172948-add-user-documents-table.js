'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_documents', {
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
      document_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      document_uri: {
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
    await queryInterface.addConstraint('user_documents', {
      fields: ['user_id'],
      type: 'FOREIGN KEY',
      name: 'user_id_fk',
      references: {
        table: 'users',
        field: 'id',
      },
    });
    await queryInterface.addIndex('user_documents', ['document_type']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_documents');
  }
};
