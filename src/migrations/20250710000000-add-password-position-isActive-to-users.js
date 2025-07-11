'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'temp_password'
    });
    
    await queryInterface.addColumn('users', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    
    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'password');
    await queryInterface.removeColumn('users', 'position');
    await queryInterface.removeColumn('users', 'isActive');
  }
};
