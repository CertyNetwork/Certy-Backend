'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'user_type', {
      type: Sequelize.ENUM('individual', 'institution'),
      allowNull: true,
      after: 'nonce',
      defaultValue: 'individual'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'user_type');
  }
};
